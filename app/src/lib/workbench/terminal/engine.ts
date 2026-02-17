/**
 * Terminal engine for the Workbench
 * Command parser, dispatcher, and autocomplete
 */

import type {
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
  TerminalEntry,
  TerminalOutputLine,
  AutocompleteResult,
  AutocompleteSuggestion,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";

import { createTerminalError } from "./errors";
import { createCoreCommandHandlers, CORE_COMMAND_DEFINITIONS, getCoreAutocompleteWords } from "./commands/core";
import { handleGitCommand, GIT_COMMAND_DEFINITIONS } from "./commands/git";
import { handleSolanaCommand, SOLANA_COMMAND_DEFINITIONS } from "./commands/solana";
import { handleAnchorCommand, ANCHOR_COMMAND_DEFINITIONS } from "./commands/anchor";
import { handleSplTokenCommand, SPL_TOKEN_COMMAND_DEFINITIONS } from "./commands/spl-token";

// ============================================================================
// Command Parser
// ============================================================================

function parseQuotedArguments(input: string): string[] {
  const result: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const prev = input[i - 1];

    if ((char === '"' || char === "'") && prev !== "\\") {
      if (quote === char) {
        quote = null;
        continue;
      }
      if (!quote) {
        quote = char;
        continue;
      }
    }

    if (!quote && /\s/.test(char)) {
      if (current) {
        result.push(current);
        current = "";
      }
      continue;
    }

    if (char === "\\" && (input[i + 1] === '"' || input[i + 1] === "'" || input[i + 1] === "\\")) {
      continue;
    }

    current += char;
  }

  if (current) {
    result.push(current);
  }

  return result;
}

export function parseCommandLine(raw: string): ParsedCommand {
  const argv = parseQuotedArguments(raw.trim());
  const command = argv[0] ?? "";
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 1; i < argv.length; i++) {
    const token = argv[i];
    if (!token) continue;

    if (token.startsWith("--")) {
      const [flag, inlineValue] = token.split("=", 2);
      if (inlineValue !== undefined) {
        flags[flag] = inlineValue;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          flags[flag] = next;
          i += 1;
        } else {
          flags[flag] = true;
        }
      }
      continue;
    }

    if (token.startsWith("-")) {
      flags[token] = true;
      continue;
    }

    positional.push(token);
  }

  return {
    raw,
    command,
    argv,
    positional,
    flags,
  };
}

// ============================================================================
// Initial State
// ============================================================================

export function createInitialSimulationState(): SimulationState {
  return {
    currentDir: "/workspace",
    env: {
      LANG: "en_US.UTF-8",
      HOME: "/home/user",
      PATH: "/usr/local/bin:/usr/bin:/bin",
    },
    solanaUrl: "devnet",
    keypairs: {},
    activeKeypairPath: null,
    balances: {},
    tokenMints: {},
    knownAddresses: [],
    recentTxSignatures: [],
    pendingTransfer: null,
    commandHistory: [],
    commandSuccesses: [],
    errors: [],
  };
}

// ============================================================================
// Command Dispatcher
// ============================================================================

const coreHandlers = createCoreCommandHandlers();

const ALL_COMMAND_DEFINITIONS = [
  ...CORE_COMMAND_DEFINITIONS,
  ...GIT_COMMAND_DEFINITIONS,
  ...SOLANA_COMMAND_DEFINITIONS,
  ...ANCHOR_COMMAND_DEFINITIONS,
  ...SPL_TOKEN_COMMAND_DEFINITIONS,
];

export async function executeCommand(
  rawCommand: string,
  state: SimulationState,
  fs: DirectoryNode
): Promise<CommandExecutionResult> {
  const parsed = parseCommandLine(rawCommand);

  if (!parsed.command) {
    return {
      nextState: state,
      lines: [],
    };
  }

  // Track command in history
  const stateWithHistory: SimulationState = {
    ...state,
    commandHistory: [...state.commandHistory, parsed.raw],
  };

  // Route to appropriate handler
  let result: CommandExecutionResult;

  // Core commands
  if (parsed.command in coreHandlers) {
    const handler = coreHandlers[parsed.command];
    result = handler(parsed, stateWithHistory, fs);
  }
  // Git commands
  else if (parsed.command === "git") {
    result = handleGitCommand(parsed, stateWithHistory, fs);
  }
  // Solana commands
  else if (parsed.command === "solana") {
    result = handleSolanaCommand(parsed, stateWithHistory, fs);
  }
  // Solana keygen
  else if (parsed.command === "solana-keygen") {
    result = handleSolanaCommand(parsed, stateWithHistory, fs);
  }
  // Anchor commands
  else if (parsed.command === "anchor") {
    result = handleAnchorCommand(parsed, stateWithHistory, fs);
  }
  // SPL Token commands
  else if (parsed.command === "spl-token") {
    result = handleSplTokenCommand(parsed, stateWithHistory, fs);
  }
  // Unknown command
  else {
    const error = createTerminalError("UNKNOWN_COMMAND", `Command not found: ${parsed.command}`);
    result = {
      nextState: {
        ...stateWithHistory,
        errors: [...stateWithHistory.errors, error],
      },
      lines: [
        { kind: "error", text: `Error: ${error.message}` },
        { kind: "system", text: `Hint: ${error.hint}` },
      ],
    };
  }

  // Ensure we always return a valid result
  return result ?? {
    nextState: stateWithHistory,
    lines: [],
  };
}

// ============================================================================
// Autocomplete
// ============================================================================

export function getAutocompleteSuggestions(
  input: string,
  fs: DirectoryNode,
  currentDir: string
): AutocompleteResult {
  const trimmed = input.trim();
  const lastSpaceIndex = trimmed.lastIndexOf(" ");
  const prefix = lastSpaceIndex >= 0 ? trimmed.slice(0, lastSpaceIndex + 1) : "";
  const partial = lastSpaceIndex >= 0 ? trimmed.slice(lastSpaceIndex + 1) : trimmed;

  const suggestions: AutocompleteSuggestion[] = [];

  // If no command yet, suggest commands
  if (!prefix) {
    for (const cmd of ALL_COMMAND_DEFINITIONS) {
      if (cmd.name.startsWith(partial)) {
        suggestions.push({
          text: cmd.name,
          description: cmd.description,
          type: "command",
        });
      }
    }
  }
  // If we have a command, suggest flags or files
  else {
    const commandName = prefix.trim().split(" ")[0];
    if (!commandName) {
      return { suggestions: [], matchStart: 0, matchEnd: 0 };
    }

    const cmd = ALL_COMMAND_DEFINITIONS.find((c) => c.name === commandName || c.name.startsWith(commandName));

    if (cmd && partial.startsWith("-")) {
      // Suggest flags
      for (const flag of cmd.flags) {
        if (flag.startsWith(partial)) {
          suggestions.push({
            text: flag,
            description: "Flag",
            type: "flag",
          });
        }
      }
    } else {
      // Suggest files/paths
      const fileWords = getCoreAutocompleteWords(fs, currentDir);
      for (const word of fileWords) {
        if (word.startsWith(partial)) {
          suggestions.push({
            text: word,
            type: "file",
          });
        }
      }
    }
  }

  return {
    suggestions,
    matchStart: prefix.length,
    matchEnd: trimmed.length,
  };
}

export function applyAutocomplete(input: string, suggestion: string): string {
  const trimmed = input.trim();
  const lastSpaceIndex = trimmed.lastIndexOf(" ");

  if (lastSpaceIndex < 0) {
    return suggestion + " ";
  }

  return trimmed.slice(0, lastSpaceIndex + 1) + suggestion;
}

// ============================================================================
// Terminal Entry Helpers
// ============================================================================

export function createTerminalEntry(
  kind: TerminalEntry["kind"],
  text: string,
  timestamp = Date.now()
): TerminalEntry {
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2)}`,
    kind,
    text,
    timestamp,
  };
}

export function convertOutputLines(lines: TerminalOutputLine[]): TerminalEntry[] {
  const now = Date.now();
  return lines.map((line, index) => ({
    id: `${now}-${index}-${Math.random().toString(36).slice(2)}`,
    kind: line.kind,
    text: line.text,
    timestamp: now,
  }));
}

// ============================================================================
// Command History
// ============================================================================

export function getPreviousCommand(
  history: string[],
  currentIndex: number | null
): { command: string; index: number } | null {
  if (history.length === 0) {
    return null;
  }

  const newIndex = currentIndex === null ? history.length - 1 : Math.max(0, currentIndex - 1);
  const command = history[newIndex];

  if (!command) {
    return null;
  }

  return { command, index: newIndex };
}

export function getNextCommand(
  history: string[],
  currentIndex: number | null
): { command: string; index: number | null } | null {
  if (currentIndex === null || history.length === 0) {
    return null;
  }

  const newIndex = currentIndex + 1;
  if (newIndex >= history.length) {
    return { command: "", index: null };
  }

  const command = history[newIndex];
  if (!command) {
    return { command: "", index: null };
  }

  return { command, index: newIndex };
}
