export type TerminalErrorCode =
  | "UNKNOWN_COMMAND"
  | "INVALID_FLAG"
  | "MISSING_ARGUMENT"
  | "INVALID_AMOUNT"
  | "INVALID_PUBKEY"
  | "WALLET_REQUIRED"
  | "INSUFFICIENT_FUNDS"
  | "FILE_NOT_FOUND"
  | "DIRECTORY_NOT_FOUND"
  | "NETWORK_MISMATCH"
  | "PROJECT_EXISTS"
  | "TOKEN_NOT_FOUND";

export interface TerminalError {
  code: TerminalErrorCode;
  message: string;
  hint: string;
}

const ERROR_MAP: Record<TerminalErrorCode, Omit<TerminalError, "code">> = {
  UNKNOWN_COMMAND: {
    message: "Command not found.",
    hint: "Run `help` to see available commands.",
  },
  INVALID_FLAG: {
    message: "Unsupported flag for this command.",
    hint: "Check command usage with `help` and remove unsupported flags.",
  },
  MISSING_ARGUMENT: {
    message: "Missing required argument.",
    hint: "Provide all positional arguments shown in the command usage.",
  },
  INVALID_AMOUNT: {
    message: "Amount must be a positive number.",
    hint: "Use decimals for SOL amounts, for example `0.5`.",
  },
  INVALID_PUBKEY: {
    message: "Invalid public key format.",
    hint: "Use a base58 Solana address (32-byte public key).",
  },
  WALLET_REQUIRED: {
    message: "No signer wallet available.",
    hint: "Create a burner wallet or connect an external wallet.",
  },
  INSUFFICIENT_FUNDS: {
    message: "Insufficient funds for this operation.",
    hint: "Airdrop SOL first with `solana airdrop 1`.",
  },
  FILE_NOT_FOUND: {
    message: "File not found.",
    hint: "Use `ls` to inspect available files and paths.",
  },
  DIRECTORY_NOT_FOUND: {
    message: "Directory not found.",
    hint: "Use `pwd` and `ls` to verify the current directory.",
  },
  NETWORK_MISMATCH: {
    message: "Unsupported network for this operation.",
    hint: "Set devnet with `solana config set --url devnet`.",
  },
  PROJECT_EXISTS: {
    message: "Anchor project directory already exists.",
    hint: "Choose a new project name or remove existing files first.",
  },
  TOKEN_NOT_FOUND: {
    message: "Token mint was not found in local SPL ledger.",
    hint: "Create one with `spl-token create-token` first.",
  },
};

export function createTerminalError(code: TerminalErrorCode, customMessage?: string): TerminalError {
  const base = ERROR_MAP[code];
  return {
    code,
    message: customMessage ?? base.message,
    hint: base.hint,
  };
}
