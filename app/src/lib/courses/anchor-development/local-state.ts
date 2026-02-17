export interface AnchorProjectSnapshot {
  authority: string;
  pda: string;
  finalCount: number;
}

export interface AnchorDevelopmentLocalState {
  version: 1;
  completedLessonIds: string[];
  lastCheckpoint: AnchorProjectSnapshot | null;
  updatedAt: string;
}

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = "jazzcode:anchor-development";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCompletedLessons(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set<string>();
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim().length > 0) {
      unique.add(entry);
    }
  }
  return Array.from(unique);
}

function normalizeCheckpoint(value: unknown): AnchorProjectSnapshot | null {
  if (!isObject(value)) {
    return null;
  }
  if (
    typeof value.authority !== "string" ||
    typeof value.pda !== "string" ||
    typeof value.finalCount !== "number" ||
    !Number.isFinite(value.finalCount)
  ) {
    return null;
  }

  return {
    authority: value.authority,
    pda: value.pda,
    finalCount: value.finalCount,
  };
}

export function createDefaultAnchorDevelopmentState(): AnchorDevelopmentLocalState {
  return {
    version: STORAGE_VERSION,
    completedLessonIds: [],
    lastCheckpoint: null,
    updatedAt: new Date().toISOString(),
  };
}

function storageKey(userScope: string): string {
  return `${STORAGE_PREFIX}:${userScope}`;
}

export function loadAnchorDevelopmentState(userScope: string): AnchorDevelopmentLocalState {
  try {
    const raw = localStorage.getItem(storageKey(userScope));
    if (!raw) {
      return createDefaultAnchorDevelopmentState();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) {
      return createDefaultAnchorDevelopmentState();
    }

    return {
      version: STORAGE_VERSION,
      completedLessonIds: normalizeCompletedLessons(
        parsed.completedLessonIds ?? parsed.completedLessons,
      ),
      lastCheckpoint: normalizeCheckpoint(parsed.lastCheckpoint),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultAnchorDevelopmentState();
  }
}

export function saveAnchorDevelopmentState(
  userScope: string,
  state: AnchorDevelopmentLocalState,
): void {
  const normalized: AnchorDevelopmentLocalState = {
    version: STORAGE_VERSION,
    completedLessonIds: normalizeCompletedLessons(state.completedLessonIds),
    lastCheckpoint: normalizeCheckpoint(state.lastCheckpoint),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storageKey(userScope), JSON.stringify(normalized));
}

export function clearAnchorDevelopmentState(userScope: string): void {
  localStorage.removeItem(storageKey(userScope));
}
