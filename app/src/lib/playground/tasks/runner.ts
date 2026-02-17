import { TaskContext, TaskQuest, TaskResult } from "@/lib/playground/tasks/types";

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function evaluateAssertion(context: TaskContext, assertion: TaskQuest["tasks"][number]["assertions"][number]): boolean {
  if (assertion.type === "command_succeeded") {
    return context.terminalState.commandSuccesses.some(
      (entry) => entry.toLowerCase().trim() === assertion.command.toLowerCase().trim()
    );
  }

  if (assertion.type === "file_regex") {
    const file = context.workspace.files[assertion.path];
    if (!file) {
      return false;
    }
    const regexp = new RegExp(assertion.regex, "m");
    return regexp.test(file.content);
  }

  if (assertion.type === "checkpoint") {
    return context.checkpoints.includes(assertion.id);
  }

  if (assertion.type === "state") {
    if (assertion.key === "wallet_created") {
      return Boolean(context.terminalState.activeKeypairPath || context.terminalState.knownAddresses.length > 0);
    }
    if (assertion.key === "config_devnet") {
      return context.terminalState.solanaUrl === "devnet";
    }
    if (assertion.key === "airdrop_done") {
      return context.terminalState.commandSuccesses.includes("solana:airdrop");
    }
    if (assertion.key === "balance_checked") {
      return context.terminalState.commandSuccesses.includes("solana:balance");
    }
    if (assertion.key === "transfer_done") {
      return context.terminalState.commandSuccesses.includes("solana:transfer");
    }
    if (assertion.key === "script_created") {
      return Object.values(context.workspace.files).some((file) => {
        if (!file.path.endsWith(".ts") && !file.path.endsWith(".js")) {
          return false;
        }
        const pattern = new RegExp(`${escapeRegex("console.log")}|${escapeRegex("getBalance")}`);
        return pattern.test(file.content);
      });
    }
  }

  return false;
}

export function evaluateQuest(quest: TaskQuest, context: TaskContext): TaskResult[] {
  const completed = new Set<string>();

  return quest.tasks.map((task) => {
    const prereqs = task.prerequisites ?? [];
    const locked = prereqs.some((id) => !completed.has(id));
    if (locked) {
      return { taskId: task.id, complete: false, locked: true };
    }

    const complete = task.assertions.every((assertion) => evaluateAssertion(context, assertion));
    if (complete) {
      completed.add(task.id);
    }

    return {
      taskId: task.id,
      complete,
      locked: false,
    };
  });
}
