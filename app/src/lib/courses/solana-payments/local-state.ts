export interface SolanaPaymentsLocalState {
  version: 1;
  completedLessonIds: string[];
  paymentIntents: PaymentIntent[];
  pendingTransactions: PendingTransaction[];
  webhookReceipts: WebhookReceipt[];
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  recipient: string;
  amount: string;
  currency: string;
  idempotencyKey: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export interface PendingTransaction {
  id: string;
  intentId: string;
  transactionSignature?: string;
  status: "pending" | "confirmed" | "finalized" | "failed";
  createdAt: string;
}

export interface WebhookReceipt {
  id: string;
  paymentId: string;
  signature: string;
  verified: boolean;
  amount: string;
  currency: string;
  timestamp: string;
}

const STORAGE_PREFIX = "jazzcode:solana-payments";
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

export function normalizePaymentIntent(entry: unknown): PaymentIntent | null {
  if (
    entry &&
    typeof entry === "object" &&
    typeof (entry as Record<string, unknown>).id === "string" &&
    typeof (entry as Record<string, unknown>).recipient === "string" &&
    typeof (entry as Record<string, unknown>).amount === "string" &&
    typeof (entry as Record<string, unknown>).idempotencyKey === "string"
  ) {
    const e = entry as Record<string, unknown>;
    return {
      id: e.id as string,
      recipient: e.recipient as string,
      amount: e.amount as string,
      currency: typeof e.currency === "string" ? e.currency : "SOL",
      idempotencyKey: e.idempotencyKey as string,
      status: ["pending", "processing", "completed", "failed"].includes(e.status as string)
        ? (e.status as PaymentIntent["status"])
        : "pending",
      createdAt: typeof e.createdAt === "string" ? e.createdAt : new Date().toISOString(),
    };
  }
  return null;
}

function normalizePaymentIntents(value: unknown): PaymentIntent[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const intents: PaymentIntent[] = [];
  for (const entry of value) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof entry.id === "string" &&
      typeof entry.recipient === "string" &&
      typeof entry.amount === "string" &&
      typeof entry.idempotencyKey === "string"
    ) {
      intents.push({
        id: entry.id,
        recipient: entry.recipient,
        amount: entry.amount,
        currency: typeof entry.currency === "string" ? entry.currency : "SOL",
        idempotencyKey: entry.idempotencyKey,
        status: ["pending", "processing", "completed", "failed"].includes(entry.status)
          ? entry.status
          : "pending",
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      });
    }
  }
  return intents;
}

function normalizePendingTransactions(value: unknown): PendingTransaction[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const txs: PendingTransaction[] = [];
  for (const entry of value) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof entry.id === "string" &&
      typeof entry.intentId === "string"
    ) {
      txs.push({
        id: entry.id,
        intentId: entry.intentId,
        transactionSignature:
          typeof entry.transactionSignature === "string" ? entry.transactionSignature : undefined,
        status: ["pending", "confirmed", "finalized", "failed"].includes(entry.status)
          ? entry.status
          : "pending",
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      });
    }
  }
  return txs;
}

function normalizeWebhookReceipts(value: unknown): WebhookReceipt[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const receipts: WebhookReceipt[] = [];
  for (const entry of value) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof entry.id === "string" &&
      typeof entry.paymentId === "string"
    ) {
      receipts.push({
        id: entry.id,
        paymentId: entry.paymentId,
        signature: typeof entry.signature === "string" ? entry.signature : "",
        verified: typeof entry.verified === "boolean" ? entry.verified : false,
        amount: typeof entry.amount === "string" ? entry.amount : "0",
        currency: typeof entry.currency === "string" ? entry.currency : "SOL",
        timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
      });
    }
  }
  return receipts;
}

export function createDefaultSolanaPaymentsLocalState(): SolanaPaymentsLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    paymentIntents: [],
    pendingTransactions: [],
    webhookReceipts: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaPaymentsLocalState(scope: string): SolanaPaymentsLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaPaymentsLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaPaymentsLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      paymentIntents: normalizePaymentIntents(record.paymentIntents),
      pendingTransactions: normalizePendingTransactions(record.pendingTransactions),
      webhookReceipts: normalizeWebhookReceipts(record.webhookReceipts),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaPaymentsLocalState();
  }
}

export function saveSolanaPaymentsLocalState(
  scope: string,
  state: SolanaPaymentsLocalState,
): void {
  const normalized: SolanaPaymentsLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    paymentIntents: normalizePaymentIntents(state.paymentIntents),
    pendingTransactions: normalizePendingTransactions(state.pendingTransactions),
    webhookReceipts: normalizeWebhookReceipts(state.webhookReceipts),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaPaymentsLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}
