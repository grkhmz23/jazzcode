/**
 * Unit tests for Workbench terminal
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  parseCommandLine,
  createInitialSimulationState,
  executeCommand,
} from "@/lib/workbench/terminal/engine";
import { createDirectoryNode, createFileSystemFromFiles } from "@/lib/workbench/fs";
import type { SimulationState, DirectoryNode } from "@/lib/workbench";
import { resetGitState } from "@/lib/workbench/terminal/commands/git";

describe("Terminal Parser", () => {
  it("should parse simple commands", () => {
    const result = parseCommandLine("ls");
    expect(result.command).toBe("ls");
    expect(result.positional).toEqual([]);
    expect(result.flags).toEqual({});
  });

  it("should parse commands with arguments", () => {
    const result = parseCommandLine("cd /home/user");
    expect(result.command).toBe("cd");
    expect(result.positional).toEqual(["/home/user"]);
  });

  it("should parse commands with flags", () => {
    const result = parseCommandLine("solana config set --url devnet");
    expect(result.command).toBe("solana");
    expect(result.positional).toEqual(["config", "set"]);
    expect(result.flags["--url"]).toBe("devnet");
  });

  it("should parse boolean flags", () => {
    const result = parseCommandLine("ls -la");
    expect(result.flags["-la"]).toBe(true);
  });

  it("should parse quoted arguments", () => {
    const result = parseCommandLine('echo "hello world"');
    expect(result.command).toBe("echo");
    expect(result.positional).toEqual(["hello world"]);
  });

  it("should handle empty input", () => {
    const result = parseCommandLine("");
    expect(result.command).toBe("");
  });

  it("should parse inline flag values", () => {
    const result = parseCommandLine("git commit -m=\"initial commit\"");
    expect(result.command).toBe("git");
    expect(result.flags["-m"]).toBe("initial commit");
  });
});

describe("Terminal Command Execution", () => {
  let state: SimulationState;
  let fs: DirectoryNode;

  beforeEach(() => {
    state = createInitialSimulationState();
    fs = createFileSystemFromFiles({
      "README.md": "# Test",
      "src/index.ts": "console.log('hello');",
    });
  });

  it("should execute help command", async () => {
    const result = await executeCommand("help", state, fs);
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.nextState.commandSuccesses).toContain("help");
  });

  it("should execute pwd command", async () => {
    const result = await executeCommand("pwd", state, fs);
    expect(result.lines[0]?.text).toBe("/workspace");
  });

  it("should execute ls command", async () => {
    const result = await executeCommand("ls", state, fs);
    expect(result.lines.length).toBeGreaterThan(0);
  });

  it("should change directory with cd", async () => {
    const result = await executeCommand("cd src", state, fs);
    expect(result.nextState.currentDir).toBe("/workspace/src");
  });

  it("should show error for non-existent directory", async () => {
    const result = await executeCommand("cd nonexistent", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });

  it("should execute echo command", async () => {
    const result = await executeCommand("echo hello world", state, fs);
    expect(result.lines[0]?.text).toBe("hello world");
  });

  it("should clear terminal with clear command", async () => {
    const result = await executeCommand("clear", state, fs);
    expect(result.shouldClear).toBe(true);
  });

  it("should show error for unknown commands", async () => {
    const result = await executeCommand("unknowncommand", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });
});

describe("Solana Command Simulation", () => {
  let state: SimulationState;
  let fs: DirectoryNode;

  beforeEach(() => {
    state = createInitialSimulationState();
    fs = createDirectoryNode("/workspace");
  });

  it("should set solana config to devnet", async () => {
    const result = await executeCommand("solana config set --url devnet", state, fs);
    expect(result.nextState.solanaUrl).toBe("devnet");
    expect(result.nextState.commandSuccesses).toContain("solana:config:set");
  });

  it("should reject invalid network URL", async () => {
    const result = await executeCommand("solana config set --url invalid", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });

  it("should show error for address without wallet", async () => {
    const result = await executeCommand("solana address", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });

  it("should require wallet for airdrop", async () => {
    const result = await executeCommand("solana airdrop 2", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });

  it("should generate keypair", async () => {
    const result = await executeCommand("solana-keygen new --outfile ~/my-keypair.json", state, fs);
    expect(Object.keys(result.nextState.keypairs).length).toBe(1);
    expect(result.nextState.commandSuccesses).toContain("solana:keygen:new");
  });

  it("should perform airdrop after keypair creation", async () => {
    // First create a keypair
    let result = await executeCommand("solana-keygen new --outfile ~/my-keypair.json", state, fs);
    const newState = result.nextState;

    // Then request airdrop
    result = await executeCommand("solana airdrop 2", newState, fs);
    const address = Object.keys(result.nextState.balances)[0];
    expect(address).toBeDefined();
    expect(result.nextState.balances[address!]).toBe(2);
  });

  it("should check balance correctly", async () => {
    // Setup: create keypair and get airdrop
    let result = await executeCommand("solana-keygen new --outfile ~/my-keypair.json", state, fs);
    result = await executeCommand("solana airdrop 2", result.nextState, fs);

    // Check balance
    result = await executeCommand("solana balance", result.nextState, fs);
    expect(result.lines[0]?.text).toContain("2.");
  });

  it("should transfer SOL between addresses", async () => {
    // Setup: create two keypairs and fund the first
    let result = await executeCommand("solana-keygen new --outfile ~/keypair1.json", state, fs);
    const state1 = result.nextState;
    result = await executeCommand("solana-keygen new --outfile ~/keypair2.json", state1, fs);
    const state2 = result.nextState;
    result = await executeCommand("solana airdrop 2", state2, fs);
    const state3 = result.nextState;

    const senderAddress = Object.keys(state3.keypairs)[0];
    const sender = state3.keypairs[senderAddress!];
    expect(sender).toBeDefined();
    const recipientAddress = Object.keys(state3.keypairs)[1];
    const recipient = state3.keypairs[recipientAddress!];
    expect(recipient).toBeDefined();

    // Transfer
    result = await executeCommand(`solana transfer ${recipient?.publicKey} 0.5`, state3, fs);

    expect(result.nextState.balances[sender?.publicKey ?? ""]).toBe(1.5);
    expect(result.nextState.balances[recipient?.publicKey ?? ""]).toBe(0.5);
  });

  it("should reject transfer with insufficient funds", async () => {
    // Setup: create keypair with small balance
    let result = await executeCommand("solana-keygen new --outfile ~/keypair1.json", state, fs);
    result = await executeCommand("solana airdrop 0.5", result.nextState, fs);

    const senderAddress = Object.keys(result.nextState.keypairs)[0];
    const sender = result.nextState.keypairs[senderAddress!];
    expect(sender).toBeDefined();

    // Try to transfer more than balance
    result = await executeCommand(`solana transfer ${sender?.publicKey ?? ""} 1`, result.nextState, fs);

    expect(result.lines.some((line) => line.text.includes("Insufficient funds"))).toBe(true);
  });
});

describe("SPL Token Command Simulation", () => {
  let state: SimulationState;
  let fs: DirectoryNode;

  beforeEach(() => {
    state = createInitialSimulationState();
    fs = createDirectoryNode("/workspace");
  });

  it("should create a token mint", async () => {
    // First create a wallet
    let result = await executeCommand("solana-keygen new --outfile ~/keypair.json", state, fs);

    result = await executeCommand("spl-token create-token", result.nextState, fs);
    expect(Object.keys(result.nextState.tokenMints).length).toBe(1);
  });

  it("should mint tokens", async () => {
    // Setup wallet and token
    let result = await executeCommand("solana-keygen new --outfile ~/keypair.json", state, fs);
    result = await executeCommand("spl-token create-token", result.nextState, fs);
    const mintAddress = Object.keys(result.nextState.tokenMints)[0];

    // Create account
    result = await executeCommand(`spl-token create-account ${mintAddress}`, result.nextState, fs);

    // Mint tokens
    result = await executeCommand(`spl-token mint ${mintAddress} 1000`, result.nextState, fs);

    const address = Object.keys(result.nextState.keypairs)[0];
    const keypair = result.nextState.keypairs[address!];
    expect(keypair).toBeDefined();
    expect(result.nextState.tokenMints[mintAddress!]?.supply).toBe(1000);
    expect(result.nextState.tokenMints[mintAddress!]?.balances[keypair?.publicKey ?? ""]).toBe(1000);
  });

  it("should show token supply", async () => {
    // Setup
    let result = await executeCommand("solana-keygen new --outfile ~/keypair.json", state, fs);
    result = await executeCommand("spl-token create-token", result.nextState, fs);
    const mintAddress = Object.keys(result.nextState.tokenMints)[0];

    result = await executeCommand(`spl-token supply ${mintAddress}`, result.nextState, fs);
    expect(result.lines[0]?.text).toBe("0");
  });
});

describe("Git Command Simulation", () => {
  let state: SimulationState;
  let fs: DirectoryNode;

  beforeEach(() => {
    state = createInitialSimulationState();
    fs = createDirectoryNode("/workspace");
    resetGitState(); // Clear all git repos for test isolation
  });

  it("should initialize git repository", async () => {
    const result = await executeCommand("git init", state, fs);
    expect(result.lines[0]?.text).toContain("Initialized empty Git repository");
  });

  it("should show error for git status without init", async () => {
    const result = await executeCommand("git status", state, fs);
    expect(result.lines.some((line) => line.kind === "error")).toBe(true);
  });

  it("should show status after init", async () => {
    let result = await executeCommand("git init", state, fs);
    result = await executeCommand("git status", result.nextState, fs);
    expect(result.lines[0]?.text).toContain("On branch main");
  });
});
