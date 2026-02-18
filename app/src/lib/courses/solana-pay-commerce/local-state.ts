export interface SolanaPayCommerceLocalState {
  version: 1;
  completedLessonIds: string[];
  lastEncodedUrl: string | null;
  lastReceiptJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:solana-pay-commerce";
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

export function createDefaultSolanaPayCommerceLocalState(): SolanaPayCommerceLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastEncodedUrl: null,
    lastReceiptJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaPayCommerceLocalState(scope: string): SolanaPayCommerceLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaPayCommerceLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaPayCommerceLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastEncodedUrl: typeof record.lastEncodedUrl === "string" ? record.lastEncodedUrl : null,
      lastReceiptJson: typeof record.lastReceiptJson === "string" ? record.lastReceiptJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaPayCommerceLocalState();
  }
}

export function saveSolanaPayCommerceLocalState(
  scope: string,
  state: SolanaPayCommerceLocalState,
): void {
  const normalized: SolanaPayCommerceLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastEncodedUrl: typeof state.lastEncodedUrl === "string" ? state.lastEncodedUrl : null,
    lastReceiptJson: typeof state.lastReceiptJson === "string" ? state.lastReceiptJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaPayCommerceLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
