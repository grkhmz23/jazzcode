import { WorkspaceTemplate } from "@/lib/playground/types";

const MAX_IMPORT_FILES = 200;
const MAX_TOTAL_BYTES = 2_500_000;

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${detail}`);
  }
  return (await response.json()) as T;
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

export async function importGitHubRepository(input: string, branchInput?: string): Promise<WorkspaceTemplate> {
  const parsed = parseRepoInput(input, branchInput);
  if (!parsed) {
    throw new Error("Invalid repository input. Use owner/repo or full GitHub URL.");
  }

  const tree = await fetchJson<GitTreeResponse>(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${parsed.branch}?recursive=1`
  );

  if (tree.truncated) {
    throw new Error("Repository tree is too large for import (GitHub truncated response).");
  }

  const blobItems = tree.tree
    .filter((item) => item.type === "blob")
    .filter((item) => !item.path.startsWith(".git/"))
    .slice(0, MAX_IMPORT_FILES);

  let totalBytes = 0;
  const files: WorkspaceTemplate["files"] = [];

  for (const item of blobItems) {
    if ((item.size ?? 0) > 200_000) {
      continue;
    }

    const blob = await fetchJson<GitBlobResponse>(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/blobs/${item.sha}`
    );

    const content = atob(blob.content.replace(/\n/g, ""));
    totalBytes += content.length;

    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new Error("Repository import exceeds 2.5 MB workspace limit.");
    }

    files.push({
      path: item.path,
      content,
      readOnly: true,
    });
  }

  if (files.length === 0) {
    throw new Error("No importable text files found in repository.");
  }

  return {
    id: `github-${parsed.owner}-${parsed.repo}`,
    title: `${parsed.owner}/${parsed.repo}`,
    description: `Imported from GitHub branch ${parsed.branch}`,
    files,
  };
}
