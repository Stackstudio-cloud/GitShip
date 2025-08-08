import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGunzip } from 'zlib';
import * as tar from 'tar';
import { GitHubService } from './github';
import { storage } from './storage';
import type { Deployment, Project } from '@shared/schema';

export interface BuildConfig {
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  nodeVersion?: string;
  environmentVariables?: Record<string, string>;
}

export class BuildService {
  private static readonly BUILD_DIR = '/tmp/builds';
  private static readonly OUTPUT_DIR = '/tmp/outputs';

  static async ensureDirectories() {
    await fs.mkdir(this.BUILD_DIR, { recursive: true });
    await fs.mkdir(this.OUTPUT_DIR, { recursive: true });
  }

  static getFrameworkDefaults(framework: string): Partial<BuildConfig> {
    const configs: Record<string, Partial<BuildConfig>> = {
      'nextjs': {
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        nodeVersion: '18',
      },
      'react': {
        buildCommand: 'npm run build',
        outputDirectory: 'build',
        nodeVersion: '18',
      },
      'vue': {
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        nodeVersion: '18',
      },
      'vite': {
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        nodeVersion: '18',
      },
      'angular': {
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        nodeVersion: '18',
      },
      'svelte': {
        buildCommand: 'npm run build',
        outputDirectory: 'build',
        nodeVersion: '18',
      },
      'astro': {
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        nodeVersion: '18',
      },
      'gatsby': {
        buildCommand: 'npm run build',
        outputDirectory: 'public',
        nodeVersion: '18',
      },
      'remix': {
        buildCommand: 'npm run build',
        outputDirectory: 'build',
        nodeVersion: '18',
      },
      'nuxt': {
        buildCommand: 'npm run build',
        outputDirectory: '.output/public',
        nodeVersion: '18',
      },
      'static': {
        buildCommand: 'echo "No build required for static site"',
        outputDirectory: '.',
        nodeVersion: '18',
      },
    };

    return configs[framework] || configs['static'];
  }

  static async startBuild(deploymentId: number): Promise<void> {
    const deployment = await storage.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found`);
    }

    const project = await storage.getProject(deployment.projectId!);
    if (!project) {
      throw new Error(`Project ${deployment.projectId} not found`);
    }

    console.log(`Starting build for deployment ${deploymentId}`);

    try {
      // Update deployment status
      await storage.updateDeployment(deploymentId, {
        status: 'building',
        startedAt: new Date(),
      });

      // Get GitHub access token
      const user = await storage.getUser(project.userId!);
      if (!user?.githubAccessToken) {
        throw new Error('GitHub access token not found');
      }

      // Download and build
      await this.performBuild(project, deployment, user.githubAccessToken);

      // Update deployment as successful
      await storage.updateDeployment(deploymentId, {
        status: 'success',
        completedAt: new Date(),
        deployUrl: `https://${project.name}-${project.id}.gitship.app`,
      });

      console.log(`Build completed successfully for deployment ${deploymentId}`);
    } catch (error) {
      console.error(`Build failed for deployment ${deploymentId}:`, error);
      
      await storage.updateDeployment(deploymentId, {
        status: 'failed',
        completedAt: new Date(),
        buildLogs: error instanceof Error ? error.message : 'Unknown build error',
      });
    }
  }

  private static async performBuild(
    project: Project, 
    deployment: Deployment, 
    githubAccessToken: string
  ): Promise<void> {
    await this.ensureDirectories();

    const buildId = `${project.id}-${deployment.id}`;
    const projectDir = path.join(this.BUILD_DIR, buildId);
    const outputDir = path.join(this.OUTPUT_DIR, buildId);

    try {
      // Download repository
      console.log(`Downloading repository: ${project.githubOwner}/${project.githubRepo}`);
      const github = new GitHubService(githubAccessToken);
      const repoBuffer = await github.downloadRepository(
        project.githubOwner!,
        project.githubRepo!,
        deployment.branch
      );

      // Extract repository
      await fs.mkdir(projectDir, { recursive: true });
      await this.extractZip(repoBuffer, projectDir);

      // Get build configuration
      const buildConfig: BuildConfig = {
        framework: project.framework || 'static',
        buildCommand: project.buildCommand || 'npm run build',
        outputDirectory: project.outputDirectory || 'dist',
        ...this.getFrameworkDefaults(project.framework || 'static'),
      };

      // Get environment variables
      const envVars = await storage.getEnvironmentVariables(project.id);
      const environment = envVars.reduce((acc, env) => {
        acc[env.key] = env.value;
        return acc;
      }, {} as Record<string, string>);

      // Install dependencies
      await this.runCommand('npm install', projectDir, environment);

      // Run build command
      if (buildConfig.framework !== 'static') {
        await this.runCommand(buildConfig.buildCommand, projectDir, environment);
      }

      // Copy build output
      const sourceDir = path.join(projectDir, buildConfig.outputDirectory);
      await this.copyDirectory(sourceDir, outputDir);

      // Store build artifacts (in a real implementation, this would upload to CDN/storage)
      console.log(`Build output stored at: ${outputDir}`);

    } finally {
      // Cleanup build directory
      try {
        await fs.rm(projectDir, { recursive: true, force: true });
      } catch (error) {
        console.warn('Failed to cleanup build directory:', error);
      }
    }
  }

  private static async extractZip(buffer: Buffer, targetDir: string): Promise<void> {
    // GitHub provides tar.gz archives, not zip files
    const tempFile = path.join('/tmp', `extract-${Date.now()}.tar.gz`);
    
    try {
      await fs.writeFile(tempFile, buffer);
      
      // Extract tar.gz archive
      await tar.extract({
        file: tempFile,
        cwd: targetDir,
        strip: 1, // Remove the root directory from the archive
      });
    } finally {
      try {
        await fs.unlink(tempFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  private static async runCommand(
    command: string, 
    cwd: string, 
    env: Record<string, string> = {}
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const child = spawn(cmd, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  private static async copyDirectory(source: string, destination: string): Promise<void> {
    await fs.mkdir(destination, { recursive: true });
    
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }
  }

  static async triggerDeployment(projectId: number, commitHash?: string, branch?: string): Promise<Deployment> {
    const project = await storage.getProject(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // Get latest commit if not provided
    if (!commitHash) {
      const user = await storage.getUser(project.userId!);
      if (user?.githubAccessToken) {
        const github = new GitHubService(user.githubAccessToken);
        try {
          const commit = await github.getLatestCommit(
            project.githubOwner!,
            project.githubRepo!,
            branch || project.branch || 'main'
          );
          commitHash = commit.sha;
        } catch (error) {
          console.warn('Failed to get latest commit:', error);
          commitHash = 'unknown';
        }
      }
    }

    // Create new deployment
    const deployment = await storage.createDeployment({
      projectId,
      commitHash: commitHash || 'manual',
      commitMessage: 'Manual deployment',
      branch: branch || project.branch || 'main',
      status: 'queued',
      startedAt: new Date(),
    });

    // Start build process asynchronously
    setImmediate(() => {
      this.startBuild(deployment.id).catch(error => {
        console.error('Build process failed:', error);
      });
    });

    return deployment;
  }
}