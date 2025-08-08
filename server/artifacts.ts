import fs from "fs";
import path from "path";

export function getArtifactsRoot(): string {
  const root = path.resolve(process.cwd(), "artifacts");
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  return root;
}

export async function writeStaticArtifact(deploymentId: number, html: string): Promise<string> {
  const root = getArtifactsRoot();
  const deploymentDir = path.join(root, String(deploymentId));
  await fs.promises.mkdir(deploymentDir, { recursive: true });
  const indexPath = path.join(deploymentDir, "index.html");
  await fs.promises.writeFile(indexPath, html, "utf8");
  return indexPath;
}


