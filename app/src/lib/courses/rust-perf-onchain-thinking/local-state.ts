export interface RustPerfOnchainThinkingLocalState {
  version: 2;
  completedLessonIds: string[];
  lastPerfReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rust-perf-onchain-thinking";
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

export function createDefaultRustPerfOnchainThinkingLocalState(): RustPerfOnchainThinkingLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastPerfReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRustPerfOnchainThinkingLocalState(
  value: unknown,
): RustPerfOnchainThinkingLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRustPerfOnchainThinkingLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastPerfReportJson: typeof record.lastPerfReportJson === "string" ? record.lastPerfReportJson : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRustPerfOnchainThinkingLocalState(scope: string): RustPerfOnchainThinkingLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRustPerfOnchainThinkingLocalState();
    }
    return migrateRustPerfOnchainThinkingLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRustPerfOnchainThinkingLocalState();
  }
}

export function saveRustPerfOnchainThinkingLocalState(
  scope: string,
  state: RustPerfOnchainThinkingLocalState,
): void {
  localStorage.setItem(key(scope), JSON.stringify(migrateRustPerfOnchainThinkingLocalState(state)));
}

export function clearRustPerfOnchainThinkingLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
