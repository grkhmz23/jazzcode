import { PublicKey } from "@solana/web3.js";
import type { SplTransferBuilderInput, TransactionPlan } from "../types";

const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function toPubkey(value: string, field: string): string {
  try {
    return new PublicKey(value).toBase58();
  } catch {
    throw new Error(`Invalid ${field}: ${value}`);
  }
}

function encodeU64LE(value: bigint): number[] {
  if (value < BigInt(0) || value > U64_MAX) {
    throw new Error("Amount exceeds u64");
  }

  const bytes: number[] = [];
  let n = value;
  for (let index = 0; index < 8; index += 1) {
    bytes.push(Number(n & BigInt(0xff)));
    n >>= BigInt(8);
  }
  return bytes;
}

export function buildSplTransferPlan(input: SplTransferBuilderInput): TransactionPlan {
  const sourceAta = toPubkey(input.sourceAta, "sourceAta");
  const destinationAta = toPubkey(input.destinationAta, "destinationAta");
  const owner = toPubkey(input.owner, "owner");
  const mint = toPubkey(input.mint, "mint");
  const feePayer = toPubkey(input.feePayer ?? input.owner, "feePayer");

  if (!/^\d+$/.test(input.amountRaw)) {
    throw new Error(`Invalid amountRaw: ${input.amountRaw}`);
  }

  const amount = BigInt(input.amountRaw);
  if (amount < BigInt(0)) {
    throw new Error("Negative token amounts are not allowed");
  }
  if (amount > U64_MAX) {
    throw new Error("Amount exceeds u64");
  }

  if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 255) {
    throw new Error(`Invalid decimals: ${input.decimals}`);
  }

  if (
    typeof input.expectedDecimals === "number" &&
    input.expectedDecimals !== input.decimals
  ) {
    throw new Error(
      `Decimals mismatch: expected ${input.expectedDecimals}, got ${input.decimals}`,
    );
  }

  const transferCheckedInstructionData = [
    12,
    ...encodeU64LE(amount),
    input.decimals,
  ];

  return {
    feePayer,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: TOKEN_PROGRAM_ID,
        keys: [
          { pubkey: sourceAta, isSigner: false, isWritable: true },
          { pubkey: mint, isSigner: false, isWritable: false },
          { pubkey: destinationAta, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: false },
        ],
        dataBase64: Buffer.from(transferCheckedInstructionData).toString("base64"),
      },
    ],
  };
}
