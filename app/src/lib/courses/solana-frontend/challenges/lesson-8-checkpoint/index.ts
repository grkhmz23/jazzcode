import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify({
    owner: input.owner,
    tokenCount: 0,
    totalValueUsd: "0.000000",
    topTokens: [],
    recent: [],
    invariants: [],
    determinism: { fixtureHash: "", modelVersion: "solana-frontend-dashboard-v2" }
  });
}
`;

export const lesson8SolutionCode = `function run(input) {
  const summary = {
    owner: input.owner,
    tokenCount: input.rows.length,
    totalValueUsd: input.totalValueUsd,
    topTokens: [...input.rows]
      .sort((a, b) => {
        if (a.valueUsd === b.valueUsd) return a.mint.localeCompare(b.mint);
        return b.valueUsd.localeCompare(a.valueUsd);
      })
      .slice(0, 3)
      .map((row) => ({ mint: row.mint, symbol: row.symbol, amount: row.amount, valueUsd: row.valueUsd })),
    recent: [...input.recent]
      .sort((a, b) => (b.ts - a.ts) || b.id.localeCompare(a.id))
      .slice(0, 5),
    invariants: [
      "event ids applied once",
      "corrections tracked deterministically",
      "history sorted by replay order"
    ],
    determinism: {
      fixtureHash: input.fixtureHash,
      modelVersion: "solana-frontend-dashboard-v2"
    }
  };

  return JSON.stringify(summary);
}
`;

export const lesson8Hints: string[] = [
  "Emit JSON keys in a fixed order for stable snapshots.",
  "Sort top tokens deterministically with tie breakers.",
  "Include modelVersion and fixtureHash in determinism metadata.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "emits stable DashboardSummary",
    input: JSON.stringify({
      owner: "OWNER",
      totalValueUsd: "7.000000",
      fixtureHash: "abc123",
      rows: [
        { mint: "MINT_B", symbol: "USDC", amount: "5000000", valueUsd: "5.000000" },
        { mint: "MINT_C", symbol: "USDT", amount: "2000000", valueUsd: "2.000000" }
      ],
      recent: [
        { id: "e2", ts: 12, summary: "Transferred" },
        { id: "e1", ts: 10, summary: "Minted" }
      ]
    }),
    expectedOutput:
      '{"owner":"OWNER","tokenCount":2,"totalValueUsd":"7.000000","topTokens":[{"mint":"MINT_B","symbol":"USDC","amount":"5000000","valueUsd":"5.000000"},{"mint":"MINT_C","symbol":"USDT","amount":"2000000","valueUsd":"2.000000"}],"recent":[{"id":"e2","ts":12,"summary":"Transferred"},{"id":"e1","ts":10,"summary":"Minted"}],"invariants":["event ids applied once","corrections tracked deterministically","history sorted by replay order"],"determinism":{"fixtureHash":"abc123","modelVersion":"solana-frontend-dashboard-v2"}}'
  },
  {
    name: "emits stable summary when rows are empty",
    input: JSON.stringify({
      owner: "OWNER2",
      totalValueUsd: "0.000000",
      fixtureHash: "emptyrows456",
      rows: [],
      recent: [
        { id: "e9", ts: 9, summary: "noop" }
      ]
    }),
    expectedOutput:
      '{"owner":"OWNER2","tokenCount":0,"totalValueUsd":"0.000000","topTokens":[],"recent":[{"id":"e9","ts":9,"summary":"noop"}],"invariants":["event ids applied once","corrections tracked deterministically","history sorted by replay order"],"determinism":{"fixtureHash":"emptyrows456","modelVersion":"solana-frontend-dashboard-v2"}}'
  }
];
