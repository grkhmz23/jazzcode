/**
 * Directory operations for Playground Workspace
 * Adds mkdir, rmdir, and directory-aware file operations
 */

import { Workspace, WorkspaceFile } from "@/lib/playground/types";
import { normalizePath, inferLanguageFromPath } from "@/lib/playground/workspace";

export interface DirectoryNode {
  type: "directory";
  name: string;
  path: string;
  children: Map<string, DirectoryNode | FileNode>;
}

export interface FileNode {
  type: "file";
  name: string;
  path: string;
  file: WorkspaceFile;
}

export type FileSystemNode = DirectoryNode | FileNode;

/** Build a hierarchical tree from flat workspace files */
export function buildFileSystemTree(files: Record<string, WorkspaceFile>): DirectoryNode {
  const root: DirectoryNode = {
    type: "directory",
    name: "",
    path: "",
    children: new Map(),
  };

  for (const file of Object.values(files)) {
    insertFileIntoTree(root, file);
  }

  return root;
}

function insertFileIntoTree(root: DirectoryNode, file: WorkspaceFile): void {
  const parts = file.path.split("/").filter(Boolean);
  if (parts.length === 0) return;

  let current: DirectoryNode = root;
  const pathSoFar: string[] = [];

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    pathSoFar.push(part);

    const existing = current.children.get(part);
    if (!existing) {
      const newDir: DirectoryNode = {
        type: "directory",
        name: part,
        path: pathSoFar.join("/"),
        children: new Map(),
      };
      current.children.set(part, newDir);
      current = newDir;
    } else if (existing.type === "directory") {
      current = existing;
    } else {
      // Conflict: a file exists where we need a directory
      throw new Error(`Cannot create directory: file exists at ${existing.path}`);
    }
  }

  const fileName = parts[parts.length - 1];
  if (current.children.has(fileName)) {
    // File already exists, will be handled by caller
    return;
  }

  current.children.set(fileName, {
    type: "file",
    name: fileName,
    path: file.path,
    file,
  });
}

/** Get all file paths under a directory (recursive) */
export function getPathsInDirectory(files: Record<string, WorkspaceFile>, dirPath: string): string[] {
  const normalized = dirPath === "/" ? "" : normalizePath(dirPath);
  const prefix = normalized ? `${normalized}/` : "";

  return Object.keys(files).filter((path) =>
    normalized === "" ? !path.includes("/") : path.startsWith(prefix)
  );
}

/** Check if a directory exists (has any files under it) */
export function directoryExists(files: Record<string, WorkspaceFile>, dirPath: string): boolean {
  const normalized = dirPath === "/" ? "" : normalizePath(dirPath);
  const prefix = normalized ? `${normalized}/` : "";

  return Object.keys(files).some((path) =>
    normalized === "" ? !path.includes("/") : path.startsWith(prefix)
  );
}

/** Check if a path is a directory (has children) */
export function isDirectory(files: Record<string, WorkspaceFile>, path: string): boolean {
  const normalized = path === "/" ? "" : normalizePath(path);
  const prefix = normalized ? `${normalized}/` : "";

  // It's a directory if any file path starts with prefix + "/"
  return Object.keys(files).some((p) => p.startsWith(prefix) && p !== normalized);
}

/** Get immediate children of a directory */
export function listDirectoryContents(
  files: Record<string, WorkspaceFile>,
  dirPath: string
): Array<{ name: string; type: "file" | "directory"; path: string }> {
  const normalized = dirPath === "/" ? "" : normalizePath(dirPath);
  const prefix = normalized ? `${normalized}/` : "";

  const children = new Map<string, { name: string; type: "file" | "directory"; path: string }>();

  for (const path of Object.keys(files)) {
    if (normalized === "") {
      // Root level - look for files without "/" or first segment
      const slashIndex = path.indexOf("/");
      if (slashIndex === -1) {
        children.set(path, { name: path, type: "file", path });
      } else {
        const dirName = path.slice(0, slashIndex);
        if (!children.has(dirName)) {
          children.set(dirName, { name: dirName, type: "directory", path: dirName });
        }
      }
    } else if (path.startsWith(prefix)) {
      const relative = path.slice(prefix.length);
      const slashIndex = relative.indexOf("/");

      if (slashIndex === -1) {
        // Direct child file
        children.set(relative, { name: relative, type: "file", path });
      } else {
        // Child directory
        const dirName = relative.slice(0, slashIndex);
        if (!children.has(dirName)) {
          children.set(dirName, {
            name: dirName,
            type: "directory",
            path: `${normalized}/${dirName}`,
          });
        }
      }
    }
  }

  return Array.from(children.values()).sort((a, b) => {
    // Directories first, then alphabetically
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

/** Create a directory by ensuring at least one file exists in it */
export function createDirectory(
  workspace: Workspace,
  rawPath: string,
  createPlaceholder = false
): { workspace: Workspace; created: boolean; placeholderPath?: string } {
  const path = normalizePath(rawPath);

  if (directoryExists(workspace.files, path)) {
    return { workspace, created: false };
  }

  if (!createPlaceholder) {
    return { workspace, created: false };
  }

  // Create a placeholder .gitkeep file to make the directory exist
  const placeholderPath = path ? `${path}/.gitkeep` : ".gitkeep";
  const timestamp = Date.now();

  const next: Workspace = {
    ...workspace,
    files: {
      ...workspace.files,
      [placeholderPath]: {
        path: placeholderPath,
        language: "typescript",
        content: "",
        updatedAt: timestamp,
        readOnly: false,
      },
    },
    updatedAt: timestamp,
  };

  return { workspace: next, created: true, placeholderPath };
}

/** Remove a directory and all its contents */
export function removeDirectory(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  const pathsToDelete = getPathsInDirectory(workspace.files, path);

  if (pathsToDelete.length === 0) {
    throw new Error(`Directory does not exist: ${path}`);
  }

  // Check if we're deleting all files
  const remainingFiles = Object.keys(workspace.files).filter((p) => !pathsToDelete.includes(p));
  if (remainingFiles.length === 0) {
    throw new Error("Cannot delete the last file in workspace.");
  }

  const timestamp = Date.now();
  const nextFiles = { ...workspace.files };

  for (const p of pathsToDelete) {
    delete nextFiles[p];
  }

  return {
    ...workspace,
    files: nextFiles,
    openFiles: workspace.openFiles.filter((p) => !pathsToDelete.includes(p)),
    activeFile: workspace.activeFile && !pathsToDelete.includes(workspace.activeFile)
      ? workspace.activeFile
      : remainingFiles[remainingFiles.length - 1],
    updatedAt: timestamp,
  };
}

/** Move/rename a file or directory */
export function movePath(
  workspace: Workspace,
  oldRawPath: string,
  newRawPath: string
): Workspace {
  const oldPath = normalizePath(oldRawPath);
  const newPath = normalizePath(newRawPath);

  // Check if it's a directory move
  const isDir = isDirectory(workspace.files, oldPath);

  if (isDir) {
    return moveDirectory(workspace, oldPath, newPath);
  }

  // Single file move - use existing renameFile logic
  return moveSingleFile(workspace, oldPath, newPath);
}

function moveSingleFile(workspace: Workspace, oldPath: string, newPath: string): Workspace {
  if (!workspace.files[oldPath]) {
    throw new Error(`File does not exist: ${oldPath}`);
  }
  if (workspace.files[newPath]) {
    throw new Error(`File already exists: ${newPath}`);
  }

  const timestamp = Date.now();
  const nextFiles = { ...workspace.files };
  const existing = nextFiles[oldPath];
  delete nextFiles[oldPath];

  nextFiles[newPath] = {
    ...existing,
    path: newPath,
    language: inferLanguageFromPath(newPath),
    updatedAt: timestamp,
  };

  return {
    ...workspace,
    files: nextFiles,
    openFiles: workspace.openFiles.map((p) => (p === oldPath ? newPath : p)),
    activeFile: workspace.activeFile === oldPath ? newPath : workspace.activeFile,
    updatedAt: timestamp,
  };
}

function moveDirectory(workspace: Workspace, oldDir: string, newDir: string): Workspace {
  const oldPrefix = oldDir ? `${oldDir}/` : "";
  const newPrefix = newDir ? `${newDir}/` : "";

  // Check target doesn't exist
  if (directoryExists(workspace.files, newDir) || workspace.files[newDir]) {
    throw new Error(`Cannot move: destination already exists: ${newDir}`);
  }

  const timestamp = Date.now();
  const nextFiles: Record<string, WorkspaceFile> = {};
  const pathMapping = new Map<string, string>();

  for (const [path, file] of Object.entries(workspace.files)) {
    if (path.startsWith(oldPrefix) || path === oldDir) {
      // File is in the moved directory
      const relative = path.startsWith(oldPrefix) ? path.slice(oldPrefix.length) : "";
      const newPath = newPrefix ? `${newPrefix}${relative}` : relative || path;

      if (workspace.files[newPath]) {
        throw new Error(`Cannot move: file would overwrite existing: ${newPath}`);
      }

      pathMapping.set(path, newPath);
      nextFiles[newPath] = {
        ...file,
        path: newPath,
        updatedAt: timestamp,
      };
    } else {
      // File is not in the moved directory
      nextFiles[path] = file;
    }
  }

  // Update open files
  const nextOpenFiles = workspace.openFiles.map((p) => pathMapping.get(p) ?? p);
  const nextActiveFile = workspace.activeFile
    ? (pathMapping.get(workspace.activeFile) ?? workspace.activeFile)
    : nextOpenFiles[nextOpenFiles.length - 1];

  return {
    ...workspace,
    files: nextFiles,
    openFiles: nextOpenFiles,
    activeFile: nextActiveFile,
    updatedAt: timestamp,
  };
}

/** Copy a file or directory */
export function copyPath(
  workspace: Workspace,
  sourceRawPath: string,
  destRawPath: string
): Workspace {
  const sourcePath = normalizePath(sourceRawPath);
  const destPath = normalizePath(destRawPath);

  const isDir = isDirectory(workspace.files, sourcePath);

  if (isDir) {
    return copyDirectory(workspace, sourcePath, destPath);
  }

  return copySingleFile(workspace, sourcePath, destPath);
}

function copySingleFile(workspace: Workspace, sourcePath: string, destPath: string): Workspace {
  if (!workspace.files[sourcePath]) {
    throw new Error(`File does not exist: ${sourcePath}`);
  }

  const timestamp = Date.now();
  const source = workspace.files[sourcePath];

  // Handle duplicate names
  let finalPath = destPath;
  if (workspace.files[destPath]) {
    const ext = destPath.lastIndexOf(".");
    const base = ext > 0 ? destPath.slice(0, ext) : destPath;
    const suffix = ext > 0 ? destPath.slice(ext) : "";
    let counter = 1;
    while (workspace.files[`${base} (${counter})${suffix}`]) {
      counter++;
    }
    finalPath = `${base} (${counter})${suffix}`;
  }

  return {
    ...workspace,
    files: {
      ...workspace.files,
      [finalPath]: {
        ...source,
        path: finalPath,
        updatedAt: timestamp,
        readOnly: false,
      },
    },
    updatedAt: timestamp,
  };
}

function copyDirectory(workspace: Workspace, sourceDir: string, destDir: string): Workspace {
  const sourcePrefix = sourceDir ? `${sourceDir}/` : "";
  const destPrefix = destDir ? `${destDir}/` : "";

  if (directoryExists(workspace.files, destDir) || workspace.files[destDir]) {
    throw new Error(`Cannot copy: destination already exists: ${destDir}`);
  }

  const timestamp = Date.now();
  const nextFiles = { ...workspace.files };

  for (const [path, file] of Object.entries(workspace.files)) {
    if (path.startsWith(sourcePrefix)) {
      const relative = path.slice(sourcePrefix.length);
      const newPath = destPrefix ? `${destPrefix}${relative}` : relative;

      nextFiles[newPath] = {
        ...file,
        path: newPath,
        updatedAt: timestamp,
        readOnly: false,
      };
    }
  }

  return {
    ...workspace,
    files: nextFiles,
    updatedAt: timestamp,
  };
}
