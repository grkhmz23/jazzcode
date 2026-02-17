/**
 * Simulated Git commands for the Workbench terminal
 * Provides deterministic git simulation for educational purposes
 */

import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";
import { createTerminalError } from "../errors";

interface GitRepository {
  initialized: boolean;
  commits: GitCommit[];
  branches: string[];
  currentBranch: string;
  stagedFiles: string[];
  lastCommitMessage?: string;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  files: string[];
}

// In-memory storage for git state (per workspace)
const gitRepos = new Map<string, GitRepository>();

function getRepoKey(fs: DirectoryNode): string {
  return fs.path;
}

function getOrCreateRepo(fs: DirectoryNode): GitRepository {
  const key = getRepoKey(fs);
  let repo = gitRepos.get(key);
  if (!repo) {
    repo = {
      initialized: false,
      commits: [],
      branches: ["main"],
      currentBranch: "main",
      stagedFiles: [],
    };
    gitRepos.set(key, repo);
  }
  return repo;
}

function generateCommitHash(seed: string): string {
  const chars = "0123456789abcdef";
  let hash = "";
  let x = 0;
  for (let i = 0; i < seed.length; i++) {
    x = (x * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < 7; i++) {
    x = (x * 1664525 + 1013904223) >>> 0;
    hash += chars[x % 16];
  }
  return hash;
}

function successState(
  state: SimulationState,
  lines: string[],
  command: string
): CommandExecutionResult {
  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, command],
    },
    lines: lines.map((text) => ({ kind: "output" as const, text })),
    metadata: { commandSucceeded: command },
  };
}

function errorResult(
  state: SimulationState,
  code: keyof typeof import("../errors").TERMINAL_ERRORS,
  customMessage?: string
): CommandExecutionResult {
  const error = createTerminalError(code, customMessage);
  return {
    nextState: {
      ...state,
      errors: [...state.errors, error].slice(-30),
    },
    lines: [
      { kind: "error", text: `Error: ${error.message}` },
      { kind: "system", text: `Hint: ${error.hint}` },
    ],
  };
}

// ============================================================================
// Command Handlers
// ============================================================================

function handleGitInit(
  _parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (repo.initialized) {
    return errorResult(state, "PROJECT_EXISTS", "Git repository already initialized");
  }

  repo.initialized = true;

  return successState(state, ["Initialized empty Git repository in .git/"], "git init");
}

function handleGitStatus(
  _parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  const lines: string[] = [];
  lines.push(`On branch ${repo.currentBranch}`);

  if (repo.commits.length === 0) {
    lines.push("", "No commits yet");
  }

  if (repo.stagedFiles.length > 0) {
    lines.push("", "Changes to be committed:");
    lines.push('  (use "git restore --staged <file>..." to unstage)');
    lines.push("");
    for (const file of repo.stagedFiles) {
      lines.push(`\tnew file:   ${file}`);
    }
  } else {
    lines.push("", "nothing to commit, working tree clean");
  }

  return successState(state, lines, "git status");
}

function handleGitAdd(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  const filePattern = parsed.positional[0];
  if (!filePattern) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: git add <file>");
  }

  // Simulate adding files - in a real implementation, we'd check the FS
  const filesToAdd = filePattern === "." ? ["src/main.ts", "README.md"] : [filePattern];

  for (const file of filesToAdd) {
    if (!repo.stagedFiles.includes(file)) {
      repo.stagedFiles.push(file);
    }
  }

  return successState(state, [], "git add");
}

function handleGitCommit(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  const message = parsed.flags["-m"];
  if (typeof message !== "string" || !message) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: git commit -m \"message\"");
  }

  if (repo.stagedFiles.length === 0) {
    return successState(
      state,
      ["nothing to commit, working tree clean"],
      "git commit"
    );
  }

  const hash = generateCommitHash(`${fs.path}:${message}:${Date.now()}`);
  const commit: GitCommit = {
    hash,
    message,
    author: "Developer <dev@example.com>",
    timestamp: Date.now(),
    files: [...repo.stagedFiles],
  };

  repo.commits.push(commit);
  repo.stagedFiles = [];
  repo.lastCommitMessage = message;

  const lines: string[] = [];
  lines.push(`[${repo.currentBranch} ${hash}] ${message}`);
  for (const file of commit.files) {
    lines.push(` ${repo.commits.length === 1 ? "create mode 100644" : "modified"}   ${file}`);
  }

  return successState(state, lines, "git commit");
}

function handleGitLog(
  _parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  if (repo.commits.length === 0) {
    return successState(state, ["fatal: your current branch does not have any commits yet"], "git log");
  }

  const lines: string[] = [];
  for (const commit of repo.commits.slice().reverse()) {
    lines.push(`commit ${commit.hash}`);
    lines.push(`Author: ${commit.author}`);
    lines.push(`Date:   ${new Date(commit.timestamp).toISOString()}`);
    lines.push("");
    lines.push(`    ${commit.message}`);
    lines.push("");
  }

  return successState(state, lines, "git log");
}

function handleGitBranch(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  const newBranch = parsed.positional[0];

  if (newBranch) {
    // Create new branch
    if (repo.branches.includes(newBranch)) {
      return errorResult(state, "PROJECT_EXISTS", `A branch named '${newBranch}' already exists`);
    }
    repo.branches.push(newBranch);
    return successState(state, [], `git branch ${newBranch}`);
  }

  // List branches
  const lines = repo.branches.map((branch) =>
    branch === repo.currentBranch ? `* ${branch}` : `  ${branch}`
  );

  return successState(state, lines, "git branch");
}

function handleGitCheckout(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const repo = getOrCreateRepo(fs);

  if (!repo.initialized) {
    return errorResult(state, "GIT_NOT_INITIALIZED");
  }

  const target = parsed.positional[0];
  if (!target) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: git checkout <branch>");
  }

  if (!repo.branches.includes(target)) {
    return errorResult(state, "DIRECTORY_NOT_FOUND", `pathspec '${target}' did not match any known branch`);
  }

  repo.currentBranch = target;

  return successState(state, [`Switched to branch '${target}'`], "git checkout");
}

// ============================================================================
// Command Router
// ============================================================================

export function handleGitCommand(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const subcommand = parsed.positional[0];

  switch (subcommand) {
    case "init":
      return handleGitInit(parsed, state, fs);
    case "status":
      return handleGitStatus(parsed, state, fs);
    case "add":
      return handleGitAdd(parsed, state, fs);
    case "commit":
      return handleGitCommit(parsed, state, fs);
    case "log":
      return handleGitLog(parsed, state, fs);
    case "branch":
      return handleGitBranch(parsed, state, fs);
    case "checkout":
      return handleGitCheckout(parsed, state, fs);
    default:
      return errorResult(state, "UNKNOWN_COMMAND", `Unknown git subcommand: ${subcommand ?? "(none)"}`);
  }
}

export const GIT_COMMAND_DEFINITIONS: Omit<CommandDefinition, "handler">[] = [
  { name: "git init", description: "Initialize git repository", usage: "git init", flags: [] },
  { name: "git status", description: "Show working tree status", usage: "git status", flags: [] },
  { name: "git add", description: "Add files to staging", usage: "git add <file>", flags: [] },
  {
    name: "git commit",
    description: "Record changes to repository",
    usage: "git commit -m <message>",
    flags: ["-m"],
  },
  { name: "git log", description: "Show commit logs", usage: "git log", flags: [] },
  {
    name: "git branch",
    description: "List or create branches",
    usage: "git branch [name]",
    flags: [],
  },
  {
    name: "git checkout",
    description: "Switch branches",
    usage: "git checkout <branch>",
    flags: [],
  },
];

export function resetGitState(fs?: DirectoryNode): void {
  if (fs) {
    const key = getRepoKey(fs);
    gitRepos.delete(key);
  } else {
    gitRepos.clear();
  }
}
