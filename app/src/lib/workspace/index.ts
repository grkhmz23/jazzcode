export {
  applyPatch,
  createSnapshot,
  getWorkspaceRoot,
  loadWorkspace,
  replaceWorkspace,
  resetToSnapshot,
} from "@/lib/workspace/storage";
export {
  applyFilePatches,
  createWorkspaceTree,
  diffWorkspaceTrees,
  listFiles,
  readFile,
} from "@/lib/workspace/tree";
export type {
  WorkspaceDiffEntry,
  WorkspaceDocument,
  WorkspaceFilePatch,
  WorkspaceNode,
  WorkspaceSnapshot,
} from "@/lib/workspace/types";
