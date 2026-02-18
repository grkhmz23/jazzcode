import { Workspace } from "@/lib/playground/types";
import { TerminalError } from "@/lib/playground/terminal/errors";

export interface ParsedCommand {
  raw: string;
  command: string;
  argv: string[];
  positional: string[];
  flags: Record<string, string | boolean>;
}

export interface TokenMintState {
  symbol: string;
  decimals: number;
  supply: number;
  balances: Record<string, number>;
}

export interface PendingTransfer {
  recipient: string;
  amountSol: number;
  real: boolean;
  sender: string;
}

export interface TerminalState {
  cwd: string;
  env: Record<string, string>;
  solanaUrl: "devnet";
  keypairs: Record<string, { path: string; secretKey: number[]; publicKey: string }>;
  activeKeypairPath: string | null;
  knownAddresses: string[];
  recentTxSignatures: string[];
  commandSuccesses: string[];
  commandHistory: string[];
  errors: TerminalError[];
  simulatedBalances: Record<string, number>;
  tokenMints: Record<string, TokenMintState>;
  pendingTransfer: PendingTransfer | null;
  gitAuth: GitAuthState;
}

export interface GitAuthState {
  token: string | null;
}

export interface TerminalIo {
  workspace: Workspace;
  createOrUpdateFile: (path: string, content: string) => void;
  fileExists: (path: string) => boolean;
  readFile: (path: string) => string | null;
  listPaths: () => string[];
  setActiveFile: (path: string) => void;
  deleteFile?: (path: string) => void;
  requestGitToken?: () => Promise<string | null>;
  shouldApplyRunnerArtifacts?: () => boolean;
  runRunnerJob?: (request: {
    jobType:
      | "anchor_deploy"
      | "anchor_idl_build"
      | "anchor_idl_fetch"
      | "cargo_build"
      | "cargo_test";
    files: Record<string, string>;
    args: Record<string, string>;
    onLog?: (entry: { stream: "stdout" | "stderr" | "system"; line: string }) => void;
  }) => Promise<{
    ok: boolean;
    result?: {
      exitCode: number;
      stdout: string;
      stderr: string;
      outputFiles?: Record<string, string>;
      outputFilesList?: string[];
      durationMs?: number;
      outputFilesTarGzBase64?: string;
    };
    error?: string;
    streamed?: boolean;
  }>;
  wallet: {
    mode: "burner" | "external";
    burnerAddress: string | null;
    externalAddress: string | null;
    burnerSigner: {
      publicKey: string;
      secretKey: Uint8Array;
    } | null;
    externalConnected: boolean;
    sendExternalTransaction?: (recipient: string, lamports: number) => Promise<string>;
  };
}

export interface TerminalOutputLine {
  kind: "output" | "system" | "error";
  text: string;
}

export interface CommandExecutionResult {
  nextState: TerminalState;
  lines: TerminalOutputLine[];
  shouldClear?: boolean;
  checkpoint?: string;
  metadata?: {
    commandSucceeded?: string;
    realRpcUsed?: boolean;
  };
}

export interface CommandContext {
  parsed: ParsedCommand;
  state: TerminalState;
  io: TerminalIo;
}

export type CommandHandler = (context: CommandContext) => Promise<CommandExecutionResult>;

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  flags: string[];
}

export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  { name: "help", description: "List supported commands.", usage: "help", flags: [] },
  { name: "clear", description: "Clear terminal output.", usage: "clear", flags: [] },
  { name: "pwd", description: "Print current directory.", usage: "pwd", flags: [] },
  { name: "ls", description: "List files/directories.", usage: "ls [path]", flags: [] },
  { name: "cd", description: "Change directory.", usage: "cd <path>", flags: [] },
  { name: "cat", description: "Print file content.", usage: "cat <path>", flags: [] },
  { name: "echo", description: "Echo text.", usage: "echo <text>", flags: [] },
  { name: "open", description: "Open file in editor.", usage: "open <path>", flags: [] },
  {
    name: "solana",
    description: "Simulated Solana CLI root command.",
    usage: "solana <subcommand>",
    flags: ["--url", "--keypair", "--real"],
  },
  {
    name: "solana-keygen",
    description: "Create and inspect local keypairs.",
    usage: "solana-keygen <new|pubkey>",
    flags: ["--outfile"],
  },
  {
    name: "anchor",
    description: "Anchor framework commands.",
    usage: "anchor <init|build|test|deploy|idl>",
    flags: [],
  },
  { name: "cargo", description: "Rust cargo commands.", usage: "cargo <build|test>", flags: [] },
  {
    name: "spl-token",
    description: "SPL token simulation commands.",
    usage: "spl-token <create-token|create-account|mint|transfer|supply>",
    flags: ["--decimals", "--owner", "--mint"],
  },
  { name: "confirm", description: "Confirm pending transfer action.", usage: "confirm", flags: [] },
  {
    name: "git",
    description: "Git version control commands.",
    usage: "git <init|status|add|commit|log|branch|checkout|remote|clone|pull|push [remote] [branch]>",
    flags: ["-m", "-b", "--oneline", "-u", "--set-upstream", "--with-token"],
  },
];
