import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = planLutUsage(input);
  return JSON.stringify(result);
}

function planLutUsage(input) {
  // TODO: Plan Address Lookup Table usage for a transaction
  // 1. Count unique account keys across all instructions
  // 2. Determine which keys appear in available LUTs
  // 3. Calculate tx size savings from using LUTs
  // 4. Decide: use LUT, create new LUT, or fallback to legacy
  return {
    totalUniqueKeys: 0,
    keysInLut: 0,
    keysNotInLut: 0,
    estimatedSizeWithoutLut: 0,
    estimatedSizeWithLut: 0,
    bytesSaved: 0,
    recommendation: "legacy",
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = planLutUsage(input);
  return JSON.stringify(result);
}

function planLutUsage(input) {
  var instructions = input.instructions;
  var availableLuts = input.availableLuts || [];
  var BYTES_PER_KEY = 32;
  var BYTES_PER_LUT_INDEX = 1;
  var BASE_TX_SIZE = 200;
  var MAX_LEGACY_TX_SIZE = 1232;

  var allKeys = {};
  for (var i = 0; i < instructions.length; i++) {
    var keys = instructions[i].accountKeys || [];
    for (var k = 0; k < keys.length; k++) {
      allKeys[keys[k]] = true;
    }
  }

  var lutKeySet = {};
  for (var l = 0; l < availableLuts.length; l++) {
    var lutKeys = availableLuts[l].keys || [];
    for (var j = 0; j < lutKeys.length; j++) {
      lutKeySet[lutKeys[j]] = true;
    }
  }

  var uniqueKeys = Object.keys(allKeys);
  var totalUniqueKeys = uniqueKeys.length;
  var keysInLut = 0;
  var keysNotInLut = 0;

  for (var m = 0; m < uniqueKeys.length; m++) {
    if (lutKeySet[uniqueKeys[m]]) {
      keysInLut++;
    } else {
      keysNotInLut++;
    }
  }

  var sizeWithoutLut = BASE_TX_SIZE + totalUniqueKeys * BYTES_PER_KEY;
  var sizeWithLut = BASE_TX_SIZE + keysNotInLut * BYTES_PER_KEY + keysInLut * BYTES_PER_LUT_INDEX;
  var bytesSaved = sizeWithoutLut - sizeWithLut;

  var recommendation;
  if (sizeWithoutLut <= MAX_LEGACY_TX_SIZE) {
    recommendation = "legacy";
  } else if (keysInLut > 0 && sizeWithLut <= MAX_LEGACY_TX_SIZE) {
    recommendation = "use-existing-lut";
  } else if (sizeWithLut > MAX_LEGACY_TX_SIZE) {
    recommendation = "create-new-lut";
  } else {
    recommendation = "use-existing-lut";
  }

  return {
    totalUniqueKeys: totalUniqueKeys,
    keysInLut: keysInLut,
    keysNotInLut: keysNotInLut,
    estimatedSizeWithoutLut: sizeWithoutLut,
    estimatedSizeWithLut: sizeWithLut,
    bytesSaved: bytesSaved,
    recommendation: recommendation,
  };
}
`;

export const lesson5Hints: string[] = [
  "Collect all unique account keys across instructions into a set.",
  "Each key costs 32 bytes without LUT, 1 byte with LUT.",
  "Base transaction overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
  "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "small tx uses legacy",
    input: JSON.stringify({
      instructions: [
        { name: "transfer", accountKeys: ["w1", "w2", "sys"] },
      ],
      availableLuts: [],
    }),
    expectedOutput: '{"totalUniqueKeys":3,"keysInLut":0,"keysNotInLut":3,"estimatedSizeWithoutLut":296,"estimatedSizeWithLut":296,"bytesSaved":0,"recommendation":"legacy"}',
  },
  {
    name: "large tx benefits from existing LUT",
    input: JSON.stringify({
      instructions: [
        { name: "swap", accountKeys: ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12","k13","k14","k15","k16","k17","k18","k19","k20","k21","k22","k23","k24","k25","k26","k27","k28","k29","k30","k31","k32","k33","k34","k35"] },
      ],
      availableLuts: [
        { address: "LUT1", keys: ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12","k13","k14","k15","k16","k17","k18","k19","k20"] },
      ],
    }),
    expectedOutput: '{"totalUniqueKeys":35,"keysInLut":20,"keysNotInLut":15,"estimatedSizeWithoutLut":1320,"estimatedSizeWithLut":700,"bytesSaved":620,"recommendation":"use-existing-lut"}',
  },
  {
    name: "very large tx needs new LUT",
    input: JSON.stringify({
      instructions: [
        { name: "multiSwap", accountKeys: ["a1","a2","a3","a4","a5","a6","a7","a8","a9","a10","a11","a12","a13","a14","a15","a16","a17","a18","a19","a20","a21","a22","a23","a24","a25","a26","a27","a28","a29","a30","a31","a32","a33","a34","a35","a36","a37","a38","a39","a40","a41","a42","a43","a44","a45"] },
      ],
      availableLuts: [
        { address: "LUT1", keys: ["a1","a2","a3","a4","a5"] },
      ],
    }),
    expectedOutput: '{"totalUniqueKeys":45,"keysInLut":5,"keysNotInLut":40,"estimatedSizeWithoutLut":1640,"estimatedSizeWithLut":1485,"bytesSaved":155,"recommendation":"create-new-lut"}',
  },
];
