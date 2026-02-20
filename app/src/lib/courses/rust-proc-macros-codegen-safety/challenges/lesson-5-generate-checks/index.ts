import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return generateChecks(input.ast);
}

function generateChecks(ast) {
  return ast.map((node) => {
    if (node.kind === "signer") return "require_signer(" + node.target + ");";
    if (node.kind === "mut") return "require_mut(" + node.target + ");";
    if (node.kind === "owner") return "require_owner(" + node.target + ", " + node.expected + ");";
    return "require_has_one(" + node.target + ", " + node.expected + ");";
  }).join("\\n");
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints = [
  "Generate stable pseudo-code output from AST.",
  "One deterministic line per constraint node.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "generates deterministic check code",
    input: JSON.stringify({ ast: [{ kind: "signer", target: "authority" }, { kind: "owner", target: "vault", expected: "VaultProgram" }] }),
    expectedOutput: "require_signer(authority);\\nrequire_owner(vault, VaultProgram);",
  },
  {
    name: "supports mut and has_one forms",
    input: JSON.stringify({ ast: [{ kind: "mut", target: "vault" }, { kind: "has_one", target: "vault", expected: "authority" }] }),
    expectedOutput: "require_mut(vault);\\nrequire_has_one(vault, authority);",
  },
];
