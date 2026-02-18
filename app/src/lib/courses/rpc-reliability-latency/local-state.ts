export interface RpcReliabilityLatencyLocalState {
  version: 2;
  completedLessonIds: string[];
  lastRpcHealthJson: string | null;
  preferredEndpointId: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:rpc-reliability-latency";
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

export function createDefaultRpcReliabilityLatencyLocalState(): RpcReliabilityLatencyLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastRpcHealthJson: null,
    preferredEndpointId: null,
    updatedAt: new Date().toISOString(),
  };
}

export function migrateRpcReliabilityLatencyLocalState(value: unknown): RpcReliabilityLatencyLocalState {
  if (!value || typeof value !== "object") {
    return createDefaultRpcReliabilityLatencyLocalState();
  }

  const record = value as Record<string, unknown>;
  return {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(record.completedLessonIds),
    lastRpcHealthJson: typeof record.lastRpcHealthJson === "string" ? record.lastRpcHealthJson : null,
    preferredEndpointId:
      typeof record.preferredEndpointId === "string" ? record.preferredEndpointId : null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadRpcReliabilityLatencyLocalState(scope: string): RpcReliabilityLatencyLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultRpcReliabilityLatencyLocalState();
    }
    return migrateRpcReliabilityLatencyLocalState(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultRpcReliabilityLatencyLocalState();
  }
}

export function saveRpcReliabilityLatencyLocalState(
  scope: string,
  state: RpcReliabilityLatencyLocalState,
): void {
  const normalized = migrateRpcReliabilityLatencyLocalState(state);
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearRpcReliabilityLatencyLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
