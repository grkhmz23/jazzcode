import bs58 from "bs58";
import { ChainState } from "@/lib/devlab/types";

function toBase58(bytes: Uint8Array): string {
  return bs58.encode(bytes);
}

function lcg(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function seededBytes(seed: number, length: number): Uint8Array {
  const rand = lcg(seed);
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    out[i] = Math.floor(rand() * 256);
  }
  return out;
}

export function generateAddress(seed: number): string {
  // 32-byte key gives realistic 32-44 char base58 pubkeys.
  return toBase58(seededBytes(seed, 32));
}

export function generateSignature(seed: number): string {
  // 64-byte signature gives realistic 87-88 char base58 signatures.
  return toBase58(seededBytes(seed, 64));
}

export function createInitialState(): ChainState {
  return {
    config: {
      rpcUrl: "https://api.devnet.solana.com",
      websocketUrl: "wss://api.devnet.solana.com/",
      keypairPath: "~/.config/solana/id.json",
      commitment: "confirmed",
    },
    wallets: {},
    defaultWallet: null,
    tokens: {},
    tokenAccounts: {},
    programs: {},
    transactions: [],
    currentDir: "/my-solana-project",
    lastBuildSucceeded: false,
  };
}

export function upsertWallet(state: ChainState, wallet: { pubkey: string; balance?: number; keypairPath?: string }): ChainState {
  const existing = state.wallets[wallet.pubkey];
  return {
    ...state,
    wallets: {
      ...state.wallets,
      [wallet.pubkey]: {
        pubkey: wallet.pubkey,
        balance: wallet.balance ?? existing?.balance ?? 0,
        keypairPath: wallet.keypairPath ?? existing?.keypairPath,
      },
    },
    defaultWallet: state.defaultWallet ?? wallet.pubkey,
  };
}

export function updateWalletBalance(state: ChainState, pubkey: string, amountDelta: number): ChainState {
  const wallet = state.wallets[pubkey] ?? { pubkey, balance: 0 };
  return {
    ...state,
    wallets: {
      ...state.wallets,
      [pubkey]: {
        ...wallet,
        balance: Math.max(0, Number((wallet.balance + amountDelta).toFixed(9))),
      },
    },
  };
}

export function setConfig(state: ChainState, key: keyof ChainState["config"], value: string): ChainState {
  if (key === "commitment" && value !== "processed" && value !== "confirmed" && value !== "finalized") {
    return state;
  }
  return {
    ...state,
    config: {
      ...state.config,
      [key]: value,
    },
  };
}

export function recordTransaction(state: ChainState, signature: string, description: string): ChainState {
  return {
    ...state,
    transactions: [{ signature, description, timestamp: Date.now() }, ...state.transactions],
  };
}

export function deployProgram(state: ChainState, programId: string): ChainState {
  return {
    ...state,
    programs: {
      ...state.programs,
      [programId]: {
        programId,
        deployedAt: Date.now(),
        authority: state.defaultWallet ?? "unknown",
      },
    },
  };
}

export function setCurrentDir(state: ChainState, nextDir: string): ChainState {
  return { ...state, currentDir: nextDir };
}

export function setBuildStatus(state: ChainState, ok: boolean): ChainState {
  return { ...state, lastBuildSucceeded: ok };
}
