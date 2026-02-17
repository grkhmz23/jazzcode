import { WorkspaceTemplate } from "@/lib/playground/types";

const MAX_IMPORT_FILES = 200;
const MAX_TOTAL_BYTES = 2_500_000;
const CONCURRENT_DOWNLOADS = 5;

export interface ImportProgress {
  total: number;
  completed: number;
  currentFile?: string;
}

interface ParsedRepoInput {
  owner: string;
  repo: string;
  branch: string;
}

function parseRepoInput(input: string, branchInput?: string): ParsedRepoInput | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const direct = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (direct) {
    return { owner: direct[1], repo: direct[2], branch: branchInput?.trim() || "HEAD" };
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname !== "github.com") {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    const branchFromUrl = parts[2] === "tree" ? parts[3] : undefined;

    return {
      owner,
      repo,
      branch: branchInput?.trim() || branchFromUrl || "HEAD",
    };
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string, retryCount = 2): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });
      
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining");
        const rateLimitReset = response.headers.get("X-RateLimit-Reset");
        
        if (rateLimitRemaining === "0" && rateLimitReset) {
          const resetTime = new Date(Number(rateLimitReset) * 1000);
          throw new Error(
            `GitHub API rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}. ` +
            `Try using a personal access token for higher limits.`
          );
        }
      }
      
      if (response.status === 404) {
        throw new Error("Repository not found. Check the owner/repo name and ensure it's public.");
      }
      
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`GitHub API error (${response.status}): ${detail}`);
      }
      
      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (attempt < retryCount) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

interface GitTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

interface GitTreeResponse {
  tree: GitTreeItem[];
  truncated: boolean;
}

interface GitBlobResponse {
  content: string;
  encoding: "base64";
}

async function downloadBlob(
  owner: string,
  repo: string,
  item: GitTreeItem,
  onProgress?: (progress: ImportProgress) => void,
  currentIndex?: number,
  total?: number
): Promise<{ path: string; content: string } | null> {
  try {
    if ((item.size ?? 0) > 200_000) {
      return null; // Skip large files
    }

    onProgress?.({
      total: total ?? 1,
      completed: currentIndex ?? 0,
      currentFile: item.path,
    });

    const blob = await fetchJson<GitBlobResponse>(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs/${item.sha}`
    );

    const content = atob(blob.content.replace(/\n/g, ""));
    return { path: item.path, content };
  } catch (error) {
    console.warn(`Failed to download ${item.path}:`, error);
    return null;
  }
}

async function downloadBlobsConcurrently(
  owner: string,
  repo: string,
  items: GitTreeItem[],
  onProgress?: (progress: ImportProgress) => void
): Promise<Array<{ path: string; content: string }>> {
  const results: Array<{ path: string; content: string }> = [];
  let completed = 0;

  // Process in batches to limit concurrency
  for (let i = 0; i < items.length; i += CONCURRENT_DOWNLOADS) {
    const batch = items.slice(i, i + CONCURRENT_DOWNLOADS);
    const batchResults = await Promise.all(
      batch.map((item, batchIndex) =>
        downloadBlob(owner, repo, item, onProgress, completed + batchIndex, items.length)
      )
    );

    for (const result of batchResults) {
      if (result) {
        results.push(result);
      }
    }
    completed += batch.length;
    
    onProgress?.({
      total: items.length,
      completed,
    });
  }

  return results;
}

export interface ImportOptions {
  onProgress?: (progress: ImportProgress) => void;
}

export async function importGitHubRepository(
  input: string,
  branchInput?: string,
  options?: ImportOptions
): Promise<WorkspaceTemplate> {
  const parsed = parseRepoInput(input, branchInput);
  if (!parsed) {
    throw new Error("Invalid repository input. Use owner/repo or full GitHub URL.");
  }

  const { onProgress } = options ?? {};

  onProgress?.({ total: 1, completed: 0, currentFile: "Fetching repository tree..." });

  const tree = await fetchJson<GitTreeResponse>(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${parsed.branch}?recursive=1`
  );

  if (tree.truncated) {
    throw new Error("Repository tree is too large for import (GitHub truncated response).");
  }

  const blobItems = tree.tree
    .filter((item) => item.type === "blob")
    .filter((item) => !item.path.startsWith(".git/"))
    .filter((item) => !item.path.includes("/node_modules/"))
    .filter((item) => !item.path.includes("/.next/"))
    .filter((item) => !item.path.includes("/dist/"))
    .filter((item) => !item.path.includes("/build/"))
    .slice(0, MAX_IMPORT_FILES);

  if (blobItems.length === 0) {
    throw new Error("No importable text files found in repository.");
  }

  // Download blobs concurrently with progress tracking
  const downloadedFiles = await downloadBlobsConcurrently(
    parsed.owner,
    parsed.repo,
    blobItems,
    onProgress
  );

  let totalBytes = 0;
  const files: WorkspaceTemplate["files"] = [];

  for (const { path, content } of downloadedFiles) {
    totalBytes += content.length;

    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new Error("Repository import exceeds 2.5 MB workspace limit.");
    }

    files.push({
      path,
      content,
      readOnly: true,
    });
  }

  if (files.length === 0) {
    throw new Error("No importable text files found in repository.");
  }

  onProgress?.({ total: 1, completed: 1, currentFile: "Import complete" });

  return {
    id: `github-${parsed.owner}-${parsed.repo}`,
    title: `${parsed.owner}/${parsed.repo}`,
    description: `Imported ${files.length} files from GitHub branch ${parsed.branch}`,
    files,
  };
}
