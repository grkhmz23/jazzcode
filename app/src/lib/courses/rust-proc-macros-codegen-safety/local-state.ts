export interface RustProcMacrosCodegenSafetyLocalState {
  version: 2;
  completedLessonIds: string[];
  lastGeneratedSafetyReport: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rust-proc-macros-codegen-safety";
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

export function createDefaultRustProcMacrosCodegenSafetyLocalState(): RustProcMacrosCodegenSafetyLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastGeneratedSafetyReport: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRustProcMacrosCodegenSafetyLocalState(
  value: unknown,
): RustProcMacrosCodegenSafetyLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRustProcMacrosCodegenSafetyLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastGeneratedSafetyReport:
      typeof record.lastGeneratedSafetyReport === "string" ? record.lastGeneratedSafetyReport : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRustProcMacrosCodegenSafetyLocalState(
  scope: string,
): RustProcMacrosCodegenSafetyLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRustProcMacrosCodegenSafetyLocalState();
    }
    return migrateRustProcMacrosCodegenSafetyLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRustProcMacrosCodegenSafetyLocalState();
  }
}

export function saveRustProcMacrosCodegenSafetyLocalState(
  scope: string,
  state: RustProcMacrosCodegenSafetyLocalState,
): void {
  localStorage.setItem(
    key(scope),
    JSON.stringify(migrateRustProcMacrosCodegenSafetyLocalState(state)),
  );
}

export function clearRustProcMacrosCodegenSafetyLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
