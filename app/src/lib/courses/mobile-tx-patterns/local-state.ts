export interface TxHistoryEntry {
  id: string;
  type: string;
  status: string;
  lamports: number;
  sender: string;
  recipient: string;
  timestamp: number;
  retryCount: number;
}

export interface SimulationResult {
  success: boolean;
  unitsConsumed: number;
  logs: string[];
  error?: string;
}

export interface MobileTxPatternsLocalState {
  version: 1;
  completedLessonIds: string[];
  txHistory: TxHistoryEntry[];
  lastSimulationResult: SimulationResult | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:mobile-tx-patterns";
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

export function createDefaultMobileTxPatternsLocalState(): MobileTxPatternsLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    txHistory: [],
    lastSimulationResult: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadMobileTxPatternsLocalState(scope: string): MobileTxPatternsLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultMobileTxPatternsLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultMobileTxPatternsLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      txHistory: Array.isArray(record.txHistory) ? record.txHistory : [],
      lastSimulationResult:
        record.lastSimulationResult &&
        typeof record.lastSimulationResult === "object"
          ? (record.lastSimulationResult as SimulationResult)
          : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultMobileTxPatternsLocalState();
  }
}

export function saveMobileTxPatternsLocalState(
  scope: string,
  state: MobileTxPatternsLocalState
): void {
  const normalized: MobileTxPatternsLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    txHistory: state.txHistory.slice(0, 1000),
    lastSimulationResult:
      state.lastSimulationResult &&
      typeof state.lastSimulationResult === "object"
        ? state.lastSimulationResult
        : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearMobileTxPatternsLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
