import { WorkspaceTemplate } from "@/lib/playground/types";

export interface ImportProgress {
  total: number;
  completed: number;
  currentFile?: string;
}

export interface ImportOptions {
  onProgress?: (progress: ImportProgress) => void;
}

interface ImportResponse {
  success: boolean;
  files?: Array<{ path: string; content: string }>;
  fileCount?: number;
  error?: string;
}

/**
 * Import a GitHub repository using the server-side API.
 * This avoids CORS issues and rate limits that occur when calling
 * the GitHub API directly from the browser.
 */
export async function importGitHubRepositoryServer(
  repoUrl: string,
  branch?: string,
  options?: ImportOptions
): Promise<WorkspaceTemplate> {
  const { onProgress } = options ?? {};

  onProgress?.({ total: 1, completed: 0, currentFile: "Fetching repository..." });

  const response = await fetch("/api/playground/import/github", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repoUrl: repoUrl.trim(),
      branch: branch?.trim() || undefined,
    }),
  });

  const result = (await response.json()) as ImportResponse;

  if (!response.ok || !result.success) {
    const errorMessage = result.error || `Import failed (${response.status})`;
    throw new Error(errorMessage);
  }

  if (!result.files || result.files.length === 0) {
    throw new Error("No importable files found in repository.");
  }

  onProgress?.({
    total: result.files.length,
    completed: result.files.length,
    currentFile: "Import complete",
  });

  // Parse owner/repo from URL for the template ID
  const url = new URL(repoUrl.trim());
  const pathParts = url.pathname.split("/").filter(Boolean);
  const owner = pathParts[0] || "unknown";
  const repo = (pathParts[1] || "unknown").replace(/\.git$/, "");

  return {
    id: `github-${owner}-${repo}`,
    title: `${owner}/${repo}`,
    description: `Imported ${result.files.length} files from GitHub${branch ? ` (${branch})` : ""}`,
    files: result.files.map((f) => ({
      path: f.path,
      content: f.content,
      readOnly: true,
    })),
  };
}
