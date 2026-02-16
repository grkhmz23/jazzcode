import { VFSNode } from "@/lib/devlab/types";
import { listDir } from "@/lib/devlab/vfs";

export function normalizePath(path: string): string {
  const absolute = path.startsWith("/") ? path : `/${path}`;
  const parts = absolute.split("/");
  const stack: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }

  return `/${stack.join("/")}`;
}

export function resolvePath(currentDir: string, inputPath: string): string {
  if (!inputPath) return currentDir;
  if (inputPath === "~") return "/my-solana-project";
  if (inputPath.startsWith("~/")) return normalizePath(`/my-solana-project/${inputPath.slice(2)}`);
  if (inputPath.startsWith("/")) return normalizePath(inputPath);
  return normalizePath(`${currentDir}/${inputPath}`);
}

export function pathExists(vfs: VFSNode, path: string): boolean {
  const entries = listDir(vfs, path);
  return entries.length > 0 || path === "/" || path === "/my-solana-project";
}

export function toVfsPath(path: string): string {
  return path.replace(/^\//, "");
}
