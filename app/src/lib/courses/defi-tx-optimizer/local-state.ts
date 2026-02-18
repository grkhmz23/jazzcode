export interface DefiTxOptimizerLocalState {
  version: 1;
  completedLessonIds: string[];
  lastSendStrategyJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-tx-optimizer";
const VERSION = 1;

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const set = new Set<string>();
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim().length > 0) {
      set.add(entry);
    }
  }
  return [...set];
}

export function createDefaultDefiTxOptimizerLocalState(): DefiTxOptimizerLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastSendStrategyJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiTxOptimizerLocalState(scope: string): DefiTxOptimizerLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultDefiTxOptimizerLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultDefiTxOptimizerLocalState();
    }
    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastSendStrategyJson: typeof record.lastSendStrategyJson === "string" ? record.lastSendStrategyJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultDefiTxOptimizerLocalState();
  }
}

export function saveDefiTxOptimizerLocalState(scope: string, state: DefiTxOptimizerLocalState): void {
  const normalized: DefiTxOptimizerLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastSendStrategyJson: typeof state.lastSendStrategyJson === "string" ? state.lastSendStrategyJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearDefiTxOptimizerLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
