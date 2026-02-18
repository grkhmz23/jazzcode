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

const DEFAULT_MAX_FILES = 500;
const DEFAULT_MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB uncompressed
const MAX_COMPRESSED_BYTES = 10 * 1024 * 1024; // 10 MB compressed input limit

/**
 * Common metadata/system paths that should be skipped during import
 */
const SKIP_PATH_PREFIXES = [
  "__MACOSX/",
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",
  ".svn/",
  ".hg/",
  ".idea/",
  ".vscode/",
  ".vs/",
  "*.tmp",
  "*.temp",
  "~$",
];

/**
 * Check if a path should be skipped as metadata/system file
 */
function isMetadataPath(rawPath: string): boolean {
  const lowerPath = rawPath.toLowerCase();

  for (const prefix of SKIP_PATH_PREFIXES) {
    const lowerPrefix = prefix.toLowerCase();

    if (prefix.endsWith("/")) {
      // Directory prefix - check if path starts with this directory
      if (lowerPath.startsWith(lowerPrefix) || lowerPath.includes("/" + lowerPrefix)) {
        return true;
      }
    } else if (prefix.startsWith("*.")) {
      // Extension pattern
      const ext = prefix.slice(1).toLowerCase();
      if (lowerPath.endsWith(ext)) {
        return true;
      }
    } else if (prefix.startsWith("~$")) {
      // Office temp file prefix
      if (lowerPath.includes("/~$") || lowerPath.startsWith("~$")) {
        return true;
      }
    } else {
      // Exact match or contains as path component
      if (
        lowerPath === lowerPrefix ||
        lowerPath.includes("/" + lowerPrefix) ||
        lowerPath.startsWith(lowerPrefix + "/")
      ) {
        return true;
      }
    }
  }

  return false;
}

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

export interface ParseZipOptions {
  maxFiles?: number;
  maxTotalBytes?: number;
  maxCompressedBytes?: number;
  onProgress?: (current: number, total: number, currentFile: string) => void;
}

export function parseZipFile(
  buffer: ArrayBuffer,
  options?: ParseZipOptions
): ZipImportResult {
  const maxFiles = options?.maxFiles ?? DEFAULT_MAX_FILES;
  const maxTotalBytes = options?.maxTotalBytes ?? DEFAULT_MAX_TOTAL_BYTES;
  const maxCompressedBytes = options?.maxCompressedBytes ?? MAX_COMPRESSED_BYTES;

  // Check compressed size first
  if (buffer.byteLength > maxCompressedBytes) {
    throw new Error(
      `ZIP file size (${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB) exceeds ` +
        `maximum allowed (${(maxCompressedBytes / 1024 / 1024).toFixed(0)} MB). ` +
        `Try splitting your archive or removing large files.`
    );
  }

  let decompressed: Record<string, Uint8Array>;
  try {
    decompressed = unzipSync(new Uint8Array(buffer));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse ZIP file: ${message}. The archive may be corrupted.`);
  }

  const entries: ZipImportEntry[] = [];
  const skipped: string[] = [];
  let totalBytes = 0;

  const filesToProcess = Object.entries(decompressed).filter(
    ([rawPath]) => !rawPath.endsWith("/")
  );
  const totalFiles = filesToProcess.length;

  for (let i = 0; i < filesToProcess.length; i++) {
    const [rawPath, data] = filesToProcess[i];

    // Report progress
    options?.onProgress?.(i, totalFiles, rawPath);

    // Skip metadata/system files
    if (isMetadataPath(rawPath)) {
      skipped.push(rawPath);
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
        `ZIP would exceed maximum total size of ${(maxTotalBytes / 1024 / 1024).toFixed(0)} MB ` +
          `when uncompressed (${(totalBytes / 1024 / 1024).toFixed(1)} MB). ` +
          `Try removing large files or splitting into smaller archives.`
      );
    }

    if (entries.length >= maxFiles) {
      throw new Error(
        `ZIP contains too many files (${totalFiles}). ` +
          `Maximum allowed is ${maxFiles}. Try removing unnecessary files.`
      );
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
