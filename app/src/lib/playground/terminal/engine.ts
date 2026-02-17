import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  COMMAND_DEFINITIONS,
  CommandExecutionResult,
  ParsedCommand,
  TerminalIo,
  TerminalOutputLine,
  TerminalState,
  TokenMintState,
} from "@/lib/playground/terminal/commands";
import { createTerminalError } from "@/lib/playground/terminal/errors";
import { normalizePath } from "@/lib/playground/workspace";

const MAX_TERMINAL_ERRORS = 30;

function parseQuotedArguments(input: string): string[] {
  const result: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const previous = input[index - 1];

    if ((char === '"' || char === "'") && previous !== "\\") {
      if (quote === char) {
        quote = null;
        continue;
      }
      if (!quote) {
        quote = char;
        continue;
      }
    }

    if (!quote && /\s/.test(char)) {
      if (current) {
        result.push(current);
        current = "";
      }
      continue;
    }

    if (char === "\\" && (input[index + 1] === '"' || input[index + 1] === "'" || input[index + 1] === "\\")) {
      continue;
    }

    current += char;
  }

  if (current) {
    result.push(current);
  }

  return result;
}

export function parseCommandLine(raw: string): ParsedCommand {
  const argv = parseQuotedArguments(raw.trim());
  const command = argv[0] ?? "";
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 1; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const [flag, inlineValue] = token.split("=", 2);
      if (inlineValue !== undefined) {
        flags[flag] = inlineValue;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          flags[flag] = next;
          i += 1;
        } else {
          flags[flag] = true;
        }
      }
      continue;
    }

    positional.push(token);
  }

  return {
    raw,
    command,
    argv,
    positional,
    flags,
  };
}

export function createInitialTerminalState(): TerminalState {
  return {
    cwd: "/",
    env: {
      LANG: "en_US.UTF-8",
    },
    solanaUrl: "devnet",
    keypairs: {},
    activeKeypairPath: null,
    knownAddresses: [],
    recentTxSignatures: [],
    commandSuccesses: [],
    commandHistory: [],
    errors: [],
    simulatedBalances: {},
    tokenMints: {},
    pendingTransfer: null,
  };
}

function appendError(state: TerminalState, code: Parameters<typeof createTerminalError>[0], message?: string): TerminalState {
  const nextError = createTerminalError(code, message);
  return {
    ...state,
    errors: [...state.errors, nextError].slice(-MAX_TERMINAL_ERRORS),
  };
}

function outputError(errorText: string, hintText: string): TerminalOutputLine[] {
  return [
    { kind: "error", text: `Error: ${errorText}` },
    { kind: "system", text: `Hint: ${hintText}` },
  ];
}

function resolvePath(cwd: string, input: string): string {
  const candidate = input.startsWith("/") ? input : `${cwd}/${input}`;
  const parts = candidate
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);
  const stack: string[] = [];

  parts.forEach((segment) => {
    if (segment === ".") {
      return;
    }
    if (segment === "..") {
      stack.pop();
      return;
    }
    stack.push(segment);
  });

  if (stack.length === 0) {
    return "/";
  }

  return `/${normalizePath(stack.join("/"))}`;
}

function pathExists(io: TerminalIo, path: string): boolean {
  const normalized = path.replace(/^\//, "");
  if (io.fileExists(normalized)) {
    return true;
  }
  return io.listPaths().some((entry) => entry.startsWith(`${normalized}/`));
}

function listDirectory(io: TerminalIo, directory: string): string[] {
  const prefix = directory === "/" ? "" : `${directory.replace(/^\//, "")}/`;
  const values = io
    .listPaths()
    .filter((filePath) => filePath.startsWith(prefix))
    .map((filePath) => filePath.slice(prefix.length).split("/")[0])
    .filter((value, index, list) => value.length > 0 && list.indexOf(value) === index)
    .sort();
  return values;
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
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  let output = "";
  for (let i = 0; i < 88; i += 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    output += chars[hash % chars.length];
  }
  return output;
}

function getActiveWalletAddress(state: TerminalState, io: TerminalIo): string | null {
  if (io.wallet.mode === "external") {
    return io.wallet.externalAddress;
  }

  if (io.wallet.burnerAddress) {
    return io.wallet.burnerAddress;
  }

  if (state.activeKeypairPath && state.keypairs[state.activeKeypairPath]) {
    return state.keypairs[state.activeKeypairPath].publicKey;
  }

  return null;
}

function cloneMint(mint: TokenMintState): TokenMintState {
  return {
    symbol: mint.symbol,
    decimals: mint.decimals,
    supply: mint.supply,
    balances: { ...mint.balances },
  };
}

async function handleSolanaConfig(state: TerminalState, parsed: ParsedCommand): Promise<CommandExecutionResult> {
  const subcommand = parsed.positional[1];
  if (subcommand === "set") {
    const url = parsed.flags["--url"];
    if (typeof url !== "string") {
      const error = createTerminalError("MISSING_ARGUMENT", "Missing --url for solana config set.");
      return {
        nextState: appendError(state, error.code, error.message),
        lines: outputError(error.message, error.hint),
      };
    }
    if (url !== "devnet") {
      const error = createTerminalError("NETWORK_MISMATCH");
      return {
        nextState: appendError(state, error.code, error.message),
        lines: outputError(error.message, error.hint),
      };
    }

    return {
      nextState: {
        ...state,
        solanaUrl: "devnet",
        commandSuccesses: [...state.commandSuccesses, "solana:config:set"],
      },
      lines: [{ kind: "output", text: "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com" }],
      metadata: { commandSucceeded: "solana config set --url devnet" },
    };
  }

  if (subcommand === "get") {
    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "solana:config:get"],
      },
      lines: [
        { kind: "output", text: "Config File: ~/.config/solana/cli/config.yml" },
        { kind: "output", text: "RPC URL: https://api.devnet.solana.com" },
        { kind: "output", text: `Keypair Path: ${state.activeKeypairPath ?? "(wallet adapter or burner)"}` },
      ],
      metadata: { commandSucceeded: "solana config get" },
    };
  }

  const error = createTerminalError("MISSING_ARGUMENT", "Unknown `solana config` subcommand.");
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}

async function requestRealAirdrop(address: string, sol: number): Promise<{ signature: string; lamports: number }> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
  const pubkey = new PublicKey(address);
  const signature = await connection.requestAirdrop(pubkey, lamports);
  await connection.confirmTransaction(signature, "confirmed");
  return { signature, lamports };
}

async function readRealBalance(address: string): Promise<number> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const lamports = await connection.getBalance(new PublicKey(address), "confirmed");
  return lamports / LAMPORTS_PER_SOL;
}

async function performRealBurnerTransfer(secretKey: Uint8Array, recipient: string, amountSol: number): Promise<string> {
  const sender = Keypair.fromSecretKey(secretKey);
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: new PublicKey(recipient),
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL),
    })
  );
  const signature = await connection.sendTransaction(transaction, [sender]);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

function makeAnchorProject(projectName: string): Record<string, string> {
  return {
    [`${projectName}/Anchor.toml`]: [
      "[programs.devnet]",
      `${projectName} = \"Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h\"`,
      "",
      "[provider]",
      'cluster = "devnet"',
      'wallet = "~/.config/solana/id.json"',
    ].join("\n"),
    [`${projectName}/programs/${projectName}/src/lib.rs`]: [
      "use anchor_lang::prelude::*;",
      "",
      `declare_id!(\"Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h\");`,
      "",
      "#[program]",
      `pub mod ${projectName.replace(/-/g, "_")} {`,
      "    use super::*;",
      "",
      "    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {",
      "        msg!(\"Counter initialized\");",
      "        Ok(())",
      "    }",
      "}",
      "",
      "#[derive(Accounts)]",
      "pub struct Initialize {}",
    ].join("\n"),
    [`${projectName}/tests/${projectName}.ts`]: [
      "import * as anchor from \"@coral-xyz/anchor\";",
      "",
      `describe(\"${projectName}\", () => {`,
      "  it(\"initializes\", async () => {",
      "    console.log(\"test stub\");",
      "  });",
      "});",
    ].join("\n"),
  };
}

function runAnchorBuildSimulation(io: TerminalIo): { success: boolean; lines: string[] } {
  const rustFile = io.readFile("programs/counter/src/lib.rs") ?? io.readFile("anchor-counter/programs/anchor-counter/src/lib.rs");
  if (!rustFile) {
    return {
      success: false,
      lines: [
        "error: failed to read program source",
        "help: run `anchor init counter` or ensure programs/<name>/src/lib.rs exists",
      ],
    };
  }

  const missing: string[] = [];
  if (!rustFile.includes("#[program]")) missing.push("#[program]");
  if (!rustFile.includes("declare_id!")) missing.push("declare_id!");

  if (missing.length > 0) {
    return {
      success: false,
      lines: [
        "Compiling anchor program...",
        `error[E0432]: missing required macro(s): ${missing.join(", ")}`,
        "hint: include Anchor program scaffolding in lib.rs",
      ],
    };
  }

  return {
    success: true,
    lines: [
      "Compiling anchor-lang v0.30.1",
      "Compiling counter v0.1.0",
      "Finished release [optimized] target(s) in 0.88s",
      "Build simulation complete (no on-chain deploy performed).",
    ],
  };
}

async function handleSolanaCommand(parsed: ParsedCommand, state: TerminalState, io: TerminalIo): Promise<CommandExecutionResult> {
  const sub = parsed.positional[0];
  if (!sub) {
    const error = createTerminalError("MISSING_ARGUMENT", "Missing solana subcommand.");
    return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
  }

  if (sub === "config") {
    return handleSolanaConfig(state, parsed);
  }

  if (sub === "address") {
    const address = getActiveWalletAddress(state, io);
    if (!address) {
      const error = createTerminalError("WALLET_REQUIRED");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
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

  if (sub === "airdrop") {
    const amountText = parsed.positional[1];
    const amount = Number(amountText);
    if (!amountText || Number.isNaN(amount) || amount <= 0) {
      const error = createTerminalError("INVALID_AMOUNT");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const address = getActiveWalletAddress(state, io);
    if (!address) {
      const error = createTerminalError("WALLET_REQUIRED");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const nextBalances = { ...state.simulatedBalances };

    try {
      const real = await requestRealAirdrop(address, amount);
      return {
        nextState: {
          ...state,
          simulatedBalances: {
            ...nextBalances,
            [address]: (nextBalances[address] ?? 0) + amount,
          },
          recentTxSignatures: [real.signature, ...state.recentTxSignatures].slice(0, 10),
          commandSuccesses: [...state.commandSuccesses, "solana:airdrop"],
        },
        lines: [
          { kind: "output", text: `Requesting airdrop of ${amount} SOL to ${address}` },
          { kind: "output", text: `Signature: ${real.signature}` },
          { kind: "system", text: "Executed against devnet RPC." },
        ],
        metadata: { commandSucceeded: "solana airdrop", realRpcUsed: true },
      };
    } catch {
      const signature = deterministicSignature(`${address}:airdrop:${amount}:${state.commandHistory.length}`);
      return {
        nextState: {
          ...state,
          simulatedBalances: {
            ...nextBalances,
            [address]: (nextBalances[address] ?? 0) + amount,
          },
          recentTxSignatures: [signature, ...state.recentTxSignatures].slice(0, 10),
          commandSuccesses: [...state.commandSuccesses, "solana:airdrop"],
        },
        lines: [
          { kind: "output", text: `Airdrop simulated: +${amount.toFixed(2)} SOL to ${address}` },
          { kind: "output", text: `Signature: ${signature}` },
          { kind: "system", text: "RPC unavailable, used deterministic simulation." },
        ],
        metadata: { commandSucceeded: "solana airdrop" },
      };
    }
  }

  if (sub === "balance") {
    const address = getActiveWalletAddress(state, io);
    if (!address) {
      const error = createTerminalError("WALLET_REQUIRED");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      const value = await readRealBalance(address);
      return {
        nextState: {
          ...state,
          simulatedBalances: {
            ...state.simulatedBalances,
            [address]: value,
          },
          commandSuccesses: [...state.commandSuccesses, "solana:balance"],
        },
        lines: [{ kind: "output", text: `${value.toFixed(9)} SOL` }, { kind: "system", text: "Fetched from devnet RPC." }],
        metadata: { commandSucceeded: "solana balance", realRpcUsed: true },
      };
    } catch {
      const value = state.simulatedBalances[address] ?? 0;
      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "solana:balance"],
        },
        lines: [{ kind: "output", text: `${value.toFixed(9)} SOL (simulated)` }],
        metadata: { commandSucceeded: "solana balance" },
      };
    }
  }

  if (sub === "transfer") {
    const recipient = parsed.positional[1];
    const amountText = parsed.positional[2];
    const amountSol = Number(amountText);
    if (!recipient || !amountText) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: solana transfer <RECIPIENT> <AMOUNT>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    if (!validatePublicKey(recipient)) {
      const error = createTerminalError("INVALID_PUBKEY");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    if (Number.isNaN(amountSol) || amountSol <= 0) {
      const error = createTerminalError("INVALID_AMOUNT");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const sender = getActiveWalletAddress(state, io);
    if (!sender) {
      const error = createTerminalError("WALLET_REQUIRED");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const senderBalance = state.simulatedBalances[sender] ?? 0;
    if (senderBalance < amountSol) {
      const error = createTerminalError("INSUFFICIENT_FUNDS");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const wantsReal = Boolean(parsed.flags["--real"]);
    if (wantsReal && (io.wallet.burnerSigner || io.wallet.externalConnected)) {
      return {
        nextState: {
          ...state,
          pendingTransfer: {
            recipient,
            amountSol,
            real: true,
            sender,
          },
        },
        lines: [
          { kind: "system", text: `Ready to send ${amountSol} SOL from ${sender} to ${recipient}.` },
          { kind: "system", text: "Run `confirm` to submit real devnet transaction." },
        ],
      };
    }

    const signature = deterministicSignature(`${sender}:${recipient}:${amountSol}:${state.commandHistory.length}`);
    return {
      nextState: {
        ...state,
        simulatedBalances: {
          ...state.simulatedBalances,
          [sender]: Math.max(0, senderBalance - amountSol),
          [recipient]: (state.simulatedBalances[recipient] ?? 0) + amountSol,
        },
        recentTxSignatures: [signature, ...state.recentTxSignatures].slice(0, 10),
        commandSuccesses: [...state.commandSuccesses, "solana:transfer"],
      },
      lines: [
        { kind: "output", text: `Transfer simulated: ${amountSol} SOL -> ${recipient}` },
        { kind: "output", text: `Signature: ${signature}` },
      ],
      metadata: { commandSucceeded: "solana transfer" },
    };
  }

  const error = createTerminalError("UNKNOWN_COMMAND", `Unknown solana subcommand: ${sub}`);
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}

async function handleSolanaKeygen(parsed: ParsedCommand, state: TerminalState, io: TerminalIo): Promise<CommandExecutionResult> {
  const sub = parsed.positional[0];
  if (sub === "new") {
    const outfile = parsed.flags["--outfile"];
    if (typeof outfile !== "string") {
      const error = createTerminalError("MISSING_ARGUMENT", "solana-keygen new requires --outfile <path>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const absolutePath = resolvePath(state.cwd, outfile).replace(/^\//, "");
    const keypair = Keypair.generate();
    const secret = Array.from(keypair.secretKey);
    const pubkey = keypair.publicKey.toBase58();
    io.createOrUpdateFile(absolutePath, `${JSON.stringify(secret, null, 2)}\n`);

    return {
      nextState: {
        ...state,
        keypairs: {
          ...state.keypairs,
          [absolutePath]: {
            path: absolutePath,
            secretKey: secret,
            publicKey: pubkey,
          },
        },
        activeKeypairPath: absolutePath,
        knownAddresses: Array.from(new Set([...state.knownAddresses, pubkey])),
        simulatedBalances: {
          ...state.simulatedBalances,
          [pubkey]: state.simulatedBalances[pubkey] ?? 0,
        },
        commandSuccesses: [...state.commandSuccesses, "solana:keygen:new"],
      },
      lines: [
        { kind: "output", text: `Wrote new keypair to ${absolutePath}` },
        { kind: "output", text: `pubkey: ${pubkey}` },
      ],
      metadata: { commandSucceeded: "solana-keygen new" },
    };
  }

  if (sub === "pubkey") {
    const keypairPath = parsed.positional[1];
    if (!keypairPath) {
      const error = createTerminalError("MISSING_ARGUMENT", "solana-keygen pubkey requires a keypair file path");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }
    const absolutePath = resolvePath(state.cwd, keypairPath).replace(/^\//, "");
    const registered = state.keypairs[absolutePath];

    if (registered) {
      return {
        nextState: {
          ...state,
          activeKeypairPath: absolutePath,
          commandSuccesses: [...state.commandSuccesses, "solana:keygen:pubkey"],
        },
        lines: [{ kind: "output", text: registered.publicKey }],
        metadata: { commandSucceeded: "solana-keygen pubkey" },
      };
    }

    const content = io.readFile(absolutePath);
    if (!content) {
      const error = createTerminalError("FILE_NOT_FOUND");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      const parsedSecret = JSON.parse(content) as number[];
      const keypair = Keypair.fromSecretKey(Uint8Array.from(parsedSecret));
      const pubkey = keypair.publicKey.toBase58();
      return {
        nextState: {
          ...state,
          keypairs: {
            ...state.keypairs,
            [absolutePath]: {
              path: absolutePath,
              secretKey: parsedSecret,
              publicKey: pubkey,
            },
          },
          activeKeypairPath: absolutePath,
          knownAddresses: Array.from(new Set([...state.knownAddresses, pubkey])),
          commandSuccesses: [...state.commandSuccesses, "solana:keygen:pubkey"],
        },
        lines: [{ kind: "output", text: pubkey }],
        metadata: { commandSucceeded: "solana-keygen pubkey" },
      };
    } catch {
      const error = createTerminalError("INVALID_PUBKEY", "Keypair file is not valid JSON secret key data.");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }
  }

  const error = createTerminalError("UNKNOWN_COMMAND", "Unknown solana-keygen subcommand.");
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}

async function handleAnchor(parsed: ParsedCommand, state: TerminalState, io: TerminalIo): Promise<CommandExecutionResult> {
  const sub = parsed.positional[0];
  if (sub === "init") {
    const projectName = parsed.positional[1];
    if (!projectName) {
      const error = createTerminalError("MISSING_ARGUMENT", "anchor init requires project name");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const rootPath = resolvePath(state.cwd, projectName).replace(/^\//, "");
    if (io.fileExists(`${rootPath}/Anchor.toml`) || io.listPaths().some((path) => path.startsWith(`${rootPath}/`))) {
      const error = createTerminalError("PROJECT_EXISTS");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const files = makeAnchorProject(projectName);
    Object.entries(files).forEach(([path, content]) => io.createOrUpdateFile(path, content));

    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "anchor:init"],
      },
      lines: [
        { kind: "output", text: `Initialized Anchor workspace at ${rootPath}` },
        { kind: "system", text: "Use `anchor build` then `anchor test` to validate scaffolding." },
      ],
      metadata: { commandSucceeded: "anchor init" },
    };
  }

  if (sub === "build") {
    const result = runAnchorBuildSimulation(io);
    if (!result.success) {
      const next = appendError(state, "UNKNOWN_COMMAND", "Anchor build failed checks.");
      return {
        nextState: next,
        lines: result.lines.map((line) => ({ kind: "output" as const, text: line })),
      };
    }
    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "anchor:build"],
      },
      lines: result.lines.map((line) => ({ kind: "output" as const, text: line })),
      metadata: { commandSucceeded: "anchor build" },
    };
  }

  if (sub === "test") {
    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "anchor:test"],
      },
      lines: [
        { kind: "output", text: "Running test suite..." },
        { kind: "output", text: "  counter" },
        { kind: "output", text: "    ✓ initializes state (simulated)" },
        { kind: "output", text: "1 passing (122ms)" },
      ],
      metadata: { commandSucceeded: "anchor test" },
    };
  }

  const error = createTerminalError("UNKNOWN_COMMAND", `Unknown anchor subcommand: ${sub}`);
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}

async function handleSplToken(parsed: ParsedCommand, state: TerminalState): Promise<CommandExecutionResult> {
  const sub = parsed.positional[0];
  const currentAddress = Object.keys(state.simulatedBalances)[0] ?? state.knownAddresses[0] ?? "unknown";

  if (sub === "create-token") {
    const decimalsRaw = parsed.flags["--decimals"];
    const decimals = typeof decimalsRaw === "string" ? Number(decimalsRaw) : 9;
    const mintAddress = deterministicSignature(`mint:${state.commandHistory.length}`).slice(0, 44);
    const symbol = `TOKEN${Object.keys(state.tokenMints).length + 1}`;
    const mint: TokenMintState = {
      symbol,
      decimals: Number.isNaN(decimals) ? 9 : decimals,
      supply: 0,
      balances: {},
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
        { kind: "output", text: `Creating token ${mintAddress}` },
        { kind: "output", text: `Address: ${mintAddress}` },
      ],
      metadata: { commandSucceeded: "spl-token create-token" },
    };
  }

  if (sub === "create-account") {
    const mint = parsed.positional[1];
    if (!mint) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: spl-token create-account <MINT>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const found = state.tokenMints[mint];
    if (!found) {
      const error = createTerminalError("TOKEN_NOT_FOUND");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const nextMint = cloneMint(found);
    nextMint.balances[currentAddress] = nextMint.balances[currentAddress] ?? 0;

    return {
      nextState: {
        ...state,
        tokenMints: {
          ...state.tokenMints,
          [mint]: nextMint,
        },
        commandSuccesses: [...state.commandSuccesses, "spl:create-account"],
      },
      lines: [{ kind: "output", text: `Created token account for ${currentAddress}` }],
      metadata: { commandSucceeded: "spl-token create-account" },
    };
  }

  if (sub === "mint") {
    const mint = parsed.positional[1];
    const amountRaw = parsed.positional[2];
    const amount = Number(amountRaw);
    if (!mint || !amountRaw || Number.isNaN(amount) || amount <= 0) {
      const error = createTerminalError("INVALID_AMOUNT", "Usage: spl-token mint <MINT> <AMOUNT>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const found = state.tokenMints[mint];
    if (!found) {
      const error = createTerminalError("TOKEN_NOT_FOUND");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const nextMint = cloneMint(found);
    nextMint.supply += amount;
    nextMint.balances[currentAddress] = (nextMint.balances[currentAddress] ?? 0) + amount;

    return {
      nextState: {
        ...state,
        tokenMints: {
          ...state.tokenMints,
          [mint]: nextMint,
        },
        commandSuccesses: [...state.commandSuccesses, "spl:mint"],
      },
      lines: [{ kind: "output", text: `Minted ${amount} tokens to ${currentAddress}` }],
      metadata: { commandSucceeded: "spl-token mint" },
    };
  }

  if (sub === "transfer") {
    const mint = parsed.positional[1];
    const amountRaw = parsed.positional[2];
    const recipient = parsed.positional[3];
    const amount = Number(amountRaw);

    if (!mint || !amountRaw || !recipient || Number.isNaN(amount) || amount <= 0) {
      const error = createTerminalError("INVALID_AMOUNT", "Usage: spl-token transfer <MINT> <AMOUNT> <RECIPIENT>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const found = state.tokenMints[mint];
    if (!found) {
      const error = createTerminalError("TOKEN_NOT_FOUND");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const nextMint = cloneMint(found);
    const sourceBalance = nextMint.balances[currentAddress] ?? 0;
    if (sourceBalance < amount) {
      const error = createTerminalError("INSUFFICIENT_FUNDS", "Insufficient token balance for transfer.");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    nextMint.balances[currentAddress] = sourceBalance - amount;
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
      lines: [{ kind: "output", text: `Transferred ${amount} tokens to ${recipient}` }],
      metadata: { commandSucceeded: "spl-token transfer" },
    };
  }

  if (sub === "supply") {
    const mint = parsed.positional[1];
    if (!mint) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: spl-token supply <MINT>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const found = state.tokenMints[mint];
    if (!found) {
      const error = createTerminalError("TOKEN_NOT_FOUND");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    return {
      nextState: {
        ...state,
        commandSuccesses: [...state.commandSuccesses, "spl:supply"],
      },
      lines: [{ kind: "output", text: `${found.supply}` }],
      metadata: { commandSucceeded: "spl-token supply" },
    };
  }

  const error = createTerminalError("UNKNOWN_COMMAND", `Unknown spl-token subcommand: ${sub ?? "(none)"}`);
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}

async function handleConfirm(state: TerminalState, io: TerminalIo): Promise<CommandExecutionResult> {
  const pending = state.pendingTransfer;
  if (!pending) {
    return {
      nextState: state,
      lines: [{ kind: "system", text: "No pending transfer." }],
    };
  }

  const senderBalance = state.simulatedBalances[pending.sender] ?? 0;
  if (senderBalance < pending.amountSol) {
    const error = createTerminalError("INSUFFICIENT_FUNDS");
    return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
  }

  let signature = deterministicSignature(`confirmed:${pending.sender}:${pending.recipient}:${pending.amountSol}`);
  let realUsed = false;

  if (pending.real) {
    try {
      if (io.wallet.mode === "burner" && io.wallet.burnerSigner) {
        signature = await performRealBurnerTransfer(
          io.wallet.burnerSigner.secretKey,
          pending.recipient,
          pending.amountSol
        );
        realUsed = true;
      } else if (io.wallet.mode === "external" && io.wallet.sendExternalTransaction) {
        signature = await io.wallet.sendExternalTransaction(
          pending.recipient,
          Math.floor(pending.amountSol * LAMPORTS_PER_SOL)
        );
        realUsed = true;
      }
    } catch {
      realUsed = false;
    }
  }

  return {
    nextState: {
      ...state,
      pendingTransfer: null,
      simulatedBalances: {
        ...state.simulatedBalances,
        [pending.sender]: Math.max(0, senderBalance - pending.amountSol),
        [pending.recipient]: (state.simulatedBalances[pending.recipient] ?? 0) + pending.amountSol,
      },
      recentTxSignatures: [signature, ...state.recentTxSignatures].slice(0, 10),
      commandSuccesses: [...state.commandSuccesses, "solana:transfer"],
    },
    lines: [
      {
        kind: "output",
        text: realUsed
          ? `Transfer submitted to devnet. Signature: ${signature}`
          : `Transfer simulated. Signature: ${signature}`,
      },
    ],
    metadata: { commandSucceeded: "solana transfer", realRpcUsed: realUsed },
  };
}

export async function executeTerminalCommand(rawCommand: string, state: TerminalState, io: TerminalIo): Promise<CommandExecutionResult> {
  const parsed = parseCommandLine(rawCommand);

  if (!parsed.command) {
    return {
      nextState: state,
      lines: [],
    };
  }

  const nextStateWithHistory: TerminalState = {
    ...state,
    commandHistory: [...state.commandHistory, parsed.raw],
  };

  if (parsed.command === "help") {
    const lines = COMMAND_DEFINITIONS.map((item) => `${item.usage} - ${item.description}`);
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "help"],
      },
      lines: lines.map((line) => ({ kind: "output", text: line })),
      metadata: { commandSucceeded: "help" },
    };
  }

  if (parsed.command === "clear") {
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "clear"],
      },
      lines: [],
      shouldClear: true,
      metadata: { commandSucceeded: "clear" },
    };
  }

  if (parsed.command === "pwd") {
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "pwd"],
      },
      lines: [{ kind: "output", text: nextStateWithHistory.cwd }],
      metadata: { commandSucceeded: "pwd" },
    };
  }

  if (parsed.command === "echo") {
    const message = parsed.argv.slice(1).join(" ");
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "echo"],
      },
      lines: [{ kind: "output", text: message }],
      metadata: { commandSucceeded: "echo" },
    };
  }

  if (parsed.command === "ls") {
    const target = parsed.positional[0] ? resolvePath(nextStateWithHistory.cwd, parsed.positional[0]) : nextStateWithHistory.cwd;
    if (!pathExists(io, target)) {
      const error = createTerminalError("DIRECTORY_NOT_FOUND");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const entries = listDirectory(io, target);
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "ls"],
      },
      lines: [{ kind: "output", text: entries.length > 0 ? entries.join("  ") : "(empty)" }],
      metadata: { commandSucceeded: `ls ${parsed.positional[0] ?? ""}`.trim() },
    };
  }

  if (parsed.command === "cd") {
    const input = parsed.positional[0];
    if (!input) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: cd <directory>");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }
    const target = resolvePath(nextStateWithHistory.cwd, input);
    const hasDirectory = io.listPaths().some((path) => path.startsWith(`${target.replace(/^\//, "")}/`));
    if (!hasDirectory && target !== "/") {
      const error = createTerminalError("DIRECTORY_NOT_FOUND");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    return {
      nextState: {
        ...nextStateWithHistory,
        cwd: target,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "cd"],
      },
      lines: [],
      metadata: { commandSucceeded: "cd" },
    };
  }

  if (parsed.command === "cat") {
    const input = parsed.positional[0];
    if (!input) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: cat <file>");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }
    const filePath = resolvePath(nextStateWithHistory.cwd, input).replace(/^\//, "");
    const content = io.readFile(filePath);
    if (content === null) {
      const error = createTerminalError("FILE_NOT_FOUND");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "cat"],
      },
      lines: [{ kind: "output", text: content }],
      metadata: { commandSucceeded: "cat" },
    };
  }

  if (parsed.command === "open") {
    const input = parsed.positional[0];
    if (!input) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: open <file>");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    const target = resolvePath(nextStateWithHistory.cwd, input).replace(/^\//, "");
    if (!io.fileExists(target)) {
      const error = createTerminalError("FILE_NOT_FOUND");
      return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    io.setActiveFile(target);
    return {
      nextState: {
        ...nextStateWithHistory,
        commandSuccesses: [...nextStateWithHistory.commandSuccesses, "open"],
      },
      lines: [{ kind: "output", text: `Opened ${target}` }],
      metadata: { commandSucceeded: "open" },
    };
  }

  if (parsed.command === "solana") {
    return handleSolanaCommand(parsed, nextStateWithHistory, io);
  }

  if (parsed.command === "solana-keygen") {
    return handleSolanaKeygen(parsed, nextStateWithHistory, io);
  }

  if (parsed.command === "anchor") {
    return handleAnchor(parsed, nextStateWithHistory, io);
  }

  if (parsed.command === "spl-token") {
    return handleSplToken(parsed, nextStateWithHistory);
  }

  if (parsed.command === "confirm") {
    return handleConfirm(nextStateWithHistory, io);
  }

  const error = createTerminalError("UNKNOWN_COMMAND", `Unknown command: ${parsed.command}`);
  return { nextState: appendError(nextStateWithHistory, error.code, error.message), lines: outputError(error.message, error.hint) };
}
