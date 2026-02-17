export type EditorLanguage = "typescript" | "javascript" | "json" | "rust";

export interface WorkspaceFile {
  path: string;
  language: EditorLanguage;
  content: string;
  updatedAt: number;
  readOnly?: boolean;
}

export interface Workspace {
  templateId: string;
  files: Record<string, WorkspaceFile>;
  openFiles: string[];
  activeFile: string;
  createdAt: number;
  updatedAt: number;
  cursor?: {
    line: number;
    column: number;
  };
}

export interface WorkspaceTemplate {
  id: string;
  title: string;
  description: string;
  files: Array<{
    path: string;
    language?: EditorLanguage;
    content: string;
    readOnly?: boolean;
  }>;
}

export interface FileTreeNode {
  type: "file" | "directory";
  name: string;
  path: string;
  language?: EditorLanguage;
  children?: FileTreeNode[];
}

export interface TerminalEntry {
  id: string;
  kind: "input" | "output" | "system" | "error";
  text: string;
  timestamp: number;
}
