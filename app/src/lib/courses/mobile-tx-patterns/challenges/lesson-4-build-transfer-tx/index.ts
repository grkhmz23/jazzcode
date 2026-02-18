import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(buildTransferTx(JSON.parse(input)));
}

function buildTransferTx(params) {
  // Build a mobile-optimized transfer transaction
  // params: { sender, recipient, lamports, memo, feePayer? }
  // Return: { instructions, feePayer, estimatedFee, hasMemo }
  return { instructions: [], feePayer: "", estimatedFee: 0, hasMemo: false };
}
`;

export const lesson4SolutionCode = `function run(input) {
  return JSON.stringify(buildTransferTx(JSON.parse(input)));
}

function buildTransferTx(params) {
  const { sender, recipient, lamports, memo, feePayer } = params;
  const instructions = [];

  // System Program Transfer instruction
  instructions.push({
    programId: "11111111111111111111111111111111",
    keys: [
      { pubkey: sender, isSigner: true, isWritable: true },
      { pubkey: recipient, isSigner: false, isWritable: true },
    ],
    data: "transfer:" + lamports,
  });

  // Add memo instruction if memo is provided and non-empty
  const hasMemo = typeof memo === "string" && memo.trim().length > 0;
  if (hasMemo) {
    instructions.push({
      programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
      keys: [
        { pubkey: sender, isSigner: true, isWritable: false },
      ],
      data: memo.trim(),
    });
  }

  // Fee payer defaults to sender if not specified
  const resolvedFeePayer = feePayer && feePayer.trim().length > 0 ? feePayer : sender;

  // Deterministic fee estimation:
  // Base fee: 5000 lamports per signature
  // Each instruction adds 200 compute units worth of fee
  const baseFee = 5000;
  const perInstructionFee = 200;
  const estimatedFee = baseFee + instructions.length * perInstructionFee;

  return {
    instructions,
    feePayer: resolvedFeePayer,
    estimatedFee,
    hasMemo,
  };
}
`;

export const lesson4Hints: string[] = [
  "Use System Program ID 11111111111111111111111111111111 for SOL transfers",
  "Use Memo Program ID MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr for memos",
  "Fee payer defaults to sender when not provided",
  "Estimate fees deterministically: 5000 base + 200 per instruction",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "builds basic transfer without memo",
    input: JSON.stringify({
      sender: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      recipient: "RecipientBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      lamports: 1000000,
      memo: "",
    }),
    expectedOutput: JSON.stringify({
      instructions: [
        {
          programId: "11111111111111111111111111111111",
          keys: [
            { pubkey: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", isSigner: true, isWritable: true },
            { pubkey: "RecipientBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", isSigner: false, isWritable: true },
          ],
          data: "transfer:1000000",
        },
      ],
      feePayer: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      estimatedFee: 5200,
      hasMemo: false,
    }),
  },
  {
    name: "builds transfer with memo and fee payer delegation",
    input: JSON.stringify({
      sender: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      recipient: "RecipientBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      lamports: 5000000,
      memo: "coffee payment",
      feePayer: "RelayerCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    }),
    expectedOutput: JSON.stringify({
      instructions: [
        {
          programId: "11111111111111111111111111111111",
          keys: [
            { pubkey: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", isSigner: true, isWritable: true },
            { pubkey: "RecipientBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", isSigner: false, isWritable: true },
          ],
          data: "transfer:5000000",
        },
        {
          programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
          keys: [
            { pubkey: "SenderAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", isSigner: true, isWritable: false },
          ],
          data: "coffee payment",
        },
      ],
      feePayer: "RelayerCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
      estimatedFee: 5400,
      hasMemo: true,
    }),
  },
  {
    name: "builds transfer with memo and sender as fee payer",
    input: JSON.stringify({
      sender: "UserDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      recipient: "ShopEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
      lamports: 250000,
      memo: "tip",
    }),
    expectedOutput: JSON.stringify({
      instructions: [
        {
          programId: "11111111111111111111111111111111",
          keys: [
            { pubkey: "UserDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", isSigner: true, isWritable: true },
            { pubkey: "ShopEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", isSigner: false, isWritable: true },
          ],
          data: "transfer:250000",
        },
        {
          programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
          keys: [
            { pubkey: "UserDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", isSigner: true, isWritable: false },
          ],
          data: "tip",
        },
      ],
      feePayer: "UserDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      estimatedFee: 5400,
      hasMemo: true,
    }),
  },
];
