/**
 * Core filesystem and shell commands for the Workbench terminal
 */

import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";
import {
  createDirectoryNode,
  createFileNode,
  findNode,
  getNodeName,
  getParentPath,
  insertNode,
  listAllFilePaths,
  listDirectory,
  normalizeFSPath,
  removeNode,
  renameNode,
  resolvePath,
} from "@/lib/workbench/fs";
import { createTerminalError } from "../errors";

function outputLines(
  lines: string[],
  kind: "output" | "error" | "system" = "output"
): CommandExecutionResult["lines"] {
  return lines.map((text) => ({ kind, text }));
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
    lines: outputLines(lines),
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

function handleHelp(state: SimulationState): CommandExecutionResult {
  const commands = [
    ["ls [path]", "List directory contents"],
    ["cd <path>", "Change directory"],
    ["pwd", "Print working directory"],
    ["cat <file>", "Display file contents"],
    ["mkdir <dir>", "Create directory"],
    ["touch <file>", "Create empty file"],
    ["rm <path>", "Remove file or directory"],
    ["cp <src> <dst>", "Copy file"],
    ["mv <src> <dst>", "Move/rename file"],
    ["echo <text>", "Print text"],
    ["clear", "Clear terminal"],
    ["help", "Show this help"],
    ["", ""],
    ["solana <cmd>", "Solana CLI commands"],
    ["solana-keygen <cmd>", "Keypair management"],
    ["anchor <cmd>", "Anchor framework"],
    ["spl-token <cmd>", "SPL token commands"],
    ["git <cmd>", "Git commands (simulated)"],
  ];

  const lines = commands.map(([cmd, desc]) => (cmd ? `${cmd.padEnd(20)} ${desc}` : ""));

  return successState(state, lines, "help");
}

function handlePwd(state: SimulationState): CommandExecutionResult {
  return successState(state, [state.currentDir], "pwd");
}

function handleCd(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const target = parsed.positional[0] ?? "~";
  const resolved = resolvePath(state.currentDir, target);
  const normalized = normalizeFSPath(resolved);

  const node = findNode(fs, normalized);
  if (!node) {
    return errorResult(state, "DIRECTORY_NOT_FOUND");
  }
  if (node.type !== "directory") {
    return errorResult(state, "NOT_A_DIRECTORY");
  }

  return {
    nextState: {
      ...state,
      currentDir: normalized,
      commandSuccesses: [...state.commandSuccesses, "cd"],
    },
    lines: [],
    metadata: { commandSucceeded: `cd ${target}` },
  };
}

function handleLs(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const target = parsed.positional[0] ?? ".";
  const resolved = resolvePath(state.currentDir, target);
  const normalized = normalizeFSPath(resolved);

  const node = findNode(fs, normalized);
  if (!node) {
    return errorResult(state, "DIRECTORY_NOT_FOUND");
  }

  let entries: import("@/lib/workbench/fs").FSNode[];
  if (node.type === "file") {
    entries = [node];
  } else {
    const listed = listDirectory(fs, normalized);
    if (!listed) {
      return errorResult(state, "DIRECTORY_NOT_FOUND");
    }
    entries = listed;
  }

  const lines = entries.map((entry) => {
    const suffix = entry.type === "directory" ? "/" : "";
    const prefix = entry.type === "directory" ? "📁 " : "📄 ";
    return `${prefix}${entry.name}${suffix}`;
  });

  if (lines.length === 0) {
    lines.push("(empty directory)");
  }

  return successState(state, lines, "ls");
}

function handleCat(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const target = parsed.positional[0];
  if (!target) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: cat <file>");
  }

  const resolved = resolvePath(state.currentDir, target);
  const normalized = normalizeFSPath(resolved);

  const node = findNode(fs, normalized);
  if (!node) {
    return errorResult(state, "FILE_NOT_FOUND");
  }
  if (node.type !== "file") {
    return errorResult(state, "IS_A_DIRECTORY");
  }

  const content = node.content;
  const lines = content ? content.split("\n") : ["(empty file)"];

  return successState(state, lines, "cat");
}

function handleMkdir(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const dirName = parsed.positional[0];
  if (!dirName) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: mkdir <directory>");
  }

  const resolved = resolvePath(state.currentDir, dirName);
  const normalized = normalizeFSPath(resolved);

  if (findNode(fs, normalized)) {
    return errorResult(state, "FILE_EXISTS");
  }

  const parentPath = getParentPath(normalized);
  if (!parentPath) {
    return errorResult(state, "PERMISSION_DENIED", "Cannot create root directory");
  }

  const parent = findNode(fs, parentPath);
  if (!parent) {
    return errorResult(state, "DIRECTORY_NOT_FOUND", "Parent directory does not exist");
  }
  if (parent.type !== "directory") {
    return errorResult(state, "NOT_A_DIRECTORY", "Parent is not a directory");
  }

  const newDir = createDirectoryNode(normalized);
  const inserted = insertNode(fs, newDir);
  if (!inserted) {
    return errorResult(state, "FILE_EXISTS");
  }

  return successState(state, [`Created directory: ${getNodeName(normalized)}`], "mkdir");
}

function handleTouch(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const fileName = parsed.positional[0];
  if (!fileName) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: touch <file>");
  }

  const resolved = resolvePath(state.currentDir, fileName);
  const normalized = normalizeFSPath(resolved);

  // If file exists, just update timestamp (simulated)
  const existing = findNode(fs, normalized);
  if (existing) {
    if (existing.type !== "file") {
      return errorResult(state, "IS_A_DIRECTORY");
    }
    // Just return success for existing file
    return successState(state, [], "touch");
  }

  const parentPath = getParentPath(normalized);
  if (!parentPath) {
    return errorResult(state, "PERMISSION_DENIED", "Cannot create file at root");
  }

  const parent = findNode(fs, parentPath);
  if (!parent) {
    return errorResult(state, "DIRECTORY_NOT_FOUND", "Parent directory does not exist");
  }
  if (parent.type !== "directory") {
    return errorResult(state, "NOT_A_DIRECTORY");
  }

  const newFile = createFileNode(normalized, "");
  const inserted = insertNode(fs, newFile);
  if (!inserted) {
    return errorResult(state, "FILE_EXISTS");
  }

  return successState(state, [], "touch");
}

function handleRm(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const target = parsed.positional[0];
  const recursive = parsed.flags["-r"] === true || parsed.flags["--recursive"] === true;

  if (!target) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: rm [-r] <path>");
  }

  const resolved = resolvePath(state.currentDir, target);
  const normalized = normalizeFSPath(resolved);

  const node = findNode(fs, normalized);
  if (!node) {
    return errorResult(state, "FILE_NOT_FOUND");
  }

  if (node.type === "directory" && !recursive) {
    return errorResult(state, "IS_A_DIRECTORY", "Use -r to remove directories");
  }

  const parentPath = getParentPath(normalized);
  if (!parentPath) {
    return errorResult(state, "PERMISSION_DENIED", "Cannot remove root directory");
  }

  const removed = removeNode(fs, normalized);
  if (!removed) {
    return errorResult(state, "FILE_NOT_FOUND");
  }

  const name = getNodeName(normalized);
  return successState(state, [`Removed: ${name}`], "rm");
}

function handleCp(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const source = parsed.positional[0];
  const dest = parsed.positional[1];

  if (!source || !dest) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: cp <source> <destination>");
  }

  const sourceResolved = resolvePath(state.currentDir, source);
  const sourceNormalized = normalizeFSPath(sourceResolved);
  const destResolved = resolvePath(state.currentDir, dest);
  const destNormalized = normalizeFSPath(destResolved);

  const sourceNode = findNode(fs, sourceNormalized);
  if (!sourceNode) {
    return errorResult(state, "FILE_NOT_FOUND", "Source not found");
  }
  if (sourceNode.type !== "file") {
    return errorResult(state, "IS_A_DIRECTORY", "Can only copy files");
  }

  if (findNode(fs, destNormalized)) {
    return errorResult(state, "FILE_EXISTS", "Destination already exists");
  }

  const parentPath = getParentPath(destNormalized);
  if (!parentPath) {
    return errorResult(state, "PERMISSION_DENIED");
  }

  const parent = findNode(fs, parentPath);
  if (!parent || parent.type !== "directory") {
    return errorResult(state, "DIRECTORY_NOT_FOUND", "Destination directory does not exist");
  }

  const newFile = createFileNode(destNormalized, sourceNode.content);
  const inserted = insertNode(fs, newFile);
  if (!inserted) {
    return errorResult(state, "FILE_EXISTS");
  }

  return successState(state, [`Copied: ${getNodeName(sourceNormalized)} -> ${getNodeName(destNormalized)}`], "cp");
}

function handleMv(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const source = parsed.positional[0];
  const dest = parsed.positional[1];

  if (!source || !dest) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: mv <source> <destination>");
  }

  const sourceResolved = resolvePath(state.currentDir, source);
  const sourceNormalized = normalizeFSPath(sourceResolved);
  const destResolved = resolvePath(state.currentDir, dest);
  const destNormalized = normalizeFSPath(destResolved);

  const sourceNode = findNode(fs, sourceNormalized);
  if (!sourceNode) {
    return errorResult(state, "FILE_NOT_FOUND", "Source not found");
  }

  if (findNode(fs, destNormalized)) {
    return errorResult(state, "FILE_EXISTS", "Destination already exists");
  }

  const renamed = renameNode(fs, sourceNormalized, destNormalized);
  if (!renamed) {
    return errorResult(state, "FILE_NOT_FOUND");
  }

  return successState(state, [`Moved: ${getNodeName(sourceNormalized)} -> ${getNodeName(destNormalized)}`], "mv");
}

function handleEcho(parsed: ParsedCommand, state: SimulationState): CommandExecutionResult {
  const text = parsed.positional.join(" ");
  return successState(state, [text || ""], "echo");
}

function handleClear(state: SimulationState): CommandExecutionResult {
  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, "clear"],
    },
    lines: [],
    shouldClear: true,
  };
}

// ============================================================================
// Command Definitions
// ============================================================================

export const CORE_COMMAND_DEFINITIONS: Omit<CommandDefinition, "handler">[] = [
  { name: "help", description: "Show available commands", usage: "help", flags: [] },
  { name: "clear", description: "Clear terminal screen", usage: "clear", flags: [] },
  { name: "pwd", description: "Print working directory", usage: "pwd", flags: [] },
  { name: "ls", description: "List directory contents", usage: "ls [path]", flags: [] },
  { name: "cd", description: "Change directory", usage: "cd <path>", flags: [] },
  { name: "cat", description: "Display file contents", usage: "cat <file>", flags: [] },
  { name: "mkdir", description: "Create directory", usage: "mkdir <directory>", flags: [] },
  { name: "touch", description: "Create empty file", usage: "touch <file>", flags: [] },
  { name: "rm", description: "Remove file or directory", usage: "rm [-r] <path>", flags: ["-r", "--recursive"] },
  { name: "cp", description: "Copy file", usage: "cp <source> <destination>", flags: [] },
  { name: "mv", description: "Move or rename file", usage: "mv <source> <destination>", flags: [] },
  { name: "echo", description: "Print text", usage: "echo <text>", flags: [] },
];

export function createCoreCommandHandlers(): Record<
  string,
  (parsed: ParsedCommand, state: SimulationState, fs: DirectoryNode) => CommandExecutionResult
> {
  return {
    help: (_, state) => handleHelp(state),
    clear: (_, state) => handleClear(state),
    pwd: (_, state) => handlePwd(state),
    cd: handleCd,
    ls: handleLs,
    cat: handleCat,
    mkdir: handleMkdir,
    touch: handleTouch,
    rm: handleRm,
    cp: handleCp,
    mv: handleMv,
    echo: handleEcho,
  };
}

export function getCoreAutocompleteWords(fs: DirectoryNode, currentDir: string): string[] {
  const words: string[] = [];
  const allPaths = listAllFilePaths(fs);

  for (const path of allPaths) {
    // Add relative paths
    if (path.startsWith(currentDir)) {
      const relative = path.slice(currentDir.length).replace(/^\//, "");
      if (relative) {
        words.push(relative);
        // Add just the first component for directory navigation
        const firstComponent = relative.split("/")[0];
        if (firstComponent) {
          words.push(firstComponent);
        }
      }
    }
  }

  return [...new Set(words)].sort();
}
