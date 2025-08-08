import { storage } from "./storage";
import { writeStaticArtifact } from "./artifacts";

export interface BuildProjectContext {
  id: number;
  name: string;
  branch?: string | null;
}

export interface BuildTask {
  deploymentId: number;
  project: BuildProjectContext;
}

type LogFn = (deploymentId: number, message: string) => void;

export class BuildQueue {
  private concurrency: number;
  private queue: BuildTask[] = [];
  private running: number = 0;
  private onLog: LogFn;

  constructor(options: { concurrency?: number; onLog: LogFn }) {
    this.concurrency = Math.max(1, options.concurrency ?? 2);
    this.onLog = options.onLog;
  }

  enqueue(task: BuildTask) {
    this.queue.push(task);
    this.pump();
  }

  private pump() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.running += 1;
      this.runTask(task).finally(() => {
        this.running -= 1;
        this.pump();
      });
    }
  }

  private async runTask(task: BuildTask) {
    const { deploymentId, project } = task;
    try {
      await storage.updateDeployment(deploymentId, {
        status: "building",
        buildLogs:
          "Queued...\nStarting build...\nResolving dependencies...\nSetting up environment...\n",
      });
      this.onLog(deploymentId, "Queued...");
      this.onLog(deploymentId, "Starting build...");
      await this.sleep(800);
      this.onLog(deploymentId, "Resolving dependencies...");
      await this.sleep(1200);
      this.onLog(deploymentId, `Checking out branch ${project.branch || "main"}...`);
      await this.sleep(600);
      this.onLog(deploymentId, "Running build command...");
      await this.sleep(2000);
      this.onLog(deploymentId, "Optimizing assets...");
      await this.sleep(900);
      await storage.updateDeployment(deploymentId, {
        status: "success",
        buildLogs:
          "Queued...\nStarting build...\nResolving dependencies...\nSetting up environment...\nRunning build command...\nOptimizing assets...\nBuild completed successfully!\n",
        // In local/dev, serve artifact via internal route, while preserving external deployUrl for future DNS
        deployUrl: `https://${project.name.toLowerCase()}-${deploymentId}.gitship.app`,
        previewUrl: `/deployments/${deploymentId}`,
        buildTime: Math.floor(Math.random() * 120) + 30,
        completedAt: new Date(),
      });
      // Generate a minimal artifact
      const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${this.escapeHtml(project.name)} • Deployment ${deploymentId}</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;background:#0b1220;color:#e6edf3;margin:0;padding:2rem}
      .card{max-width:800px;margin:0 auto;background:#111827;border:1px solid #334155;border-radius:12px;padding:1.5rem}
      .muted{color:#94a3b8}
      code{background:#0b1220;border:1px solid #334155;border-radius:6px;padding:0.2rem 0.4rem}
      a{color:#22d3ee}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${this.escapeHtml(project.name)}</h1>
      <p class="muted">Deployment <code>#${deploymentId}</code> built successfully.</p>
      <p>Replace this with your actual build output by integrating the real build pipeline.</p>
      <p class="muted">${new Date().toLocaleString()}</p>
    </div>
  </body>
 </html>`;
      await writeStaticArtifact(deploymentId, html);
      this.onLog(deploymentId, "Build completed successfully!");
    } catch (error) {
      await storage.updateDeployment(deploymentId, {
        status: "failed",
        buildLogs:
          "Queued...\nStarting build...\nError occurred during build.\n",
        completedAt: new Date(),
      });
      this.onLog(deploymentId, "Error: Build failed");
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


