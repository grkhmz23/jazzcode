/**
 * Centralized security limits for Playground V2
 * All size/file limits are defined here and enforced consistently
 */

export interface LimitConfig {
  // Workspace limits
  maxFileCount: number;
  maxSingleFileBytes: number;
  maxTotalWorkspaceBytes: number;

  // ZIP import limits
  zipMaxCompressedBytes: number;
  zipMaxUncompressedBytes: number;
  zipMaxFiles: number;

  // GitHub import limits
  githubMaxFiles: number;
  githubMaxTotalBytes: number;

  // Export limits
  exportMaxBytes: number;

  // Share link limits
  shareMaxPayloadBytes: number;

  // Terminal limits
  maxTerminalHistory: number;
  maxTerminalErrors: number;
}

export const DEFAULT_LIMITS: LimitConfig = {
  // Workspace: 500 files, 1MB per file, 50MB total
  maxFileCount: 500,
  maxSingleFileBytes: 1 * 1024 * 1024,
  maxTotalWorkspaceBytes: 50 * 1024 * 1024,

  // ZIP: 10MB compressed, 50MB uncompressed, 500 files
  zipMaxCompressedBytes: 10 * 1024 * 1024,
  zipMaxUncompressedBytes: 50 * 1024 * 1024,
  zipMaxFiles: 500,

  // GitHub: 400 files, 8MB total
  githubMaxFiles: 400,
  githubMaxTotalBytes: 8 * 1024 * 1024,

  // Export: 5MB
  exportMaxBytes: 5 * 1024 * 1024,

  // Share: 100KB (base64url encoded + gzip)
  shareMaxPayloadBytes: 100 * 1024,

  // Terminal: 1000 history entries, 30 errors
  maxTerminalHistory: 1000,
  maxTerminalErrors: 30,
};

/** Check if adding content would exceed workspace limits */
export function checkWorkspaceLimits(
  currentFiles: Record<string, { content: string }>,
  newFilePath: string,
  newContent: string,
  limits: LimitConfig = DEFAULT_LIMITS
): { allowed: true } | { allowed: false; reason: string } {
  const currentCount = Object.keys(currentFiles).length;
  const isNewFile = !currentFiles[newFilePath];

  // Check file count
  if (isNewFile && currentCount >= limits.maxFileCount) {
    return {
      allowed: false,
      reason: `Workspace file limit reached (${limits.maxFileCount} files). Delete files to add more.`,
    };
  }

  // Check single file size
  const newContentBytes = new TextEncoder().encode(newContent).length;
  if (newContentBytes > limits.maxSingleFileBytes) {
    return {
      allowed: false,
      reason: `File too large (${(newContentBytes / 1024).toFixed(1)} KB). Maximum is ${(limits.maxSingleFileBytes / 1024).toFixed(0)} KB per file.`,
    };
  }

  // Check total workspace size
  const currentSize = Object.values(currentFiles).reduce(
    (sum, f) => sum + new TextEncoder().encode(f.content).length,
    0
  );
  const existingSize = currentFiles[newFilePath]
    ? new TextEncoder().encode(currentFiles[newFilePath].content).length
    : 0;
  const newTotalSize = currentSize - existingSize + newContentBytes;

  if (newTotalSize > limits.maxTotalWorkspaceBytes) {
    return {
      allowed: false,
      reason: `Workspace size limit would be exceeded (${(newTotalSize / 1024 / 1024).toFixed(1)} MB). Maximum is ${(limits.maxTotalWorkspaceBytes / 1024 / 1024).toFixed(0)} MB.`,
    };
  }

  return { allowed: true };
}

/** Check ZIP import limits before processing */
export function checkZipImportLimits(
  compressedSize: number,
  uncompressedSize: number,
  fileCount: number,
  limits: LimitConfig = DEFAULT_LIMITS
): { allowed: true } | { allowed: false; reason: string } {
  if (compressedSize > limits.zipMaxCompressedBytes) {
    return {
      allowed: false,
      reason: `ZIP file too large (${(compressedSize / 1024 / 1024).toFixed(1)} MB compressed). Maximum is ${(limits.zipMaxCompressedBytes / 1024 / 1024).toFixed(0)} MB. Try removing large files or splitting into smaller archives.`,
    };
  }

  if (uncompressedSize > limits.zipMaxUncompressedBytes) {
    return {
      allowed: false,
      reason: `ZIP would exceed maximum uncompressed size (${(uncompressedSize / 1024 / 1024).toFixed(1)} MB). Maximum is ${(limits.zipMaxUncompressedBytes / 1024 / 1024).toFixed(0)} MB.`,
    };
  }

  if (fileCount > limits.zipMaxFiles) {
    return {
      allowed: false,
      reason: `ZIP contains too many files (${fileCount}). Maximum is ${limits.zipMaxFiles}.`,
    };
  }

  return { allowed: true };
}

/** Check GitHub import limits */
export function checkGitHubImportLimits(
  fileCount: number,
  totalBytes: number,
  limits: LimitConfig = DEFAULT_LIMITS
): { allowed: true } | { allowed: false; reason: string } {
  if (fileCount > limits.githubMaxFiles) {
    return {
      allowed: false,
      reason: `Repository has too many files (${fileCount}). Maximum is ${limits.githubMaxFiles}.`,
    };
  }

  if (totalBytes > limits.githubMaxTotalBytes) {
    return {
      allowed: false,
      reason: `Repository too large (${(totalBytes / 1024 / 1024).toFixed(1)} MB). Maximum is ${(limits.githubMaxTotalBytes / 1024 / 1024).toFixed(0)} MB.`,
    };
  }

  return { allowed: true };
}

/** Check export limits */
export function checkExportLimits(
  totalBytes: number,
  limits: LimitConfig = DEFAULT_LIMITS
): { allowed: true } | { allowed: false; reason: string } {
  if (totalBytes > limits.exportMaxBytes) {
    return {
      allowed: false,
      reason: `Workspace too large to export (${(totalBytes / 1024 / 1024).toFixed(1)} MB). Maximum is ${(limits.exportMaxBytes / 1024 / 1024).toFixed(0)} MB. Remove large files and try again.`,
    };
  }

  return { allowed: true };
}

/** Check share payload limits */
export function checkShareLimits(
  payloadBytes: number,
  limits: LimitConfig = DEFAULT_LIMITS
): { allowed: true } | { allowed: false; reason: string } {
  if (payloadBytes > limits.shareMaxPayloadBytes) {
    return {
      allowed: false,
      reason: `Share link payload too large (${(payloadBytes / 1024).toFixed(1)} KB). Maximum is ${(limits.shareMaxPayloadBytes / 1024).toFixed(0)} KB. Remove large files before sharing.`,
    };
  }

  return { allowed: true };
}

/** Path sanitization for security */
export function sanitizePath(input: string): string | null {
  if (!input || input.includes("\0")) {
    return null;
  }

  // Reject Windows drive letters
  if (/^[a-zA-Z]:/.test(input)) {
    return null;
  }

  // Reject absolute paths
  if (input.startsWith("/") || input.startsWith("\\")) {
    return null;
  }

  // Normalize backslashes
  const normalized = input.replace(/\\/g, "/");

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

  return segments.join("/");
}

/** Check if a path should be skipped as metadata/system file */
export function isMetadataPath(rawPath: string): boolean {
  const lowerPath = rawPath.toLowerCase();

  const skipPatterns = [
    { type: "prefix" as const, value: "__macosx/" },
    { type: "exact" as const, value: ".ds_store" },
    { type: "exact" as const, value: "thumbs.db" },
    { type: "exact" as const, value: "desktop.ini" },
    { type: "prefix" as const, value: ".svn/" },
    { type: "prefix" as const, value: ".hg/" },
    { type: "prefix" as const, value: ".idea/" },
    { type: "prefix" as const, value: ".vscode/" },
    { type: "prefix" as const, value: ".vs/" },
    { type: "suffix" as const, value: ".tmp" },
    { type: "suffix" as const, value: ".temp" },
    { type: "prefix" as const, value: "~$" }, // Office temp files
  ];

  for (const pattern of skipPatterns) {
    switch (pattern.type) {
      case "prefix":
        if (lowerPath.startsWith(pattern.value)) return true;
        break;
      case "suffix":
        if (lowerPath.endsWith(pattern.value)) return true;
        break;
      case "exact":
        if (lowerPath === pattern.value) return true;
        break;
    }
  }

  return false;
}
