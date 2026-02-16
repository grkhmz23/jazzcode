import {
  WorkspaceDiffEntry,
  WorkspaceFilePatch,
  WorkspaceNode,
} from "@/lib/workspace/types";

// Workspace trees are immutable; helpers always return new roots for safe state updates.
function cloneNode(node: WorkspaceNode): WorkspaceNode {
  if (node.type === "file") {
    return { ...node };
  }
  const children: Record<string, WorkspaceNode> = {};
  Object.entries(node.children ?? {}).forEach(([key, value]) => {
    children[key] = cloneNode(value);
  });
  return { ...node, children };
}

function normalizePath(path: string): string[] {
  return path
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);
}

function ensureDir(root: WorkspaceNode, segments: string[]): WorkspaceNode {
  const next = cloneNode(root);
  let current = next;
  for (const segment of segments) {
    if (current.type !== "directory") break;
    if (!current.children) current.children = {};
    if (!current.children[segment]) {
      current.children[segment] = {
        id: `dir:${segments.join("/")}:${segment}`,
        name: segment,
        type: "directory",
        children: {},
      };
    }
    current = current.children[segment];
  }
  return next;
}

function getNode(root: WorkspaceNode, path: string): WorkspaceNode | null {
  const parts = normalizePath(path);
  let current: WorkspaceNode = root;
  for (const part of parts) {
    if (current.type !== "directory") return null;
    const next = current.children?.[part];
    if (!next) return null;
    current = next;
  }
  return current;
}

export function createWorkspaceTree(initialFiles: Record<string, string>): WorkspaceNode {
  let root: WorkspaceNode = {
    id: "root",
    name: "/",
    type: "directory",
    children: {},
  };

  Object.entries(initialFiles).forEach(([path, content]) => {
    const parts = normalizePath(path);
    const fileName = parts.at(-1);
    if (!fileName) return;
    root = ensureDir(root, parts.slice(0, -1));
    const parent = getNode(root, parts.slice(0, -1).join("/"));
    if (!parent || parent.type !== "directory") return;
    if (!parent.children) parent.children = {};
    parent.children[fileName] = {
      id: `file:${parts.join("/")}`,
      name: fileName,
      type: "file",
      content,
    };
  });

  return root;
}

export function readFile(root: WorkspaceNode, path: string): string | null {
  const node = getNode(root, path);
  if (!node || node.type !== "file") return null;
  return node.content ?? "";
}

export function listFiles(root: WorkspaceNode, basePath = ""): string[] {
  if (root.type === "file") {
    return [basePath || root.name];
  }
  return Object.entries(root.children ?? {}).flatMap(([name, child]) => {
    const nextPath = basePath ? `${basePath}/${name}` : name;
    return listFiles(child, nextPath);
  });
}

export function applyFilePatches(
  root: WorkspaceNode,
  files: WorkspaceFilePatch[]
): WorkspaceNode {
  let nextRoot = cloneNode(root);

  files.forEach(({ path, content }) => {
    const parts = normalizePath(path);
    const fileName = parts.at(-1);
    if (!fileName) return;
    nextRoot = ensureDir(nextRoot, parts.slice(0, -1));
    const parent = getNode(nextRoot, parts.slice(0, -1).join("/"));
    if (!parent || parent.type !== "directory") return;
    if (!parent.children) parent.children = {};

    const existing = parent.children[fileName];
    parent.children[fileName] = {
      id: existing?.id ?? `file:${parts.join("/")}`,
      name: fileName,
      type: "file",
      content,
    };
  });

  return nextRoot;
}

export function diffWorkspaceTrees(
  before: WorkspaceNode,
  after: WorkspaceNode
): WorkspaceDiffEntry[] {
  const beforeFiles = new Map<string, string>();
  const afterFiles = new Map<string, string>();

  listFiles(before).forEach((path) => {
    const content = readFile(before, path);
    if (content !== null) beforeFiles.set(path, content);
  });

  listFiles(after).forEach((path) => {
    const content = readFile(after, path);
    if (content !== null) afterFiles.set(path, content);
  });

  const allPaths = new Set([...beforeFiles.keys(), ...afterFiles.keys()]);
  const diffs: WorkspaceDiffEntry[] = [];

  allPaths.forEach((path) => {
    const prev = beforeFiles.get(path) ?? null;
    const next = afterFiles.get(path) ?? null;
    if (prev !== next) {
      diffs.push({ path, before: prev, after: next });
    }
  });

  return diffs.sort((a, b) => a.path.localeCompare(b.path));
}
