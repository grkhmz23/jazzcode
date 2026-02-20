import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(validatePatchResult(input));
}

function validatePatchResult(input) {
  return {
    signerCheck: false,
    ownerCheck: false,
    pdaCheck: false,
    safeMath: false,
    blocked: false,
    code: "",
  };
}
`;

export const lesson6SolutionCode = `function run(input) {
  return JSON.stringify(validatePatchResult(input));
}

function validatePatchResult(input) {
  const signerCheck = input.requiredChecks.includes("signer");
  const ownerCheck = input.requiredChecks.includes("owner");
  const pdaCheck = input.requiredChecks.includes("pda");
  const safeMath = input.requiredChecks.includes("safe-u64");
  const blocked = Boolean(input.fixedBlockedExploit);

  return {
    signerCheck,
    ownerCheck,
    pdaCheck,
    safeMath,
    blocked,
    code: blocked ? input.errorCode : "",
  };
}
`;

export const lesson6Hints: string[] = [
  "All four controls must be true for a complete patch.",
  "Use fixedBlockedExploit to set blocked status.",
  "Return error code only when blocked is true.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "validates fixed runtime controls",
    input: JSON.stringify({
      requiredChecks: ["signer", "owner", "pda", "safe-u64"],
      fixedBlockedExploit: true,
      errorCode: "ERR_BAD_PDA",
    }),
    expectedOutput:
      '{"signerCheck":true,"ownerCheck":true,"pdaCheck":true,"safeMath":true,"blocked":true,"code":"ERR_BAD_PDA"}',
  },
  {
    name: "keeps code empty when exploit is not blocked",
    input: JSON.stringify({
      requiredChecks: ["signer", "owner"],
      fixedBlockedExploit: false,
      errorCode: "ERR_UNUSED",
    }),
    expectedOutput:
      '{"signerCheck":true,"ownerCheck":true,"pdaCheck":false,"safeMath":false,"blocked":false,"code":""}',
  },
];
