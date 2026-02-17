/**
 * Virtual File System Operations
 * High-level file operations for the playground environment
 */

import { fsStore } from "./store";
import type { FileEntry, DirEntry } from "./types";

/**
 * Normalize a file path to use forward slashes and remove redundant separators
 */
export function normalizePath(input: string): string {
  const cleaned = input.trim().replace(/\\+/g, "/").replace(/^\/+/, "").replace(/\/{2,}/g, "/");
  if (!cleaned) {
    throw new Error("File path cannot be empty");
  }

  const segments = cleaned.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error("File path contains invalid segments");
  }

  return segments.join("/");
}

/**
 * Read a file from the virtual filesystem
 */
export async function readFile(path: string): Promise<string | null> {
  const normalized = normalizePath(path);
  const entry = await fsStore.readFile(normalized);
  return entry?.content ?? null;
}

/**
 * Write content to a file in the virtual filesystem
 */
export async function writeFile(
  path: string,
  content: string,
  language?: string,
  readOnly?: boolean
): Promise<void> {
  const normalized = normalizePath(path);
  return fsStore.writeFile(normalized, content, language, readOnly);
}

/**
 * Delete a file from the virtual filesystem
 */
export async function rm(path: string): Promise<void> {
  const normalized = normalizePath(path);
  return fsStore.deleteFile(normalized);
}

/**
 * Rename/move a file
 */
export async function mv(oldPath: string, newPath: string): Promise<void> {
  const normalizedOld = normalizePath(oldPath);
  const normalizedNew = normalizePath(newPath);
  return fsStore.renameFile(normalizedOld, normalizedNew);
}

/**
 * Copy a file
 */
export async function cp(sourcePath: string, destPath: string): Promise<void> {
  const normalizedSource = normalizePath(sourcePath);
  const normalizedDest = normalizePath(destPath);

  const entry = await fsStore.readFile(normalizedSource);
  if (!entry) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  return fsStore.writeFile(normalizedDest, entry.content, entry.language, entry.readOnly);
}

/**
 * Create a directory (virtual - only validates path structure)
 */
export async function mkdir(path: string): Promise<void> {
  // In the flat file system, directories are implicit
  // Just validate the path is well-formed
  normalizePath(path);
}

/**
 * List all files in the virtual filesystem as a tree structure
 */
export async function listTree(): Promise<DirEntry> {
  const files = await fsStore.listFiles();

  const root: DirEntry = {
    type: "directory",
    path: "/",
    name: "/",
    children: [],
  };

  // Group files by directory
  const dirMap = new Map<string, DirEntry>();
  dirMap.set("/", root);

  for (const file of files) {
    const parts = file.path.split("/");
    // Remove filename to get directory path
    parts.pop();
    const dirPath = parts.join("/") || "/";

    // Ensure all parent directories exist
    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!dirMap.has(currentPath)) {
        const parentPath = parts.slice(0, i).join("/") || "/";
        const parent = dirMap.get(parentPath) ?? root;
        const dir: DirEntry = {
          type: "directory",
          path: currentPath,
          name: part,
          children: [],
        };
        dirMap.set(currentPath, dir);
        parent.children.push(dir);
      }
    }

    // Add file to its parent directory
    const parent = dirMap.get(dirPath) ?? root;
    parent.children.push(file);
  }

  // Sort children: directories first, then alphabetically
  function sortChildren(dir: DirEntry): void {
    dir.children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const child of dir.children) {
      if (child.type === "directory") {
        sortChildren(child);
      }
    }
  }

  sortChildren(root);
  return root;
}

/**
 * List all file paths
 */
export async function listPaths(): Promise<string[]> {
  const files = await fsStore.listFiles();
  return files.map((f) => f.path);
}

/**
 * Check if a file exists
 */
export async function fileExists(path: string): Promise<boolean> {
  const normalized = normalizePath(path);
  const entry = await fsStore.readFile(normalized);
  return entry !== null;
}

/**
 * Get file metadata
 */
export async function stat(path: string): Promise<FileEntry | null> {
  const normalized = normalizePath(path);
  return fsStore.readFile(normalized);
}
