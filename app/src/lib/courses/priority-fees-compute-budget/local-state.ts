export interface PriorityFeesComputeBudgetLocalState {
  version: 2;
  completedLessonIds: string[];
  lastFeePlanJson: string | null;
  lastPolicyName: string | null;
  updatedAt: string;
}

interface LegacyPriorityFeesState {
  version?: 1;
  completedLessonIds?: unknown;
  lastFeePlanJson?: unknown;
  updatedAt?: unknown;
}

const STORAGE_PREFIX = "jazzcode:priority-fees-compute-budget";
const VERSION = 2;

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const ids = new Set<string>();
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim().length > 0) {
      ids.add(entry);
    }
  }
  return [...ids];
}

export function createDefaultPriorityFeesComputeBudgetLocalState(): PriorityFeesComputeBudgetLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastFeePlanJson: null,
    lastPolicyName: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migratePriorityFeesComputeBudgetLocalState(
  value: unknown,
): PriorityFeesComputeBudgetLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultPriorityFeesComputeBudgetLocalState();
  }

  const record = value as LegacyPriorityFeesState & Record<string, unknown>;

  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastFeePlanJson: typeof record.lastFeePlanJson === "string" ? record.lastFeePlanJson : null,
    lastPolicyName: typeof record.lastPolicyName === "string" ? record.lastPolicyName : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadPriorityFeesComputeBudgetLocalState(
  scope: string,
): PriorityFeesComputeBudgetLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultPriorityFeesComputeBudgetLocalState();
    }
    return migratePriorityFeesComputeBudgetLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultPriorityFeesComputeBudgetLocalState();
  }
}

export function savePriorityFeesComputeBudgetLocalState(
  scope: string,
  state: PriorityFeesComputeBudgetLocalState,
): void {
  const normalized = migratePriorityFeesComputeBudgetLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearPriorityFeesComputeBudgetLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
