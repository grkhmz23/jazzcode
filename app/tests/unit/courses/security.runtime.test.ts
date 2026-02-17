import { describe, expect, it } from "vitest";
import { deriveVaultPda } from "@/lib/courses/solana-security/project/model/pda";
import { buildInstructionForScenario, getSecurityFixtures, securityScenarios } from "@/lib/courses/solana-security/project/exploit/reproduce";
import { runScenario, traceHash } from "@/lib/courses/solana-security/project/exploit/run";

function scenarioById(id: string) {
  const scenario = securityScenarios.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Missing scenario ${id}`);
  }
  return scenario;
}

describe("solana security runtime", () => {
  it("derives stable vault PDA for same seeds/bump/program", () => {
    const fixtures = getSecurityFixtures();
    const first = deriveVaultPda(fixtures.authority, fixtures.vaultBump, fixtures.programId);
    const second = deriveVaultPda(fixtures.authority, fixtures.vaultBump, fixtures.programId);

    expect(first).toEqual(second);
  });

  it("vulnerable runtime allows signer-missing exploit and drains expected amount", () => {
    const outcome = runScenario("vulnerable", scenarioById("signer-missing"));

    expect(outcome.ok).toBe(true);
    expect(outcome.beforeVaultBalance).toBe("1000");
    expect(outcome.afterVaultBalance).toBe("300");
    expect(outcome.beforeRecipientLamports).toBe("10");
    expect(outcome.afterRecipientLamports).toBe("710");

    const hash = traceHash(outcome.trace);
    expect(hash).toBe("1e612fd4a559172c834daee280d2c69ff736ddfef7d9c1fc9e3279a1256743ff");
  });

  it("trace hashing is deterministic for repeated runs", () => {
    const scenario = scenarioById("owner-missing");
    const first = runScenario("vulnerable", scenario);
    const second = runScenario("vulnerable", scenario);

    expect(traceHash(first.trace)).toBe(traceHash(second.trace));
  });

  it("instruction account refs are stable for scenario construction", () => {
    const instruction = buildInstructionForScenario(scenarioById("pda-spoof"));

    expect(instruction.name).toBe("withdraw");
    expect(instruction.accounts.authority).toBe(getSecurityFixtures().authority);
    expect(instruction.accounts.recipientAccount).toBe(getSecurityFixtures().recipient);
  });
});
