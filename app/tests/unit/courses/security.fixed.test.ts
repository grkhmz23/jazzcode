import { describe, expect, it } from "vitest";
import { runScenario } from "@/lib/courses/solana-security/project/exploit/run";
import { securityScenarios } from "@/lib/courses/solana-security/project/exploit/reproduce";

function getScenario(id: string) {
  const scenario = securityScenarios.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`missing scenario: ${id}`);
  }
  return scenario;
}

describe("solana security fixed runtime", () => {
  it("blocks signer-missing exploit with typed error", () => {
    const result = runScenario("fixed", getScenario("signer-missing"));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ERR_NOT_SIGNER");
  });

  it("blocks owner substitution exploit with typed error", () => {
    const result = runScenario("fixed", getScenario("owner-missing"));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ERR_BAD_OWNER");
  });

  it("blocks pda spoof exploit with typed error", () => {
    const result = runScenario("fixed", getScenario("pda-spoof"));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ERR_BAD_PDA");
  });
});
