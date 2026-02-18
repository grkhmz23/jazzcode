export interface WalletUxEngineeringLocalState {
  version: 1;
  completedLessonIds: string[];
  lastConnectionStateJson: string | null;
  lastSelectedNetwork: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:wallet-ux-engineering";
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

export function createDefaultWalletUxEngineeringLocalState(): WalletUxEngineeringLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastConnectionStateJson: null,
    lastSelectedNetwork: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadWalletUxEngineeringLocalState(scope: string): WalletUxEngineeringLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultWalletUxEngineeringLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultWalletUxEngineeringLocalState();
    }

    const r = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(r.completedLessonIds),
      lastConnectionStateJson: typeof r.lastConnectionStateJson === "string" ? r.lastConnectionStateJson : null,
      lastSelectedNetwork: typeof r.lastSelectedNetwork === "string" ? r.lastSelectedNetwork : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultWalletUxEngineeringLocalState();
  }
}

export function saveWalletUxEngineeringLocalState(
  scope: string,
  state: WalletUxEngineeringLocalState,
): void {
  const n: WalletUxEngineeringLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastConnectionStateJson: typeof state.lastConnectionStateJson === "string" ? state.lastConnectionStateJson : null,
    lastSelectedNetwork: typeof state.lastSelectedNetwork === "string" ? state.lastSelectedNetwork : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(n));
}

export function clearWalletUxEngineeringLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
