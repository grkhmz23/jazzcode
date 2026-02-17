import { unzipSync, strFromU8 } from "fflate";
import { WorkspaceFile } from "@/lib/playground/types";
import { normalizePath, inferLanguageFromPath } from "@/lib/playground/workspace";

export interface ZipImportEntry {
  path: string;
  content: string;
  sizeBytes: number;
}

export interface ZipImportResult {
  entries: ZipImportEntry[];
  skipped: string[];
  totalBytes: number;
}

export type ConflictResolution = "overwrite" | "keep_both" | "skip";

interface ParseZipOptions {
  maxFiles?: number;
  maxTotalBytes?: number;
}

const DEFAULT_MAX_FILES = 500;
const DEFAULT_MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB

export function sanitizeZipPath(rawPath: string): string | null {
  if (!rawPath || rawPath.includes("\0")) {
    return null;
  }

  // Reject Windows drive letters
  if (/^[a-zA-Z]:/.test(rawPath)) {
    return null;
  }

  // Reject absolute paths
  if (rawPath.startsWith("/") || rawPath.startsWith("\\")) {
    return null;
  }

  // Normalize backslashes
  const normalized = rawPath.replace(/\\/g, "/");

  // Reject path traversal
  const segments = normalized.split("/").filter(Boolean);
  if (segments.some((s) => s === ".." || s === ".")) {
    return null;
  }

  // Reject empty segments (double slashes)
  if (normalized.includes("//")) {
    return null;
  }

  if (segments.length === 0) {
    return null;
  }

  try {
    return normalizePath(segments.join("/"));
  } catch {
    return null;
  }
}

export function parseZipFile(
  buffer: ArrayBuffer,
  options?: ParseZipOptions
): ZipImportResult {
  const maxFiles = options?.maxFiles ?? DEFAULT_MAX_FILES;
  const maxTotalBytes = options?.maxTotalBytes ?? DEFAULT_MAX_TOTAL_BYTES;

  const decompressed = unzipSync(new Uint8Array(buffer));
  const entries: ZipImportEntry[] = [];
  const skipped: string[] = [];
  let totalBytes = 0;

  for (const [rawPath, data] of Object.entries(decompressed)) {
    // Skip directories (trailing slash or empty data)
    if (rawPath.endsWith("/")) {
      continue;
    }

    // Skip .git/ files
    if (rawPath === ".git" || rawPath.startsWith(".git/") || rawPath.includes("/.git/")) {
      skipped.push(rawPath);
      continue;
    }

    const sanitized = sanitizeZipPath(rawPath);
    if (!sanitized) {
      skipped.push(rawPath);
      continue;
    }

    const sizeBytes = data.byteLength;
    totalBytes += sizeBytes;

    if (totalBytes > maxTotalBytes) {
      throw new Error(
        `ZIP exceeds maximum total size of ${(maxTotalBytes / 1024 / 1024).toFixed(0)} MB.`
      );
    }

    if (entries.length >= maxFiles) {
      throw new Error(`ZIP exceeds maximum file count of ${maxFiles}.`);
    }

    const content = strFromU8(data);
    entries.push({ path: sanitized, content, sizeBytes });
  }

  return { entries, skipped, totalBytes };
}

export function mergeImportedFiles(
  existing: Record<string, WorkspaceFile>,
  entries: ZipImportEntry[],
  resolution: ConflictResolution
): Record<string, WorkspaceFile> {
  const now = Date.now();
  const merged = { ...existing };

  for (const entry of entries) {
    const hasConflict = Boolean(merged[entry.path]);

    if (hasConflict) {
      if (resolution === "skip") {
        continue;
      }

      if (resolution === "keep_both") {
        const ext = entry.path.lastIndexOf(".");
        const base = ext > 0 ? entry.path.slice(0, ext) : entry.path;
        const suffix = ext > 0 ? entry.path.slice(ext) : "";
        let counter = 1;
        let candidate = `${base} (${counter})${suffix}`;
        while (merged[candidate]) {
          counter += 1;
          candidate = `${base} (${counter})${suffix}`;
        }
        merged[candidate] = {
          path: candidate,
          language: inferLanguageFromPath(candidate),
          content: entry.content,
          updatedAt: now,
        };
        continue;
      }
    }

    merged[entry.path] = {
      path: entry.path,
      language: inferLanguageFromPath(entry.path),
      content: entry.content,
      updatedAt: now,
    };
  }

  return merged;
}
