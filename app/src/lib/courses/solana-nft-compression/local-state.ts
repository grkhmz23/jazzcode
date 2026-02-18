export interface SolanaNftCompressionLocalState {
  version: 1;
  completedLessonIds: string[];
  lastAuditReportJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:solana-nft-compression";
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

export function createDefaultSolanaNftCompressionLocalState(): SolanaNftCompressionLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastAuditReportJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaNftCompressionLocalState(scope: string): SolanaNftCompressionLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaNftCompressionLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaNftCompressionLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastAuditReportJson:
        typeof record.lastAuditReportJson === "string" ? record.lastAuditReportJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaNftCompressionLocalState();
  }
}

export function saveSolanaNftCompressionLocalState(
  scope: string,
  state: SolanaNftCompressionLocalState,
): void {
  const normalized: SolanaNftCompressionLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastAuditReportJson:
      typeof state.lastAuditReportJson === "string" ? state.lastAuditReportJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaNftCompressionLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
