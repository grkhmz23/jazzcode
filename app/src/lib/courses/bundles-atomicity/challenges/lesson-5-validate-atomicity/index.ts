import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const issues = validateAtomicity(input.flow);
  return JSON.stringify(issues);
}

function validateAtomicity(flow) {
  const issues = [];
  const steps = flow.steps || [];
  const ids = new Set(steps.map((s) => s.id));

  for (const step of steps) {
    for (const dep of step.dependsOn || []) {
      if (!ids.has(dep)) {
        issues.push({ code: "broken-dependency", stepId: step.id, detail: "depends on missing step " + dep });
      }
    }
    if (!step.idempotent) {
      issues.push({ code: "non-idempotent", stepId: step.id, detail: "step is not idempotent; retries can duplicate side effects" });
      if (step.kind !== "refund" && step.kind !== "cleanup") {
        issues.push({ code: "partial-execution-risk", stepId: step.id, detail: "partial execution could leave user funds or approvals in unsafe state" });
      }
    }
  }

  const hasSwap = steps.some((step) => step.kind === "swap");
  const hasRefund = steps.some((step) => step.kind === "refund");
  if (hasSwap && !hasRefund) {
    issues.push({ code: "missing-refund", stepId: "swap", detail: "swap flow has no deterministic refund step" });
  }

  return issues.sort((a, b) => (a.code + ":" + a.stepId).localeCompare(b.code + ":" + b.stepId));
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Detect missing refund branch for swap flows.",
  "Flag non-idempotent steps because retries can break all-or-nothing guarantees.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "detects missing refund and non-idempotent risk",
    input: JSON.stringify({
      flow: {
        steps: [
          { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
          { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: false },
        ],
      },
    }),
    expectedOutput:
      '[{"code":"missing-refund","stepId":"swap","detail":"swap flow has no deterministic refund step"},{"code":"non-idempotent","stepId":"swap","detail":"step is not idempotent; retries can duplicate side effects"},{"code":"partial-execution-risk","stepId":"swap","detail":"partial execution could leave user funds or approvals in unsafe state"}]',
  },
  {
    name: "returns no issues for idempotent swap flow with refund",
    input: JSON.stringify({
      flow: {
        steps: [
          { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
          { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: true },
          { id: "refund", kind: "refund", dependsOn: ["swap"], idempotent: true },
        ],
      },
    }),
    expectedOutput: "[]",
  },
];
