import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(runGeneratedChecks(input.ast, input.state));
}

function runGeneratedChecks(ast, state) {
  const failures = [];
  for (const node of ast) {
    if (node.kind === "signer" && !state.signers.includes(node.target)) {
      failures.push({ kind: "signer", target: node.target, reason: "missing signer: " + node.target });
    }
    if (node.kind === "owner" && state.owners[node.target] !== node.expected) {
      failures.push({ kind: "owner", target: node.target, reason: "owner mismatch: expected " + node.expected });
    }
  }
  return { ok: failures.length === 0, failures };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints = [
  "Evaluate generated constraints against sample account state.",
  "Return deterministic failure reasons.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "reports owner mismatch deterministically",
    input: JSON.stringify({
      ast: [{ kind: "owner", target: "vault", expected: "VaultProgram" }],
      state: { signers: ["authority"], owners: { vault: "SystemProgram" } },
    }),
    expectedOutput:
      '{"ok":false,"failures":[{"kind":"owner","target":"vault","reason":"owner mismatch: expected VaultProgram"}]}',
  },
];
