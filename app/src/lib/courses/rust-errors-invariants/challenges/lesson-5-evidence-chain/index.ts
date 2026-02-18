import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(buildChain(input.steps, input.startMs));
}

function buildChain(steps, startMs) {
  return {
    steps: steps.map((step, index) => ({
      id: step.id,
      action: step.action,
      status: step.status,
      detail: step.detail,
      atMs: startMs + index * 10,
    })),
  };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints = [
  "Inject/mock timestamps for deterministic evidence chains.",
  "Step ordering must remain stable for snapshot tests.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "builds deterministic evidence chain",
    input: JSON.stringify({
      startMs: 100,
      steps: [
        { id: "s1", action: "check balance", status: "pass", detail: "ok" },
        { id: "s2", action: "check owner", status: "fail", detail: "mismatch" },
      ],
    }),
    expectedOutput:
      '{"steps":[{"id":"s1","action":"check balance","status":"pass","detail":"ok","atMs":100},{"id":"s2","action":"check owner","status":"fail","detail":"mismatch","atMs":110}]}',
  },
];
