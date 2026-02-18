export interface SolanaIndexingLocalState {
  version: 1;
  completedLessonIds: string[];
  indexedEvents: Array<{
    signature: string;
    timestamp: number;
    type: string;
  }>;
  lastCheckpoint: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:solana-indexing";
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

export function createDefaultSolanaIndexingLocalState(): SolanaIndexingLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    indexedEvents: [],
    lastCheckpoint: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaIndexingLocalState(scope: string): SolanaIndexingLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaIndexingLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaIndexingLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      indexedEvents: Array.isArray(record.indexedEvents) ? record.indexedEvents : [],
      lastCheckpoint: typeof record.lastCheckpoint === "string" ? record.lastCheckpoint : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaIndexingLocalState();
  }
}

export function saveSolanaIndexingLocalState(
  scope: string,
  state: SolanaIndexingLocalState
): void {
  const normalized: SolanaIndexingLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    indexedEvents: state.indexedEvents.slice(0, 1000),
    lastCheckpoint: typeof state.lastCheckpoint === "string" ? state.lastCheckpoint : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaIndexingLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
