import { COMMAND_DEFINITIONS } from "@/lib/playground/terminal/commands";
import { parseCommandLine } from "@/lib/playground/terminal/engine";

export interface AutocompleteContext {
  input: string;
  filePaths: string[];
}

export interface AutocompleteResult {
  suggestions: string[];
  replacement: string;
}

function startsWithToken(value: string, token: string): boolean {
  return value.toLowerCase().startsWith(token.toLowerCase());
}

function collectFlags(commandName: string): string[] {
  const definition = COMMAND_DEFINITIONS.find((entry) => entry.name === commandName);
  return definition?.flags ?? [];
}

function completePath(fragment: string, filePaths: string[]): string[] {
  return filePaths.filter((path) => startsWithToken(path, fragment)).sort();
}

export function getAutocompleteSuggestions({ input, filePaths }: AutocompleteContext): AutocompleteResult {
  const trimmed = input.replace(/^\s+/, "");
  const parsed = parseCommandLine(trimmed);

  if (!parsed.command) {
    return {
      suggestions: COMMAND_DEFINITIONS.map((item) => item.name).sort(),
      replacement: "",
    };
  }

  if (parsed.argv.length <= 1 && !trimmed.endsWith(" ")) {
    const suggestions = COMMAND_DEFINITIONS.map((entry) => entry.name).filter((name) => startsWithToken(name, parsed.command));
    return {
      suggestions,
      replacement: parsed.command,
    };
  }

  const lastToken = parsed.argv[parsed.argv.length - 1] ?? "";
  if (lastToken.startsWith("--")) {
    const suggestions = collectFlags(parsed.command).filter((flag) => startsWithToken(flag, lastToken));
    return { suggestions, replacement: lastToken };
  }

  const wantsPath = ["ls", "cat", "open", "cd", "solana-keygen"].includes(parsed.command);
  if (wantsPath) {
    const fragment = trimmed.endsWith(" ") ? "" : lastToken;
    const suggestions = completePath(fragment, filePaths);
    return { suggestions, replacement: fragment };
  }

  if (parsed.command === "solana") {
    const subcommands = ["config", "address", "airdrop", "balance", "transfer"];
    if (parsed.positional.length <= 1 && !trimmed.endsWith(" ")) {
      const token = parsed.positional[0] ?? "";
      return {
        suggestions: subcommands.filter((item) => startsWithToken(item, token)),
        replacement: token,
      };
    }
    if (parsed.positional[0] === "config" && parsed.positional.length <= 2) {
      const token = parsed.positional[1] ?? "";
      return {
        suggestions: ["set", "get"].filter((item) => startsWithToken(item, token)),
        replacement: token,
      };
    }
  }

  if (parsed.command === "anchor") {
    const token = parsed.positional[0] ?? "";
    return {
      suggestions: ["init", "build", "test"].filter((item) => startsWithToken(item, token)),
      replacement: token,
    };
  }

  if (parsed.command === "spl-token") {
    const token = parsed.positional[0] ?? "";
    return {
      suggestions: ["create-token", "create-account", "mint", "transfer", "supply"].filter((item) => startsWithToken(item, token)),
      replacement: token,
    };
  }

  return {
    suggestions: [],
    replacement: "",
  };
}

export function applySuggestion(input: string, replacement: string, suggestion: string): string {
  if (!replacement) {
    return input.length > 0 && !input.endsWith(" ") ? `${input} ${suggestion}` : `${input}${suggestion}`;
  }

  const index = input.lastIndexOf(replacement);
  if (index === -1) {
    return `${input}${suggestion}`;
  }

  return `${input.slice(0, index)}${suggestion}`;
}
