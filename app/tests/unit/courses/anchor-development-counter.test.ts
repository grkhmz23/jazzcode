import { describe, expect, it } from "vitest";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  applyIncrementSequence,
  applyIncrementToState,
  buildIncrementIx,
  buildInitCounterIx,
  decodeCounterState,
  deriveCounterPda,
  encodeCounterState,
  initializeCounterState,
  runCounterProjectCheckpointJson,
} from "@/lib/courses/anchor-development/project/counter";

describe("Anchor Development V2 counter project helpers", () => {
  const programId = "BPFLoaderUpgradeab1e11111111111111111111111";
  const authority = "11111111111111111111111111111111";

  it("derives stable PDA and bump using Solana PDA rules", () => {
    const derived = deriveCounterPda(programId, authority);
    const [expectedPda, expectedBump] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode("counter"), new PublicKey(authority).toBytes()],
      new PublicKey(programId),
    );

    expect(derived.pda).toBe(expectedPda.toBase58());
    expect(derived.bump).toBe(expectedBump);
  });

  it("buildInitCounterIx returns deterministic keys and data", () => {
    const ix = buildInitCounterIx({
      programId,
      authorityPubkey: authority,
      payerPubkey: authority,
    });

    expect(ix.programId).toBe(programId);
    expect(ix.keys).toHaveLength(4);
    expect(ix.keys[0].isWritable).toBe(true);
    expect(ix.keys[1]).toEqual({
      pubkey: authority,
      isSigner: true,
      isWritable: false,
    });
    expect(ix.keys[2]).toEqual({
      pubkey: authority,
      isSigner: true,
      isWritable: true,
    });
    expect(ix.keys[3].pubkey).toBe(SystemProgram.programId.toBase58());
    expect(ix.data.length).toBe(9);
  });

  it("increment emulator applies +1 and errors on overflow", () => {
    const initialized = initializeCounterState({
      authorityPubkey: authority,
      bump: 123,
    });
    const incremented = applyIncrementToState(initialized);
    const decoded = decodeCounterState(incremented);
    expect(decoded.count).toBe(BigInt(1));

    const overflowState = encodeCounterState({
      authority,
      count: (BigInt(1) << BigInt(64)) - BigInt(1),
      bump: 9,
    });

    expect(() => applyIncrementToState(overflowState)).toThrow("Counter overflow");
  });

  it("project checkpoint summary JSON has stable key order and final count", () => {
    const json = runCounterProjectCheckpointJson({
      programId,
      authorityPubkey: authority,
    });

    const parsed = JSON.parse(json) as {
      authority: string;
      pda: string;
      initIxProgramId: string;
      initKeys: Array<{ pubkey: string; isSigner: boolean; isWritable: boolean }>;
      incrementKeys: Array<{ pubkey: string; isSigner: boolean; isWritable: boolean }>;
      finalCount: number;
    };

    expect(Object.keys(parsed)).toEqual([
      "authority",
      "pda",
      "initIxProgramId",
      "initKeys",
      "incrementKeys",
      "finalCount",
    ]);
    expect(parsed.finalCount).toBe(2);
    expect(parsed.initIxProgramId).toBe(programId);
    expect(parsed.initKeys).toHaveLength(4);

    const incIx = buildIncrementIx({ programId, authorityPubkey: authority });
    expect(parsed.incrementKeys).toEqual(incIx.keys);

    const state = initializeCounterState({
      authorityPubkey: authority,
      bump: deriveCounterPda(programId, authority).bump,
    });
    const twice = applyIncrementSequence(state, 2);
    expect(decodeCounterState(twice).count).toBe(BigInt(2));
  });
});
