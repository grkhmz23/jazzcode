import { FileTreeNode, Workspace, WorkspaceFile, WorkspaceTemplate } from "@/lib/playground/types";

const EXTENSION_LANGUAGE: Record<string, WorkspaceFile["language"]> = {
  ts: "typescript",
  js: "javascript",
  json: "json",
  rs: "rust",
};

export type WorkspaceAction =
  | { type: "load"; workspace: Workspace }
  | { type: "load_template"; template: WorkspaceTemplate }
  | { type: "create_file"; path: string }
  | { type: "rename_file"; oldPath: string; newPath: string }
  | { type: "delete_file"; path: string }
  | { type: "update_content"; path: string; content: string }
  | { type: "open_file"; path: string }
  | { type: "close_file"; path: string }
  | { type: "set_active_file"; path: string };

function now(): number {
  return Date.now();
}

export function inferLanguageFromPath(path: string): WorkspaceFile["language"] {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_LANGUAGE[extension] ?? "typescript";
}

export function normalizePath(input: string): string {
  const cleaned = input.trim().replace(/\\+/g, "/").replace(/^\/+/, "").replace(/\/{2,}/g, "/");
  if (!cleaned) {
    throw new Error("File path cannot be empty.");
  }

  const segments = cleaned.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error("File path contains invalid segments.");
  }

  return segments.join("/");
}

function ensureWorkspaceConsistency(workspace: Workspace): Workspace {
  const filePaths = Object.keys(workspace.files).sort();
  if (filePaths.length === 0) {
    throw new Error("Workspace must contain at least one file.");
  }

  const dedupedOpenFiles = workspace.openFiles.filter((path, index, list) => {
    return filePaths.includes(path) && list.indexOf(path) === index;
  });

  const openFiles = dedupedOpenFiles.length > 0 ? dedupedOpenFiles : [filePaths[0]];
  const activeFile = openFiles.includes(workspace.activeFile)
    ? workspace.activeFile
    : openFiles[openFiles.length - 1];

  return {
    ...workspace,
    openFiles,
    activeFile,
  };
}

export function createWorkspaceFromTemplate(template: WorkspaceTemplate): Workspace {
  const createdAt = now();
  const files = template.files.reduce<Record<string, WorkspaceFile>>((acc, file) => {
    const path = normalizePath(file.path);
    if (acc[path]) {
      throw new Error(`Duplicate file in template: ${path}`);
    }

    acc[path] = {
      path,
      language: file.language ?? inferLanguageFromPath(path),
      content: file.content,
      updatedAt: createdAt,
      readOnly: file.readOnly,
    };

    return acc;
  }, {});

  const filePaths = Object.keys(files).sort();
  if (filePaths.length === 0) {
    throw new Error("Template must include at least one file.");
  }

  return {
    templateId: template.id,
    files,
    openFiles: [filePaths[0]],
    activeFile: filePaths[0],
    createdAt,
    updatedAt: createdAt,
  };
}

export function createFile(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  if (workspace.files[path]) {
    throw new Error(`File already exists: ${path}`);
  }

  const timestamp = now();
  const next: Workspace = {
    ...workspace,
    files: {
      ...workspace.files,
      [path]: {
        path,
        language: inferLanguageFromPath(path),
        content: "",
        updatedAt: timestamp,
        readOnly: false,
      },
    },
    openFiles: [...workspace.openFiles, path],
    activeFile: path,
    updatedAt: timestamp,
  };

  return ensureWorkspaceConsistency(next);
}

export function renameFile(workspace: Workspace, oldRawPath: string, newRawPath: string): Workspace {
  const oldPath = normalizePath(oldRawPath);
  const newPath = normalizePath(newRawPath);

  if (!workspace.files[oldPath]) {
    throw new Error(`File does not exist: ${oldPath}`);
  }
  if (workspace.files[newPath]) {
    throw new Error(`File already exists: ${newPath}`);
  }

  const timestamp = now();
  const nextFiles = { ...workspace.files };
  const existing = nextFiles[oldPath];
  delete nextFiles[oldPath];

  nextFiles[newPath] = {
    ...existing,
    path: newPath,
    language: inferLanguageFromPath(newPath),
    updatedAt: timestamp,
  };

  const next: Workspace = {
    ...workspace,
    files: nextFiles,
    openFiles: workspace.openFiles.map((path) => (path === oldPath ? newPath : path)),
    activeFile: workspace.activeFile === oldPath ? newPath : workspace.activeFile,
    updatedAt: timestamp,
  };

  return ensureWorkspaceConsistency(next);
}

export function deleteFile(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  if (!workspace.files[path]) {
    throw new Error(`File does not exist: ${path}`);
  }

  const paths = Object.keys(workspace.files);
  if (paths.length <= 1) {
    throw new Error("Cannot delete the last file in a workspace.");
  }

  const timestamp = now();
  const nextFiles = { ...workspace.files };
  delete nextFiles[path];

  const next: Workspace = {
    ...workspace,
    files: nextFiles,
    openFiles: workspace.openFiles.filter((openPath) => openPath !== path),
    activeFile: workspace.activeFile,
    updatedAt: timestamp,
  };

  return ensureWorkspaceConsistency(next);
}

export function updateFileContent(workspace: Workspace, rawPath: string, content: string): Workspace {
  const path = normalizePath(rawPath);
  const target = workspace.files[path];
  if (!target) {
    throw new Error(`File does not exist: ${path}`);
  }
  if (target.readOnly) {
    throw new Error(`File is read-only: ${path}`);
  }

  const timestamp = now();
  const next: Workspace = {
    ...workspace,
    files: {
      ...workspace.files,
      [path]: {
        ...target,
        content,
        updatedAt: timestamp,
      },
    },
    updatedAt: timestamp,
  };

  return ensureWorkspaceConsistency(next);
}

export function openFile(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  if (!workspace.files[path]) {
    throw new Error(`File does not exist: ${path}`);
  }
  if (workspace.openFiles.includes(path)) {
    return setActiveFile(workspace, path);
  }

  const next: Workspace = {
    ...workspace,
    openFiles: [...workspace.openFiles, path],
    activeFile: path,
  };

  return ensureWorkspaceConsistency(next);
}

export function closeFile(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  if (!workspace.files[path]) {
    throw new Error(`File does not exist: ${path}`);
  }

  const next: Workspace = {
    ...workspace,
    openFiles: workspace.openFiles.filter((openPath) => openPath !== path),
    activeFile: workspace.activeFile,
  };

  return ensureWorkspaceConsistency(next);
}

export function setActiveFile(workspace: Workspace, rawPath: string): Workspace {
  const path = normalizePath(rawPath);
  if (!workspace.files[path]) {
    throw new Error(`File does not exist: ${path}`);
  }

  const openFiles = workspace.openFiles.includes(path)
    ? workspace.openFiles
    : [...workspace.openFiles, path];

  return ensureWorkspaceConsistency({
    ...workspace,
    openFiles,
    activeFile: path,
  });
}

export function listTree(workspace: Workspace): FileTreeNode[] {
  type DirectoryAccumulator = {
    dirs: Record<string, DirectoryAccumulator>;
    files: FileTreeNode[];
  };

  const root: DirectoryAccumulator = { dirs: {}, files: [] };

  Object.values(workspace.files).forEach((file) => {
    const parts = file.path.split("/");
    const fileName = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1);

    let current = root;
    let currentPath = "";
    dirParts.forEach((part) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      current.dirs[part] = current.dirs[part] ?? { dirs: {}, files: [] };
      current = current.dirs[part];
    });

    current.files.push({
      type: "file",
      name: fileName,
      path: file.path,
      language: file.language,
    });
  });

  function toNodes(accumulator: DirectoryAccumulator, basePath = ""): FileTreeNode[] {
    const dirNodes = Object.entries(accumulator.dirs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, directory]) => {
        const path = basePath ? `${basePath}/${name}` : name;
        return {
          type: "directory" as const,
          name,
          path,
          children: toNodes(directory, path),
        };
      });

    const fileNodes = [...accumulator.files].sort((a, b) => a.name.localeCompare(b.name));

    return [...dirNodes, ...fileNodes];
  }

  return toNodes(root);
}

export function workspaceReducer(state: Workspace, action: WorkspaceAction): Workspace {
  switch (action.type) {
    case "load":
      return ensureWorkspaceConsistency(action.workspace);
    case "load_template":
      return createWorkspaceFromTemplate(action.template);
    case "create_file":
      return createFile(state, action.path);
    case "rename_file":
      return renameFile(state, action.oldPath, action.newPath);
    case "delete_file":
      return deleteFile(state, action.path);
    case "update_content":
      return updateFileContent(state, action.path, action.content);
    case "open_file":
      return openFile(state, action.path);
    case "close_file":
      return closeFile(state, action.path);
    case "set_active_file":
      return setActiveFile(state, action.path);
    default:
      return state;
  }
}
