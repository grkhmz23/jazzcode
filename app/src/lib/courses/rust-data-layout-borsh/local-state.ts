export interface RustDataLayoutBorshLocalState {
  version: 2;
  completedLessonIds: string[];
  lastLayoutReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rust-data-layout-borsh";
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

export function createDefaultRustDataLayoutBorshLocalState(): RustDataLayoutBorshLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastLayoutReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRustDataLayoutBorshLocalState(value: unknown): RustDataLayoutBorshLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRustDataLayoutBorshLocalState();
  }
  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastLayoutReportJson:
      typeof record.lastLayoutReportJson === "string" ? record.lastLayoutReportJson : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRustDataLayoutBorshLocalState(scope: string): RustDataLayoutBorshLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRustDataLayoutBorshLocalState();
    }
    return migrateRustDataLayoutBorshLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRustDataLayoutBorshLocalState();
  }
}

export function saveRustDataLayoutBorshLocalState(
  scope: string,
  state: RustDataLayoutBorshLocalState,
): void {
  localStorage.setItem(key(scope), JSON.stringify(migrateRustDataLayoutBorshLocalState(state)));
}

export function clearRustDataLayoutBorshLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
