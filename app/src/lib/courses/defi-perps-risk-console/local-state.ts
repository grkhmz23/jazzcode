export interface DefiPerpsRiskConsoleLocalState {
  version: 1;
  completedLessonIds: string[];
  lastRiskConsoleReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-perps-risk-console";
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

export function createDefaultDefiPerpsRiskConsoleLocalState(): DefiPerpsRiskConsoleLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastRiskConsoleReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiPerpsRiskConsoleLocalState(scope: string): DefiPerpsRiskConsoleLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultDefiPerpsRiskConsoleLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultDefiPerpsRiskConsoleLocalState();
    }
    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastRiskConsoleReportJson: typeof record.lastRiskConsoleReportJson === "string" ? record.lastRiskConsoleReportJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultDefiPerpsRiskConsoleLocalState();
  }
}

export function saveDefiPerpsRiskConsoleLocalState(scope: string, state: DefiPerpsRiskConsoleLocalState): void {
  const normalized: DefiPerpsRiskConsoleLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastRiskConsoleReportJson: typeof state.lastRiskConsoleReportJson === "string" ? state.lastRiskConsoleReportJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearDefiPerpsRiskConsoleLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
