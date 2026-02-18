import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(selectRpcEndpoint(input.endpoints, input.healthSamples));
}

function selectRpcEndpoint(endpoints, healthSamples) {
  const byId = new Map((healthSamples || []).map((sample) => [sample.endpointId, sample]));
  const scored = (endpoints || []).map((endpoint) => {
    const sample = byId.get(endpoint.id) || { successRate: 0.5, p95LatencyMs: 1000, rateLimitedRatio: 0.25, slotLag: 20 };
    const score = sample.successRate * 100 + endpoint.weight * 2 - sample.p95LatencyMs * 0.03 - sample.rateLimitedRatio * 120 - sample.slotLag * 2;
    return { endpoint, score, sample };
  }).sort((a, b) => b.score - a.score || a.endpoint.id.localeCompare(b.endpoint.id));

  const best = scored[0];
  return {
    chosen: best.endpoint,
    reasoning: "selected " + best.endpoint.id + " score=" + best.score.toFixed(2) + " success=" + best.sample.successRate.toFixed(2) + " p95=" + best.sample.p95LatencyMs + "ms",
  };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Blend success rate, latency, 429 pressure, and slot lag into one score.",
  "Tie-break deterministically by endpoint ID.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "chooses healthiest endpoint",
    input: JSON.stringify({
      endpoints: [
        { id: "a", url: "https://a.example", region: "us-east", weight: 2 },
        { id: "b", url: "https://b.example", region: "us-west", weight: 1 },
      ],
      healthSamples: [
        { endpointId: "a", successRate: 0.96, p95LatencyMs: 140, rateLimitedRatio: 0.01, slotLag: 1 },
        { endpointId: "b", successRate: 0.9, p95LatencyMs: 90, rateLimitedRatio: 0.1, slotLag: 3 },
      ],
    }),
    expectedOutput:
      '{"chosen":{"id":"a","url":"https://a.example","region":"us-east","weight":2},"reasoning":"selected a score=92.60 success=0.96 p95=140ms"}',
  },
];
