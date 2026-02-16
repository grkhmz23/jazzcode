import { describe, expect, it } from "vitest";
import {
  createInitialTerminalState,
  parseTerminalCommand,
  runTerminalCommand,
} from "@/lib/terminal-sim";

describe("terminal simulator parser", () => {
  it("parses quoted args", () => {
    const tokens = parseTerminalCommand('solana config set --url "devnet"');
    expect(tokens).toEqual(["solana", "config", "set", "--url", "devnet"]);
  });
});

describe("terminal simulator state machine", () => {
  it("sets and gets config url", () => {
    let state = createInitialTerminalState();
    const setResult = runTerminalCommand(state, "solana config set --url testnet");
    state = setResult.state;
    expect(setResult.exitCode).toBe(0);
    const getResult = runTerminalCommand(state, "solana config get");
    expect(getResult.stdout).toContain("testnet");
  });

  it("rejects invalid config url", () => {
    const result = runTerminalCommand(
      createInitialTerminalState(),
      "solana config set --url banana"
    );
    expect(result.exitCode).toBe(1);
  });

  it("creates keypair and returns deterministic address", () => {
    const initial = createInitialTerminalState();
    const a = runTerminalCommand(initial, "solana-keygen new --outfile ~/.config/solana/id.json");
    const b = runTerminalCommand(createInitialTerminalState(), "solana-keygen new --outfile ~/.config/solana/id.json");
    expect(a.stdout).toContain("pubkey:");
    expect(a.stdout).toBe(b.stdout);
  });

  it("returns default address after keygen", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new --outfile ~/.config/solana/id.json").state;
    const result = runTerminalCommand(state, "solana address");
    expect(result.exitCode).toBe(0);
    expect(result.stdout.length).toBeGreaterThan(20);
  });

  it("fails address before keygen", () => {
    const result = runTerminalCommand(createInitialTerminalState(), "solana address");
    expect(result.exitCode).toBe(1);
  });

  it("airdrops funds and updates balance", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const drop = runTerminalCommand(state, "solana airdrop 2");
    state = drop.state;
    const balance = runTerminalCommand(state, "solana balance");
    expect(drop.exitCode).toBe(0);
    expect(balance.stdout).toContain("2 SOL");
  });

  it("enforces airdrop cap", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const drop = runTerminalCommand(state, "solana airdrop 6");
    expect(drop.exitCode).toBe(1);
  });

  it("transfers with fee deduction", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    state = runTerminalCommand(state, "solana airdrop 2").state;
    const from = runTerminalCommand(state, "solana address").stdout;
    const transfer = runTerminalCommand(state, "solana transfer Rec1p11111111111111111111111111111111 1");
    state = transfer.state;
    expect(transfer.exitCode).toBe(0);
    const senderLamports = state.balances[from];
    expect(senderLamports).toBe(BigInt(999_995_000));
  });

  it("rejects transfer with insufficient balance", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const transfer = runTerminalCommand(state, "solana transfer Rec 1");
    expect(transfer.exitCode).toBe(1);
  });

  it("creates token with default decimals", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const result = runTerminalCommand(state, "spl-token create-token");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Decimals: 9");
  });

  it("creates token account", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const tokenResult = runTerminalCommand(state, "spl-token create-token");
    state = tokenResult.state;
    const mint = tokenResult.stdout.split("Address: ")[1].split("\n")[0];
    const ata = runTerminalCommand(state, `spl-token create-account ${mint}`);
    expect(ata.exitCode).toBe(0);
  });

  it("mints tokens into existing ATA", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const tokenResult = runTerminalCommand(state, "spl-token create-token");
    state = tokenResult.state;
    const mint = tokenResult.stdout.split("Address: ")[1].split("\n")[0];
    const ataResult = runTerminalCommand(state, `spl-token create-account ${mint}`);
    state = ataResult.state;
    const ata = ataResult.stdout.split("Creating account ")[1].split("\n")[0];
    const mintResult = runTerminalCommand(state, `spl-token mint ${mint} 100 ${ata}`);
    expect(mintResult.exitCode).toBe(0);
    const supply = runTerminalCommand(mintResult.state, `spl-token supply ${mint}`);
    expect(supply.stdout).toBe("100");
  });

  it("rejects mint without token account", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const token = runTerminalCommand(state, "spl-token create-token");
    state = token.state;
    const mint = token.stdout.split("Address: ")[1].split("\n")[0];
    const result = runTerminalCommand(state, `spl-token mint ${mint} 10`);
    expect(result.exitCode).toBe(1);
  });

  it("transfers tokens to recipient", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const token = runTerminalCommand(state, "spl-token create-token");
    state = token.state;
    const mint = token.stdout.split("Address: ")[1].split("\n")[0];

    const src = runTerminalCommand(state, `spl-token create-account ${mint}`);
    state = src.state;
    const srcAta = src.stdout.split("Creating account ")[1].split("\n")[0];

    state = runTerminalCommand(state, `spl-token mint ${mint} 500 ${srcAta}`).state;
    const transfer = runTerminalCommand(
      state,
      `spl-token transfer ${mint} 120 Recipient111111111111111111111111111111`
    );
    expect(transfer.exitCode).toBe(0);
  });

  it("rejects token transfer with insufficient balance", () => {
    let state = createInitialTerminalState();
    state = runTerminalCommand(state, "solana-keygen new").state;
    const token = runTerminalCommand(state, "spl-token create-token");
    state = token.state;
    const mint = token.stdout.split("Address: ")[1].split("\n")[0];
    state = runTerminalCommand(state, `spl-token create-account ${mint}`).state;
    const transfer = runTerminalCommand(
      state,
      `spl-token transfer ${mint} 10 Recipient111111111111111111111111111111`
    );
    expect(transfer.exitCode).toBe(1);
  });

  it("returns command not found for unknown binary", () => {
    const result = runTerminalCommand(createInitialTerminalState(), "foo bar");
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("command not found");
  });
});
