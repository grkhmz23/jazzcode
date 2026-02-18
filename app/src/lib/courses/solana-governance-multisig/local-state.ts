export interface SolanaGovernanceMultisigLocalState {
  version: 1;
  completedLessonIds: string[];
  lastProposalStateJson: string | null;
  lastExecutionTraceJson: string | null;
  updatedAt: string;
}

const STORAGE_PREFIX = "jazzcode:solana-governance-multisig";
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

export function createDefaultSolanaGovernanceMultisigLocalState(): SolanaGovernanceMultisigLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastProposalStateJson: null,
    lastExecutionTraceJson: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaGovernanceMultisigLocalState(scope: string): SolanaGovernanceMultisigLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaGovernanceMultisigLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaGovernanceMultisigLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastProposalStateJson:
        typeof record.lastProposalStateJson === "string" ? record.lastProposalStateJson : null,
      lastExecutionTraceJson:
        typeof record.lastExecutionTraceJson === "string" ? record.lastExecutionTraceJson : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaGovernanceMultisigLocalState();
  }
}

export function saveSolanaGovernanceMultisigLocalState(
  scope: string,
  state: SolanaGovernanceMultisigLocalState,
): void {
  const normalized: SolanaGovernanceMultisigLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastProposalStateJson:
      typeof state.lastProposalStateJson === "string" ? state.lastProposalStateJson : null,
    lastExecutionTraceJson:
      typeof state.lastExecutionTraceJson === "string" ? state.lastExecutionTraceJson : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaGovernanceMultisigLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
