import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = computeTickMath(input);
  return JSON.stringify(result);
}

function computeTickMath(input) {
  // TODO: Implement tick <-> price conversion
  // 1. Convert tick index to price using: price = 1.0001^tick
  // 2. Convert price to nearest tick index
  // 3. Compute sqrtPrice from tick
  // 4. Return all computed values
  return {
    tickIndex: 0,
    price: "0",
    sqrtPriceX64: "0",
    priceToTick: 0,
    tickSpacingAligned: 0,
  };
}

function tickToPrice(tick) {
  return Math.pow(1.0001, tick);
}

function priceToTick(price) {
  return Math.round(Math.log(price) / Math.log(1.0001));
}

function alignToTickSpacing(tick, tickSpacing) {
  return Math.floor(tick / tickSpacing) * tickSpacing;
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = computeTickMath(input);
  return JSON.stringify(result);
}

function computeTickMath(input) {
  var tickIndex = input.tickIndex;
  var tickSpacing = input.tickSpacing || 64;

  var price = tickToPrice(tickIndex);
  var priceStr = price.toFixed(12);

  var sqrtPrice = Math.sqrt(price);
  var sqrtPriceX64 = BigInt(Math.round(sqrtPrice * (2 ** 64)));

  var reverseTickFromPrice = priceToTick(price);
  var aligned = alignToTickSpacing(tickIndex, tickSpacing);

  return {
    tickIndex: tickIndex,
    price: priceStr,
    sqrtPriceX64: sqrtPriceX64.toString(),
    priceToTick: reverseTickFromPrice,
    tickSpacingAligned: aligned,
  };
}

function tickToPrice(tick) {
  return Math.pow(1.0001, tick);
}

function priceToTick(price) {
  return Math.round(Math.log(price) / Math.log(1.0001));
}

function alignToTickSpacing(tick, tickSpacing) {
  return Math.floor(tick / tickSpacing) * tickSpacing;
}
`;

export const lesson4Hints: string[] = [
  "Price at a tick index = 1.0001^tickIndex. Use Math.pow(1.0001, tick).",
  "Reverse conversion: tick = round(ln(price) / ln(1.0001)).",
  "sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64)) — Solana CLMM uses Q64.64 fixed-point.",
  "Tick spacing alignment: floor(tick / spacing) * spacing.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "computes tick math for tick 0",
    input: JSON.stringify({ tickIndex: 0, tickSpacing: 64 }),
    expectedOutput: '{"tickIndex":0,"price":"1.000000000000","sqrtPriceX64":"18446744073709551616","priceToTick":0,"tickSpacingAligned":0}',
  },
  {
    name: "computes tick math for positive tick",
    input: JSON.stringify({ tickIndex: 23027, tickSpacing: 64 }),
    expectedOutput: '{"tickIndex":23027,"price":"9.999997796808","sqrtPriceX64":"58333720261115273216","priceToTick":23027,"tickSpacingAligned":22976}',
  },
  {
    name: "computes tick math for negative tick",
    input: JSON.stringify({ tickIndex: -23027, tickSpacing: 64 }),
    expectedOutput: '{"tickIndex":-23027,"price":"0.100000022032","sqrtPriceX64":"5833373311315574784","priceToTick":-23027,"tickSpacingAligned":-23040}',
  },
];
