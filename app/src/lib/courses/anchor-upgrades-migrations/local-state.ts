export interface AnchorUpgradesMigrationsLocalState {
  version: 2;
  completedLessonIds: string[];
  lastReportJson: string | null;
  lastReleaseTag: string | null;
  updatedAt: string;
}

interface LegacyAnchorUpgradesMigrationsLocalState {
  version?: 1;
  completedLessonIds?: unknown;
  lastReportJson?: unknown;
  updatedAt?: unknown;
}

const STORAGE_PREFIX = "jazzcode:anchor-upgrades-migrations";
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

export function createDefaultAnchorUpgradesMigrationsLocalState(): AnchorUpgradesMigrationsLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastReportJson: null,
    lastReleaseTag: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateAnchorUpgradesMigrationsLocalState(
  value: unknown,
): AnchorUpgradesMigrationsLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultAnchorUpgradesMigrationsLocalState();
  }

  const record = value as LegacyAnchorUpgradesMigrationsLocalState & Record<string, unknown>;

  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastReportJson: typeof record.lastReportJson === "string" ? record.lastReportJson : null,
    lastReleaseTag: typeof record.lastReleaseTag === "string" ? record.lastReleaseTag : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadAnchorUpgradesMigrationsLocalState(
  scope: string,
): AnchorUpgradesMigrationsLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultAnchorUpgradesMigrationsLocalState();
    }
    return migrateAnchorUpgradesMigrationsLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultAnchorUpgradesMigrationsLocalState();
  }
}

export function saveAnchorUpgradesMigrationsLocalState(
  scope: string,
  state: AnchorUpgradesMigrationsLocalState,
): void {
  const normalized = migrateAnchorUpgradesMigrationsLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearAnchorUpgradesMigrationsLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
