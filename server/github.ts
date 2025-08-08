import { Octokit } from "@octokit/rest";
import crypto from "crypto";
import { encryptText } from "./crypto";

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  static getAuthUrl() {
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID;
    if (!clientId) {
      throw new Error("GITHUB_CLIENT_ID environment variable is required");
    }
    
    const scopes = ["repo", "user:email"].join(",");
    const state = Math.random().toString(36).substring(7);
    
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scopes}&state=${state}`;
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error("GitHub OAuth credentials not configured");
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description}`);
    }

    // Store encrypted at-rest
    return encryptText(data.access_token);
  }

  async getCurrentUser() {
    const { data } = await this.octokit.rest.users.getAuthenticated();
    return data;
  }

  async getUserRepositories() {
    const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });
    return data;
  }

  async getRepository(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.get({
      owner,
      repo,
    });
    return data;
  }

  async getBranches(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.listBranches({
      owner,
      repo,
    });
    return data;
  }

  async getRepositoryContent(owner: string, repo: string, path: string = "", ref?: string) {
    const { data } = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    return data;
  }

  async createWebhook(owner: string, repo: string, webhookUrl: string) {
    try {
      const { data } = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: "json",
          secret: process.env.GITHUB_WEBHOOK_SECRET,
        },
        events: ["push", "pull_request"],
      });
      return data;
    } catch (error: any) {
      if (error.status === 422) {
        // Webhook already exists
        const { data: webhooks } = await this.octokit.rest.repos.listWebhooks({
          owner,
          repo,
        });
        
        const existingWebhook = webhooks.find(w => 
          w.config?.url === webhookUrl
        );
        
        if (existingWebhook) {
          return existingWebhook;
        }
      }
      throw error;
    }
  }

  async downloadRepository(owner: string, repo: string, ref: string = "main") {
    const { data } = await this.octokit.rest.repos.downloadZipballArchive({
      owner,
      repo,
      ref,
    });
    return data;
  }

  static parseRepositoryUrl(url: string): { owner: string; repo: string } | null {
    const githubRegex = /github\.com[\/:]([^\/]+)\/([^\/\.]+)/;
    const match = url.match(githubRegex);
    
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }
    
    return null;
  }

  async detectFramework(owner: string, repo: string): Promise<string | null> {
    try {
      const packageJson = await this.getRepositoryContent(owner, repo, "package.json");
      
      if (Array.isArray(packageJson) || packageJson.type !== "file") {
        return null;
      }

      const content = Buffer.from(packageJson.content, "base64").toString("utf-8");
      const pkg = JSON.parse(content);
      
      const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (dependencies.next) return "nextjs";
      if (dependencies.nuxt) return "nuxt";
      if (dependencies.astro) return "astro";
      if (dependencies.svelte || dependencies["@sveltejs/kit"]) return "svelte";
      if (dependencies.vue) return "vue";
      if (dependencies.react) return "react";
      if (dependencies.gatsby) return "gatsby";
      if (dependencies["@angular/core"]) return "angular";
      
      return "static";
    } catch (error) {
      // If we can't detect framework, default to static
      return "static";
    }
  }
}

export function verifyGitHubWebhookSignature(rawBody: string, signatureHeader: string | undefined): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  // GitHub sends sha256=<signature>
  const [algo, hash] = signatureHeader.split("=");
  if (algo !== "sha256" || !hash) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const expected = hmac.digest("hex");
  // Use constant-time comparison
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"));
}