export interface BundlesAtomicityLocalState {
  version: 2;
  completedLessonIds: string[];
  lastFlowReportMarkdown: string | null;
  lastBundleJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:bundles-atomicity";
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

export function createDefaultBundlesAtomicityLocalState(): BundlesAtomicityLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastFlowReportMarkdown: null,
    lastBundleJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateBundlesAtomicityLocalState(value: unknown): BundlesAtomicityLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultBundlesAtomicityLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastFlowReportMarkdown:
      typeof record.lastFlowReportMarkdown === "string" ? record.lastFlowReportMarkdown : null,
    lastBundleJson: typeof record.lastBundleJson === "string" ? record.lastBundleJson : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadBundlesAtomicityLocalState(scope: string): BundlesAtomicityLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultBundlesAtomicityLocalState();
    }
    return migrateBundlesAtomicityLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultBundlesAtomicityLocalState();
  }
}

export function saveBundlesAtomicityLocalState(scope: string, state: BundlesAtomicityLocalState): void {
  const normalized = migrateBundlesAtomicityLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearBundlesAtomicityLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
