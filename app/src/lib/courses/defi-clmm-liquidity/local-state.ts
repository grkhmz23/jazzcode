export interface DefiClmmLiquidityLocalState {
  version: 1;
  completedLessonIds: string[];
  lastPositionReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:defi-clmm-liquidity";
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

export function createDefaultDefiClmmLiquidityLocalState(): DefiClmmLiquidityLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastPositionReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDefiClmmLiquidityLocalState(scope: string): DefiClmmLiquidityLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultDefiClmmLiquidityLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultDefiClmmLiquidityLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastPositionReportJson: typeof record.lastPositionReportJson === "string" ? record.lastPositionReportJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultDefiClmmLiquidityLocalState();
  }
}

export function saveDefiClmmLiquidityLocalState(
  scope: string,
  state: DefiClmmLiquidityLocalState,
): void {
  const normalized: DefiClmmLiquidityLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastPositionReportJson: typeof state.lastPositionReportJson === "string" ? state.lastPositionReportJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearDefiClmmLiquidityLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
