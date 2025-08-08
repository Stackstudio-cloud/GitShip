import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertDeploymentSchema } from "@shared/schema";
import { GitHubService, verifyGitHubWebhookSignature } from "./github";
import { decryptText, isEncrypted } from "./crypto";
import { BuildQueue } from "./build";
import path from "path";
import fs from "fs";
import { getArtifactsRoot } from "./artifacts";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // GitHub OAuth routes
  app.get('/api/auth/github', isAuthenticated, async (_req, res) => {
    try {
      const authUrl = GitHubService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating GitHub auth URL:", error);
      res.status(500).json({ message: "Failed to generate GitHub auth URL" });
    }
  });

  app.get('/api/auth/github/callback', isAuthenticated, async (req: any, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ message: "Authorization code required" });
      }

      // Exchange code for access token (encrypted)
      const encryptedToken = await GitHubService.exchangeCodeForToken(code as string);

      // Get GitHub user info
      const githubService = new GitHubService(decryptText(encryptedToken));
      const githubUser = await githubService.getCurrentUser();

      // Update user with GitHub info
      const userId = req.user.claims.sub;
      await storage.updateUserGitHubInfo(userId, {
        githubAccessToken: encryptedToken,
        githubUsername: githubUser.login,
        githubId: githubUser.id.toString(),
      });

      res.redirect('/dashboard?github=connected');
    } catch (error) {
      console.error("Error in GitHub OAuth callback:", error);
      res.redirect('/dashboard?github=error');
    }
  });

  // GitHub repositories route
  app.get('/api/github/repositories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub account not connected" });
      }
      const token = isEncrypted(user.githubAccessToken) ? decryptText(user.githubAccessToken) : user.githubAccessToken;
      const githubService = new GitHubService(token);
      const repositories = await githubService.getUserRepositories();
      res.json(repositories);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub account not connected. Please connect your GitHub account first." });
      }

      const projectData = insertProjectSchema.parse({ ...req.body, userId });

      // Parse GitHub repository info
      const repoInfo = GitHubService.parseRepositoryUrl(projectData.repositoryUrl);
      if (!repoInfo) {
        return res.status(400).json({ message: "Invalid GitHub repository URL" });
      }

      // Verify user has access to the repository
      const token = isEncrypted(user.githubAccessToken) ? decryptText(user.githubAccessToken) : user.githubAccessToken;
      const githubService = new GitHubService(token);
      try {
        const repoData = await githubService.getRepository(repoInfo.owner, repoInfo.repo);

        // Auto-detect framework if not specified
        let framework = projectData.framework;
        if (!framework) {
          framework = await githubService.detectFramework(repoInfo.owner, repoInfo.repo);
        }

        const project = await storage.createProject({
          ...projectData,
          githubOwner: repoInfo.owner,
          githubRepo: repoInfo.repo,
          githubRepoId: repoData.id.toString(),
          framework: framework || 'static',
        });

        // Create webhook for auto-deployments
        try {
          const webhookUrl = `${req.protocol}://${req.hostname}/api/webhooks/github`;
          await githubService.createWebhook(repoInfo.owner, repoInfo.repo, webhookUrl);
        } catch (webhookError) {
          console.warn("Failed to create webhook:", webhookError);
        }

        // Create initial deployment
        const deployment = await storage.createDeployment({
          projectId: project.id,
          commitHash: 'initial',
          commitMessage: 'Initial deployment',
          branch: project.branch || 'main',
          status: 'queued',
          startedAt: new Date(),
        });

        res.json({ project, deployment });
      } catch (repoError: any) {
        if (repoError.status === 404) {
          return res.status(404).json({ message: "Repository not found or access denied" });
        }
        throw repoError;
      }
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // GitHub webhook handler for auto-deployments (raw body + signature verify)
  app.post('/api/webhooks/github', express.raw({ type: '*/*' }) as any, async (req: any, res) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string | undefined;
      const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : '';
      if (!verifyGitHubWebhookSignature(rawBody, signature)) {
        return res.status(401).send('Invalid signature');
      }

      const event = req.headers['x-github-event'];
      const payload = JSON.parse(rawBody);

      if (event === 'push') {
        const repoId = String(payload.repository?.id ?? '');
        const branchRef: string = payload.ref || '';
        const branch = branchRef.replace('refs/heads/', '');
        const projectsForRepo = await storage.findProjectsByGithubRepoId(repoId);
        const candidates = projectsForRepo.filter(p => (p.branch || 'main') === branch);
        for (const project of candidates) {
          const deployment = await storage.createDeployment({
            projectId: project.id,
            commitHash: payload.after || `push-${Date.now()}`,
            commitMessage: payload.head_commit?.message || 'Auto-deploy from GitHub push',
            branch,
            status: 'queued',
            startedAt: new Date(),
          });
          buildQueue.enqueue({ deploymentId: deployment.id, project: { id: project.id, name: project.name, branch: project.branch } });
        }
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      const updates = req.body;
      const updatedProject = await storage.updateProject(projectId, updates);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Deployment routes
  app.get('/api/projects/:id/deployments', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      const deployments = await storage.getProjectDeployments(projectId);
      res.json(deployments);
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({ message: "Failed to fetch deployments" });
    }
  });

  app.post('/api/projects/:id/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Create new deployment
      const deployment = await storage.createDeployment({
        projectId,
        commitHash: `deploy-${Date.now()}`,
        commitMessage: req.body.commitMessage || 'Manual deployment',
        branch: project.branch || 'main',
        status: 'queued',
        startedAt: new Date(),
      });

      buildQueue.enqueue({ deploymentId: deployment.id, project: { id: project.id, name: project.name, branch: project.branch } });

      res.json(deployment);
    } catch (error) {
      console.error("Error creating deployment:", error);
      res.status(500).json({ message: "Failed to create deployment" });
    }
  });

  // Team secrets routes
  app.get('/api/team-secrets', isAuthenticated, async (_req, res) => {
    try {
      const secrets = await storage.getTeamSecrets();
      const sanitizedSecrets = secrets.map(s => ({ ...s, value: '***' }));
      res.json(sanitizedSecrets);
    } catch (error) {
      console.error("Error fetching team secrets:", error);
      res.status(500).json({ message: "Failed to fetch team secrets" });
    }
  });

  app.post('/api/team-secrets', isAuthenticated, async (req: any, res) => {
    try {
      const { key, value, description } = req.body;
      const userId = req.user.claims.sub;
      if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      const secret = await storage.setTeamSecret(key, value, description, userId);
      res.json({ ...secret, value: '***' });
    } catch (error) {
      console.error("Error creating team secret:", error);
      res.status(500).json({ message: "Failed to create team secret" });
    }
  });

  app.delete('/api/team-secrets/:key', isAuthenticated, async (req, res) => {
    try {
      const { key } = req.params;
      await storage.deleteTeamSecret(key);
      res.json({ message: "Team secret deleted successfully" });
    } catch (error) {
      console.error("Error deleting team secret:", error);
      res.status(500).json({ message: "Failed to delete team secret" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Add WebSocket support for real-time build logs
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  function broadcastLog(deploymentId: number, message: string) {
    const payload = JSON.stringify({ type: 'log', deploymentId: String(deploymentId), message });
    wss.clients.forEach((client) => {
      if ((client as any).deploymentId === String(deploymentId) && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe') {
          (ws as any).deploymentId = data.deploymentId;
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Lightweight health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), uptimeSec: Math.floor(process.uptime()) });
  });

  // Serve built artifacts for previews
  app.get('/deployments/:id', async (req, res) => {
    const id = parseInt(String(req.params.id));
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');
    const root = getArtifactsRoot();
    const file = path.join(root, String(id), 'index.html');
    if (!fs.existsSync(file)) return res.status(404).send('Not found');
    res.sendFile(file);
  });

  // Build queue with streaming logger
  const buildQueue = new BuildQueue({
    concurrency: 2,
    onLog: broadcastLog,
  });

  return httpServer;
}
import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertDeploymentSchema } from "@shared/schema";
<<<<<<< HEAD
import { GitHubService, verifyGitHubWebhookSignature } from "./github";
import { decryptText, encryptText, isEncrypted } from "./crypto";
import { BuildQueue } from "./build";
import path from "path";
import fs from "fs";
import { getArtifactsRoot } from "./artifacts";
=======
import { GitHubService } from "./github";
import { gitshipAI } from "./ai";
import { BuildService } from "./builder";
>>>>>>> 13f29e88fa9c0d1ceec4b716cdd84927594dd817
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // GitHub OAuth routes
  app.get('/api/auth/github', isAuthenticated, async (req, res) => {
    try {
      const authUrl = GitHubService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating GitHub auth URL:", error);
      res.status(500).json({ message: "Failed to generate GitHub auth URL" });
    }
  });

  app.get('/api/auth/github/callback', isAuthenticated, async (req: any, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ message: "Authorization code required" });
      }

      // Exchange code for access token
      const encryptedToken = await GitHubService.exchangeCodeForToken(code as string);
      
      // Get GitHub user info
      const githubService = new GitHubService(decryptText(encryptedToken));
      const githubUser = await githubService.getCurrentUser();
      
      // Update user with GitHub info
      const userId = req.user.claims.sub;
      await storage.updateUserGitHubInfo(userId, {
        githubAccessToken: encryptedToken,
        githubUsername: githubUser.login,
        githubId: githubUser.id.toString(),
      });

      res.redirect('/dashboard?github=connected');
    } catch (error) {
      console.error("Error in GitHub OAuth callback:", error);
      res.redirect('/dashboard?github=error');
    }
  });

  // GitHub repositories route
  app.get('/api/github/repositories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub account not connected" });
      }

      const token = isEncrypted(user.githubAccessToken) ? decryptText(user.githubAccessToken) : user.githubAccessToken;
      const githubService = new GitHubService(token);
      const repositories = await githubService.getUserRepositories();
      
      res.json(repositories);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub account not connected. Please connect your GitHub account first." });
      }

      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });

      // Parse GitHub repository info
      const repoInfo = GitHubService.parseRepositoryUrl(projectData.repositoryUrl);
      if (!repoInfo) {
        return res.status(400).json({ message: "Invalid GitHub repository URL" });
      }

      // Verify user has access to the repository
      const token = isEncrypted(user.githubAccessToken) ? decryptText(user.githubAccessToken) : user.githubAccessToken;
      const githubService = new GitHubService(token);
      try {
        const repoData = await githubService.getRepository(repoInfo.owner, repoInfo.repo);
        
        // Auto-detect framework if not specified
        let framework = projectData.framework;
        if (!framework) {
          framework = await githubService.detectFramework(repoInfo.owner, repoInfo.repo);
        }

        const project = await storage.createProject({
          ...projectData,
          githubOwner: repoInfo.owner,
          githubRepo: repoInfo.repo,
          githubRepoId: repoData.id.toString(),
          framework: framework || 'static',
        });

        // Create webhook for auto-deployments
        try {
          const webhookUrl = `${req.protocol}://${req.hostname}/api/webhooks/github`;
          await githubService.createWebhook(repoInfo.owner, repoInfo.repo, webhookUrl);
        } catch (webhookError) {
          console.warn("Failed to create webhook:", webhookError);
          // Continue without webhook - manual deployments will still work
        }

        // Create initial deployment
        const deployment = await storage.createDeployment({
          projectId: project.id,
          commitHash: 'initial',
          commitMessage: 'Initial deployment',
          branch: project.branch || 'main',
          status: 'queued',
          startedAt: new Date(),
        });

        res.json({ project, deployment });
      } catch (repoError: any) {
        if (repoError.status === 404) {
          return res.status(404).json({ message: "Repository not found or access denied" });
        }
        throw repoError;
      }
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // GitHub webhook handler for auto-deployments
  // IMPORTANT: must capture raw body for signature verification
  app.post('/api/webhooks/github', express.raw({ type: '*/*' }) as any, async (req: any, res) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string | undefined;
      const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : '';
      if (!verifyGitHubWebhookSignature(rawBody, signature)) {
        return res.status(401).send('Invalid signature');
      }

      const event = req.headers['x-github-event'];
      const payload = JSON.parse(rawBody);

      if (event === 'push') {
        const repoId = String(payload.repository?.id ?? '');
        const branchRef: string = payload.ref || '';
        const branch = branchRef.replace('refs/heads/', '');
        const projectsForRepo = await storage.findProjectsByGithubRepoId(repoId);
        const candidates = projectsForRepo.filter(p => (p.branch || 'main') === branch);
        for (const project of candidates) {
          const deployment = await storage.createDeployment({
            projectId: project.id,
            commitHash: payload.after || `push-${Date.now()}`,
            commitMessage: payload.head_commit?.message || 'Auto-deploy from GitHub push',
            branch,
            status: 'queued',
            startedAt: new Date(),
          });
          buildQueue.enqueue({ deploymentId: deployment.id, project: { id: project.id, name: project.name, branch: project.branch } });
        }
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updates = req.body;
      const updatedProject = await storage.updateProject(projectId, updates);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Deployment routes
  app.get('/api/projects/:id/deployments', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const deployments = await storage.getProjectDeployments(projectId);
      res.json(deployments);
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({ message: "Failed to fetch deployments" });
    }
  });

  app.post('/api/projects/:id/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
<<<<<<< HEAD
      // Create new deployment
      const deployment = await storage.createDeployment({
        projectId,
        commitHash: `deploy-${Date.now()}`,
        commitMessage: req.body.commitMessage || 'Manual deployment',
        branch: project.branch || 'main',
        status: 'queued',
        startedAt: new Date(),
      });
      
      buildQueue.enqueue({ deploymentId: deployment.id, project: { id: project.id, name: project.name, branch: project.branch } });
=======
      // Trigger real deployment
      const deployment = await BuildService.triggerDeployment(
        projectId, 
        req.body.commitHash, 
        req.body.branch
      );
>>>>>>> 13f29e88fa9c0d1ceec4b716cdd84927594dd817
      
      res.json(deployment);
    } catch (error) {
      console.error("Error creating deployment:", error);
      res.status(500).json({ message: "Failed to create deployment" });
    }
  });

  // Team secrets routes
  app.get('/api/team-secrets', isAuthenticated, async (req, res) => {
    try {
      const secrets = await storage.getTeamSecrets();
      // Don't return actual values for security
      const sanitizedSecrets = secrets.map(s => ({
        ...s,
        value: '***'
      }));
      res.json(sanitizedSecrets);
    } catch (error) {
      console.error("Error fetching team secrets:", error);
      res.status(500).json({ message: "Failed to fetch team secrets" });
    }
  });

  app.post('/api/team-secrets', isAuthenticated, async (req: any, res) => {
    try {
      const { key, value, description } = req.body;
      const userId = req.user.claims.sub;
      
      if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      
      const secret = await storage.setTeamSecret(key, value, description, userId);
      res.json({ ...secret, value: '***' });
    } catch (error) {
      console.error("Error creating team secret:", error);
      res.status(500).json({ message: "Failed to create team secret" });
    }
  });

  // GitHub webhook endpoint
  app.post('/api/webhooks/github', async (req, res) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const payload = JSON.stringify(req.body);
      
      // Verify webhook signature
      if (process.env.GITHUB_WEBHOOK_SECRET) {
        const expectedSignature = `sha256=${crypto
          .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
          .update(payload)
          .digest('hex')}`;
        
        if (signature !== expectedSignature) {
          console.error('Invalid webhook signature');
          return res.status(401).json({ message: 'Invalid signature' });
        }
      }

      const event = req.headers['x-github-event'] as string;
      
      if (event === 'push') {
        const { repository, ref, after: commitHash, commits } = req.body;
        const branch = ref.split('/').pop();
        
        // Find projects associated with this repository
        const projects = await storage.getAllProjects();
        const matchingProjects = projects.filter(p => 
          p.githubOwner === repository.owner.login && 
          p.githubRepo === repository.name &&
          p.autoDeployEnabled &&
          (p.branch === branch || (p.branch === 'main' && branch === 'master'))
        );

        for (const project of matchingProjects) {
          try {
            const commitMessage = commits?.[0]?.message || 'Webhook deployment';
            
            await BuildService.triggerDeployment(project.id, commitHash, branch);
            console.log(`Triggered deployment for project ${project.id} from webhook`);
          } catch (error) {
            console.error(`Failed to trigger deployment for project ${project.id}:`, error);
          }
        }
      }

      res.json({ message: 'Webhook processed successfully' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: 'Failed to process webhook' });
    }
  });

  // Environment variables routes
  app.get('/api/projects/:id/env', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const envVars = await storage.getEnvironmentVariables(projectId);
      // Don't return actual values for security
      const sanitizedVars = envVars.map(env => ({
        ...env,
        value: env.isSecret ? '***' : env.value
      }));
      
      res.json(sanitizedVars);
    } catch (error) {
      console.error("Error fetching environment variables:", error);
      res.status(500).json({ message: "Failed to fetch environment variables" });
    }
  });

  app.post('/api/projects/:id/env', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      
      const envVar = await storage.setEnvironmentVariable(projectId, key, value);
      res.json({ ...envVar, value: envVar.isSecret ? '***' : envVar.value });
    } catch (error) {
      console.error("Error setting environment variable:", error);
      res.status(500).json({ message: "Failed to set environment variable" });
    }
  });

  app.delete('/api/projects/:id/env/:key', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { key } = req.params;
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteEnvironmentVariable(projectId, key);
      res.json({ message: "Environment variable deleted successfully" });
    } catch (error) {
      console.error("Error deleting environment variable:", error);
      res.status(500).json({ message: "Failed to delete environment variable" });
    }
  });

  app.delete('/api/team-secrets/:key', isAuthenticated, async (req, res) => {
    try {
      const { key } = req.params;
      await storage.deleteTeamSecret(key);
      res.json({ message: "Team secret deleted successfully" });
    } catch (error) {
      console.error("Error deleting team secret:", error);
      res.status(500).json({ message: "Failed to delete team secret" });
    }
  });

  // Public AI Demo route (no auth required for testing)
  app.post('/api/ai/demo', async (req: any, res) => {
    try {
      // Demo analysis result
      const demoAnalysis = {
        issues: [
          {
            type: 'performance',
            severity: 'medium',
            message: 'Unused lodash import detected in package.json',
            suggestion: 'Remove lodash dependency or use tree-shaking with lodash-es',
            file: 'package.json',
            line: 6
          },
          {
            type: 'bug',
            severity: 'high',
            message: 'Missing error handling in async fetch operation',
            suggestion: 'Add try-catch block or .catch() handler to prevent unhandled promise rejections',
            file: 'src/App.tsx',
            line: 8
          },
          {
            type: 'maintainability',
            severity: 'low',
            message: 'Using array index as React key',
            suggestion: 'Use unique identifiers instead of array indices for better performance',
            file: 'src/App.tsx',
            line: 15
          }
        ],
        optimizations: [
          {
            type: 'bundle-size',
            description: 'Tree-shake unused React features',
            impact: 'high',
            implementation: 'Use React.lazy() for component splitting and import only used hooks'
          },
          {
            type: 'performance',
            description: 'Implement React.memo for list items',
            impact: 'medium',
            implementation: 'Wrap repetitive components with React.memo to prevent unnecessary re-renders'
          },
          {
            type: 'seo',
            description: 'Add meta tags and structured data',
            impact: 'high',
            implementation: 'Use react-helmet-async for dynamic meta tags and JSON-LD structured data'
          }
        ],
        score: 78
      };
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      res.json(demoAnalysis);
    } catch (error) {
      console.error("Error in demo analysis:", error);
      res.status(500).json({ message: "Failed to run demo analysis" });
    }
  });

  // AI Copilot routes
  app.post('/api/ai/analyze-code', isAuthenticated, async (req: any, res) => {
    try {
      const { codeFiles } = req.body;
      
      if (!codeFiles || !Array.isArray(codeFiles)) {
        return res.status(400).json({ message: "Code files array required" });
      }

      const analysis = await gitshipAI.analyzeCode(codeFiles);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing code:", error);
      res.status(500).json({ message: "Failed to analyze code" });
    }
  });

  app.post('/api/ai/optimize-build', isAuthenticated, async (req: any, res) => {
    try {
      const { packageJson, framework } = req.body;
      
      if (!packageJson) {
        return res.status(400).json({ message: "package.json content required" });
      }

      const optimization = await gitshipAI.optimizeBuildConfiguration(packageJson, framework);
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing build:", error);
      res.status(500).json({ message: "Failed to optimize build configuration" });
    }
  });

  app.post('/api/ai/performance-insights', isAuthenticated, async (req: any, res) => {
    try {
      const { metrics, framework } = req.body;
      
      if (!metrics || !framework) {
        return res.status(400).json({ message: "Performance metrics and framework required" });
      }

      const insights = await gitshipAI.generatePerformanceInsights(metrics, framework);
      res.json(insights);
    } catch (error) {
      console.error("Error generating performance insights:", error);
      res.status(500).json({ message: "Failed to generate performance insights" });
    }
  });

  app.post('/api/ai/debug-build', isAuthenticated, async (req: any, res) => {
    try {
      const { errorLog, framework, buildCommand } = req.body;
      
      if (!errorLog) {
        return res.status(400).json({ message: "Error log required" });
      }

      const debugging = await gitshipAI.debugBuildError(errorLog, { framework, buildCommand });
      res.json(debugging);
    } catch (error) {
      console.error("Error debugging build:", error);
      res.status(500).json({ message: "Failed to debug build error" });
    }
  });

  app.post('/api/ai/generate-docs', isAuthenticated, async (req: any, res) => {
    try {
      const { codeFiles, framework } = req.body;
      
      if (!codeFiles || !framework) {
        return res.status(400).json({ message: "Code files and framework required" });
      }

      const documentation = await gitshipAI.generateProjectDocumentation(codeFiles, framework);
      res.json({ documentation });
    } catch (error) {
      console.error("Error generating documentation:", error);
      res.status(500).json({ message: "Failed to generate documentation" });
    }
  });

  app.post('/api/ai/migration-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const { currentFramework, targetFramework, codeFiles } = req.body;
      
      if (!currentFramework || !targetFramework || !codeFiles) {
        return res.status(400).json({ message: "Current framework, target framework, and code files required" });
      }

      const analysis = await gitshipAI.suggestFrameworkMigration(currentFramework, targetFramework, codeFiles);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing migration:", error);
      res.status(500).json({ message: "Failed to analyze framework migration" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Add WebSocket support for real-time build logs
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  function broadcastLog(deploymentId: number, message: string) {
    const payload = JSON.stringify({ type: 'log', deploymentId: String(deploymentId), message });
    wss.clients.forEach((client) => {
      if ((client as any).deploymentId === String(deploymentId) && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe') {
          // Subscribe to deployment updates
          (ws as any).deploymentId = data.deploymentId;
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Lightweight health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), uptimeSec: Math.floor(process.uptime()) });
  });

  // Serve built artifacts for previews
  app.get('/deployments/:id', async (req, res) => {
    const id = parseInt(String(req.params.id));
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');
    const root = getArtifactsRoot();
    const file = path.join(root, String(id), 'index.html');
    if (!fs.existsSync(file)) return res.status(404).send('Not found');
    res.sendFile(file);
  });

  // Build queue with streaming logger
  const buildQueue = new BuildQueue({
    concurrency: 2,
    onLog: broadcastLog,
  });

  return httpServer;
}