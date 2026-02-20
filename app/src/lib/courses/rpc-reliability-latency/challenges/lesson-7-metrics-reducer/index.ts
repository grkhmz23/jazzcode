import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(metricsReducer(input.events));
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const idx = Math.ceil((p / 100) * values.length) - 1;
  return values[Math.max(0, Math.min(values.length - 1, idx))];
}

function metricsReducer(events) {
  const latencies = (events || []).map((event) => event.latencyMs).sort((a, b) => a - b);
  const histogram = { "0-49": 0, "50-99": 0, "100-249": 0, "250-499": 0, "500+": 0 };
  let success = 0;
  for (const event of events || []) {
    if (event.ok) success += 1;
    if (event.latencyMs < 50) histogram["0-49"] += 1;
    else if (event.latencyMs < 100) histogram["50-99"] += 1;
    else if (event.latencyMs < 250) histogram["100-249"] += 1;
    else if (event.latencyMs < 500) histogram["250-499"] += 1;
    else histogram["500+"] += 1;
  }
  return {
    total: (events || []).length,
    success,
    error: (events || []).length - success,
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    histogram,
  };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "Reduce RPC telemetry into histogram buckets and quantiles.",
  "Keep bucket boundaries explicit for deterministic snapshots.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "reduces latency metrics",
    input: JSON.stringify({ events: [{ latencyMs: 40, ok: true }, { latencyMs: 120, ok: true }, { latencyMs: 600, ok: false }] }),
    expectedOutput:
      '{"total":3,"success":2,"error":1,"p50LatencyMs":120,"p95LatencyMs":600,"histogram":{"0-49":1,"50-99":0,"100-249":1,"250-499":0,"500+":1}}',
  },
  {
    name: "returns zeroed metrics for empty event list",
    input: JSON.stringify({ events: [] }),
    expectedOutput:
      '{"total":0,"success":0,"error":0,"p50LatencyMs":0,"p95LatencyMs":0,"histogram":{"0-49":0,"50-99":0,"100-249":0,"250-499":0,"500+":0}}',
  },
];
