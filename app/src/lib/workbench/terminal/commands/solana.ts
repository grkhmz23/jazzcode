/**
 * Solana CLI simulation commands for the Workbench terminal
 * Provides deterministic Solana blockchain simulation
 */

import { Keypair, PublicKey } from "@solana/web3.js";
import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";
import {
  createFileNode,
  findNode,
  insertNode,
  normalizeFSPath,
  resolvePath,
} from "@/lib/workbench/fs";
import { createTerminalError } from "../errors";

const LAMPORTS_PER_SOL = 1_000_000_000;



function errorResult(
  state: SimulationState,
  code: keyof typeof import("../errors").TERMINAL_ERRORS,
  customMessage?: string
): CommandExecutionResult {
  const error = createTerminalError(code, customMessage);
  return {
    nextState: {
      ...state,
      errors: [...state.errors, error].slice(-30),
    },
    lines: [
      { kind: "error", text: `Error: ${error.message}` },
      { kind: "system", text: `Hint: ${error.hint}` },
    ],
  };
}

function validatePublicKey(value: string): boolean {
  try {
    void new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

function deterministicSignature(seed: string): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  let output = "";
  for (let i = 0; i < 88; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    output += chars[hash % chars.length];
  }
  return output;
}

function getActiveAddress(state: SimulationState): string | null {
  // Return the first available keypair's public key
  const keypairs = Object.values(state.keypairs);
  if (keypairs.length > 0) {
    return keypairs[0].publicKey;
  }
  // Fall back to known addresses
  return state.knownAddresses[0] ?? null;
}

// ============================================================================
// Solana Config Commands
// ============================================================================

function handleSolanaConfig(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const subcommand = parsed.positional[1];

  if (subcommand === "set") {
    const url = parsed.flags["--url"];
    if (typeof url !== "string") {
      return errorResult(state, "MISSING_ARGUMENT", "Usage: solana config set --url <url>");
    }

    const validUrls = ["devnet", "mainnet-beta", "testnet", "localhost"];
    if (!validUrls.includes(url)) {
      return errorResult(state, "NETWORK_MISMATCH", `Invalid URL: ${url}. Use devnet, mainnet-beta, testnet, or localhost`);
    }

    return {
      nextState: {
        ...state,
        solanaUrl: url as SimulationState["solanaUrl"],
        commandSuccesses: [...state.commandSuccesses, "solana:config:set"],
      },
      lines: [
        { kind: "output", text: "Config File: ~/.config/solana/cli/config.yml" },
        { kind: "output", text: `RPC URL: https://api.${url}.solana.com` },
      ],
      metadata: { commandSucceeded: "solana config set" },
    };
  }

  if (subcommand === "get") {
    const keypairPath = state.activeKeypairPath ?? "(not set)";
    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "solana:config:get"],
      },
      lines: [
        { kind: "output", text: "Config File: ~/.config/solana/cli/config.yml" },
        { kind: "output", text: `RPC URL: https://api.${state.solanaUrl}.solana.com` },
        { kind: "output", text: `Keypair Path: ${keypairPath}` },
      ],
      metadata: { commandSucceeded: "solana config get" },
    };
  }

  return errorResult(state, "UNKNOWN_COMMAND", "Unknown config subcommand");
}

// ============================================================================
// Solana Address Commands
// ============================================================================

function handleSolanaAddress(state: SimulationState): CommandExecutionResult {
  const address = getActiveAddress(state);
  if (!address) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  return {
    nextState: {
      ...state,
      knownAddresses: Array.from(new Set([...state.knownAddresses, address])),
      commandSuccesses: [...state.commandSuccesses, "solana:address"],
    },
    lines: [{ kind: "output", text: address }],
    metadata: { commandSucceeded: "solana address" },
  };
}

// ============================================================================
// Solana Airdrop Commands
// ============================================================================

function handleSolanaAirdrop(parsed: ParsedCommand, state: SimulationState): CommandExecutionResult {
  const amountText = parsed.positional[1];
  const amount = Number(amountText);

  if (!amountText || Number.isNaN(amount) || amount <= 0) {
    return errorResult(state, "INVALID_AMOUNT", "Usage: solana airdrop <amount>");
  }

  const address = getActiveAddress(state);
  if (!address) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  const signature = deterministicSignature(`${address}:airdrop:${amount}:${Date.now()}`);
  const currentBalance = state.balances[address] ?? 0;

  return {
    nextState: {
      ...state,
      balances: {
        ...state.balances,
        [address]: currentBalance + amount,
      },
      recentTxSignatures: [signature, ...state.recentTxSignatures].slice(0, 10),
      commandSuccesses: [...state.commandSuccesses, "solana:airdrop"],
    },
    lines: [
      { kind: "output", text: `Requesting airdrop of ${amount} SOL` },
      { kind: "output", text: "" },
      { kind: "output", text: `Signature: ${signature}` },
      { kind: "output", text: "" },
      { kind: "system", text: `New balance: ${(currentBalance + amount).toFixed(9)} SOL` },
    ],
    metadata: { commandSucceeded: "solana airdrop" },
  };
}

// ============================================================================
// Solana Balance Commands
// ============================================================================

function handleSolanaBalance(state: SimulationState): CommandExecutionResult {
  const address = getActiveAddress(state);
  if (!address) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  const balance = state.balances[address] ?? 0;

  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, "solana:balance"],
    },
    lines: [{ kind: "output", text: `${balance.toFixed(9)} SOL` }],
    metadata: { commandSucceeded: "solana balance" },
  };
}

// ============================================================================
// Solana Transfer Commands
// ============================================================================

function handleSolanaTransfer(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const recipient = parsed.positional[1];
  const amountText = parsed.positional[2];
  const amount = Number(amountText);

  if (!recipient || !amountText) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: solana transfer <recipient> <amount>");
  }

  if (!validatePublicKey(recipient)) {
    return errorResult(state, "INVALID_PUBKEY");
  }

  if (Number.isNaN(amount) || amount <= 0) {
    return errorResult(state, "INVALID_AMOUNT");
  }

  const sender = getActiveAddress(state);
  if (!sender) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  const senderBalance = state.balances[sender] ?? 0;
  if (senderBalance < amount) {
    return errorResult(state, "INSUFFICIENT_FUNDS");
  }

  const signature = deterministicSignature(`${sender}:${recipient}:${amount}:${Date.now()}`);

  return {
    nextState: {
      ...state,
      balances: {
        ...state.balances,
        [sender]: Math.max(0, senderBalance - amount),
        [recipient]: (state.balances[recipient] ?? 0) + amount,
      },
      recentTxSignatures: [signature, ...state.recentTxSignatures].slice(0, 10),
      commandSuccesses: [...state.commandSuccesses, "solana:transfer"],
    },
    lines: [
      { kind: "output", text: `Transfer ${amount} SOL` },
      { kind: "output", text: `  From: ${sender}` },
      { kind: "output", text: `  To: ${recipient}` },
      { kind: "output", text: "" },
      { kind: "output", text: `Signature: ${signature}` },
    ],
    metadata: { commandSucceeded: "solana transfer" },
  };
}

// ============================================================================
// Solana Keygen Commands
// ============================================================================

export function handleSolanaKeygen(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const subcommand = parsed.positional[0];

  if (subcommand === "new") {
    const outfile = parsed.flags["--outfile"];
    if (typeof outfile !== "string" || !outfile) {
      return errorResult(state, "MISSING_ARGUMENT", "Usage: solana-keygen new --outfile <path>");
    }

    const resolvedPath = resolvePath(state.currentDir, outfile);
    const normalizedPath = normalizeFSPath(resolvedPath).replace(/^\//, "");

    // Check if file already exists
    if (findNode(fs, normalizedPath)) {
      return errorResult(state, "FILE_EXISTS", "Keypair file already exists");
    }

    // Generate deterministic keypair
    const keypair = Keypair.generate();
    const secretKey = Array.from(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();

    // Create the keypair file
    const content = JSON.stringify(secretKey, null, 2);
    const fileNode = createFileNode(normalizedPath, content);
    insertNode(fs, fileNode);

    return {
      nextState: {
        ...state,
        keypairs: {
          ...state.keypairs,
          [normalizedPath]: {
            path: normalizedPath,
            publicKey,
            secretKey,
          },
        },
        activeKeypairPath: normalizedPath,
        knownAddresses: Array.from(new Set([...state.knownAddresses, publicKey])),
        balances: {
          ...state.balances,
          [publicKey]: state.balances[publicKey] ?? 0,
        },
        commandSuccesses: [...state.commandSuccesses, "solana:keygen:new"],
      },
      lines: [
        { kind: "output", text: `Wrote new keypair to ${outfile}` },
        { kind: "output", text: `pubkey: ${publicKey}` },
      ],
      metadata: { commandSucceeded: "solana-keygen new" },
    };
  }

  if (subcommand === "pubkey") {
    const keypairPath = parsed.positional[1];
    if (!keypairPath) {
      return errorResult(state, "MISSING_ARGUMENT", "Usage: solana-keygen pubkey <keypair_file>");
    }

    const resolvedPath = resolvePath(state.currentDir, keypairPath);
    const normalizedPath = normalizeFSPath(resolvedPath).replace(/^\//, "");

    // Check registered keypairs first
    const registered = state.keypairs[normalizedPath];
    if (registered) {
      return {
        nextState: {
          ...state,
          activeKeypairPath: normalizedPath,
          commandSuccesses: [...state.commandSuccesses, "solana:keygen:pubkey"],
        },
        lines: [{ kind: "output", text: registered.publicKey }],
        metadata: { commandSucceeded: "solana-keygen pubkey" },
      };
    }

    // Try to read from file system
    const node = findNode(fs, normalizedPath);
    if (!node || node.type !== "file") {
      return errorResult(state, "FILE_NOT_FOUND", "Keypair file not found");
    }

    try {
      const secretKey = JSON.parse(node.content) as number[];
      const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
      const publicKey = keypair.publicKey.toBase58();

      return {
        nextState: {
          ...state,
          keypairs: {
            ...state.keypairs,
            [normalizedPath]: {
              path: normalizedPath,
              publicKey,
              secretKey,
            },
          },
          activeKeypairPath: normalizedPath,
          knownAddresses: Array.from(new Set([...state.knownAddresses, publicKey])),
          commandSuccesses: [...state.commandSuccesses, "solana:keygen:pubkey"],
        },
        lines: [{ kind: "output", text: publicKey }],
        metadata: { commandSucceeded: "solana-keygen pubkey" },
      };
    } catch {
      return errorResult(state, "INVALID_ARGUMENT", "Invalid keypair file format");
    }
  }

  return errorResult(state, "UNKNOWN_COMMAND", "Unknown solana-keygen subcommand");
}

// ============================================================================
// Command Router
// ============================================================================

export function handleSolanaCommand(
  parsed: ParsedCommand,
  state: SimulationState,
  // eslint-disable-next-line no-unused-vars
  _fs: DirectoryNode
): CommandExecutionResult {
  const subcommand = parsed.positional[0];

  switch (subcommand) {
    case "config":
      return handleSolanaConfig(parsed, state);
    case "address":
      return handleSolanaAddress(state);
    case "airdrop":
      return handleSolanaAirdrop(parsed, state);
    case "balance":
      return handleSolanaBalance(state);
    case "transfer":
      return handleSolanaTransfer(parsed, state);
    default:
      return errorResult(state, "UNKNOWN_COMMAND", `Unknown solana subcommand: ${subcommand ?? "(none)"}`);
  }
}

export const SOLANA_COMMAND_DEFINITIONS: Omit<CommandDefinition, "handler">[] = [
  {
    name: "solana config",
    description: "Configure Solana CLI settings",
    usage: "solana config <set|get>",
    flags: ["--url"],
  },
  { name: "solana address", description: "Display the active address", usage: "solana address", flags: [] },
  { name: "solana airdrop", description: "Request an airdrop", usage: "solana airdrop <amount>", flags: [] },
  { name: "solana balance", description: "Check account balance", usage: "solana balance", flags: [] },
  {
    name: "solana transfer",
    description: "Transfer SOL to another address",
    usage: "solana transfer <recipient> <amount>",
    flags: [],
  },
  {
    name: "solana-keygen new",
    description: "Generate a new keypair",
    usage: "solana-keygen new --outfile <path>",
    flags: ["--outfile"],
  },
  {
    name: "solana-keygen pubkey",
    description: "Display the public key for a keypair file",
    usage: "solana-keygen pubkey <keypair_file>",
    flags: [],
  },
];

export { LAMPORTS_PER_SOL };
