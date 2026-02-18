export interface MempoolUxDefenseLocalState {
  version: 2;
  completedLessonIds: string[];
  lastProtectionConfigJson: string | null;
  lastRiskGrade: "low" | "medium" | "high" | "critical" | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:mempool-ux-defense";
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

export function createDefaultMempoolUxDefenseLocalState(): MempoolUxDefenseLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastProtectionConfigJson: null,
    lastRiskGrade: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateMempoolUxDefenseLocalState(value: unknown): MempoolUxDefenseLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultMempoolUxDefenseLocalState();
  }

  const record = value as Record<string, unknown>;
  const grade = record.lastRiskGrade;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastProtectionConfigJson:
      typeof record.lastProtectionConfigJson === "string" ? record.lastProtectionConfigJson : null,
    lastRiskGrade:
      grade === "low" || grade === "medium" || grade === "high" || grade === "critical"
        ? grade
        : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadMempoolUxDefenseLocalState(scope: string): MempoolUxDefenseLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultMempoolUxDefenseLocalState();
    }
    return migrateMempoolUxDefenseLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultMempoolUxDefenseLocalState();
  }
}

export function saveMempoolUxDefenseLocalState(scope: string, state: MempoolUxDefenseLocalState): void {
  const normalized = migrateMempoolUxDefenseLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearMempoolUxDefenseLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
