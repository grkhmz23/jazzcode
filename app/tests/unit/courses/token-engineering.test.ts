import { describe, expect, it } from "vitest";
import basicFixture from "@/lib/courses/token-engineering/project/fixtures/token-config.basic.json";
import feesFixture from "@/lib/courses/token-engineering/project/fixtures/token-config.fees.json";
import lockedFixture from "@/lib/courses/token-engineering/project/fixtures/token-config.locked.json";
import { deriveAtaAddress, deriveMintAddress } from "@/lib/courses/token-engineering/project/address/derive";
import { validateTokenConfig } from "@/lib/courses/token-engineering/project/validation/validate";
import { buildInitPlan } from "@/lib/courses/token-engineering/project/token2022/instruction-plan";
import { calculateTransferFee } from "@/lib/courses/token-engineering/project/simulation/fees";
import { simulateDistribution } from "@/lib/courses/token-engineering/project/simulation/transfers";
import { buildLaunchPackSummaryJson, hashFixture } from "@/lib/courses/token-engineering/project/checkpoint/summary";
import { ENCODING_VERSION } from "@/lib/courses/token-engineering/project/constants";

function expectBase58ish(address: string): void {
  expect(address).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
}

describe("Token Engineering V2 deterministic helpers", () => {
  it("validates good fixtures and rejects bad config", () => {
    const valid = validateTokenConfig(feesFixture);
    expect(valid.config.symbol).toBe("JFEE");
    expect(valid.recipientsTotal).toBe("20000000000");

    const badDecimals = {
      ...basicFixture,
      decimals: 12,
    };

    const badRecipientSum = {
      ...basicFixture,
      recipients: [
        { owner: basicFixture.recipients[0].owner, amount: "999999999999" },
      ],
    };

    expect(() => validateTokenConfig(badDecimals)).toThrow("decimals out of range");
    expect(() => validateTokenConfig(badRecipientSum)).toThrow("recipients total exceeds initialSupply");
  });

  it("derives deterministic mint and ata pseudo-addresses", () => {
    const mintA = deriveMintAddress("JUSD", "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY");
    const mintB = deriveMintAddress("JUSD", "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY");
    expect(mintA).toBe(mintB);
    expect(mintA).toHaveLength(44);
    expectBase58ish(mintA);

    const ataA = deriveAtaAddress(mintA, "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo");
    const ataB = deriveAtaAddress(mintA, "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo");
    expect(ataA).toBe(ataB);
    expect(ataA).toHaveLength(44);
    expectBase58ish(ataA);
  });

  it("builds deterministic init plan labels and payload encoding", () => {
    const { config } = validateTokenConfig(feesFixture);
    const mint = deriveMintAddress(config.symbol, config.mintAuthority);
    const initPlan = buildInitPlan(config, mint);

    expect(initPlan.length).toBe(4);
    expect(initPlan.map((step) => step.label)).toEqual([
      "create-mint-account",
      "init-mint-decimals-6",
      "extension-transfer-fee",
      "extension-default-account-state",
    ]);

    const payloadA = initPlan[0].dataBase64;
    const payloadB = buildInitPlan(config, mint)[0].dataBase64;
    expect(payloadA).toBe(payloadB);
  });

  it("applies fee math with cap and simulates distribution totals", () => {
    expect(calculateTransferFee("1000000", 250, "5000000")).toBe("25000");
    expect(calculateTransferFee("250000000", 250, "5000000")).toBe("5000000");

    const simulation = simulateDistribution(validateTokenConfig(feesFixture).config);
    expect(simulation.totalDistributed).toBe("20000000000");
    expect(simulation.remaining).toBe("30000000000");
    expect(simulation.totalFees).toBe("10000000");
  });

  it("builds stable checkpoint summary JSON and determinism metadata", () => {
    const { config } = validateTokenConfig(lockedFixture);
    const summaryJson = buildLaunchPackSummaryJson({
      config,
      fixture: lockedFixture,
    });

    const parsed = JSON.parse(summaryJson) as {
      mint: string;
      plan: { labels: string[] };
      determinism: { fixturesHash: string; encodingVersion: string };
    };

    expect(Object.keys(parsed)).toEqual([
      "mint",
      "token",
      "authorities",
      "extensions",
      "supply",
      "plan",
      "invariants",
      "determinism",
    ]);
    expect(parsed.determinism.fixturesHash).toBe(hashFixture(lockedFixture));
    expect(parsed.determinism.encodingVersion).toBe(ENCODING_VERSION);
    expect(parsed.plan.labels.length).toBeGreaterThan(0);
  });
});
