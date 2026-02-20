import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(rpcPolicy(input));
}

function rpcPolicy(input) {
  const attempts = Number(input.maxRetries || 0) + 1;
  const schedule = [];
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let delayBeforeAttemptMs = 0;
    if (attempt > 0) {
      delayBeforeAttemptMs = input.backoff.kind === "exponential"
        ? input.backoff.baseDelayMs * Math.pow(2, attempt - 1)
        : input.backoff.baseDelayMs * attempt;
      delayBeforeAttemptMs = Math.min(delayBeforeAttemptMs, input.backoff.maxDelayMs);
    }
    schedule.push({ attempt, timeoutMs: input.timeoutMs, delayBeforeAttemptMs });
  }
  return schedule;
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Build a deterministic retry schedule including the first attempt.",
  "Cap delays at maxDelayMs.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "creates exponential retry schedule",
    input: JSON.stringify({ timeoutMs: 900, maxRetries: 2, backoff: { kind: "exponential", baseDelayMs: 100, maxDelayMs: 500 } }),
    expectedOutput:
      '[{"attempt":0,"timeoutMs":900,"delayBeforeAttemptMs":0},{"attempt":1,"timeoutMs":900,"delayBeforeAttemptMs":100},{"attempt":2,"timeoutMs":900,"delayBeforeAttemptMs":200}]',
  },
  {
    name: "caps linear backoff delay at maxDelayMs",
    input: JSON.stringify({ timeoutMs: 1000, maxRetries: 3, backoff: { kind: "linear", baseDelayMs: 250, maxDelayMs: 400 } }),
    expectedOutput:
      '[{"attempt":0,"timeoutMs":1000,"delayBeforeAttemptMs":0},{"attempt":1,"timeoutMs":1000,"delayBeforeAttemptMs":250},{"attempt":2,"timeoutMs":1000,"delayBeforeAttemptMs":400},{"attempt":3,"timeoutMs":1000,"delayBeforeAttemptMs":400}]',
  },
];
