import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const plan = buildSwapPlan(input);
  return JSON.stringify(plan);
}

function buildSwapPlan(quote) {
  // TODO: Parse the quote response and build a normalized swap plan
  // 1. Extract input/output mints and amounts
  // 2. Calculate minOutAmount using slippageBps
  // 3. Map route legs with program labels
  // 4. Return normalized SwapPlan
  return {
    inputMint: "",
    outputMint: "",
    inAmount: "0",
    outAmount: "0",
    minOutAmount: "0",
    slippageBps: 0,
    priceImpactPct: "0",
    routeLegs: [],
  };
}

function applySlippage(amount, slippageBps) {
  // TODO: Calculate minimum output after slippage
  return "0";
}
`;

export const lesson4SolutionCode = `function run(input) {
  const plan = buildSwapPlan(input);
  return JSON.stringify(plan);
}

function buildSwapPlan(quote) {
  const inAmount = quote.inAmount;
  const outAmount = quote.outAmount;
  const slippageBps = quote.slippageBps;
  const minOutAmount = applySlippage(outAmount, slippageBps);

  const routeLegs = (quote.routePlan || []).map(function(leg, idx) {
    return {
      index: idx,
      ammLabel: leg.swapInfo.ammKey ? leg.swapInfo.label : "unknown",
      inputMint: leg.swapInfo.inputMint,
      outputMint: leg.swapInfo.outputMint,
      feeMint: leg.swapInfo.feeMint || leg.swapInfo.outputMint,
      feeAmount: leg.swapInfo.feeAmount || "0",
      pct: leg.percent,
    };
  });

  return {
    inputMint: quote.inputMint,
    outputMint: quote.outputMint,
    inAmount: inAmount,
    outAmount: outAmount,
    minOutAmount: minOutAmount,
    slippageBps: slippageBps,
    priceImpactPct: quote.priceImpactPct || "0",
    routeLegs: routeLegs,
  };
}

function applySlippage(amount, slippageBps) {
  var num = BigInt(amount);
  var bps = BigInt(slippageBps);
  var minOut = num - (num * bps) / 10000n;
  return minOut.toString();
}
`;

export const lesson4Hints: string[] = [
  "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
  "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
  "Map each routePlan entry to a normalized leg with index, ammLabel, mints, and fees.",
  "The priceImpactPct comes directly from the quote response.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "builds swap plan from SOL-USDC quote",
    input: JSON.stringify({
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      inAmount: "1000000000",
      outAmount: "22500000",
      slippageBps: 50,
      priceImpactPct: "0.12",
      routePlan: [
        {
          percent: 100,
          swapInfo: {
            ammKey: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
            label: "Whirlpool",
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            feeMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            feeAmount: "6750",
          },
        },
      ],
    }),
    expectedOutput: '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","inAmount":"1000000000","outAmount":"22500000","minOutAmount":"22387500","slippageBps":50,"priceImpactPct":"0.12","routeLegs":[{"index":0,"ammLabel":"Whirlpool","inputMint":"So11111111111111111111111111111111111111112","outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","feeMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","feeAmount":"6750","pct":100}]}',
  },
  {
    name: "builds multi-hop swap plan",
    input: JSON.stringify({
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
      inAmount: "5000000000",
      outAmount: "4800000000",
      slippageBps: 100,
      priceImpactPct: "0.05",
      routePlan: [
        {
          percent: 60,
          swapInfo: {
            ammKey: "AMM1111111111111111111111111111111111111111",
            label: "Raydium",
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            feeMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            feeAmount: "14400",
          },
        },
        {
          percent: 40,
          swapInfo: {
            ammKey: "AMM2222222222222222222222222222222222222222",
            label: "Orca",
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            feeMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            feeAmount: "9600",
          },
        },
      ],
    }),
    expectedOutput: '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","inAmount":"5000000000","outAmount":"4800000000","minOutAmount":"4752000000","slippageBps":100,"priceImpactPct":"0.05","routeLegs":[{"index":0,"ammLabel":"Raydium","inputMint":"So11111111111111111111111111111111111111112","outputMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","feeMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","feeAmount":"14400","pct":60},{"index":1,"ammLabel":"Orca","inputMint":"So11111111111111111111111111111111111111112","outputMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","feeMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","feeAmount":"9600","pct":40}]}',
  },
  {
    name: "handles zero slippage",
    input: JSON.stringify({
      inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      outputMint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
      inAmount: "1000000",
      outAmount: "999500",
      slippageBps: 0,
      priceImpactPct: "0.01",
      routePlan: [
        {
          percent: 100,
          swapInfo: {
            ammKey: "AMM3333333333333333333333333333333333333333",
            label: "Saber",
            inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            outputMint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
            feeMint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
            feeAmount: "500",
          },
        },
      ],
    }),
    expectedOutput: '{"inputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","outputMint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","inAmount":"1000000","outAmount":"999500","minOutAmount":"999500","slippageBps":0,"priceImpactPct":"0.01","routeLegs":[{"index":0,"ammLabel":"Saber","inputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","outputMint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","feeMint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","feeAmount":"500","pct":100}]}',
  },
];
