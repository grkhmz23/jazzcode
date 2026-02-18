import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const flow = buildAtomicFlow(input.steps);
  return JSON.stringify(flow);
}

function buildAtomicFlow(steps) {
  const normalized = (steps || [])
    .map((step) => ({
      id: step.id,
      kind: step.kind,
      dependsOn: (step.dependsOn || []).slice().sort((a, b) => a.localeCompare(b)),
      idempotent: !!step.idempotent,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const edges = [];
  for (const step of normalized) {
    for (const dep of step.dependsOn) {
      edges.push({ from: dep, to: step.id });
    }
  }
  edges.sort((a, b) => (a.from + ":" + a.to).localeCompare(b.from + ":" + b.to));

  return { steps: normalized, edges };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Normalize order by step ID and dependency ID for deterministic flow graphs.",
  "Emit explicit edges from dependency relationships.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "builds normalized flow graph",
    input: JSON.stringify({
      steps: [
        { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: true },
        { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
      ],
    }),
    expectedOutput:
      '{"steps":[{"id":"approve","kind":"approval","dependsOn":[],"idempotent":true},{"id":"swap","kind":"swap","dependsOn":["approve"],"idempotent":true}],"edges":[{"from":"approve","to":"swap"}]}',
  },
];
