import { PublicKey, SystemProgram } from "@solana/web3.js";
import type { SolTransferBuilderInput, TransactionPlan } from "../types";

const LAMPORTS_PER_SOL = 1_000_000_000;

function toPubkey(value: string, field: string): string {
  try {
    return new PublicKey(value).toBase58();
  } catch {
    throw new Error(`Invalid ${field}: ${value}`);
  }
}

function encodeU64LE(value: bigint): number[] {
  if (value < BigInt(0) || value > (BigInt(1) << BigInt(64)) - BigInt(1)) {
    throw new Error("Amount does not fit in u64");
  }

  const bytes: number[] = [];
  let n = value;
  for (let index = 0; index < 8; index += 1) {
    bytes.push(Number(n & BigInt(0xff)));
    n >>= BigInt(8);
  }
  return bytes;
}

export function buildSolTransferPlan(input: SolTransferBuilderInput): TransactionPlan {
  const from = toPubkey(input.from, "from");
  const to = toPubkey(input.to, "to");
  const feePayer = toPubkey(input.feePayer ?? input.from, "feePayer");

  if (!Number.isFinite(input.amountSol) || input.amountSol <= 0) {
    throw new Error(`Invalid SOL amount: ${input.amountSol}`);
  }

  const lamports = BigInt(Math.round(input.amountSol * LAMPORTS_PER_SOL));
  if (lamports <= BigInt(0)) {
    throw new Error("Lamports must be positive");
  }

  const instructionData = [2, 0, 0, 0, ...encodeU64LE(lamports)];

  return {
    feePayer,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: SystemProgram.programId.toBase58(),
        keys: [
          { pubkey: from, isSigner: true, isWritable: true },
          { pubkey: to, isSigner: false, isWritable: true },
        ],
        dataBase64: Buffer.from(instructionData).toString("base64"),
      },
    ],
  };
}
