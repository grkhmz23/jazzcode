import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = deriveCounterPda(input.programId, input.authorityPubkey);
  const instruction = buildInitCounterIx({
    programId: input.programId,
    authorityPubkey: input.authorityPubkey,
    payerPubkey: input.payerPubkey,
  });

  return JSON.stringify({
    pda: result.pda,
    bump: result.bump,
    programId: instruction.programId,
    keyFlags: instruction.keys.map((k) => [k.isSigner, k.isWritable]),
    data: instruction.data,
  });
}

function deriveCounterPda(programId, authorityPubkey) {
  return { pda: "", bump: 0 };
}

function buildInitCounterIx(params) {
  return {
    programId: params.programId,
    keys: [],
    data: [],
  };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = deriveCounterPda(input.programId, input.authorityPubkey);
  const instruction = buildInitCounterIx({
    programId: input.programId,
    authorityPubkey: input.authorityPubkey,
    payerPubkey: input.payerPubkey,
  });

  return JSON.stringify({
    pda: result.pda,
    bump: result.bump,
    programId: instruction.programId,
    keyFlags: instruction.keys.map((k) => [k.isSigner, k.isWritable]),
    data: instruction.data,
  });
}

function deriveCounterPda(programId, authorityPubkey) {
  const seed = programId + ":" + authorityPubkey + ":counter";
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 131 + seed.charCodeAt(i)) % 1000000007;
  }
  const bump = hash % 256;
  const pda =
    "pda_" +
    programId.slice(0, 8) +
    "_" +
    authorityPubkey.slice(0, 8) +
    "_" +
    hash.toString(16);
  return { pda, bump };
}

function buildInitCounterIx(params) {
  const derived = deriveCounterPda(params.programId, params.authorityPubkey);
  const payer = params.payerPubkey || params.authorityPubkey;
  return {
    programId: params.programId,
    keys: [
      { pubkey: derived.pda, isSigner: false, isWritable: true },
      { pubkey: params.authorityPubkey, isSigner: true, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: "11111111111111111111111111111111", isSigner: false, isWritable: false },
    ],
    data: [73, 78, 73, 84, 95, 67, 84, 82, derived.bump],
  };
}
`;

export const lesson4Hints: string[] = [
  "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
  "The init instruction must include four keys in fixed order: counter PDA, authority, payer, system program.",
  "Encode instruction data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "stable pda derivation + init instruction shape",
    input: JSON.stringify({
      programId: "Prog1111111111111111111111111111111111111",
      authorityPubkey: "Auth1111111111111111111111111111111111111",
      payerPubkey: "Payr1111111111111111111111111111111111111",
    }),
    expectedOutput:
      '{"pda":"pda_Prog1111_Auth1111_283def7","bump":247,"programId":"Prog1111111111111111111111111111111111111","keyFlags":[[false,true],[true,false],[true,true],[false,false]],"data":[73,78,73,84,95,67,84,82,247]}',
  },
];
