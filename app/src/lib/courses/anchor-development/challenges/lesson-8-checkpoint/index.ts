import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const derived = deriveCounterPda(input.programId, input.authority);
  const initIx = buildInitCounterIx(input.programId, input.authority, derived);
  const incrementIx = buildIncrementIx(input.programId, input.authority, derived);
  const finalCount = emulateCounterFlow(0, 2);

  return JSON.stringify({
    authority: input.authority,
    pda: derived.pda,
    initIxProgramId: initIx.programId,
    initKeys: initIx.keys,
    incrementKeys: incrementIx.keys,
    finalCount,
  });
}

function deriveCounterPda(programId, authority) {
  return { pda: "", bump: 0 };
}

function buildInitCounterIx(programId, authority, derived) {
  return { programId, keys: [], data: [] };
}

function buildIncrementIx(programId, authority, derived) {
  return { programId, keys: [], data: [] };
}

function emulateCounterFlow(start, increments) {
  return start;
}
`;

export const lesson8SolutionCode = `function run(input) {
  const derived = deriveCounterPda(input.programId, input.authority);
  const initIx = buildInitCounterIx(input.programId, input.authority, derived);
  const incrementIx = buildIncrementIx(input.programId, input.authority, derived);
  const finalCount = emulateCounterFlow(0, 2);

  return JSON.stringify({
    authority: input.authority,
    pda: derived.pda,
    initIxProgramId: initIx.programId,
    initKeys: initIx.keys,
    incrementKeys: incrementIx.keys,
    finalCount,
  });
}

function deriveCounterPda(programId, authority) {
  const seed = programId + ":" + authority + ":counter";
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 131 + seed.charCodeAt(i)) % 1000000007;
  }
  return {
    pda:
      "pda_" +
      programId.slice(0, 8) +
      "_" +
      authority.slice(0, 8) +
      "_" +
      hash.toString(16),
    bump: hash % 256,
  };
}

function buildInitCounterIx(programId, authority, derived) {
  return {
    programId,
    keys: [
      { pubkey: derived.pda, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false },
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: "11111111111111111111111111111111", isSigner: false, isWritable: false },
    ],
    data: [73, 78, 73, 84, 95, 67, 84, 82, derived.bump],
  };
}

function buildIncrementIx(programId, authority, derived) {
  return {
    programId,
    keys: [
      { pubkey: derived.pda, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false },
    ],
    data: [73, 78, 67, 95, 67, 84, 82, 49],
  };
}

function emulateCounterFlow(start, increments) {
  let count = start;
  for (let i = 0; i < increments; i += 1) {
    count += 1;
  }
  return count;
}
`;

export const lesson8Hints: string[] = [
  "Compose the checkpoint from deterministic helper functions to keep output stable.",
  "Use fixed key order and fixed JSON key order to satisfy strict expected output matching.",
  "The emulator sequence for this checkpoint is init -> increment -> increment, so finalCount should be 2.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "checkpoint summary is deterministic",
    input: JSON.stringify({
      programId: "Prog1111111111111111111111111111111111111",
      authority: "Auth1111111111111111111111111111111111111",
    }),
    expectedOutput:
      '{"authority":"Auth1111111111111111111111111111111111111","pda":"pda_Prog1111_Auth1111_283def7","initIxProgramId":"Prog1111111111111111111111111111111111111","initKeys":[{"pubkey":"pda_Prog1111_Auth1111_283def7","isSigner":false,"isWritable":true},{"pubkey":"Auth1111111111111111111111111111111111111","isSigner":true,"isWritable":false},{"pubkey":"Auth1111111111111111111111111111111111111","isSigner":true,"isWritable":true},{"pubkey":"11111111111111111111111111111111","isSigner":false,"isWritable":false}],"incrementKeys":[{"pubkey":"pda_Prog1111_Auth1111_283def7","isSigner":false,"isWritable":true},{"pubkey":"Auth1111111111111111111111111111111111111","isSigner":true,"isWritable":false}],"finalCount":2}',
  },
];
