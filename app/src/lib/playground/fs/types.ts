/**
 * Virtual File System Types
 * Deterministic, serializable file system types for the playground environment
 */

export type FileLanguage = "typescript" | "javascript" | "json" | "rust" | "markdown" | "plaintext";

export interface FileEntry {
  type: "file";
  path: string;
  name: string;
  content: string;
  language: FileLanguage;
  updatedAt: number;
  readOnly?: boolean;
}

export interface DirEntry {
  type: "directory";
  path: string;
  name: string;
  children: (FileEntry | DirEntry)[];
}

export type FsEntry = FileEntry | DirEntry;

export interface FsSnapshot {
  version: 1;
  entries: Record<string, FileEntry>;
  timestamp: number;
}

export interface FsChange {
  type: "create" | "update" | "delete" | "rename";
  path: string;
  previousPath?: string;
  timestamp: number;
}

export type FsChangeListener = (change: FsChange) => void;
