import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  const plan = buildSwapPlan(input);
  return JSON.stringify(plan);
}

function buildSwapPlan(input) {
  return {
    inMint: input.inMint,
    outMint: input.outMint,
    user: input.user,
    inAmount: input.inAmount,
    minOutAmount: input.route.outAmount,
    route: input.route,
    instructions: [],
    meta: {
      mode: input.mode,
      slippageBps: input.slippageBps,
      createdAt: input.createdAt,
    },
  };
}
`;

export const lesson6SolutionCode = `function run(input) {
  const plan = buildSwapPlan(input);
  return JSON.stringify(plan);
}

function buildSwapPlan(input) {
  if (!Number.isInteger(input.slippageBps) || input.slippageBps < 0 || input.slippageBps > 10000) {
    throw new Error("Invalid slippageBps: " + input.slippageBps);
  }

  const outAmount = BigInt(input.route.outAmount);
  const minOutAmount = (outAmount * BigInt(10000 - input.slippageBps) / 10000n).toString();

  const encoded = encodeInstructionData({
    inMint: input.inMint,
    outMint: input.outMint,
    inAmount: input.inAmount,
    minOutAmount,
    poolIds: input.route.hops.map((hop) => hop.poolId),
  });

  return {
    inMint: input.inMint,
    outMint: input.outMint,
    user: input.user,
    inAmount: input.inAmount,
    minOutAmount,
    route: input.route,
    instructions: [
      {
        programId: "SwapPlanner111111111111111111111111111111",
        keys: [
          { pubkey: input.user, isSigner: true, isWritable: false },
          { pubkey: input.inMint, isSigner: false, isWritable: false },
          { pubkey: input.outMint, isSigner: false, isWritable: false },
        ],
        dataBase64: encoded,
      },
    ],
    meta: {
      mode: input.mode,
      slippageBps: input.slippageBps,
      createdAt: input.createdAt,
    },
  };
}

function encodeInstructionData(value) {
  const stable = JSON.stringify({
    kind: "OFFLINE_EDUCATIONAL_SWAP_PLAN",
    inMint: value.inMint,
    outMint: value.outMint,
    inAmount: value.inAmount,
    minOutAmount: value.minOutAmount,
    poolIds: value.poolIds,
  });

  return toBase64(stable);
}

function toBase64(value) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }

  if (typeof btoa === "function") {
    return btoa(value);
  }

  throw new Error("No base64 encoder available");
}
`;

export const lesson6Hints: string[] = [
  "Compute minOutAmount with integer math: floor(outAmount * (10000 - slippageBps) / 10000).",
  "Include an explicit OFFLINE educational marker in encoded instruction payload data.",
  "Keep instruction key order stable so output is deterministic across runs.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "builds deterministic swap plan and slippage floor",
    input: JSON.stringify({
      inMint: "So11111111111111111111111111111111111111112",
      outMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      user: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      inAmount: "2000000000",
      route: {
        hops: [
          {
            inMint: "So11111111111111111111111111111111111111112",
            outMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            poolId: "pool-alpha",
            dexLabel: "Meteora",
            feeBps: 30,
          },
        ],
        inAmount: "2000000000",
        outAmount: "38620000",
        priceImpactPct: "0.002400",
        totalFeeBps: 30,
      },
      slippageBps: 50,
      mode: "bestOut",
      createdAt: "2026-01-10T12:00:00.000Z",
    }),
    expectedOutput:
      '{"inMint":"So11111111111111111111111111111111111111112","outMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","user":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","inAmount":"2000000000","minOutAmount":"38426900","route":{"hops":[{"inMint":"So11111111111111111111111111111111111111112","outMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","poolId":"pool-alpha","dexLabel":"Meteora","feeBps":30}],"inAmount":"2000000000","outAmount":"38620000","priceImpactPct":"0.002400","totalFeeBps":30},"instructions":[{"programId":"SwapPlanner111111111111111111111111111111","keys":[{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":false},{"pubkey":"So11111111111111111111111111111111111111112","isSigner":false,"isWritable":false},{"pubkey":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","isSigner":false,"isWritable":false}],"dataBase64":"eyJraW5kIjoiT0ZGTElORV9FRFVDQVRJT05BTF9TV0FQX1BMQU4iLCJpbk1pbnQiOiJTbzExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEyIiwib3V0TWludCI6IkVQakZXZGQ1QXVmcVNTcWVNMnFOMXh6eWJhcEM4RzR3RUdHa1p3eVREdDF2IiwiaW5BbW91bnQiOiIyMDAwMDAwMDAwIiwibWluT3V0QW1vdW50IjoiMzg0MjY5MDAiLCJwb29sSWRzIjpbInBvb2wtYWxwaGEiXX0="}],"meta":{"mode":"bestOut","slippageBps":50,"createdAt":"2026-01-10T12:00:00.000Z"}}',
  },
  {
    name: "rejects invalid slippage",
    input: JSON.stringify({
      inMint: "So11111111111111111111111111111111111111112",
      outMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      user: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      inAmount: "100",
      route: { hops: [{ inMint: "A", outMint: "B", poolId: "p", dexLabel: "d", feeBps: 1 }], inAmount: "100", outAmount: "90", priceImpactPct: "0.1", totalFeeBps: 1 },
      slippageBps: 10001,
      mode: "bestOut",
      createdAt: "2026-01-10T12:00:00.000Z",
    }),
    expectedOutput: "Error: Invalid slippageBps: 10001",
  },
];
