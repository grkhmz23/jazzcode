export interface IndexingWebhooksPipelinesLocalState {
  version: 2;
  completedLessonIds: string[];
  lastSnapshotJson: string | null;
  lastPipelineReportMarkdown: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:indexing-webhooks-pipelines";
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

export function createDefaultIndexingWebhooksPipelinesLocalState(): IndexingWebhooksPipelinesLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastSnapshotJson: null,
    lastPipelineReportMarkdown: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateIndexingWebhooksPipelinesLocalState(
  value: unknown,
): IndexingWebhooksPipelinesLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultIndexingWebhooksPipelinesLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastSnapshotJson: typeof record.lastSnapshotJson === "string" ? record.lastSnapshotJson : null,
    lastPipelineReportMarkdown:
      typeof record.lastPipelineReportMarkdown === "string" ? record.lastPipelineReportMarkdown : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadIndexingWebhooksPipelinesLocalState(
  scope: string,
): IndexingWebhooksPipelinesLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultIndexingWebhooksPipelinesLocalState();
    }
    return migrateIndexingWebhooksPipelinesLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultIndexingWebhooksPipelinesLocalState();
  }
}

export function saveIndexingWebhooksPipelinesLocalState(
  scope: string,
  state: IndexingWebhooksPipelinesLocalState,
): void {
  const normalized = migrateIndexingWebhooksPipelinesLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearIndexingWebhooksPipelinesLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
