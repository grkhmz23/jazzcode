export type EventKind = "deposit" | "withdraw";

export interface IndexedEvent {
  slot: number;
  txSignature: string;
  instructionIndex: number;
  account: string;
  kind: EventKind;
  amount: number;
}

export interface ConfirmationRules {
  headSlot: number;
  minConfirmedDepth: number;
  minFinalizedDepth: number;
}

export interface PipelineSnapshot {
  balances: Record<string, number>;
  appliedEventKeys: string[];
  pendingEventKeys: string[];
  finalizedEventKeys: string[];
  headSlot: number;
}

export interface IntegrityResult {
  ok: boolean;
  issues: string[];
}

function keyOf(event: IndexedEvent): string {
  return `${event.slot}:${event.txSignature}:${event.instructionIndex}:${event.kind}:${event.account}`;
}

export function dedupeEvents(events: IndexedEvent[]): IndexedEvent[] {
  const map = new Map<string, IndexedEvent>();

  for (const event of events) {
    if (event.slot < 0 || event.instructionIndex < 0 || event.amount < 0) {
      throw new Error("event has invalid numeric fields");
    }
    map.set(keyOf(event), event);
  }

  return [...map.values()].sort((a, b) => {
    const keyA = keyOf(a);
    const keyB = keyOf(b);
    return keyA.localeCompare(keyB);
  });
}

export function applyWithConfirmations(
  events: IndexedEvent[],
  confirmationRules: ConfirmationRules,
): PipelineSnapshot {
  if (confirmationRules.minFinalizedDepth < confirmationRules.minConfirmedDepth) {
    throw new Error("minFinalizedDepth must be >= minConfirmedDepth");
  }

  const deduped = dedupeEvents(events);
  const balances: Record<string, number> = {};
  const appliedEventKeys: string[] = [];
  const pendingEventKeys: string[] = [];
  const finalizedEventKeys: string[] = [];

  for (const event of deduped) {
    const depth = confirmationRules.headSlot - event.slot;
    const key = keyOf(event);

    if (depth < confirmationRules.minConfirmedDepth) {
      pendingEventKeys.push(key);
      continue;
    }

    const previous = balances[event.account] ?? 0;
    const next = event.kind === "deposit" ? previous + event.amount : previous - event.amount;
    balances[event.account] = next;
    appliedEventKeys.push(key);

    if (depth >= confirmationRules.minFinalizedDepth) {
      finalizedEventKeys.push(key);
    }
  }

  const sortedBalances = Object.keys(balances)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, number>>((acc, account) => {
      acc[account] = balances[account];
      return acc;
    }, {});

  return {
    balances: sortedBalances,
    appliedEventKeys,
    pendingEventKeys,
    finalizedEventKeys,
    headSlot: confirmationRules.headSlot,
  };
}

export function snapshotIntegrityCheck(snapshot: PipelineSnapshot): IntegrityResult {
  const issues: string[] = [];

  for (const [account, balance] of Object.entries(snapshot.balances)) {
    if (!Number.isFinite(balance)) {
      issues.push(`non-finite balance for ${account}`);
    }
    if (balance < 0) {
      issues.push(`negative balance for ${account}`);
    }
  }

  const appliedSet = new Set(snapshot.appliedEventKeys);
  for (const finalized of snapshot.finalizedEventKeys) {
    if (!appliedSet.has(finalized)) {
      issues.push(`finalized event ${finalized} missing from applied set`);
    }
  }

  return { ok: issues.length === 0, issues };
}

export function pipelineReport(snapshot: PipelineSnapshot): string {
  const integrity = snapshotIntegrityCheck(snapshot);
  const lines = [
    "# Reorg-Safe Pipeline Report",
    "",
    `- Head slot: ${snapshot.headSlot}`,
    `- Applied events: ${snapshot.appliedEventKeys.length}`,
    `- Pending events: ${snapshot.pendingEventKeys.length}`,
    `- Finalized events: ${snapshot.finalizedEventKeys.length}`,
    `- Integrity: ${integrity.ok ? "PASS" : "FAIL"}`,
  ];

  for (const [account, balance] of Object.entries(snapshot.balances)) {
    lines.push(`- Balance ${account}: ${balance}`);
  }

  if (!integrity.ok) {
    for (const issue of integrity.issues) {
      lines.push(`- Issue: ${issue}`);
    }
  }

  return lines.join("\n");
}
