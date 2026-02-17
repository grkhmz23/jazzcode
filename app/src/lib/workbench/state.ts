/**
 * Workbench state management and persistence
 * Handles localStorage with versioning and migrations
 */

import type {
  PersistedWorkspace,
  SchemaMigration,
  SimulationState,
  WorkspaceDefinition,
  WorkspaceState,
} from "./types";
import {
  createFileSystemFromFiles,
  flattenFileSystem,
  normalizeFSPath,
} from "./fs";
import { createInitialSimulationState } from "./terminal/engine";

// ============================================================================
// Constants
// ============================================================================

import { CURRENT_SCHEMA_VERSION } from "./types";
export { CURRENT_SCHEMA_VERSION };
const STORAGE_KEY = "workbench-state-v2";

// ============================================================================
// Migrations
// ============================================================================

const migrations: SchemaMigration[] = [];

function runMigrations(data: unknown): unknown {
  let current = data;

  for (const migration of migrations) {
    const version = (current as Record<string, unknown>)?.schemaVersion;
    if (version === migration.fromVersion) {
      current = migration.migrate(current);
    }
  }

  return current;
}

// ============================================================================
// Serialization
// ============================================================================

export function serializeWorkspace(
  workspace: WorkspaceState,
  taskCompletions: string[] = [],
  revealedHints: Record<string, number> = {}
): PersistedWorkspace {
  const files = flattenFileSystem(workspace.fs);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    definitionId: workspace.definitionId,
    files,
    openFiles: workspace.openFiles,
    activeFilePath: workspace.activeFilePath,
    currentDirectory: workspace.currentDirectory,
    simulation: {
      ...workspace.simulation,
      // Ensure all arrays are plain arrays for serialization
      commandHistory: [...workspace.simulation.commandHistory],
      commandSuccesses: [...workspace.simulation.commandSuccesses],
      errors: [...workspace.simulation.errors],
      recentTxSignatures: [...workspace.simulation.recentTxSignatures],
      knownAddresses: [...workspace.simulation.knownAddresses],
    },
    taskCompletions,
    revealedHints,
    createdAt: workspace.createdAt,
    updatedAt: Date.now(),
  };
}

export function deserializeWorkspace(
  persisted: PersistedWorkspace,
  definition?: WorkspaceDefinition
): { workspace: WorkspaceState; taskCompletions: string[]; revealedHints: Record<string, number> } {
  // Restore file system from files
  const rootPath = definition?.files[0]?.path.includes("/")
    ? normalizeFSPath(`/${definition.files[0].path.split("/")[0]}`)
    : "/workspace";

  const fs = createFileSystemFromFiles(persisted.files, rootPath);

  // Restore simulation state with defaults for any missing fields
  const simulation: SimulationState = {
    ...createInitialSimulationState(),
    ...persisted.simulation,
    currentDir: persisted.currentDirectory,
  };

  const workspace: WorkspaceState = {
    definitionId: persisted.definitionId,
    fs,
    openFiles: persisted.openFiles.length > 0 ? persisted.openFiles : Object.keys(persisted.files).slice(0, 5),
    activeFilePath: persisted.activeFilePath,
    currentDirectory: persisted.currentDirectory,
    simulation,
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
  };

  return {
    workspace,
    taskCompletions: persisted.taskCompletions ?? [],
    revealedHints: persisted.revealedHints ?? {},
  };
}

// ============================================================================
// Persistence
// ============================================================================

export function saveToStorage(
  workspace: WorkspaceState,
  taskCompletions: string[],
  revealedHints: Record<string, number>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const persisted = serializeWorkspace(workspace, taskCompletions, revealedHints);
    const json = JSON.stringify(persisted);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Failed to save workbench state:", error);
  }
}

export function loadFromStorage(): PersistedWorkspace | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null;
    }

    const parsed = JSON.parse(json) as unknown;
    const migrated = runMigrations(parsed) as PersistedWorkspace;

    // Validate schema version
    if (migrated.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      console.warn(
        `Schema version mismatch: expected ${CURRENT_SCHEMA_VERSION}, got ${migrated.schemaVersion}`
      );
    }

    return migrated;
  } catch (error) {
    console.error("Failed to load workbench state:", error);
    return null;
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear workbench state:", error);
  }
}

// ============================================================================
// Workspace Initialization
// ============================================================================

export function createWorkspaceFromDefinition(
  definition: WorkspaceDefinition
): WorkspaceState {
  const now = Date.now();
  const files: Record<string, string> = {};

  for (const file of definition.files) {
    files[file.path] = file.content;
  }

  const fs = createFileSystemFromFiles(files, "/workspace");
  const filePaths = Object.keys(files);

  return {
    definitionId: definition.id,
    fs,
    openFiles: filePaths.slice(0, 5),
    activeFilePath: filePaths[0] ?? null,
    currentDirectory: "/workspace",
    simulation: createInitialSimulationState(),
    createdAt: now,
    updatedAt: now,
  };
}

export function resetWorkspace(definition: WorkspaceDefinition): WorkspaceState {
  return createWorkspaceFromDefinition(definition);
}

// ============================================================================
// Workspace Operations
// ============================================================================

export function updateSimulationState(
  workspace: WorkspaceState,
  simulation: SimulationState
): WorkspaceState {
  return {
    ...workspace,
    simulation,
    updatedAt: Date.now(),
  };
}

export function setActiveFile(workspace: WorkspaceState, path: string | null): WorkspaceState {
  if (path === null) {
    return {
      ...workspace,
      activeFilePath: null,
      updatedAt: Date.now(),
    };
  }

  const normalized = normalizeFSPath(path);
  const openFiles = workspace.openFiles.includes(normalized)
    ? workspace.openFiles
    : [...workspace.openFiles, normalized];

  return {
    ...workspace,
    activeFilePath: normalized,
    openFiles,
    updatedAt: Date.now(),
  };
}

export function closeFile(workspace: WorkspaceState, path: string): WorkspaceState {
  const normalized = normalizeFSPath(path);
  const openFiles = workspace.openFiles.filter((p) => p !== normalized);

  // If we closed the active file, switch to another open file
  let activeFilePath = workspace.activeFilePath;
  if (activeFilePath === normalized) {
    activeFilePath = openFiles[openFiles.length - 1] ?? null;
  }

  return {
    ...workspace,
    openFiles,
    activeFilePath,
    updatedAt: Date.now(),
  };
}

export function markFileAsSaved(workspace: WorkspaceState): WorkspaceState {
  // Find the file in the file system and mark it as clean
  // This is a shallow update; the FS operations should handle the actual marking
  return {
    ...workspace,
    updatedAt: Date.now(),
  };
}

export function setCurrentDirectory(workspace: WorkspaceState, path: string): WorkspaceState {
  return {
    ...workspace,
    currentDirectory: normalizeFSPath(path),
    updatedAt: Date.now(),
  };
}
