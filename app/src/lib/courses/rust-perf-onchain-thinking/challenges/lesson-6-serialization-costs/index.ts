import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(serializationCost(input));
}

function serializationCost(input) {
  const repeated = input.passes * (input.encodeBytes + input.decodeBytes);
  const optimized = input.encodeBytes + input.decodeBytes;
  return {
    repeatedBytes: repeated,
    optimizedBytes: optimized,
    bytesSaved: repeated - optimized,
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints = [
  "Show why repeated encode/decode loops are expensive.",
  "Keep the model deterministic by counting bytes instead of timing.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "models serialization overhead",
    input: JSON.stringify({ passes: 4, encodeBytes: 30, decodeBytes: 20 }),
    expectedOutput: '{"repeatedBytes":200,"optimizedBytes":50,"bytesSaved":150}',
  },
];
