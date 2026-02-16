export type WorkspaceNodeType = "file" | "directory";

export type WorkspaceNode = {
  id: string;
  name: string;
  type: WorkspaceNodeType;
  content?: string;
  children?: Record<string, WorkspaceNode>;
};

export type WorkspaceSnapshot = {
  checkpointId: string;
  root: WorkspaceNode;
  createdAt: number;
};

export type WorkspaceDocument = {
  userId: string;
  courseId: string;
  root: WorkspaceNode;
  snapshots: Record<string, WorkspaceSnapshot>;
  updatedAt: number;
};

export type WorkspaceFilePatch = {
  path: string;
  content: string;
};

export type WorkspaceDiffEntry = {
  path: string;
  before: string | null;
  after: string | null;
};
