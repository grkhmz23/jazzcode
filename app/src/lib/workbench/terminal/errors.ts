/**
 * Terminal error definitions with user-friendly hints
 */

export interface TerminalErrorDefinition {
  code: string;
  message: string;
  hint: string;
}

export const TERMINAL_ERRORS: Record<string, TerminalErrorDefinition> = {
  MISSING_ARGUMENT: {
    code: "MISSING_ARGUMENT",
    message: "Missing required argument",
    hint: "Check the command usage with `help`",
  },
  INVALID_ARGUMENT: {
    code: "INVALID_ARGUMENT",
    message: "Invalid argument provided",
    hint: "Verify the argument format and try again",
  },
  FILE_NOT_FOUND: {
    code: "FILE_NOT_FOUND",
    message: "File or directory not found",
    hint: "Use `ls` to list available files and directories",
  },
  FILE_EXISTS: {
    code: "FILE_EXISTS",
    message: "File or directory already exists",
    hint: "Choose a different name or remove the existing file first",
  },
  DIRECTORY_NOT_FOUND: {
    code: "DIRECTORY_NOT_FOUND",
    message: "Directory not found",
    hint: "Use `ls` to list available directories",
  },
  NOT_A_DIRECTORY: {
    code: "NOT_A_DIRECTORY",
    message: "Not a directory",
    hint: "The path refers to a file, not a directory",
  },
  IS_A_DIRECTORY: {
    code: "IS_A_DIRECTORY",
    message: "Is a directory",
    hint: "Cannot perform this operation on a directory",
  },
  PERMISSION_DENIED: {
    code: "PERMISSION_DENIED",
    message: "Permission denied",
    hint: "Check file permissions or use a different location",
  },
  UNKNOWN_COMMAND: {
    code: "UNKNOWN_COMMAND",
    message: "Command not found",
    hint: "Run `help` to see available commands",
  },
  WALLET_REQUIRED: {
    code: "WALLET_REQUIRED",
    message: "No wallet configured",
    hint: "Create a keypair with `solana-keygen new --outfile ~/my-keypair.json`",
  },
  INVALID_PUBKEY: {
    code: "INVALID_PUBKEY",
    message: "Invalid public key",
    hint: "Provide a valid Solana base58-encoded public key",
  },
  INVALID_AMOUNT: {
    code: "INVALID_AMOUNT",
    message: "Invalid amount",
    hint: "Provide a positive number for the amount",
  },
  INSUFFICIENT_FUNDS: {
    code: "INSUFFICIENT_FUNDS",
    message: "Insufficient funds",
    hint: "Request an airdrop with `solana airdrop 2` or use a smaller amount",
  },
  NETWORK_MISMATCH: {
    code: "NETWORK_MISMATCH",
    message: "Network configuration mismatch",
    hint: "Use `solana config set --url devnet` to configure devnet",
  },
  TOKEN_NOT_FOUND: {
    code: "TOKEN_NOT_FOUND",
    message: "Token mint not found",
    hint: "Create a token first with `spl-token create-token`",
  },
  PROJECT_EXISTS: {
    code: "PROJECT_EXISTS",
    message: "Project already exists",
    hint: "Choose a different project name or delete the existing one",
  },
  GIT_NOT_INITIALIZED: {
    code: "GIT_NOT_INITIALIZED",
    message: "Not a git repository",
    hint: "Initialize with `git init` first",
  },
  ANCHOR_BUILD_FAILED: {
    code: "ANCHOR_BUILD_FAILED",
    message: "Anchor build failed",
    hint: "Ensure your program has valid Anchor syntax",
  },
};

export function createTerminalError(
  code: keyof typeof TERMINAL_ERRORS,
  customMessage?: string
): TerminalErrorDefinition & { timestamp: number } {
  const error = TERMINAL_ERRORS[code];
  return {
    ...error,
    message: customMessage ?? error.message,
    timestamp: Date.now(),
  };
}
