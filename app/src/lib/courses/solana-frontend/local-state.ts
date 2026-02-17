export interface SolanaFrontendLocalState {
  version: 1;
  completedLessonIds: string[];
  lastSummaryJson: string | null;
  updatedAt: string;
}

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = "jazzcode:solana-frontend";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && item.trim().length > 0) {
      unique.add(item);
    }
  }
  return [...unique];
}

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

export function createDefaultSolanaFrontendState(): SolanaFrontendLocalState {
  return {
    version: STORAGE_VERSION,
    completedLessonIds: [],
    lastSummaryJson: null,
    updatedAt: new Date().toISOString(),
  };
}

function migrate(raw: unknown): SolanaFrontendLocalState {
  const fallback = createDefaultSolanaFrontendState();
  if (!isObject(raw)) {
    return fallback;
  }

  return {
    version: STORAGE_VERSION,
    completedLessonIds: normalizeLessonIds(raw.completedLessonIds),
    lastSummaryJson: typeof raw.lastSummaryJson === "string" ? raw.lastSummaryJson : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaFrontendState(scope: string): SolanaFrontendLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaFrontendState();
    }
    return migrate(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultSolanaFrontendState();
  }
}

export function saveSolanaFrontendState(scope: string, state: SolanaFrontendLocalState): void {
  const normalized: SolanaFrontendLocalState = {
    version: STORAGE_VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastSummaryJson: typeof state.lastSummaryJson === "string" ? state.lastSummaryJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaFrontendState(scope: string): void {
  localStorage.removeItem(key(scope));
}
