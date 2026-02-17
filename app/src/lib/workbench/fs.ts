/**
 * In-memory filesystem model for Workbench
 * Provides a deterministic, serializable file system for the playground environment
 */

export type FileLanguage = "typescript" | "javascript" | "json" | "rust" | "markdown" | "plaintext";

export interface FileNode {
  type: "file";
  path: string;
  name: string;
  content: string;
  language: FileLanguage;
  isDirty: boolean;
  lastModified: number;
}

export interface DirectoryNode {
  type: "directory";
  path: string;
  name: string;
  children: FSNode[];
}

export type FSNode = FileNode | DirectoryNode;

export interface FileSystemState {
  root: DirectoryNode;
  currentPath: string;
}

const EXTENSION_LANGUAGE_MAP: Record<string, FileLanguage> = {
  ts: "typescript",
  js: "javascript",
  jsx: "javascript",
  tsx: "typescript",
  json: "json",
  rs: "rust",
  md: "markdown",
  txt: "plaintext",
};

export function inferLanguageFromExtension(path: string): FileLanguage {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_LANGUAGE_MAP[ext] ?? "plaintext";
}

export function normalizeFSPath(input: string): string {
  // Remove leading/trailing whitespace and normalize slashes
  let cleaned = input.trim().replace(/\\+/g, "/").replace(/\/{2,}/g, "/");

  // Handle empty path
  if (!cleaned || cleaned === "/") {
    return "/";
  }

  // Remove trailing slash except for root
  if (cleaned.endsWith("/") && cleaned.length > 1) {
    cleaned = cleaned.slice(0, -1);
  }

  // Ensure leading slash
  if (!cleaned.startsWith("/")) {
    cleaned = "/" + cleaned;
  }

  // Resolve . and ..
  const parts = cleaned.split("/").filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === ".") {
      continue;
    }
    if (part === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(part);
  }

  return "/" + resolved.join("/");
}

export function getParentPath(path: string): string | null {
  const normalized = normalizeFSPath(path);
  if (normalized === "/") {
    return null;
  }
  const parts = normalized.split("/").filter(Boolean);
  parts.pop();
  return parts.length === 0 ? "/" : "/" + parts.join("/");
}

export function getNodeName(path: string): string {
  const normalized = normalizeFSPath(path);
  const parts = normalized.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function resolvePath(cwd: string, input: string): string {
  if (input.startsWith("/")) {
    return normalizeFSPath(input);
  }
  if (input.startsWith("~/")) {
    return normalizeFSPath(input.replace("~/", "/home/user/"));
  }
  return normalizeFSPath(`${cwd}/${input}`);
}

export function createFileNode(path: string, content = ""): FileNode {
  const normalizedPath = normalizeFSPath(path);
  return {
    type: "file",
    path: normalizedPath,
    name: getNodeName(normalizedPath),
    content,
    language: inferLanguageFromExtension(normalizedPath),
    isDirty: false,
    lastModified: Date.now(),
  };
}

export function createDirectoryNode(path: string): DirectoryNode {
  const normalizedPath = normalizeFSPath(path);
  return {
    type: "directory",
    path: normalizedPath,
    name: getNodeName(normalizedPath) || "/",
    children: [],
  };
}

export function findNode(root: DirectoryNode, path: string): FSNode | null {
  const normalizedPath = normalizeFSPath(path);
  if (normalizedPath === "/") {
    return root;
  }

  const parts = normalizedPath.split("/").filter(Boolean);
  let current: FSNode = root;

  for (const part of parts) {
    if (current.type !== "directory") {
      return null;
    }
    const found: FSNode | undefined = current.children.find((child) => child.name === part);
    if (!found) {
      return null;
    }
    current = found;
  }

  return current;
}

export function nodeExists(root: DirectoryNode, path: string): boolean {
  return findNode(root, path) !== null;
}

export function insertNode(root: DirectoryNode, node: FSNode): boolean {
  const parentPath = getParentPath(node.path);
  if (!parentPath) {
    // Cannot insert at root level this way
    return false;
  }

  const parent = findNode(root, parentPath);
  if (!parent || parent.type !== "directory") {
    return false;
  }

  // Check if node already exists
  const existingIndex = parent.children.findIndex((child) => child.name === node.name);
  if (existingIndex >= 0) {
    return false;
  }

  parent.children.push(node);
  // Sort children: directories first, then alphabetically
  parent.children.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return true;
}

export function removeNode(root: DirectoryNode, path: string): FSNode | null {
  const parentPath = getParentPath(path);
  if (!parentPath) {
    return null; // Cannot remove root
  }

  const parent = findNode(root, parentPath);
  if (!parent || parent.type !== "directory") {
    return null;
  }

  const nodeName = getNodeName(path);
  const index = parent.children.findIndex((child) => child.name === nodeName);
  if (index === -1) {
    return null;
  }

  return parent.children.splice(index, 1)[0] ?? null;
}

export function updateFileContent(
  root: DirectoryNode,
  path: string,
  content: string
): FileNode | null {
  const node = findNode(root, path);
  if (!node || node.type !== "file") {
    return null;
  }

  node.content = content;
  node.isDirty = true;
  node.lastModified = Date.now();

  return node;
}

export function markFileClean(root: DirectoryNode, path: string): FileNode | null {
  const node = findNode(root, path);
  if (!node || node.type !== "file") {
    return null;
  }

  node.isDirty = false;
  return node;
}

export function listDirectory(root: DirectoryNode, path: string): FSNode[] | null {
  const node = findNode(root, path);
  if (!node || node.type !== "directory") {
    return null;
  }
  return [...node.children];
}

export function listAllFilePaths(root: DirectoryNode): string[] {
  const paths: string[] = [];

  function traverse(node: FSNode): void {
    if (node.type === "file") {
      paths.push(node.path);
    } else {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return paths.sort();
}

export function createFileSystemFromFiles(
  files: Record<string, string>,
  rootPath = "/workspace"
): DirectoryNode {
  const root = createDirectoryNode(rootPath);

  for (const [path, content] of Object.entries(files)) {
    const fullPath = normalizeFSPath(`${rootPath}/${path}`);
    const fileNode = createFileNode(fullPath, content);

    // Create parent directories as needed
    const parts = fullPath.split("/").filter(Boolean);
    parts.pop(); // Remove filename

    let currentPath = "";
    let currentNode: DirectoryNode = root;

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const normalizedCurrent = normalizeFSPath(`/${currentPath}`);

      let child = currentNode.children.find(
        (n): n is DirectoryNode => n.type === "directory" && n.name === part
      );

      if (!child) {
        child = createDirectoryNode(normalizedCurrent);
        currentNode.children.push(child);
        currentNode.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
      }

      currentNode = child;
    }

    // Insert file into the deepest directory
    const fileParent = getParentPath(fullPath);
    if (fileParent) {
      const parentNode = findNode(root, fileParent);
      if (parentNode && parentNode.type === "directory") {
        parentNode.children.push(fileNode);
        parentNode.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
      }
    }
  }

  return root;
}

export function renameNode(root: DirectoryNode, oldPath: string, newPath: string): FSNode | null {
  const node = findNode(root, oldPath);
  if (!node) {
    return null;
  }

  // Check if destination exists
  if (nodeExists(root, newPath)) {
    return null;
  }

  // Remove from old parent
  const removed = removeNode(root, oldPath);
  if (!removed) {
    return null;
  }

  // Update path and name
  const newNormalizedPath = normalizeFSPath(newPath);
  removed.path = newNormalizedPath;
  removed.name = getNodeName(newNormalizedPath);

  // If directory, update all children paths recursively
  if (removed.type === "directory") {
    const updateChildPaths = (dir: DirectoryNode, parentPath: string): void => {
      for (const child of dir.children) {
        child.path = normalizeFSPath(`${parentPath}/${child.name}`);
        if (child.type === "directory") {
          updateChildPaths(child, child.path);
        }
      }
    };
    updateChildPaths(removed, newNormalizedPath);
  }

  // Insert into new parent
  const inserted = insertNode(root, removed);
  if (!inserted) {
    return null;
  }

  return removed;
}

export function flattenFileSystem(root: DirectoryNode): Record<string, string> {
  const files: Record<string, string> = {};
  const rootPrefix = root.path === "/" ? "" : root.path;

  function traverse(node: FSNode): void {
    if (node.type === "file") {
      const relativePath = node.path.startsWith(rootPrefix)
        ? node.path.slice(rootPrefix.length + 1)
        : node.path;
      files[relativePath] = node.content;
    } else {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return files;
}
