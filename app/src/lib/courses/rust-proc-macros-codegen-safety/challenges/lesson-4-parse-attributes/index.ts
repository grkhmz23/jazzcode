import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(parseAttributes(input.dsl));
}

function parseAttributes(dsl) {
  const lines = dsl.split("\\n").map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => {
    const m = line.match(/^([a-z_]+)\\((.*)\\)$/);
    if (!m) throw new Error("invalid DSL line");
    const kind = m[1];
    const body = m[2].trim();
    if (kind === "signer" || kind === "mut") {
      return { kind, target: body };
    }
    const [target, expected] = body.split("=").map((part) => part.trim());
    return { kind, target, expected };
  });
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints = [
  "Parse mini DSL lines into typed AST nodes.",
  "Support signer, mut, owner, and has_one forms.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "parses deterministic constraint AST",
    input: JSON.stringify({ dsl: "signer(authority)\\nowner(vault=VaultProgram)" }),
    expectedOutput:
      '[{"kind":"signer","target":"authority"},{"kind":"owner","target":"vault","expected":"VaultProgram"}]',
  },
];
