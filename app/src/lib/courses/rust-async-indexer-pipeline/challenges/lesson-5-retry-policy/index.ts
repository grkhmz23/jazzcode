import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(buildRetryPolicy(input));
}

function buildRetryPolicy(input) {
  const schedule = [];
  for (let attempt = 1; attempt <= input.maxRetries; attempt += 1) {
    const raw = input.backoff === "exponential" ? input.baseDelayTicks * Math.pow(2, attempt - 1) : input.baseDelayTicks * attempt;
    schedule.push(Math.min(raw, input.maxDelayTicks));
  }
  return schedule;
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints = [
  "Retry schedule should be deterministic and bounded.",
  "Support linear and exponential backoff modes.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "builds exponential retry schedule",
    input: JSON.stringify({ maxRetries: 3, baseDelayTicks: 2, backoff: "exponential", maxDelayTicks: 10 }),
    expectedOutput: '[2,4,8]',
  },
];
