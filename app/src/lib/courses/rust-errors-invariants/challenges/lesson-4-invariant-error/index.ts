import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(ensure(input.condition, input.code, input.context));
}

function ensure(condition, code, context) {
  if (condition) return { ok: true };
  return { ok: false, error: { code, context } };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints = [
  "Return typed error payloads, not raw strings.",
  "Keep ensure() deterministic and side-effect free.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "returns typed error when invariant fails",
    input: JSON.stringify({ condition: false, code: "NEGATIVE_VALUE", context: { label: "amount", value: -1 } }),
    expectedOutput: '{"ok":false,"error":{"code":"NEGATIVE_VALUE","context":{"label":"amount","value":-1}}}',
  },
];
