import { Workspace, WorkspaceTemplate } from "@/lib/playground/types";
import {
  WorkspaceAction,
  workspaceReducer,
  createWorkspaceFromTemplate,
  createFile,
  updateFileContent,
} from "@/lib/playground/workspace";
import {
  TerminalState,
  TerminalIo,
  TerminalOutputLine,
  CommandExecutionResult,
} from "@/lib/playground/terminal/commands";
import { createInitialTerminalState, executeTerminalCommand } from "@/lib/playground/terminal/engine";
import { modelRegistry } from "@/lib/playground/editor/model-registry";

export interface PlaygroundRuntimeOptions {
  courseId?: string;
  initialTemplate?: WorkspaceTemplate;
  initialSnapshot?: Workspace;
  readOnly?: boolean;
}

export interface PlaygroundRuntime {
  getWorkspace(): Workspace;
  dispatch(action: WorkspaceAction): void;
  getTerminalState(): TerminalState;
  executeCommand(command: string): Promise<{ lines: TerminalOutputLine[]; shouldClear?: boolean }>;
  editorModels: typeof modelRegistry;
  dispose(): void;
  onChange(listener: (workspace: Workspace) => void): () => void;
}

export function createPlaygroundRuntime(options?: PlaygroundRuntimeOptions): PlaygroundRuntime {
  const readOnly = options?.readOnly ?? false;
  let workspace: Workspace = options?.initialSnapshot
    ? options.initialSnapshot
    : options?.initialTemplate
      ? createWorkspaceFromTemplate(options.initialTemplate)
      : createWorkspaceFromTemplate({
          id: "empty",
          title: "Empty Workspace",
          description: "Blank workspace",
          files: [{ path: "main.ts", content: "" }],
        });

  let terminalState: TerminalState = createInitialTerminalState();
  const editorModels = modelRegistry;
  const listeners = new Set<(workspace: Workspace) => void>();

  function notifyChange() {
    for (const listener of listeners) {
      listener(workspace);
    }
  }

  function createOrUpdateFileInWorkspace(ws: Workspace, path: string, content: string): Workspace {
    if (ws.files[path]) {
      return updateFileContent(ws, path, content);
    }
    const withFile = createFile(ws, path);
    return updateFileContent(withFile, path, content);
  }

  const runtime: PlaygroundRuntime = {
    getWorkspace() {
      return workspace;
    },

    dispatch(action: WorkspaceAction) {
      if (readOnly && action.type !== "open_file" && action.type !== "set_active_file" && action.type !== "close_file") {
        return;
      }
      workspace = workspaceReducer(workspace, action);
      notifyChange();
    },

    getTerminalState() {
      return terminalState;
    },

    async executeCommand(command: string) {
      let pendingWorkspace = workspace;

      const io: TerminalIo = {
        workspace: pendingWorkspace,
        createOrUpdateFile: (path: string, content: string) => {
          if (readOnly) return;
          pendingWorkspace = createOrUpdateFileInWorkspace(pendingWorkspace, path, content);
        },
        fileExists: (path: string) => Boolean(pendingWorkspace.files[path]),
        readFile: (path: string) => pendingWorkspace.files[path]?.content ?? null,
        listPaths: () => Object.keys(pendingWorkspace.files),
        setActiveFile: (path: string) => {
          if (pendingWorkspace.files[path]) {
            pendingWorkspace = {
              ...pendingWorkspace,
              openFiles: pendingWorkspace.openFiles.includes(path)
                ? pendingWorkspace.openFiles
                : [...pendingWorkspace.openFiles, path],
              activeFile: path,
            };
          }
        },
        deleteFile: (path: string) => {
          if (readOnly) return;
          if (pendingWorkspace.files[path] && Object.keys(pendingWorkspace.files).length > 1) {
            const nextFiles = { ...pendingWorkspace.files };
            delete nextFiles[path];
            pendingWorkspace = {
              ...pendingWorkspace,
              files: nextFiles,
              openFiles: pendingWorkspace.openFiles.filter((p) => p !== path),
              updatedAt: Date.now(),
            };
          }
        },
        wallet: {
          mode: "burner",
          burnerAddress: null,
          externalAddress: null,
          burnerSigner: null,
          externalConnected: false,
        },
      };

      const result: CommandExecutionResult = await executeTerminalCommand(command, terminalState, io);

      terminalState = result.nextState;

      if (pendingWorkspace !== workspace) {
        workspace = pendingWorkspace;
        notifyChange();
      }

      return {
        lines: result.lines,
        shouldClear: result.shouldClear,
      };
    },

    editorModels,

    dispose() {
      listeners.clear();
    },

    onChange(listener: (workspace: Workspace) => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  return runtime;
}
