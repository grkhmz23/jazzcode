import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(planFailureHandling(input));
}

function planFailureHandling(input) {
  const idempotencyKey = input.flowId + "-" + input.userId;
  const requiresRefund = !!input.requiresRefund;
  return {
    idempotencyKey,
    retryMode: "safe-retry",
    refundPath: requiresRefund ? "enabled" : "not-needed",
    status: requiresRefund ? "needs-compensation" : "safe",
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints: string[] = [
  "Generate deterministic idempotency keys from stable inputs.",
  "Always emit explicit refund-path state for observability.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "builds safe retry and compensation plan",
    input: JSON.stringify({ flowId: "flow-1", userId: "u-9", requiresRefund: true }),
    expectedOutput:
      '{"idempotencyKey":"flow-1-u-9","retryMode":"safe-retry","refundPath":"enabled","status":"needs-compensation"}',
  },
  {
    name: "marks safe path when refund is not required",
    input: JSON.stringify({ flowId: "flow-2", userId: "u-1", requiresRefund: false }),
    expectedOutput:
      '{"idempotencyKey":"flow-2-u-1","retryMode":"safe-retry","refundPath":"not-needed","status":"safe"}',
  },
];
