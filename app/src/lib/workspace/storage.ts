import { get, set } from "idb-keyval";
import {
  WorkspaceDocument,
  WorkspaceFilePatch,
  WorkspaceNode,
  WorkspaceSnapshot,
} from "@/lib/workspace/types";
import { applyFilePatches, createWorkspaceTree } from "@/lib/workspace/tree";

const memoryStore = new Map<string, WorkspaceDocument>();

// Storage uses IndexedDB in browser with a memory fallback for server/test environments.
function workspaceKey(userId: string, courseId: string): string {
  return `workspace:${userId}:${courseId}`;
}

function defaultWorkspace(userId: string, courseId: string): WorkspaceDocument {
  const root = createWorkspaceTree({
    "src/main.ts": "console.log('hello solana');\n",
    "Anchor.toml": "[provider]\ncluster = \"devnet\"\n",
    "README.md": `# ${courseId}\n\nStart your exercises in src/main.ts\n`,
  });
  return {
    userId,
    courseId,
    root,
    snapshots: {},
    updatedAt: Date.now(),
  };
}

async function readFromStorage(
  userId: string,
  courseId: string
): Promise<WorkspaceDocument | null> {
  const key = workspaceKey(userId, courseId);

  if (typeof window === "undefined") {
    return memoryStore.get(key) ?? null;
  }

  try {
    const value = await get<WorkspaceDocument>(key);
    return value ?? null;
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

async function writeToStorage(doc: WorkspaceDocument): Promise<void> {
  const key = workspaceKey(doc.userId, doc.courseId);
  memoryStore.set(key, doc);

  if (typeof window === "undefined") {
    return;
  }

  try {
    await set(key, doc);
  } catch {
    // Memory fallback already has latest state.
  }
}

export async function loadWorkspace(
  userId: string,
  courseId: string
): Promise<WorkspaceDocument> {
  const existing = await readFromStorage(userId, courseId);
  if (existing) return existing;

  const created = defaultWorkspace(userId, courseId);
  await writeToStorage(created);
  return created;
}

export async function applyPatch(
  userId: string,
  courseId: string,
  files: WorkspaceFilePatch[]
): Promise<WorkspaceDocument> {
  const doc = await loadWorkspace(userId, courseId);
  const root = applyFilePatches(doc.root, files);
  const updated: WorkspaceDocument = {
    ...doc,
    root,
    updatedAt: Date.now(),
  };
  await writeToStorage(updated);
  return updated;
}

export async function replaceWorkspace(
  userId: string,
  courseId: string,
  files: Record<string, string>
): Promise<WorkspaceDocument> {
  const doc = await loadWorkspace(userId, courseId);
  const updated: WorkspaceDocument = {
    ...doc,
    root: createWorkspaceTree(files),
    snapshots: {},
    updatedAt: Date.now(),
  };
  await writeToStorage(updated);
  return updated;
}

export async function createSnapshot(
  userId: string,
  courseId: string,
  checkpointId: string
): Promise<WorkspaceSnapshot> {
  const doc = await loadWorkspace(userId, courseId);
  const snapshot: WorkspaceSnapshot = {
    checkpointId,
    root: structuredClone(doc.root),
    createdAt: Date.now(),
  };
  const updated: WorkspaceDocument = {
    ...doc,
    snapshots: {
      ...doc.snapshots,
      [checkpointId]: snapshot,
    },
    updatedAt: Date.now(),
  };
  await writeToStorage(updated);
  return snapshot;
}

export async function resetToSnapshot(
  userId: string,
  courseId: string,
  checkpointId: string
): Promise<WorkspaceDocument> {
  const doc = await loadWorkspace(userId, courseId);
  const snapshot = doc.snapshots[checkpointId];
  if (!snapshot) {
    throw new Error(`Checkpoint '${checkpointId}' not found`);
  }

  const updated: WorkspaceDocument = {
    ...doc,
    root: structuredClone(snapshot.root),
    updatedAt: Date.now(),
  };
  await writeToStorage(updated);
  return updated;
}

export function getWorkspaceRoot(doc: WorkspaceDocument): WorkspaceNode {
  return doc.root;
}
