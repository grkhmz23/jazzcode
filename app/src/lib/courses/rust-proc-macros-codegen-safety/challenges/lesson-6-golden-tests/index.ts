import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(runGoldenCheck(input.generated, input.expected));
}

function runGoldenCheck(generated, expected) {
  return {
    matches: generated === expected,
    generated,
    expected,
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints = [
  "Golden tests compare generated output strings exactly.",
  "Keep check output deterministic to make golden tests meaningful.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "compares generated code with golden",
    input: JSON.stringify({ generated: "require_signer(authority);", expected: "require_signer(authority);" }),
    expectedOutput:
      '{"matches":true,"generated":"require_signer(authority);","expected":"require_signer(authority);"}',
  },
];
