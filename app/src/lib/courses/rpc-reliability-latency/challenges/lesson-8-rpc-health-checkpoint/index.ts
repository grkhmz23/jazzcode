import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(rpcHealthReport(input));
}

function rpcHealthReport(input) {
  return {
    json: JSON.stringify({
      error: input.error,
      histogram: input.histogram,
      p50LatencyMs: input.p50LatencyMs,
      p95LatencyMs: input.p95LatencyMs,
      success: input.success,
      total: input.total,
    }),
    markdown: "# RPC Health Report\\n\\n- Total requests: " + input.total + "\\n- Success: " + input.success + "\\n- Errors: " + input.error,
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "Checkpoint should export both JSON and markdown.",
  "Ensure field order is stable in JSON output.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports health report",
    input: JSON.stringify({ total: 8, success: 7, error: 1, p50LatencyMs: 90, p95LatencyMs: 320, histogram: { "0-49": 2, "50-99": 3, "100-249": 2, "250-499": 1, "500+": 0 } }),
    expectedOutput:
      '{"json":"{\\"error\\":1,\\"histogram\\":{\\"0-49\\":2,\\"50-99\\":3,\\"100-249\\":2,\\"250-499\\":1,\\"500+\\":0},\\"p50LatencyMs\\":90,\\"p95LatencyMs\\":320,\\"success\\":7,\\"total\\":8}","markdown":"# RPC Health Report\\n\\n- Total requests: 8\\n- Success: 7\\n- Errors: 1"}',
  },
  {
    name: "exports healthy report with zero errors",
    input: JSON.stringify({ total: 3, success: 3, error: 0, p50LatencyMs: 40, p95LatencyMs: 80, histogram: { "0-49": 2, "50-99": 1, "100-249": 0, "250-499": 0, "500+": 0 } }),
    expectedOutput:
      '{"json":"{\\"error\\":0,\\"histogram\\":{\\"0-49\\":2,\\"50-99\\":1,\\"100-249\\":0,\\"250-499\\":0,\\"500+\\":0},\\"p50LatencyMs\\":40,\\"p95LatencyMs\\":80,\\"success\\":3,\\"total\\":3}","markdown":"# RPC Health Report\\n\\n- Total requests: 3\\n- Success: 3\\n- Errors: 0"}',
  },
];
