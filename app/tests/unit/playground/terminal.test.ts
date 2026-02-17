/**
 * Terminal Engine Tests
 */

import { describe, it, expect } from "vitest";
import { parseCommandLine, createInitialTerminalState } from "@/lib/playground/terminal/engine";
import { COMMAND_DEFINITIONS } from "@/lib/playground/terminal/commands";

describe("Terminal Engine", () => {
  describe("parseCommandLine", () => {
    it("should parse simple commands", () => {
      const result = parseCommandLine("help");
      expect(result.command).toBe("help");
      expect(result.argv).toEqual(["help"]);
      expect(result.positional).toEqual([]);
      expect(result.flags).toEqual({});
    });

    it("should parse commands with arguments", () => {
      const result = parseCommandLine("solana config set --url devnet");
      expect(result.command).toBe("solana");
      expect(result.argv).toEqual(["solana", "config", "set", "--url", "devnet"]);
      expect(result.positional).toEqual(["config", "set"]);
      expect(result.flags).toEqual({ "--url": "devnet" });
    });

    it("should treat short flags as positional arguments (simple parser)", () => {
      const result = parseCommandLine("ls -la");
      expect(result.command).toBe("ls");
      expect(result.positional).toEqual(["-la"]);
      expect(result.flags).toEqual({});
    });

    it("should parse flags with inline values", () => {
      const result = parseCommandLine("anchor init myproject --template=default");
      expect(result.command).toBe("anchor");
      expect(result.positional).toEqual(["init", "myproject"]);
      expect(result.flags).toEqual({ "--template": "default" });
    });

    it("should handle quoted arguments", () => {
      const result = parseCommandLine('echo "hello world"');
      expect(result.command).toBe("echo");
      expect(result.positional).toEqual(["hello world"]);
    });

    it("should handle single quotes", () => {
      const result = parseCommandLine("echo 'hello world'");
      expect(result.command).toBe("echo");
      expect(result.positional).toEqual(["hello world"]);
    });

    it("should handle mixed quotes", () => {
      const result = parseCommandLine('echo "hello" \'world\'');
      expect(result.command).toBe("echo");
      expect(result.positional).toEqual(["hello", "world"]);
    });

    it("should handle escaped quotes", () => {
      const result = parseCommandLine('echo "say \\"hello\\""');
      expect(result.command).toBe("echo");
      expect(result.positional).toEqual(['say "hello"']);
    });

    it("should trim whitespace", () => {
      const result = parseCommandLine("  help  ");
      expect(result.command).toBe("help");
    });

    it("should handle empty input", () => {
      const result = parseCommandLine("");
      expect(result.command).toBe("");
      expect(result.argv).toEqual([]);
    });
  });

  describe("createInitialTerminalState", () => {
    it("should create initial state with defaults", () => {
      const state = createInitialTerminalState();
      expect(state.cwd).toBe("/");
      expect(state.env.LANG).toBe("en_US.UTF-8");
      expect(state.solanaUrl).toBe("devnet");
      expect(state.keypairs).toEqual({});
      expect(state.activeKeypairPath).toBeNull();
      expect(state.knownAddresses).toEqual([]);
      expect(state.recentTxSignatures).toEqual([]);
      expect(state.commandSuccesses).toEqual([]);
      expect(state.commandHistory).toEqual([]);
      expect(state.errors).toEqual([]);
      expect(state.simulatedBalances).toEqual({});
      expect(state.tokenMints).toEqual({});
      expect(state.pendingTransfer).toBeNull();
    });
  });
});

describe("Terminal Commands", () => {
  describe("Command Registry", () => {
    it("should include help command", () => {
      const helpCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "help");
      expect(helpCmd).toBeDefined();
      expect(helpCmd?.description).toBe("List supported commands.");
    });

    it("should include clear command", () => {
      const clearCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "clear");
      expect(clearCmd).toBeDefined();
      expect(clearCmd?.description).toBe("Clear terminal output.");
    });

    it("should include ls command", () => {
      const lsCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "ls");
      expect(lsCmd).toBeDefined();
      expect(lsCmd?.description).toBe("List files/directories.");
    });

    it("should include cd command", () => {
      const cdCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "cd");
      expect(cdCmd).toBeDefined();
      expect(cdCmd?.description).toBe("Change directory.");
    });

    it("should include cat command", () => {
      const catCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "cat");
      expect(catCmd).toBeDefined();
      expect(catCmd?.description).toBe("Print file content.");
    });

    it("should include pwd command", () => {
      const pwdCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "pwd");
      expect(pwdCmd).toBeDefined();
      expect(pwdCmd?.description).toBe("Print current directory.");
    });

    it("should include echo command", () => {
      const echoCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "echo");
      expect(echoCmd).toBeDefined();
      expect(echoCmd?.description).toBe("Echo text.");
    });

    it("should include open command", () => {
      const openCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "open");
      expect(openCmd).toBeDefined();
      expect(openCmd?.description).toBe("Open file in editor.");
    });

    it("should include solana command", () => {
      const solanaCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "solana");
      expect(solanaCmd).toBeDefined();
      expect(solanaCmd?.flags).toContain("--url");
    });

    it("should include anchor command", () => {
      const anchorCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "anchor");
      expect(anchorCmd).toBeDefined();
    });

    it("should include spl-token command", () => {
      const splCmd = COMMAND_DEFINITIONS.find((c: { name: string }) => c.name === "spl-token");
      expect(splCmd).toBeDefined();
      expect(splCmd?.flags).toContain("--decimals");
    });
  });
});
