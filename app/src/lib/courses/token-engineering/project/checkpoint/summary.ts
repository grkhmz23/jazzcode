import { createHash } from "crypto";
import { ENCODING_VERSION } from "../constants";
import { deriveMintAddress, deriveRecipientAtas } from "../address/derive";
import { simulateDistribution } from "../simulation/transfers";
import { normalizeExtensions } from "../token2022/extensions";
import {
  buildAtaAndMintToDistributionPlan,
  buildInitPlan,
} from "../token2022/instruction-plan";
import type { LaunchPack, LaunchPackSummary, TokenConfig } from "../types";

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const parts = keys.map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`);
  return `{${parts.join(",")}}`;
}

export function hashFixture(value: unknown): string {
  return createHash("sha256").update(canonicalize(value)).digest("hex");
}

export function buildLaunchPack(config: TokenConfig): LaunchPack {
  const mint = deriveMintAddress(config.symbol, config.mintAuthority);
  const recipients = config.recipients ?? [];
  const ataDerivations = deriveRecipientAtas(
    mint,
    recipients.map((recipient) => recipient.owner),
  );

  const initPlan = buildInitPlan(config, mint);
  const distributionPlan = buildAtaAndMintToDistributionPlan({
    mint,
    mintAuthority: config.mintAuthority,
    ataDerivations,
    recipients,
  });

  return {
    mint,
    ataDerivations,
    initPlan,
    distributionPlan,
    invariants: [
      "mint plan built deterministically",
      "distribution plan sorted by recipient order",
      "all plan payloads encoded with versioned deterministic serializer",
    ],
  };
}

export function buildLaunchPackSummary(input: {
  config: TokenConfig;
  fixture: unknown;
}): LaunchPackSummary {
  const launchPack = buildLaunchPack(input.config);
  const distribution = simulateDistribution(input.config);
  const normalizedExtensions = normalizeExtensions(input.config);

  const summary: LaunchPackSummary = {
    mint: launchPack.mint,
    token: {
      name: input.config.name,
      symbol: input.config.symbol,
      decimals: input.config.decimals,
    },
    authorities: {
      mintAuthority: input.config.mintAuthority,
      freezeAuthority: input.config.freezeAuthority ?? null,
      updateAuthority: input.config.updateAuthority ?? null,
    },
    extensions: {
      metadataPointer: normalizedExtensions.metadataPointer,
      transferFee: normalizedExtensions.transferFee,
      defaultAccountState: normalizedExtensions.defaultAccountState,
      permanentDelegate: normalizedExtensions.permanentDelegate,
    },
    supply: {
      initialSupply: input.config.initialSupply,
      recipientsTotal: distribution.totalDistributed,
      remaining: distribution.remaining,
    },
    plan: {
      initSteps: launchPack.initPlan.length,
      distributionSteps: launchPack.distributionPlan.length,
      labels: [...launchPack.initPlan, ...launchPack.distributionPlan].map((item) => item.label),
    },
    invariants: [
      "initialSupply >= recipientsTotal",
      "distribution has no negative balances",
      "plan labels are deterministic",
      "encoding version is pinned",
    ],
    determinism: {
      fixturesHash: hashFixture(input.fixture),
      encodingVersion: ENCODING_VERSION,
    },
  };

  if (normalizedExtensions.transferFee) {
    summary.feeModel = {
      feeBps: normalizedExtensions.transferFee.feeBps,
      maxFee: normalizedExtensions.transferFee.maxFee,
      examples: [
        {
          amount: "1000000",
          fee: simulateFeeExample("1000000", normalizedExtensions.transferFee.feeBps, normalizedExtensions.transferFee.maxFee),
        },
        {
          amount: "250000000",
          fee: simulateFeeExample("250000000", normalizedExtensions.transferFee.feeBps, normalizedExtensions.transferFee.maxFee),
        },
      ],
    };
  }

  return summary;
}

function simulateFeeExample(amount: string, feeBps: number, maxFee: string): string {
  const raw = BigInt(amount);
  const computed = (raw * BigInt(feeBps)) / BigInt(10_000);
  const cap = BigInt(maxFee);
  return (computed > cap ? cap : computed).toString();
}

export function buildLaunchPackSummaryJson(input: {
  config: TokenConfig;
  fixture: unknown;
}): string {
  const summary = buildLaunchPackSummary(input);

  return JSON.stringify({
    mint: summary.mint,
    token: summary.token,
    authorities: summary.authorities,
    extensions: summary.extensions,
    supply: summary.supply,
    ...(summary.feeModel ? { feeModel: summary.feeModel } : {}),
    plan: summary.plan,
    invariants: summary.invariants,
    determinism: summary.determinism,
  });
}
