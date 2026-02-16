export { parseTerminalCommand } from "@/lib/terminal-sim/parser";
export { createInitialTerminalState, runTerminalCommand } from "@/lib/terminal-sim/machine";
export type {
  TerminalSimResult,
  TerminalSimState,
  SimToken,
  SimTokenAccount,
} from "@/lib/terminal-sim/types";
