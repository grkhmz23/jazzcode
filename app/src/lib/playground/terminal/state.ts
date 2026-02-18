/**
 * Terminal state management with history persistence
 * Provides deterministic session seeds for reproducible outputs
 */

import { TerminalState, TerminalOutputLine } from "@/lib/playground/terminal/commands";
import { createInitialTerminalState } from "@/lib/playground/terminal/engine";

const TERMINAL_STATE_KEY = "playground-terminal-state";

export interface TerminalSession {
  /** Unique session seed for deterministic outputs */
  seed: string;
  /** When the session started */
  startedAt: number;
  /** Command history (persisted) */
  commandHistory: string[];
  /** Last N outputs (for scrollback, not fully persisted) */
  recentOutputs: TerminalOutputLine[];
}

export interface PersistedTerminalState {
  seed: string;
  startedAt: number;
  commandHistory: string[];
  cwd: string;
  env: Record<string, string>;
  solanaUrl: "devnet";
  keypairs: Record<string, { path: string; secretKey: number[]; publicKey: string }>;
  activeKeypairPath: string | null;
  knownAddresses: string[];
  simulatedBalances: Record<string, number>;
  tokenMints: Record<string, {
    symbol: string;
    decimals: number;
    supply: number;
    balances: Record<string, number>;
  }>;
}

/** Generate a deterministic seed from timestamp and random component */
export function generateSessionSeed(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}`;
}

/** Create initial session with optional seed for reproducibility */
export function createTerminalSession(seed?: string): TerminalSession {
  return {
    seed: seed ?? generateSessionSeed(),
    startedAt: Date.now(),
    commandHistory: [],
    recentOutputs: [],
  };
}

/** Persist terminal state to localStorage */
export function persistTerminalState(state: TerminalState, seed: string): void {
  if (typeof window === "undefined") return;

  try {
    const persisted: PersistedTerminalState = {
      seed,
      startedAt: Date.now(),
      commandHistory: state.commandHistory.slice(-100), // Last 100 commands
      cwd: state.cwd,
      env: state.env,
      solanaUrl: state.solanaUrl,
      keypairs: state.keypairs,
      activeKeypairPath: state.activeKeypairPath,
      knownAddresses: state.knownAddresses,
      simulatedBalances: state.simulatedBalances,
      tokenMints: state.tokenMints,
    };

    localStorage.setItem(TERMINAL_STATE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

/** Load terminal state from localStorage */
export function loadTerminalState(): { state: TerminalState; seed: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(TERMINAL_STATE_KEY);
    if (!stored) return null;

    const persisted: PersistedTerminalState = JSON.parse(stored);

    // Reconstruct terminal state
    const state: TerminalState = {
      ...createInitialTerminalState(),
      cwd: persisted.cwd,
      env: persisted.env,
      solanaUrl: persisted.solanaUrl,
      keypairs: persisted.keypairs,
      activeKeypairPath: persisted.activeKeypairPath,
      knownAddresses: persisted.knownAddresses,
      simulatedBalances: persisted.simulatedBalances,
      tokenMints: persisted.tokenMints,
      commandHistory: persisted.commandHistory,
    };

    return { state, seed: persisted.seed };
  } catch {
    return null;
  }
}

/** Clear persisted terminal state */
export function clearTerminalState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TERMINAL_STATE_KEY);
}

/** Deterministic random number generator for seeded sessions */
export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 4294967296;
  };
}

/** Generate deterministic signature based on session seed and inputs */
export function generateDeterministicSignature(
  sessionSeed: string,
  inputs: string[],
  counter: number
): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const seed = `${sessionSeed}:${inputs.join(":")}:${counter}`;
  const rand = seededRandom(seed);

  let output = "";
  for (let i = 0; i < 88; i++) {
    output += chars[Math.floor(rand() * chars.length)];
  }
  return output;
}

/** Generate deterministic public key */
export function generateDeterministicPublicKey(sessionSeed: string, index: number): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const seed = `${sessionSeed}:keypair:${index}`;
  const rand = seededRandom(seed);

  let output = "";
  for (let i = 0; i < 44; i++) {
    output += chars[Math.floor(rand() * chars.length)];
  }
  return output;
}

/** Generate deterministic blockhash */
export function generateDeterministicBlockhash(sessionSeed: string, slot: number): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const seed = `${sessionSeed}:blockhash:${slot}`;
  const rand = seededRandom(seed);

  let output = "";
  for (let i = 0; i < 87; i++) {
    output += chars[Math.floor(rand() * chars.length)];
  }
  return output;
}

/** Session-aware balance calculation */
export function calculateSimulatedBalance(
  sessionSeed: string,
  address: string,
  baseBalance: number,
  transactionCount: number
): number {
  // Deterministic "market fluctuation" based on session and tx count
  const seed = `${sessionSeed}:balance:${address}:${transactionCount}`;
  const rand = seededRandom(seed);
  const fluctuation = (rand() - 0.5) * 0.001; // ±0.05%
  return Math.max(0, baseBalance * (1 + fluctuation));
}
