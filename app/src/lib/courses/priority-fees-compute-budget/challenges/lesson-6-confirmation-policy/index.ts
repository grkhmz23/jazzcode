import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  const decision = chooseConfirmationPolicy(input);
  return JSON.stringify(decision);
}

function chooseConfirmationPolicy(input) {
  const risk = Number(input.riskScore || 0);
  if (risk >= 70) {
    return { confirmationLevel: "finalized", uiMessage: "High-risk flow: wait for finalized before declaring success." };
  }
  if (risk >= 35) {
    return { confirmationLevel: "confirmed", uiMessage: "Moderate risk: show pending state until confirmed." };
  }
  return { confirmationLevel: "processed", uiMessage: "Low risk: show optimistic pending state with rollback hint." };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints: string[] = [
  "Map risk score bands to processed/confirmed/finalized UX levels.",
  "Keep output deterministic and string-stable.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "high risk requires finalized",
    input: JSON.stringify({ riskScore: 88 }),
    expectedOutput:
      '{"confirmationLevel":"finalized","uiMessage":"High-risk flow: wait for finalized before declaring success."}',
  },
  {
    name: "low risk uses processed",
    input: JSON.stringify({ riskScore: 10 }),
    expectedOutput:
      '{"confirmationLevel":"processed","uiMessage":"Low risk: show optimistic pending state with rollback hint."}',
  },
];
