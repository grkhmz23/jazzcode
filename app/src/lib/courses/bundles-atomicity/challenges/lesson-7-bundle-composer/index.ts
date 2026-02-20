import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(composeBundle(input.flow));
}

function composeBundle(flow) {
  const steps = (flow.steps || []).slice().sort((a, b) => a.id.localeCompare(b.id));
  return {
    bundleId: "bundle-" + steps.length + "-steps",
    transactions: steps.map((step, index) => ({ index, stepIds: [step.id] })),
    invariants: [
      "all transactions are intended for one logical user action",
      "bundle execution must preserve all-or-nothing user expectations",
      "refund branch must be available if swap leg fails",
    ],
  };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "No real Jito calls. Build deterministic data structures only.",
  "One step per transaction keeps test assertions simple and stable.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "composes deterministic bundle",
    input: JSON.stringify({ flow: { steps: [{ id: "swap" }, { id: "approve" }] } }),
    expectedOutput:
      '{"bundleId":"bundle-2-steps","transactions":[{"index":0,"stepIds":["approve"]},{"index":1,"stepIds":["swap"]}],"invariants":["all transactions are intended for one logical user action","bundle execution must preserve all-or-nothing user expectations","refund branch must be available if swap leg fails"]}',
  },
  {
    name: "composes deterministic empty bundle shape",
    input: JSON.stringify({ flow: { steps: [] } }),
    expectedOutput:
      '{"bundleId":"bundle-0-steps","transactions":[],"invariants":["all transactions are intended for one logical user action","bundle execution must preserve all-or-nothing user expectations","refund branch must be available if swap leg fails"]}',
  },
];
