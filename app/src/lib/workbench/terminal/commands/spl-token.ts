/**
 * SPL Token CLI simulation commands for the Workbench terminal
 */

import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
  TokenMintState,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";
import { createTerminalError } from "../errors";

// eslint-disable-next-line no-unused-vars
function successState(
  state: SimulationState,
  lines: string[],
  command: string
): CommandExecutionResult {
  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, command],
    },
    lines: lines.map((text) => ({ kind: "output" as const, text })),
    metadata: { commandSucceeded: command },
  };
}

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

function deterministicAddress(seed: string): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  let output = "";
  for (let i = 0; i < 44; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    output += chars[hash % chars.length];
  }
  return output;
}

function cloneMint(mint: TokenMintState): TokenMintState {
  return {
    symbol: mint.symbol,
    decimals: mint.decimals,
    supply: mint.supply,
    balances: { ...mint.balances },
  };
}

function getCurrentOwner(state: SimulationState): string | null {
  const keypairs = Object.values(state.keypairs);
  if (keypairs.length > 0) {
    return keypairs[0].publicKey;
  }
  return state.knownAddresses[0] ?? null;
}

// ============================================================================
// Command Handlers
// ============================================================================

function handleSplTokenCreateToken(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const owner = getCurrentOwner(state);
  if (!owner) {
    return errorResult(state, "WALLET_REQUIRED", "Create a wallet first with solana-keygen");
  }

  const decimalsRaw = parsed.flags["--decimals"];
  const decimals = typeof decimalsRaw === "string" ? Number(decimalsRaw) : 9;
  const validDecimals = Number.isNaN(decimals) || decimals < 0 || decimals > 18 ? 9 : decimals;

  const mintIndex = Object.keys(state.tokenMints).length + 1;
  const mintAddress = deterministicAddress(`mint:${owner}:${mintIndex}:${Date.now()}`);
  const symbol = `TOKEN${mintIndex}`;

  const mint: TokenMintState = {
    symbol,
    decimals: validDecimals,
    supply: 0,
    balances: {
      [owner]: 0,
    },
  };

  return {
    nextState: {
      ...state,
      tokenMints: {
        ...state.tokenMints,
        [mintAddress]: mint,
      },
      commandSuccesses: [...state.commandSuccesses, "spl:create-token"],
    },
    lines: [
      { kind: "output" as const, text: "Creating token" },
      { kind: "output" as const, text: `Token symbol: ${symbol}` },
      { kind: "output" as const, text: `Decimals: ${validDecimals}` },
      { kind: "output" as const, text: `Signature: ${deterministicAddress(`sig:${mintAddress}`)}` },
      { kind: "output" as const, text: "" },
      { kind: "output" as const, text: `Address: ${mintAddress}` },
    ],
    metadata: { commandSucceeded: "spl-token create-token" },
  };
}

function handleSplTokenCreateAccount(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const mint = parsed.positional[1];
  if (!mint) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: spl-token create-account <mint_address>");
  }

  const mintState = state.tokenMints[mint];
  if (!mintState) {
    return errorResult(state, "TOKEN_NOT_FOUND");
  }

  const owner = getCurrentOwner(state);
  if (!owner) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  // Create account for this owner if not exists
  const nextMint = cloneMint(mintState);
  if (!(owner in nextMint.balances)) {
    nextMint.balances[owner] = 0;
  }

  const accountAddress = deterministicAddress(`account:${mint}:${owner}:${Date.now()}`);

  return {
    nextState: {
      ...state,
      tokenMints: {
        ...state.tokenMints,
        [mint]: nextMint,
      },
      commandSuccesses: [...state.commandSuccesses, "spl:create-account"],
    },
    lines: [
      { kind: "output" as const, text: "Creating token account" },
      { kind: "output" as const, text: `Signature: ${deterministicAddress(`sig:${accountAddress}`)}` },
      { kind: "output" as const, text: "" },
      { kind: "output" as const, text: `Address: ${accountAddress}` },
    ],
    metadata: { commandSucceeded: "spl-token create-account" },
  };
}

function handleSplTokenMint(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const mint = parsed.positional[1];
  const amountText = parsed.positional[2];
  const amount = Number(amountText);

  if (!mint || !amountText) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: spl-token mint <mint_address> <amount>");
  }

  if (Number.isNaN(amount) || amount <= 0) {
    return errorResult(state, "INVALID_AMOUNT");
  }

  const mintState = state.tokenMints[mint];
  if (!mintState) {
    return errorResult(state, "TOKEN_NOT_FOUND");
  }

  const owner = getCurrentOwner(state);
  if (!owner) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  // Check if account exists
  if (!(owner in mintState.balances)) {
    return errorResult(state, "TOKEN_NOT_FOUND", "Token account not found. Create one with spl-token create-account");
  }

  const nextMint = cloneMint(mintState);
  nextMint.supply += amount;
  nextMint.balances[owner] = (nextMint.balances[owner] ?? 0) + amount;

  return {
    nextState: {
      ...state,
      tokenMints: {
        ...state.tokenMints,
        [mint]: nextMint,
      },
      commandSuccesses: [...state.commandSuccesses, "spl:mint"],
    },
    lines: [
      { kind: "output" as const, text: "Minting tokens" },
      { kind: "output" as const, text: `Signature: ${deterministicAddress(`sig:mint:${mint}:${amount}`)}` },
      { kind: "output" as const, text: "" },
      { kind: "output" as const, text: `Minted ${amount} tokens to ${owner}` },
    ],
    metadata: { commandSucceeded: "spl-token mint" },
  };
}

function handleSplTokenTransfer(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const mint = parsed.positional[1];
  const amountText = parsed.positional[2];
  const recipient = parsed.positional[3];
  const amount = Number(amountText);

  if (!mint || !amountText || !recipient) {
    return errorResult(
      state,
      "MISSING_ARGUMENT",
      "Usage: spl-token transfer <mint_address> <amount> <recipient>"
    );
  }

  if (Number.isNaN(amount) || amount <= 0) {
    return errorResult(state, "INVALID_AMOUNT");
  }

  const mintState = state.tokenMints[mint];
  if (!mintState) {
    return errorResult(state, "TOKEN_NOT_FOUND");
  }

  const sender = getCurrentOwner(state);
  if (!sender) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  const senderBalance = mintState.balances[sender] ?? 0;
  if (senderBalance < amount) {
    return errorResult(state, "INSUFFICIENT_FUNDS", "Insufficient token balance");
  }

  const nextMint = cloneMint(mintState);
  nextMint.balances[sender] = senderBalance - amount;
  nextMint.balances[recipient] = (nextMint.balances[recipient] ?? 0) + amount;

  return {
    nextState: {
      ...state,
      tokenMints: {
        ...state.tokenMints,
        [mint]: nextMint,
      },
      commandSuccesses: [...state.commandSuccesses, "spl:transfer"],
    },
    lines: [
      { kind: "output" as const, text: "Transferring tokens" },
      { kind: "output" as const, text: `Signature: ${deterministicAddress(`sig:transfer:${mint}:${amount}:${recipient}`)}` },
      { kind: "output" as const, text: "" },
      { kind: "output" as const, text: `Transferred ${amount} tokens to ${recipient}` },
    ],
    metadata: { commandSucceeded: "spl-token transfer" },
  };
}

function handleSplTokenSupply(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const mint = parsed.positional[1];
  if (!mint) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: spl-token supply <mint_address>");
  }

  const mintState = state.tokenMints[mint];
  if (!mintState) {
    return errorResult(state, "TOKEN_NOT_FOUND");
  }

  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, "spl:supply"],
    },
    lines: [{ kind: "output" as const, text: `${mintState.supply}` }],
    metadata: { commandSucceeded: "spl-token supply" },
  };
}

function handleSplTokenBalance(
  parsed: ParsedCommand,
  state: SimulationState
): CommandExecutionResult {
  const mint = parsed.positional[1];
  if (!mint) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: spl-token balance <mint_address>");
  }

  const mintState = state.tokenMints[mint];
  if (!mintState) {
    return errorResult(state, "TOKEN_NOT_FOUND");
  }

  const owner = getCurrentOwner(state);
  if (!owner) {
    return errorResult(state, "WALLET_REQUIRED");
  }

  const balance = mintState.balances[owner] ?? 0;

  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, "spl:balance"],
    },
    lines: [{ kind: "output" as const, text: `${balance}` }],
    metadata: { commandSucceeded: "spl-token balance" },
  };
}

// ============================================================================
// Command Router
// ============================================================================

export function handleSplTokenCommand(
  parsed: ParsedCommand,
  state: SimulationState,
  // eslint-disable-next-line no-unused-vars
  _fs: DirectoryNode
): CommandExecutionResult {
  const subcommand = parsed.positional[0];

  switch (subcommand) {
    case "create-token":
      return handleSplTokenCreateToken(parsed, state);
    case "create-account":
      return handleSplTokenCreateAccount(parsed, state);
    case "mint":
      return handleSplTokenMint(parsed, state);
    case "transfer":
      return handleSplTokenTransfer(parsed, state);
    case "supply":
      return handleSplTokenSupply(parsed, state);
    case "balance":
      return handleSplTokenBalance(parsed, state);
    default:
      return errorResult(
        state,
        "UNKNOWN_COMMAND",
        `Unknown spl-token subcommand: ${subcommand ?? "(none)"}`
      );
  }
}

export const SPL_TOKEN_COMMAND_DEFINITIONS: Omit<CommandDefinition, "handler">[] = [
  {
    name: "spl-token create-token",
    description: "Create a new SPL token",
    usage: "spl-token create-token [--decimals <num>]",
    flags: ["--decimals"],
  },
  {
    name: "spl-token create-account",
    description: "Create a token account for a mint",
    usage: "spl-token create-account <mint_address>",
    flags: [],
  },
  {
    name: "spl-token mint",
    description: "Mint tokens to your account",
    usage: "spl-token mint <mint_address> <amount>",
    flags: [],
  },
  {
    name: "spl-token transfer",
    description: "Transfer tokens to another address",
    usage: "spl-token transfer <mint_address> <amount> <recipient>",
    flags: [],
  },
  {
    name: "spl-token supply",
    description: "Display the total supply of a token",
    usage: "spl-token supply <mint_address>",
    flags: [],
  },
  {
    name: "spl-token balance",
    description: "Display your token balance",
    usage: "spl-token balance <mint_address>",
    flags: [],
  },
];
