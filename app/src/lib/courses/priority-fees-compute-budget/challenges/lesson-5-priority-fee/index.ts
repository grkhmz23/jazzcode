import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const estimate = estimatePriorityFee(input.samples, input.policy);
  return JSON.stringify(estimate);
}

function estimatePriorityFee(samples, policy) {
  const clean = (samples || []).filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (clean.length === 0) {
    return { microLamports: policy.minMicroLamports, confidence: "low", warnings: ["no valid fee samples; using policy minimum"] };
  }

  const idx = Math.ceil((policy.targetPercentile / 100) * clean.length) - 1;
  const base = clean[Math.max(0, Math.min(clean.length - 1, idx))];
  const p50 = clean[Math.ceil(0.5 * clean.length) - 1];
  const p90 = clean[Math.ceil(0.9 * clean.length) - 1];
  const spreadBps = p50 > 0 ? Math.round(((p90 - p50) / p50) * 10000) : 0;

  let adjusted = base;
  const warnings = [];
  if (spreadBps > policy.volatilityGuardBps) {
    adjusted = Math.ceil(base * 1.1);
    warnings.push("volatility guard applied (+10%)");
  }
  if (clean.length !== (samples || []).length) {
    warnings.push("ignored non-positive or invalid samples");
  }

  const microLamports = Math.max(policy.minMicroLamports, Math.min(policy.maxMicroLamports, adjusted));
  const confidence = clean.length >= 8 ? "medium" : "low";
  return { microLamports, confidence, warnings };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Use percentile targeting from sorted synthetic fee samples.",
  "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
  "Clamp output between min and max micro-lamports.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "estimates fee from stable samples",
    input: JSON.stringify({
      samples: [1200, 1300, 1500, 1700, 1900, 2100],
      policy: { minMicroLamports: 1000, maxMicroLamports: 5000, targetPercentile: 75, volatilityGuardBps: 5000 },
    }),
    expectedOutput: '{"microLamports":1900,"confidence":"low","warnings":[]}',
  },
  {
    name: "applies volatility guard and ignores invalid entries",
    input: JSON.stringify({
      samples: [500, 600, 700, 5000, 8000, -1, 0],
      policy: { minMicroLamports: 400, maxMicroLamports: 9000, targetPercentile: 75, volatilityGuardBps: 3000 },
    }),
    expectedOutput:
      '{"microLamports":5500,"confidence":"low","warnings":["volatility guard applied (+10%)","ignored non-positive or invalid samples"]}',
  },
];
