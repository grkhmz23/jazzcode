export interface RustAsyncIndexerPipelineLocalState {
  version: 2;
  completedLessonIds: string[];
  lastPipelineReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rust-async-indexer-pipeline";
const VERSION = 2;

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0))];
}

export function createDefaultRustAsyncIndexerPipelineLocalState(): RustAsyncIndexerPipelineLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastPipelineReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRustAsyncIndexerPipelineLocalState(
  value: unknown,
): RustAsyncIndexerPipelineLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRustAsyncIndexerPipelineLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastPipelineReportJson:
      typeof record.lastPipelineReportJson === "string" ? record.lastPipelineReportJson : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRustAsyncIndexerPipelineLocalState(
  scope: string,
): RustAsyncIndexerPipelineLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRustAsyncIndexerPipelineLocalState();
    }
    return migrateRustAsyncIndexerPipelineLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRustAsyncIndexerPipelineLocalState();
  }
}

export function saveRustAsyncIndexerPipelineLocalState(
  scope: string,
  state: RustAsyncIndexerPipelineLocalState,
): void {
  localStorage.setItem(key(scope), JSON.stringify(migrateRustAsyncIndexerPipelineLocalState(state)));
}

export function clearRustAsyncIndexerPipelineLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
