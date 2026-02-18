import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as tar from "tar";

type RepoRef = {
  owner: string;
  repo: string;
  ref: string;
};

const cache = new Map<string, { files: Record<string, string>; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_FILES = 400;
const MAX_BYTES = 8 * 1024 * 1024;

export function parseGitHubRepoRef(url: string): RepoRef {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") {
    throw new Error("Only github.com URLs are allowed");
  }
  if (parsed.username || parsed.password) {
    throw new Error("Credential-bearing repository URLs are not allowed");
  }

  const parts = parsed.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  const [owner, repo] = parts;
  const cleanRepo = repo.replace(/\.git$/, "");
  const ref = parts[2] === "tree" && parts[3] ? parts[3] : "main";

  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(cleanRepo)) {
    throw new Error("Invalid repository name");
  }

  return { owner, repo: cleanRepo, ref };
}

export async function collectFilesFromDirectory(
  root: string,
  base = "",
  acc: Record<string, string> = {},
  stats = { count: 0, bytes: 0 }
): Promise<{ files: Record<string, string>; count: number; bytes: number }> {
  const entries = await readdir(join(root, base), { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;

    const relative = base ? `${base}/${entry.name}` : entry.name;
    const absolute = join(root, relative);

    if (entry.isDirectory()) {
      const nested = await collectFilesFromDirectory(root, relative, acc, stats);
      stats.count = nested.count;
      stats.bytes = nested.bytes;
      continue;
    }

    const fileStats = await stat(absolute);
    if (fileStats.size > 256_000) continue;

    const content = await readFile(absolute, "utf8");
    if (content.includes("\u0000")) continue;

    acc[relative] = content;
    stats.count += 1;
    stats.bytes += Buffer.byteLength(content, "utf8");

    if (stats.count > MAX_FILES || stats.bytes > MAX_BYTES) {
      throw new Error("Repository import exceeded size limits");
    }
  }

  return { files: acc, count: stats.count, bytes: stats.bytes };
}

export async function importPublicGithubRepository(
  repoUrl: string
): Promise<Record<string, string>> {
  const ref = parseGitHubRepoRef(repoUrl);
  const cacheKey = `${ref.owner}/${ref.repo}@${ref.ref}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.files;
  }

  const archiveUrl = `https://codeload.github.com/${ref.owner}/${ref.repo}/tar.gz/${ref.ref}`;
  const response = await fetch(archiveUrl, {
    headers: {
      "User-Agent": "SuperteamAcademyRunner/1.0",
      Accept: "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub archive (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const tempRoot = await mkdtemp(join(tmpdir(), "github-import-"));
  const archivePath = join(tempRoot, "archive.tar.gz");
  const extractPath = join(tempRoot, "extract");

  try {
    await writeFile(archivePath, buffer);
    await mkdir(extractPath, { recursive: true });
    await tar.x({ file: archivePath, cwd: extractPath, strip: 1 });

    const { files } = await collectFilesFromDirectory(extractPath);
    cache.set(cacheKey, { files, expiresAt: Date.now() + CACHE_TTL_MS });
    return files;
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}
