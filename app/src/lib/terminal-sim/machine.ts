import bs58 from "bs58";
import { parseTerminalCommand } from "@/lib/terminal-sim/parser";
import { TerminalSimResult, TerminalSimState } from "@/lib/terminal-sim/types";

// Deterministic command handlers for Solana CLI exercises.
const DEFAULT_KEYPAIR_PATH = "~/.config/solana/id.json";
const AIRDROP_LIMIT_SOL = 5;
const LAMPORTS_PER_SOL = BigInt(1_000_000_000);
const TRANSFER_FEE_LAMPORTS = BigInt(5_000);

function cloneState(state: TerminalSimState): TerminalSimState {
  return {
    ...state,
    keypairs: { ...state.keypairs },
    balances: { ...state.balances },
    tokens: { ...state.tokens },
    tokenAccounts: { ...state.tokenAccounts },
  };
}

function seedToBytes(seed: string, size: number): Uint8Array {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  let value = hash;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    value = Math.imul(value ^ (value >>> 15), 2246822519) >>> 0;
    bytes[i] = value & 0xff;
  }
  return bytes;
}

function deterministicBase58(seed: string, size: number): string {
  return bs58.encode(seedToBytes(seed, size));
}

function formatSol(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL;
  const frac = lamports % LAMPORTS_PER_SOL;
  const fracString = frac.toString().padStart(9, "0").replace(/0+$/, "");
  return fracString.length > 0 ? `${whole}.${fracString} SOL` : `${whole} SOL`;
}

function parseSolAmount(value: string): bigint | null {
  if (!/^\d+(\.\d+)?$/.test(value)) return null;
  const [wholePart, fracPart = ""] = value.split(".");
  const whole = BigInt(wholePart) * LAMPORTS_PER_SOL;
  const paddedFrac = `${fracPart}000000000`.slice(0, 9);
  return whole + BigInt(paddedFrac);
}

function parseUintAmount(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  return BigInt(value);
}

function getDefaultPubkey(state: TerminalSimState): string | null {
  return state.keypairs[state.defaultKeypairPath] ?? null;
}

function ok(state: TerminalSimState, stdout: string): TerminalSimResult {
  return { state, stdout, stderr: "", exitCode: 0 };
}

function fail(state: TerminalSimState, stderr: string): TerminalSimResult {
  return { state, stdout: "", stderr, exitCode: 1 };
}

export function createInitialTerminalState(): TerminalSimState {
  return {
    configUrl: "devnet",
    keypairs: {},
    defaultKeypairPath: DEFAULT_KEYPAIR_PATH,
    balances: {},
    tokens: {},
    tokenAccounts: {},
    txCounter: 0,
    nonce: 0,
  };
}

function nextSignature(state: TerminalSimState, prefix: string): string {
  state.txCounter += 1;
  return deterministicBase58(`${prefix}:sig:${state.txCounter}`, 64);
}

function nextAddress(state: TerminalSimState, prefix: string): string {
  state.nonce += 1;
  return deterministicBase58(`${prefix}:addr:${state.nonce}`, 32);
}

function handleSolanaCommand(state: TerminalSimState, args: string[]): TerminalSimResult {
  const sub = args[0];

  if (sub === "config" && args[1] === "set" && args[2] === "--url") {
    const value = args[3];
    if (
      value !== "devnet" &&
      value !== "testnet" &&
      value !== "mainnet-beta" &&
      value !== "localhost"
    ) {
      return fail(state, "error: invalid value for '--url <URL_OR_MONIKER>'");
    }
    state.configUrl = value;
    return ok(
      state,
      `Config File: ~/.config/solana/cli/config.yml\nRPC URL: ${value}\nWebSocket URL: ${value}\nKeypair Path: ${state.defaultKeypairPath}\nCommitment: confirmed`
    );
  }

  if (sub === "config" && args[1] === "get") {
    return ok(
      state,
      `Config File: ~/.config/solana/cli/config.yml\nRPC URL: ${state.configUrl}\nWebSocket URL: ${state.configUrl}\nKeypair Path: ${state.defaultKeypairPath}\nCommitment: confirmed`
    );
  }

  if (sub === "address") {
    const pubkey = getDefaultPubkey(state);
    if (!pubkey) {
      return fail(state, "No default signer found, run `solana-keygen new` first");
    }
    return ok(state, pubkey);
  }

  if (sub === "balance") {
    const address = args[1] ?? getDefaultPubkey(state);
    if (!address) {
      return fail(state, "No keypair configured");
    }
    const lamports = state.balances[address] ?? BigInt(0);
    return ok(state, formatSol(lamports));
  }

  if (sub === "airdrop") {
    const amountText = args[1] ?? "";
    const lamports = parseSolAmount(amountText);
    if (lamports === null || lamports <= BigInt(0)) {
      return fail(state, "Error: invalid airdrop amount");
    }
    const cap = BigInt(AIRDROP_LIMIT_SOL) * LAMPORTS_PER_SOL;
    if (lamports > cap) {
      return fail(
        state,
        "Error: airdrop request failed. This can happen when the rate limit is reached."
      );
    }

    const recipient = args[2] ?? getDefaultPubkey(state);
    if (!recipient) {
      return fail(state, "No keypair configured");
    }

    state.balances[recipient] = (state.balances[recipient] ?? BigInt(0)) + lamports;
    const signature = nextSignature(state, "airdrop");
    return ok(state, `Signature: ${signature}\n${formatSol(state.balances[recipient])}`);
  }

  if (sub === "transfer") {
    const recipient = args[1];
    const amountText = args[2];
    if (!recipient || !amountText) {
      return fail(state, "Usage: solana transfer <recipient> <amount>");
    }

    const amount = parseSolAmount(amountText);
    if (amount === null || amount <= BigInt(0)) {
      return fail(state, "Error: invalid transfer amount");
    }

    const sender = getDefaultPubkey(state);
    if (!sender) return fail(state, "No keypair configured");

    const senderBalance = state.balances[sender] ?? BigInt(0);
    const total = amount + TRANSFER_FEE_LAMPORTS;
    if (senderBalance < total) {
      return fail(state, "Error: Dynamic program error: InsufficientFunds");
    }

    state.balances[sender] = senderBalance - total;
    state.balances[recipient] = (state.balances[recipient] ?? BigInt(0)) + amount;
    const signature = nextSignature(state, "transfer");
    return ok(state, `Signature: ${signature}`);
  }

  return fail(state, `solana: unknown command '${args.join(" ")}'`);
}

function handleKeygenCommand(state: TerminalSimState, args: string[]): TerminalSimResult {
  const sub = args[0];

  if (sub === "new") {
    const outfileIndex = args.indexOf("--outfile");
    const outfile = outfileIndex >= 0 ? args[outfileIndex + 1] : DEFAULT_KEYPAIR_PATH;
    if (!outfile) {
      return fail(state, "error: --outfile requires a value");
    }

    const pubkey = nextAddress(state, `keypair:${outfile}`);
    state.keypairs[outfile] = pubkey;
    state.defaultKeypairPath = outfile;
    if (state.balances[pubkey] === undefined) {
      state.balances[pubkey] = BigInt(0);
    }

    return ok(
      state,
      `Generating a new keypair\nWrote new keypair to ${outfile}\n===========================================================================\npubkey: ${pubkey}\n===========================================================================`
    );
  }

  if (sub === "pubkey") {
    const path = args[1] ?? state.defaultKeypairPath;
    const pubkey = state.keypairs[path];
    if (!pubkey) {
      return fail(state, `Error: keypair not found at ${path}`);
    }
    return ok(state, pubkey);
  }

  return fail(state, `solana-keygen: unknown command '${args.join(" ")}'`);
}

function ownerAta(state: TerminalSimState, owner: string, mint: string): string | null {
  return (
    Object.values(state.tokenAccounts).find(
      (account) => account.owner === owner && account.mint === mint
    )?.address ?? null
  );
}

function handleSplTokenCommand(state: TerminalSimState, args: string[]): TerminalSimResult {
  const sub = args[0];

  if (sub === "create-token") {
    const decimalsIndex = args.indexOf("--decimals");
    const decimals = decimalsIndex >= 0 ? Number(args[decimalsIndex + 1]) : 9;
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 9) {
      return fail(state, "Error: invalid decimals");
    }

    const authority = getDefaultPubkey(state);
    if (!authority) return fail(state, "No keypair configured");

    const mint = nextAddress(state, "mint");
    state.tokens[mint] = {
      mint,
      decimals,
      supply: BigInt(0),
      authority,
    };

    const sig = nextSignature(state, "create-token");
    return ok(
      state,
      `Creating token ${mint}\nSignature: ${sig}\nAddress: ${mint}\nDecimals: ${decimals}`
    );
  }

  if (sub === "create-account") {
    const mint = args[1];
    if (!mint || !state.tokens[mint]) {
      return fail(state, "Error: mint not found");
    }
    const owner = getDefaultPubkey(state);
    if (!owner) return fail(state, "No keypair configured");

    const address = nextAddress(state, `ata:${owner}:${mint}`);
    state.tokenAccounts[address] = {
      address,
      owner,
      mint,
      balance: BigInt(0),
    };
    return ok(state, `Creating account ${address}\nOwner: ${owner}\nMint: ${mint}`);
  }

  if (sub === "mint") {
    const mint = args[1];
    const amountText = args[2];
    if (!mint || !amountText) {
      return fail(state, "Usage: spl-token mint <mint> <amount> [recipient]");
    }
    const amount = parseUintAmount(amountText);
    if (amount === null) {
      return fail(state, "Error: invalid mint amount");
    }
    const token = state.tokens[mint];
    if (!token) return fail(state, "Error: mint not found");

    const owner = getDefaultPubkey(state);
    if (!owner) return fail(state, "No keypair configured");

    const recipient = args[3] ?? ownerAta(state, owner, mint);
    if (!recipient || !state.tokenAccounts[recipient]) {
      return fail(state, "Error: token account not found");
    }

    token.supply += amount;
    state.tokenAccounts[recipient].balance += amount;
    return ok(state, `Minted ${amount} tokens\nMint: ${mint}`);
  }

  if (sub === "transfer") {
    const mint = args[1];
    const amountText = args[2];
    const recipient = args[3];
    if (!mint || !amountText || !recipient) {
      return fail(state, "Usage: spl-token transfer <mint> <amount> <recipient>");
    }

    const amount = parseUintAmount(amountText);
    if (amount === null) {
      return fail(state, "Error: invalid transfer amount");
    }
    const owner = getDefaultPubkey(state);
    if (!owner) return fail(state, "No keypair configured");

    const sourceAtaAddress = ownerAta(state, owner, mint);
    if (!sourceAtaAddress) {
      return fail(state, "Error: source token account not found");
    }

    const source = state.tokenAccounts[sourceAtaAddress];
    if (source.balance < amount) {
      return fail(state, "Error: insufficient token balance");
    }

    source.balance -= amount;
    if (!state.tokenAccounts[recipient]) {
      state.tokenAccounts[recipient] = {
        address: recipient,
        owner: recipient,
        mint,
        balance: BigInt(0),
      };
    }
    state.tokenAccounts[recipient].balance += amount;

    return ok(state, `Transfer ${amount}\nSignature: ${nextSignature(state, "token-transfer")}`);
  }

  if (sub === "supply") {
    const mint = args[1];
    if (!mint || !state.tokens[mint]) {
      return fail(state, "Error: mint not found");
    }
    return ok(state, state.tokens[mint].supply.toString());
  }

  return fail(state, `spl-token: unknown command '${args.join(" ")}'`);
}

export function runTerminalCommand(
  currentState: TerminalSimState,
  input: string
): TerminalSimResult {
  const state = cloneState(currentState);
  const tokens = parseTerminalCommand(input);
  if (tokens.length === 0) {
    return ok(state, "");
  }

  const command = tokens[0];
  const args = tokens.slice(1);

  if (command === "solana") {
    return handleSolanaCommand(state, args);
  }

  if (command === "solana-keygen") {
    return handleKeygenCommand(state, args);
  }

  if (command === "spl-token") {
    return handleSplTokenCommand(state, args);
  }

  return fail(state, `${command}: command not found`);
}
