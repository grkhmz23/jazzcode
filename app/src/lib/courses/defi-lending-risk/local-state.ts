export interface DefiLendingRiskLocalState {
  version: 1;
  completedLessonIds: string[];
  lastRiskReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-lending-risk";
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

export function createDefaultDefiLendingRiskLocalState(): DefiLendingRiskLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastRiskReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiLendingRiskLocalState(scope: string): DefiLendingRiskLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultDefiLendingRiskLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultDefiLendingRiskLocalState();
    }
    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastRiskReportJson: typeof record.lastRiskReportJson === "string" ? record.lastRiskReportJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultDefiLendingRiskLocalState();
  }
}

export function saveDefiLendingRiskLocalState(scope: string, state: DefiLendingRiskLocalState): void {
  const normalized: DefiLendingRiskLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastRiskReportJson: typeof state.lastRiskReportJson === "string" ? state.lastRiskReportJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearDefiLendingRiskLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
