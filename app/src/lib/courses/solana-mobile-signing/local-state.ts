export interface SolanaMobileSigningLocalState {
  version: 1;
  completedLessonIds: string[];
  lastSessionJson: string | null;
  lastRequestJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:solana-mobile-signing";
const VERSION = 1;

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const set = new Set<string>();
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim().length > 0) set.add(entry);
  }
  return [...set];
}

export function createDefaultSolanaMobileSigningLocalState(): SolanaMobileSigningLocalState {
  return { version: VERSION, completedLessonIds: [], lastSessionJson: null, lastRequestJson: null, updatedAt: new Date().toISOString() };
}

export function loadSolanaMobileSigningLocalState(scope: string): SolanaMobileSigningLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) return createDefaultSolanaMobileSigningLocalState();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return createDefaultSolanaMobileSigningLocalState();
    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastSessionJson: typeof record.lastSessionJson === "string" ? record.lastSessionJson : null,
      lastRequestJson: typeof record.lastRequestJson === "string" ? record.lastRequestJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch { return createDefaultSolanaMobileSigningLocalState(); }
}

export function saveSolanaMobileSigningLocalState(scope: string, state: SolanaMobileSigningLocalState): void {
  const normalized: SolanaMobileSigningLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastSessionJson: typeof state.lastSessionJson === "string" ? state.lastSessionJson : null,
    lastRequestJson: typeof state.lastRequestJson === "string" ? state.lastRequestJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaMobileSigningLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
