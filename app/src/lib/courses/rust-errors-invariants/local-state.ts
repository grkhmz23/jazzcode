export interface RustErrorsInvariantsLocalState {
  version: 2;
  completedLessonIds: string[];
  lastInvariantReportMarkdown: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rust-errors-invariants";
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

export function createDefaultRustErrorsInvariantsLocalState(): RustErrorsInvariantsLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastInvariantReportMarkdown: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRustErrorsInvariantsLocalState(value: unknown): RustErrorsInvariantsLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRustErrorsInvariantsLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastInvariantReportMarkdown:
      typeof record.lastInvariantReportMarkdown === "string"
        ? record.lastInvariantReportMarkdown
        : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRustErrorsInvariantsLocalState(scope: string): RustErrorsInvariantsLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRustErrorsInvariantsLocalState();
    }
    return migrateRustErrorsInvariantsLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRustErrorsInvariantsLocalState();
  }
}

export function saveRustErrorsInvariantsLocalState(
  scope: string,
  state: RustErrorsInvariantsLocalState,
): void {
  localStorage.setItem(key(scope), JSON.stringify(migrateRustErrorsInvariantsLocalState(state)));
}

export function clearRustErrorsInvariantsLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
