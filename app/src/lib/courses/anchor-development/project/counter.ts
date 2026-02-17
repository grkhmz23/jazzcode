import { PublicKey, SystemProgram } from "@solana/web3.js";
import { COUNTER_IDL } from "./idl";

const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

export interface DerivedCounterPda {
  pda: string;
  bump: number;
}

export interface CounterInstructionKey {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
}

export interface CounterInstruction {
  programId: string;
  keys: CounterInstructionKey[];
  data: number[];
}

export interface BuildCounterInstructionParams {
  programId: string;
  authorityPubkey: string;
  payerPubkey?: string;
}

export interface CounterState {
  authority: string;
  count: bigint;
  bump: number;
}

export interface CounterCheckpointSummary {
  authority: string;
  pda: string;
  initIxProgramId: string;
  initKeys: CounterInstructionKey[];
  incrementKeys: CounterInstructionKey[];
  finalCount: number;
}

function toPublicKey(value: string, fieldName: string): PublicKey {
  try {
    return new PublicKey(value);
  } catch {
    throw new Error(`Invalid ${fieldName}: ${value}`);
  }
}

function discriminatorBytes(discriminator: readonly number[]): number[] {
  return Array.from(discriminator);
}

function encodeU64(value: bigint): number[] {
  if (value < BigInt(0) || value > U64_MAX) {
    throw new Error("u64 value out of range");
  }

  const out: number[] = [];
  let remaining = value;
  for (let index = 0; index < 8; index += 1) {
    out.push(Number(remaining & BigInt(0xff)));
    remaining >>= BigInt(8);
  }
  return out;
}

function decodeU64(bytes: Uint8Array): bigint {
  if (bytes.length !== 8) {
    throw new Error("u64 byte length must be exactly 8");
  }

  let value = BigInt(0);
  for (let index = 0; index < 8; index += 1) {
    value |= BigInt(bytes[index]) << BigInt(index * 8);
  }
  return value;
}

function buildCounterAccountKeys(params: BuildCounterInstructionParams): {
  authority: PublicKey;
  payer: PublicKey;
  pda: PublicKey;
  bump: number;
} {
  const programId = toPublicKey(params.programId, "programId");
  const authority = toPublicKey(params.authorityPubkey, "authorityPubkey");
  const payer = toPublicKey(params.payerPubkey ?? params.authorityPubkey, "payerPubkey");
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("counter"), authority.toBytes()],
    programId,
  );

  return { authority, payer, pda, bump };
}

export function deriveCounterPda(programId: string, authorityPubkey: string): DerivedCounterPda {
  const { pda, bump } = buildCounterAccountKeys({
    programId,
    authorityPubkey,
  });

  return {
    pda: pda.toBase58(),
    bump,
  };
}

export function buildInitCounterIx(params: BuildCounterInstructionParams): CounterInstruction {
  const programId = toPublicKey(params.programId, "programId");
  const { authority, payer, pda, bump } = buildCounterAccountKeys(params);

  return {
    programId: programId.toBase58(),
    keys: [
      { pubkey: pda.toBase58(), isSigner: false, isWritable: true },
      { pubkey: authority.toBase58(), isSigner: true, isWritable: false },
      { pubkey: payer.toBase58(), isSigner: true, isWritable: true },
      {
        pubkey: SystemProgram.programId.toBase58(),
        isSigner: false,
        isWritable: false,
      },
    ],
    data: [
      ...discriminatorBytes(COUNTER_IDL.instructions.initializeCounter.discriminator),
      bump,
    ],
  };
}

export function buildIncrementIx(params: BuildCounterInstructionParams): CounterInstruction {
  const programId = toPublicKey(params.programId, "programId");
  const { authority, pda } = buildCounterAccountKeys(params);

  return {
    programId: programId.toBase58(),
    keys: [
      { pubkey: pda.toBase58(), isSigner: false, isWritable: true },
      { pubkey: authority.toBase58(), isSigner: true, isWritable: false },
    ],
    data: discriminatorBytes(COUNTER_IDL.instructions.incrementCounter.discriminator),
  };
}

export function encodeCounterState(state: CounterState): Uint8Array {
  const authority = toPublicKey(state.authority, "state.authority");
  const layout = COUNTER_IDL.accounts.counter;
  const bytes = new Uint8Array(layout.totalSpan);

  bytes.set(layout.discriminator, 0);
  bytes.set(authority.toBytes(), layout.authorityOffset);
  bytes.set(encodeU64(state.count), layout.countOffset);
  bytes[layout.bumpOffset] = state.bump;

  return bytes;
}

export function decodeCounterState(stateBytes: Uint8Array): CounterState {
  const layout = COUNTER_IDL.accounts.counter;
  if (stateBytes.length !== layout.totalSpan) {
    throw new Error(`Invalid counter state length: ${stateBytes.length}`);
  }

  const discriminator = Array.from(stateBytes.slice(0, 8));
  const expected = Array.from(layout.discriminator);
  const isDiscriminatorMatch = discriminator.every((value, index) => value === expected[index]);
  if (!isDiscriminatorMatch) {
    throw new Error("Invalid counter account discriminator");
  }

  return {
    authority: new PublicKey(stateBytes.slice(layout.authorityOffset, layout.countOffset)).toBase58(),
    count: decodeU64(stateBytes.slice(layout.countOffset, layout.bumpOffset)),
    bump: stateBytes[layout.bumpOffset],
  };
}

export function initializeCounterState(params: {
  authorityPubkey: string;
  bump: number;
}): Uint8Array {
  return encodeCounterState({
    authority: params.authorityPubkey,
    count: BigInt(0),
    bump: params.bump,
  });
}

export function applyIncrementToState(stateBytes: Uint8Array): Uint8Array {
  const decoded = decodeCounterState(stateBytes);
  if (decoded.count === U64_MAX) {
    throw new Error("Counter overflow: u64 max reached");
  }

  return encodeCounterState({
    ...decoded,
    count: decoded.count + BigInt(1),
  });
}

export function applyIncrementSequence(stateBytes: Uint8Array, times: number): Uint8Array {
  if (!Number.isInteger(times) || times < 0) {
    throw new Error(`Invalid increment count: ${times}`);
  }

  let current = stateBytes;
  for (let index = 0; index < times; index += 1) {
    current = applyIncrementToState(current);
  }
  return current;
}

export function runCounterProjectCheckpoint(params: {
  programId: string;
  authorityPubkey: string;
}): CounterCheckpointSummary {
  const derived = deriveCounterPda(params.programId, params.authorityPubkey);
  const initIx = buildInitCounterIx({
    programId: params.programId,
    authorityPubkey: params.authorityPubkey,
    payerPubkey: params.authorityPubkey,
  });
  const incrementIx = buildIncrementIx({
    programId: params.programId,
    authorityPubkey: params.authorityPubkey,
  });

  const initialized = initializeCounterState({
    authorityPubkey: params.authorityPubkey,
    bump: derived.bump,
  });
  const finalState = applyIncrementSequence(initialized, 2);
  const decoded = decodeCounterState(finalState);

  return {
    authority: params.authorityPubkey,
    pda: derived.pda,
    initIxProgramId: initIx.programId,
    initKeys: initIx.keys,
    incrementKeys: incrementIx.keys,
    finalCount: Number(decoded.count),
  };
}

export function runCounterProjectCheckpointJson(params: {
  programId: string;
  authorityPubkey: string;
}): string {
  const summary = runCounterProjectCheckpoint(params);

  return JSON.stringify({
    authority: summary.authority,
    pda: summary.pda,
    initIxProgramId: summary.initIxProgramId,
    initKeys: summary.initKeys,
    incrementKeys: summary.incrementKeys,
    finalCount: summary.finalCount,
  });
}
