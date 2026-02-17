/**
 * Task evaluators for the Workbench
 * Checks task completion conditions
 */

import type {
  TaskAssertionType,
  TaskDefinition,
  TaskEvaluationContext,
  TaskQuest,
  TaskResult,
} from "./types";
import { findNode } from "./fs";

// ============================================================================
// Assertion Evaluators
// ============================================================================

type AssertionEvaluator = (
  assertion: TaskAssertionType,
  context: TaskEvaluationContext
) => boolean;

const evaluators: Record<TaskAssertionType["type"], AssertionEvaluator> = {
  command_executed: (assertion, context) => {
    if (assertion.type !== "command_executed") return false;
    return context.simulation.commandSuccesses.some(
      (cmd) => cmd === assertion.command || cmd.includes(assertion.command)
    );
  },

  file_contains: (assertion, context) => {
    if (assertion.type !== "file_contains") return false;
    const node = findNode(context.fs, assertion.path);
    if (!node || node.type !== "file") return false;
    return node.content.includes(assertion.content);
  },

  file_matches: (assertion, context) => {
    if (assertion.type !== "file_matches") return false;
    const node = findNode(context.fs, assertion.path);
    if (!node || node.type !== "file") return false;
    try {
      const regex = new RegExp(assertion.pattern);
      return regex.test(node.content);
    } catch {
      return false;
    }
  },

  json_output_matches: (assertion, context) => {
    if (assertion.type !== "json_output_matches") return false;
    const node = findNode(context.fs, assertion.path);
    if (!node || node.type !== "file") return false;
    try {
      const json = JSON.parse(node.content) as Record<string, unknown>;
      return json[assertion.key] === assertion.value;
    } catch {
      return false;
    }
  },

  balance_at_least: (assertion, context) => {
    if (assertion.type !== "balance_at_least") return false;
    const balance = context.simulation.balances[assertion.address] ?? 0;
    return balance >= assertion.minSol;
  },

  token_minted: (assertion, context) => {
    if (assertion.type !== "token_minted") return false;
    return assertion.mintAddress in context.simulation.tokenMints;
  },

  keypair_exists: (assertion, context) => {
    if (assertion.type !== "keypair_exists") return false;
    return assertion.path in context.simulation.keypairs;
  },

  simulation_state: (assertion, context) => {
    if (assertion.type !== "simulation_state") return false;
    const state = context.simulation;
    const value = state[assertion.key as keyof typeof state];
    return value === assertion.value;
  },
};

function evaluateAssertion(
  assertion: TaskAssertionType,
  context: TaskEvaluationContext
): boolean {
  const evaluator = evaluators[assertion.type];
  if (!evaluator) {
    console.warn(`Unknown assertion type: ${assertion.type}`);
    return false;
  }
  return evaluator(assertion, context);
}

// ============================================================================
// Task Evaluation
// ============================================================================

export function evaluateTask(
  task: TaskDefinition,
  context: TaskEvaluationContext,
  completedTaskIds: Set<string>
): { complete: boolean; locked: boolean } {
  // Check prerequisites
  if (task.prerequisites && task.prerequisites.length > 0) {
    const prerequisitesMet = task.prerequisites.every((prereq) =>
      completedTaskIds.has(prereq)
    );
    if (!prerequisitesMet) {
      return { complete: false, locked: true };
    }
  }

  // Check if already completed
  if (completedTaskIds.has(task.id)) {
    return { complete: true, locked: false };
  }

  // Evaluate all assertions
  const allAssertionsMet = task.assertions.every((assertion) =>
    evaluateAssertion(assertion, context)
  );

  return { complete: allAssertionsMet, locked: false };
}

export function evaluateQuest(
  quest: TaskQuest,
  context: TaskEvaluationContext,
  completedTaskIds: string[] = []
): TaskResult[] {
  const completed = new Set(completedTaskIds);
  const results: TaskResult[] = [];

  for (const task of quest.tasks) {
    const result = evaluateTask(task, context, completed);
    results.push({
      taskId: task.id,
      complete: result.complete,
      locked: result.locked,
    });

    if (result.complete) {
      completed.add(task.id);
    }
  }

  return results;
}

export function getCompletedTaskIds(results: TaskResult[]): string[] {
  return results.filter((r) => r.complete).map((r) => r.taskId);
}

export function getNextTask(
  quest: TaskQuest,
  results: TaskResult[]
): TaskDefinition | null {
  for (let i = 0; i < quest.tasks.length; i++) {
    const task = quest.tasks[i];
    const result = results[i];
    if (!result) continue;
    if (!result.complete && !result.locked) {
      return task;
    }
  }
  return null;
}

export function isQuestComplete(results: TaskResult[]): boolean {
  return results.length > 0 && results.every((r) => r.complete);
}

export function getQuestProgress(results: TaskResult[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = results.filter((r) => r.complete).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// ============================================================================
// Predefined Quests
// ============================================================================

export const solanaFundamentalsQuest: TaskQuest = {
  id: "solana-fundamentals-cli",
  title: "Solana Fundamentals: Wallet CLI Simulator",
  description:
    "Learn the basics of Solana CLI by setting up your wallet, requesting an airdrop, and transferring SOL.",
  tasks: [
    {
      id: "config-devnet",
      title: "Configure Solana CLI for Devnet",
      description: "Set the RPC URL to devnet to ensure you're using the test network.",
      assertions: [{ type: "command_executed", command: "solana config set" }],
      hints: [
        "Use `solana config set --url devnet` to configure the CLI",
        "You can verify with `solana config get`",
      ],
      checkpointId: "checkpoint-1",
    },
    {
      id: "generate-keypair",
      title: "Generate a New Keypair",
      description: "Create a new Solana wallet by generating a keypair file.",
      prerequisites: ["config-devnet"],
      assertions: [{ type: "command_executed", command: "solana-keygen new" }],
      hints: [
        "Use `solana-keygen new --outfile ~/my-keypair.json`",
        "Save this keypair file - it contains your private key!",
      ],
      checkpointId: "checkpoint-2",
    },
    {
      id: "request-airdrop",
      title: "Request an Airdrop",
      description: "Get some free devnet SOL to test with.",
      prerequisites: ["generate-keypair"],
      assertions: [{ type: "command_executed", command: "solana airdrop" }],
      hints: [
        "Use `solana airdrop 2` to request 2 SOL",
        "This only works on devnet, not mainnet",
      ],
      checkpointId: "checkpoint-3",
    },
    {
      id: "check-balance",
      title: "Check Your Balance",
      description: "Verify that the airdrop was received by checking your balance.",
      prerequisites: ["request-airdrop"],
      assertions: [{ type: "command_executed", command: "solana balance" }],
      hints: [
        "Simply run `solana balance`",
        "You should see approximately 2 SOL (minus small transaction fees)",
      ],
      checkpointId: "checkpoint-4",
    },
    {
      id: "transfer-sol",
      title: "Transfer SOL",
      description: "Send some SOL to another address to practice transfers.",
      prerequisites: ["check-balance"],
      assertions: [{ type: "command_executed", command: "solana transfer" }],
      hints: [
        "Use `solana transfer <RECIPIENT_ADDRESS> 0.5` to send 0.5 SOL",
        "You can use any valid Solana address as the recipient",
        "Try transferring to your own address to practice!",
      ],
      checkpointId: "checkpoint-5",
    },
  ],
};

export function getQuestById(id: string): TaskQuest | null {
  if (id === "solana-fundamentals-cli") {
    return solanaFundamentalsQuest;
  }
  return null;
}

// ============================================================================
// Export utilities for tests
// ============================================================================

export { evaluators };
export type { AssertionEvaluator };
export type { DirectoryNode, FileNode, FSNode } from "./fs";
