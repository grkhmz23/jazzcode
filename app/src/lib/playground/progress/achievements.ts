import { TaskResult } from "@/lib/playground/tasks/types";
import { TerminalState } from "@/lib/playground/terminal/commands";

export interface Achievement {
  id: string;
  label: string;
  description: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first-command", label: "First Command", description: "Executed your first terminal command." },
  { id: "wallet-bootstrap", label: "Wallet Bootstrap", description: "Generated a CLI keypair." },
  { id: "rpc-live", label: "RPC Live", description: "Used real devnet RPC successfully." },
  { id: "anchor-apprentice", label: "Anchor Apprentice", description: "Ran anchor build/test workflow." },
  { id: "spl-operator", label: "SPL Operator", description: "Created and minted an SPL token." },
  { id: "quest-complete", label: "Quest Complete", description: "Completed all quest tasks." },
  { id: "speedrunner", label: "Speedrunner", description: "Completed quest under 5 minutes." },
];

export function evaluateAchievements(input: {
  terminal: TerminalState;
  tasks: TaskResult[];
  realRpcUsed: boolean;
  speedrunTimeMs: number | null;
}): Achievement[] {
  const earned = new Set<string>();

  if (input.terminal.commandHistory.length > 0) {
    earned.add("first-command");
  }
  if (input.terminal.commandSuccesses.includes("solana:keygen:new")) {
    earned.add("wallet-bootstrap");
  }
  if (input.realRpcUsed) {
    earned.add("rpc-live");
  }
  if (input.terminal.commandSuccesses.includes("anchor:build") || input.terminal.commandSuccesses.includes("anchor:test")) {
    earned.add("anchor-apprentice");
  }
  if (input.terminal.commandSuccesses.some((entry) => entry.startsWith("spl:"))) {
    earned.add("spl-operator");
  }

  const allTasksComplete = input.tasks.length > 0 && input.tasks.every((task) => task.complete);
  if (allTasksComplete) {
    earned.add("quest-complete");
  }

  if (allTasksComplete && input.speedrunTimeMs !== null && input.speedrunTimeMs <= 5 * 60 * 1000) {
    earned.add("speedrunner");
  }

  return ALL_ACHIEVEMENTS.filter((achievement) => earned.has(achievement.id));
}
