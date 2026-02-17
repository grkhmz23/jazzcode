export interface TokenEngineeringLocalState {
  version: 1;
  completedLessonIds: string[];
  lastCheckpointSummaryJson: string | null;
  updatedAt: string;
}

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = "jazzcode:token-engineering";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCompletedLessons(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && item.trim().length > 0) {
      unique.add(item);
    }
  }
  return [...unique];
}

export function createDefaultTokenEngineeringState(): TokenEngineeringLocalState {
  return {
    version: STORAGE_VERSION,
    completedLessonIds: [],
    lastCheckpointSummaryJson: null,
    updatedAt: new Date().toISOString(),
  };
}

function storageKey(userScope: string): string {
  return `${STORAGE_PREFIX}:${userScope}`;
}

function migrate(raw: unknown): TokenEngineeringLocalState {
  const fallback = createDefaultTokenEngineeringState();
  if (!isObject(raw)) {
    return fallback;
  }

  const lastCheckpointSummaryJson =
    typeof raw.lastCheckpointSummaryJson === "string" ? raw.lastCheckpointSummaryJson : null;

  return {
    version: STORAGE_VERSION,
    completedLessonIds: normalizeCompletedLessons(raw.completedLessonIds),
    lastCheckpointSummaryJson,
    updatedAt: new Date().toISOString(),
  };
}

export function loadTokenEngineeringState(userScope: string): TokenEngineeringLocalState {
  try {
    const serialized = localStorage.getItem(storageKey(userScope));
    if (!serialized) {
      return createDefaultTokenEngineeringState();
    }
    return migrate(JSON.parse(serialized) as unknown);
  } catch {
    return createDefaultTokenEngineeringState();
  }
}

export function saveTokenEngineeringState(
  userScope: string,
  state: TokenEngineeringLocalState,
): void {
  const normalized: TokenEngineeringLocalState = {
    version: STORAGE_VERSION,
    completedLessonIds: normalizeCompletedLessons(state.completedLessonIds),
    lastCheckpointSummaryJson:
      typeof state.lastCheckpointSummaryJson === "string" ? state.lastCheckpointSummaryJson : null,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storageKey(userScope), JSON.stringify(normalized));
}

export function clearTokenEngineeringState(userScope: string): void {
  localStorage.removeItem(storageKey(userScope));
}
