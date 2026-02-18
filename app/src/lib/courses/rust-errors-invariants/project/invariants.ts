export enum InvariantErrorCode {
  NegativeValue = "NEGATIVE_VALUE",
  ExceedsLimit = "EXCEEDS_LIMIT",
  MissingAuthority = "MISSING_AUTHORITY",
  Mismatch = "MISMATCH",
}

export type InvariantContextValue = string | number | boolean;

export type InvariantContext = Record<string, InvariantContextValue>;

export class InvariantError extends Error {
  readonly code: InvariantErrorCode;
  readonly context: InvariantContext;
  readonly fatal: boolean;

  constructor(code: InvariantErrorCode, message: string, context: InvariantContext, fatal = false) {
    super(message);
    this.code = code;
    this.context = context;
    this.fatal = fatal;
  }
}

export type EnsureResult = { ok: true } | { ok: false; error: InvariantError };

export function ensure(
  condition: boolean,
  code: InvariantErrorCode,
  context: InvariantContext,
  message: string,
  fatal = false,
): EnsureResult {
  if (condition) {
    return { ok: true };
  }
  return {
    ok: false,
    error: new InvariantError(code, message, context, fatal),
  };
}

export function ensureNonNegative(value: number, label: string): EnsureResult {
  return ensure(value >= 0, InvariantErrorCode.NegativeValue, { label, value }, `${label} must be non-negative`);
}

export function ensureAtMost(value: number, limit: number, label: string): EnsureResult {
  return ensure(
    value <= limit,
    InvariantErrorCode.ExceedsLimit,
    { label, value, limit },
    `${label} must be <= ${limit}`,
  );
}

export function ensureEqual(left: string, right: string, label: string): EnsureResult {
  return ensure(left === right, InvariantErrorCode.Mismatch, { label, left, right }, `${label} mismatch`);
}

export interface EvidenceStep {
  id: string;
  atMs: number;
  action: string;
  status: "pass" | "fail";
  detail: string;
}

export interface EvidenceChain {
  steps: EvidenceStep[];
}

export class EvidenceChainBuilder {
  private readonly now: () => number;
  private readonly steps: EvidenceStep[] = [];

  constructor(now: () => number) {
    this.now = now;
  }

  addPass(id: string, action: string, detail: string): EvidenceChainBuilder {
    this.steps.push({ id, atMs: this.now(), action, status: "pass", detail });
    return this;
  }

  addFail(id: string, action: string, detail: string): EvidenceChainBuilder {
    this.steps.push({ id, atMs: this.now(), action, status: "fail", detail });
    return this;
  }

  build(): EvidenceChain {
    return {
      steps: [...this.steps].sort((a, b) => a.id.localeCompare(b.id) || a.atMs - b.atMs),
    };
  }
}

function stableOrder(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableOrder(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = stableOrder(record[key]);
        return acc;
      }, {});
  }
  return value;
}

export function formatReport(chain: EvidenceChain): string {
  const failCount = chain.steps.filter((step) => step.status === "fail").length;
  const lines = [
    "# Invariant Evidence Report",
    "",
    `- Total steps: ${chain.steps.length}`,
    `- Failures: ${failCount}`,
    `- Status: ${failCount === 0 ? "PASS" : "FAIL"}`,
  ];
  for (const step of chain.steps) {
    lines.push(`- [${step.status}] ${step.id} @${step.atMs}: ${step.action} -> ${step.detail}`);
  }
  return lines.join("\n");
}

export function invariantAuditReport(chain: EvidenceChain): { json: string; markdown: string } {
  const json = JSON.stringify(stableOrder(chain));
  return {
    json,
    markdown: formatReport(chain),
  };
}
