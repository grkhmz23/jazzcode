import { createInitialTerminalState, runTerminalCommand, TerminalSimState } from "@/lib/terminal-sim";

export type BurnerWallet = {
  publicKey: string;
  keypairPath: string;
  terminalState: TerminalSimState;
};

export function createEphemeralBurnerWallet(
  previousState?: TerminalSimState
): BurnerWallet {
  const initial = previousState ?? createInitialTerminalState();
  const result = runTerminalCommand(initial, "solana-keygen new --outfile ~/.config/solana/id.json");

  const pubkey = result.stdout.match(/pubkey:\s*([1-9A-HJ-NP-Za-km-z]+)/)?.[1];
  if (!pubkey) {
    throw new Error("Failed to generate burner wallet");
  }

  return {
    publicKey: pubkey,
    keypairPath: "~/.config/solana/id.json",
    terminalState: result.state,
  };
}
