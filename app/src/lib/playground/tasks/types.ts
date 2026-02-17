import { TerminalState } from "@/lib/playground/terminal/commands";
import { Workspace } from "@/lib/playground/types";

export type TaskAssertion =
  | { type: "command_succeeded"; command: string }
  | { type: "file_regex"; path: string; regex: string }
  | { type: "state"; key: "wallet_created" | "config_devnet" | "airdrop_done" | "balance_checked" | "transfer_done" | "script_created" }
  | { type: "checkpoint"; id: string };

export interface TaskDefinitionV2 {
  id: string;
  title: string;
  description: string;
  prerequisites?: string[];
  assertions: TaskAssertion[];
  hints: string[];
  checkpointId?: string;
}

export interface TaskQuest {
  id: string;
  title: string;
  description: string;
  tasks: TaskDefinitionV2[];
}

export interface TaskContext {
  workspace: Workspace;
  terminalState: TerminalState;
  checkpoints: string[];
}

export interface TaskResult {
  taskId: string;
  complete: boolean;
  locked: boolean;
}
