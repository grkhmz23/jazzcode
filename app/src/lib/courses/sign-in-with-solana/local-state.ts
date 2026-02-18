export interface SignInWithSolanaLocalState {
  version: 1;
  completedLessonIds: string[];
  lastNonceRegistryJson: string | null;
  lastVerifiedSignInJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:sign-in-with-solana";
const VERSION = 1;

function key(scope: string): string { return `${STORAGE_PREFIX}:${scope}`; }

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const set = new Set<string>();
  for (const entry of value) { if (typeof entry === "string" && entry.trim().length > 0) set.add(entry); }
  return [...set];
}

export function createDefaultSignInWithSolanaLocalState(): SignInWithSolanaLocalState {
  return { version: VERSION, completedLessonIds: [], lastNonceRegistryJson: null, lastVerifiedSignInJson: null, updatedAt: new Date().toISOString() };
}

export function loadSignInWithSolanaLocalState(scope: string): SignInWithSolanaLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) return createDefaultSignInWithSolanaLocalState();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return createDefaultSignInWithSolanaLocalState();
    const r = parsed as Record<string, unknown>;
    return { version: VERSION, completedLessonIds: normalizeLessonIds(r.completedLessonIds), lastNonceRegistryJson: typeof r.lastNonceRegistryJson === "string" ? r.lastNonceRegistryJson : null, lastVerifiedSignInJson: typeof r.lastVerifiedSignInJson === "string" ? r.lastVerifiedSignInJson : null, updatedAt: new Date().toISOString() };
  } catch { return createDefaultSignInWithSolanaLocalState(); }
}

export function saveSignInWithSolanaLocalState(scope: string, state: SignInWithSolanaLocalState): void {
  const n: SignInWithSolanaLocalState = { version: VERSION, completedLessonIds: normalizeLessonIds(state.completedLessonIds), lastNonceRegistryJson: typeof state.lastNonceRegistryJson === "string" ? state.lastNonceRegistryJson : null, lastVerifiedSignInJson: typeof state.lastVerifiedSignInJson === "string" ? state.lastVerifiedSignInJson : null, updatedAt: new Date().toISOString() };
  localStorage.setItem(key(scope), JSON.stringify(n));
}

export function clearSignInWithSolanaLocalState(scope: string): void { localStorage.removeItem(key(scope)); }
