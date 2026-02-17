export interface DefiSolanaLocalState {
  version: 1;
  completedLessonIds: string[];
  lastSwapPlanJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-solana";
const VERSION = 1;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeLessons(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const result = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && item.trim().length > 0) {
      result.add(item);
    }
  }
  return [...result];
}

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

export function defaultDefiSolanaLocalState(): DefiSolanaLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastSwapPlanJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiSolanaLocalState(scope: string): DefiSolanaLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return defaultDefiSolanaLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) {
      return defaultDefiSolanaLocalState();
    }
    return {
      version: VERSION,
      completedLessonIds: normalizeLessons(parsed.completedLessonIds),
      lastSwapPlanJson: typeof parsed.lastSwapPlanJson === "string" ? parsed.lastSwapPlanJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return defaultDefiSolanaLocalState();
  }
}

export function saveDefiSolanaLocalState(scope: string, state: DefiSolanaLocalState): void {
  const normalized: DefiSolanaLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessons(state.completedLessonIds),
    lastSwapPlanJson: typeof state.lastSwapPlanJson === "string" ? state.lastSwapPlanJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}
