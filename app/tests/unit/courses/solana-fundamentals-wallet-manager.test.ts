import { describe, expect, it } from "vitest";
import { PublicKey, SystemInstruction, SystemProgram } from "@solana/web3.js";
import {
  buildTransferTx,
  parseArgs,
  walletManagerCli,
} from "@/lib/courses/solana-fundamentals/project/walletManager";

describe("Solana Fundamentals Lesson 4 - buildTransferTx", () => {
  it("creates exactly one transfer instruction", () => {
    const from = "11111111111111111111111111111111";
    const to = "Stake11111111111111111111111111111111111111";
    const blockhash = "ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVWX";

    const tx = buildTransferTx({
      fromPubkey: from,
      toPubkey: to,
      amountSol: 0.5,
      recentBlockhash: blockhash,
      feePayer: from,
    });

    expect(tx.instructions).toHaveLength(1);
    expect(tx.instructions[0].programId.toBase58()).toBe(SystemProgram.programId.toBase58());
  });

  it("sets signer/writable keys, lamports, feePayer and recentBlockhash correctly", () => {
    const from = new PublicKey("11111111111111111111111111111111");
    const to = new PublicKey("Stake11111111111111111111111111111111111111");
    const recentBlockhash = "recent-blockhash-123";

    const tx = buildTransferTx({
      fromPubkey: from.toBase58(),
      toPubkey: to.toBase58(),
      amountSol: 0.25,
      recentBlockhash,
      feePayer: from.toBase58(),
    });

    expect(tx.feePayer?.toBase58()).toBe(from.toBase58());
    expect(tx.recentBlockhash).toBe(recentBlockhash);

    const instruction = tx.instructions[0];
    expect(instruction.keys[0].pubkey.toBase58()).toBe(from.toBase58());
    expect(instruction.keys[0].isSigner).toBe(true);
    expect(instruction.keys[0].isWritable).toBe(true);
    expect(instruction.keys[1].pubkey.toBase58()).toBe(to.toBase58());
    expect(instruction.keys[1].isWritable).toBe(true);

    const decoded = SystemInstruction.decodeTransfer(instruction);
    expect(decoded.lamports).toBe(BigInt(250_000_000));
  });
});

describe("Solana Fundamentals Lesson 8 - Wallet Manager CLI sim", () => {
  it("parseArgs handles address and build-transfer forms", () => {
    expect(parseArgs(["address"])).toEqual({ command: "address" });

    expect(
      parseArgs(["build-transfer", "--to", "abc", "--sol", "0.1", "--blockhash", "bh"])
    ).toEqual({
      command: "build-transfer",
      to: "abc",
      sol: "0.1",
      blockhash: "bh",
    });
  });

  it("build-transfer prints stable JSON output with SOL->lamports conversion", () => {
    const output = walletManagerCli({
      argv: [
        "build-transfer",
        "--to",
        "Stake11111111111111111111111111111111111111",
        "--sol",
        "0.125",
        "--blockhash",
        "stable-blockhash",
      ],
      fromPubkey: "11111111111111111111111111111111",
    });

    expect(output).toBe(
      '{"from":"11111111111111111111111111111111","to":"Stake11111111111111111111111111111111111111","lamports":125000000,"feePayer":"11111111111111111111111111111111","recentBlockhash":"stable-blockhash","instructionProgramId":"11111111111111111111111111111111"}'
    );
  });
});
