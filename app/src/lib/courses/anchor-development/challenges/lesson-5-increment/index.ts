import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const bytes = createCounterStateBytes(input.authority, input.bump, input.startCount);
  const next = applyIncrement(bytes);
  const after = decodeCounterState(next);
  return JSON.stringify({ count: after.count, bump: after.bump, authority: after.authority });
}

function createCounterStateBytes(authority, bump, count) {
  return [];
}

function decodeCounterState(bytes) {
  return { authority: "", count: 0, bump: 0 };
}

function applyIncrement(bytes) {
  return bytes;
}
`;

export const lesson5SolutionCode = `function run(input) {
  const bytes = createCounterStateBytes(input.authority, input.bump, input.startCount);
  const next = applyIncrement(bytes);
  const after = decodeCounterState(next);
  return JSON.stringify({ count: after.count, bump: after.bump, authority: after.authority });
}

function createCounterStateBytes(authority, bump, count) {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("count must be a non-negative integer");
  }
  if (!Number.isInteger(bump) || bump < 0 || bump > 255) {
    throw new Error("bump must be in range 0-255");
  }

  const authorityBytes = authority.split("").map((ch) => ch.charCodeAt(0));
  return {
    authority: authorityBytes,
    bump,
    count,
  };
}

function decodeCounterState(bytes) {
  return {
    authority: String.fromCharCode(...bytes.authority),
    count: bytes.count,
    bump: bytes.bump,
  };
}

function applyIncrement(bytes) {
  if (bytes.count >= 4294967295) {
    throw new Error("Counter overflow");
  }
  return {
    authority: bytes.authority.slice(),
    bump: bytes.bump,
    count: bytes.count + 1,
  };
}
`;

export const lesson5Hints: string[] = [
  "Represent state as a pure JS structure so increment can be deterministic in tests.",
  "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
  "For this challenge, overflow should throw \"Counter overflow\" when count is 4294967295.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "increment adds one",
    input: JSON.stringify({ authority: "AuthX", bump: 7, startCount: 41 }),
    expectedOutput: '{"count":42,"bump":7,"authority":"AuthX"}',
  },
  {
    name: "overflow throws deterministic error",
    input: JSON.stringify({ authority: "AuthX", bump: 7, startCount: 4294967295 }),
    expectedOutput: "Error: Counter overflow",
  },
];
