export interface AtomicStep {
  id: string;
  kind: "approval" | "ata-create" | "swap" | "refund" | "cleanup";
  dependsOn: string[];
  idempotent: boolean;
}

export interface AtomicFlow {
  steps: AtomicStep[];
  edges: Array<{ from: string; to: string }>;
}

export interface AtomicityIssue {
  code: "partial-execution-risk" | "missing-refund" | "non-idempotent" | "broken-dependency";
  stepId: string;
  detail: string;
}

export interface BundlePlan {
  bundleId: string;
  transactions: Array<{ index: number; stepIds: string[] }>;
  invariants: string[];
}

function stableCopy<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => stableCopy(entry)) as T;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    const keys = Object.keys(record).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
      out[key] = stableCopy(record[key]);
    }
    return out as T;
  }
  return value;
}

export function buildAtomicFlow(steps: AtomicStep[]): AtomicFlow {
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error("steps must be a non-empty array");
  }

  const seen = new Set<string>();
  const normalized = [...steps]
    .map((step) => {
      if (!step.id || step.id.trim().length === 0) {
        throw new Error("step id is required");
      }
      if (seen.has(step.id)) {
        throw new Error(`duplicate step id: ${step.id}`);
      }
      seen.add(step.id);
      return {
        ...step,
        dependsOn: [...step.dependsOn].sort((a, b) => a.localeCompare(b)),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const edges: Array<{ from: string; to: string }> = [];
  for (const step of normalized) {
    for (const dep of step.dependsOn) {
      edges.push({ from: dep, to: step.id });
    }
  }

  return {
    steps: stableCopy(normalized),
    edges: edges.sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`)),
  };
}

export function validateAtomicity(flow: AtomicFlow): AtomicityIssue[] {
  const issues: AtomicityIssue[] = [];
  const stepMap = new Map(flow.steps.map((step) => [step.id, step]));

  for (const step of flow.steps) {
    for (const dep of step.dependsOn) {
      if (!stepMap.has(dep)) {
        issues.push({
          code: "broken-dependency",
          stepId: step.id,
          detail: `depends on missing step ${dep}`,
        });
      }
    }

    if (!step.idempotent) {
      issues.push({
        code: "non-idempotent",
        stepId: step.id,
        detail: "step is not idempotent; retries can duplicate side effects",
      });
    }

    if (step.kind === "swap") {
      const hasRefund = flow.steps.some((candidate) => candidate.kind === "refund");
      if (!hasRefund) {
        issues.push({
          code: "missing-refund",
          stepId: step.id,
          detail: "swap flow has no deterministic refund step",
        });
      }
    }

    if (step.kind !== "refund" && step.kind !== "cleanup" && !step.idempotent) {
      issues.push({
        code: "partial-execution-risk",
        stepId: step.id,
        detail: "partial execution could leave user funds or approvals in unsafe state",
      });
    }
  }

  return issues.sort((a, b) => `${a.code}:${a.stepId}`.localeCompare(`${b.code}:${b.stepId}`));
}

export function composeBundle(flow: AtomicFlow): BundlePlan {
  const transactions = flow.steps.map((step, index) => ({ index, stepIds: [step.id] }));
  return {
    bundleId: `bundle-${flow.steps.length}-steps`,
    transactions,
    invariants: [
      "all transactions are intended for one logical user action",
      "bundle execution must preserve all-or-nothing user expectations",
      "refund branch must be available if swap leg fails",
    ],
  };
}

export function flowSafetyReport(flow: AtomicFlow): string {
  const issues = validateAtomicity(flow);
  const lines = [
    "# Flow Safety Report",
    "",
    `- Steps: ${flow.steps.length}`,
    `- Edges: ${flow.edges.length}`,
    `- Issues: ${issues.length}`,
  ];

  if (issues.length === 0) {
    lines.push("- Status: PASS");
  } else {
    lines.push("- Status: FAIL");
    for (const issue of issues) {
      lines.push(`- [${issue.code}] ${issue.stepId}: ${issue.detail}`);
    }
  }

  return lines.join("\n");
}
