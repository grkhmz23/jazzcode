import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify({ owner: input.owner, totalValueUsd: "0.000000", rows: [] });
}
`;

export const lesson6SolutionCode = `function run(input) {
  const rows = input.rows
    .filter((row) => !input.query.nonZeroOnly || BigInt(row.amount) > 0n)
    .filter((row) => !input.query.search || row.symbol.toLowerCase().includes(input.query.search.toLowerCase()))
    .sort((a, b) => {
      const field = input.query.sortBy || "valueUsd";
      if (field === "balance") {
        const diff = BigInt(b.amount) - BigInt(a.amount);
        if (diff !== 0n) return diff > 0n ? 1 : -1;
      } else {
        const av = toScaled(a.valueUsd);
        const bv = toScaled(b.valueUsd);
        const diff = bv - av;
        if (diff !== 0n) return diff > 0n ? 1 : -1;
      }
      return a.mint.localeCompare(b.mint);
    });

  const total = rows.reduce((acc, row) => acc + toScaled(row.valueUsd), 0n);
  return JSON.stringify({ owner: input.owner, totalValueUsd: fromScaled(total), rows });
}

function toScaled(value) {
  const [whole, frac = ""] = String(value).split(".");
  return BigInt(whole) * 1000000n + BigInt((frac + "000000").slice(0, 6));
}

function fromScaled(value) {
  const whole = value / 1000000n;
  const frac = (value % 1000000n).toString().padStart(6, "0");
  return whole.toString() + "." + frac;
}
`;

export const lesson6Hints: string[] = [
  "Use fixed-scale integers (micro USD) instead of floating point.",
  "Apply filter -> search -> sort in a deterministic order.",
  "Break sort ties by mint for stable output.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "builds deterministic view with fixed-scale USD math",
    input: JSON.stringify({
      owner: "OWNER",
      query: { nonZeroOnly: true, search: "us", sortBy: "valueUsd" },
      rows: [
        { mint: "MINT_B", symbol: "USDC", amount: "5000000", valueUsd: "5.000000", recentTs: 10 },
        { mint: "MINT_A", symbol: "SOL", amount: "0", valueUsd: "0.000000", recentTs: 11 },
        { mint: "MINT_C", symbol: "USDT", amount: "2000000", valueUsd: "2.000000", recentTs: 9 }
      ]
    }),
    expectedOutput:
      '{"owner":"OWNER","totalValueUsd":"7.000000","rows":[{"mint":"MINT_B","symbol":"USDC","amount":"5000000","valueUsd":"5.000000","recentTs":10},{"mint":"MINT_C","symbol":"USDT","amount":"2000000","valueUsd":"2.000000","recentTs":9}]}'
  }
];
