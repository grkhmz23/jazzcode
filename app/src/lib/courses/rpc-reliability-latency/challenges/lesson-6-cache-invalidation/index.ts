import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(cacheInvalidationPlan(input));
}

function cacheInvalidationPlan(input) {
  const staleKeys = (input.changedAccounts || []).map((account) => "acct:" + account).sort((a, b) => a.localeCompare(b));
  return {
    staleKeys,
    ttlMs: input.slotLag > 5 ? 500 : 2000,
    strategy: input.slotLag > 5 ? "aggressive-invalidate" : "standard-refresh",
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints: string[] = [
  "Invalidate account-keyed cache entries deterministically.",
  "Use tighter TTL when node lag grows.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "plans aggressive invalidation when lagging",
    input: JSON.stringify({ changedAccounts: ["b", "a"], slotLag: 7 }),
    expectedOutput:
      '{"staleKeys":["acct:a","acct:b"],"ttlMs":500,"strategy":"aggressive-invalidate"}',
  },
  {
    name: "uses standard refresh mode at low slot lag",
    input: JSON.stringify({ changedAccounts: ["z", "m"], slotLag: 2 }),
    expectedOutput:
      '{"staleKeys":["acct:m","acct:z"],"ttlMs":2000,"strategy":"standard-refresh"}',
  },
];
