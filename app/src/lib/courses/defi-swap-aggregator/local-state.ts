export interface DefiSwapAggregatorLocalState {
  version: 1;
  completedLessonIds: string[];
  lastSwapPlanJson: string | null;
  lastSwapReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-swap-aggregator";
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

export function createDefaultDefiSwapAggregatorLocalState(): DefiSwapAggregatorLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastSwapPlanJson: null,
    lastSwapReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiSwapAggregatorLocalState(scope: string): DefiSwapAggregatorLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultDefiSwapAggregatorLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultDefiSwapAggregatorLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastSwapPlanJson: typeof record.lastSwapPlanJson === "string" ? record.lastSwapPlanJson : null,
      lastSwapReportJson: typeof record.lastSwapReportJson === "string" ? record.lastSwapReportJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultDefiSwapAggregatorLocalState();
  }
}

export function saveDefiSwapAggregatorLocalState(
  scope: string,
  state: DefiSwapAggregatorLocalState,
): void {
  const normalized: DefiSwapAggregatorLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastSwapPlanJson: typeof state.lastSwapPlanJson === "string" ? state.lastSwapPlanJson : null,
    lastSwapReportJson: typeof state.lastSwapReportJson === "string" ? state.lastSwapReportJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearDefiSwapAggregatorLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
