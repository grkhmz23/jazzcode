import { USD_SCALE } from "../constants";
import type { DashboardHistoryItem, DashboardState } from "../types";

function pow10(exp: number): bigint {
  let result = BigInt(1);
  for (let i = 0; i < exp; i += 1) {
    result *= BigInt(10);
  }
  return result;
}

export function decimalToScaled(value: string, scale: bigint = USD_SCALE): bigint {
  const match = value.match(/^(\d+)(?:\.(\d+))?$/);
  if (!match) {
    throw new Error(`Invalid decimal string: ${value}`);
  }
  const intPart = BigInt(match[1]);
  const fracPart = (match[2] ?? "").slice(0, 6);
  const padded = fracPart.padEnd(6, "0");
  const fracScaled = BigInt(padded || "0");
  if (scale !== USD_SCALE) {
    throw new Error("Unsupported scale");
  }
  return intPart * scale + fracScaled;
}

export function scaledToDecimal(value: bigint, scale: bigint = USD_SCALE): string {
  if (scale !== USD_SCALE) {
    throw new Error("Unsupported scale");
  }
  const negative = value < BigInt(0);
  const normalized = negative ? -value : value;
  const intPart = normalized / scale;
  const fracPart = normalized % scale;
  const fracString = fracPart.toString().padStart(6, "0");
  return `${negative ? "-" : ""}${intPart.toString()}.${fracString}`;
}

function tokenValueUsdScaled(state: DashboardState, mint: string, amountRaw: string): bigint {
  const mintMeta = state.mints[mint];
  const price = state.prices[mint];
  if (!mintMeta || !price) {
    return BigInt(0);
  }
  const amount = BigInt(amountRaw);
  const priceScaled = decimalToScaled(price.priceUsd);
  const decimalsFactor = pow10(mintMeta.decimals);
  return (amount * priceScaled) / decimalsFactor;
}

export function getOwnerPortfolio(state: DashboardState, owner: string): {
  lamports: string;
  totalValueUsd: string;
  tokens: Array<{ mint: string; symbol: string; amount: string; valueUsd: string }>;
} {
  const ownerState = state.owners[owner];
  if (!ownerState) {
    return { lamports: "0", totalValueUsd: "0.000000", tokens: [] };
  }

  const tokens = Object.entries(ownerState.balances)
    .map(([mint, amount]) => {
      const symbol = state.mints[mint]?.symbol ?? "UNKNOWN";
      const value = tokenValueUsdScaled(state, mint, amount);
      return {
        mint,
        symbol,
        amount,
        valueUsd: scaledToDecimal(value),
      };
    })
    .sort((a, b) => a.mint.localeCompare(b.mint));

  const total = tokens.reduce((acc, item) => acc + decimalToScaled(item.valueUsd), BigInt(0));

  return {
    lamports: ownerState.lamports,
    totalValueUsd: scaledToDecimal(total),
    tokens,
  };
}

export function getTopTokens(
  state: DashboardState,
  owner: string,
  limit = 3,
): Array<{ mint: string; symbol: string; amount: string; valueUsd: string }> {
  const portfolio = getOwnerPortfolio(state, owner);
  return [...portfolio.tokens]
    .sort((a, b) => {
      const diff = decimalToScaled(b.valueUsd) - decimalToScaled(a.valueUsd);
      if (diff !== BigInt(0)) {
        return diff > BigInt(0) ? 1 : -1;
      }
      return a.mint.localeCompare(b.mint);
    })
    .slice(0, limit);
}

export function getRecentActivity(
  state: DashboardState,
  owner: string,
  limit = 5,
): Array<{ id: string; ts: number; summary: string }> {
  const ownerState = state.owners[owner];
  if (!ownerState) {
    return [];
  }
  const ataSet = new Set(Object.values(ownerState.atas));

  const relevant: DashboardHistoryItem[] = state.history.filter((item) => {
    if (item.summary.includes(owner)) {
      return true;
    }
    for (const ata of ataSet) {
      if (item.summary.includes(ata)) {
        return true;
      }
    }
    return false;
  });

  return relevant
    .sort((a, b) => {
      if (a.ts !== b.ts) {
        return b.ts - a.ts;
      }
      return b.id.localeCompare(a.id);
    })
    .slice(0, limit)
    .map((item) => ({ id: item.id, ts: item.ts, summary: item.summary }));
}

export function computeDeltaBetweenSnapshots(
  before: DashboardState,
  after: DashboardState,
  owner: string,
): string {
  const beforeUsd = decimalToScaled(getOwnerPortfolio(before, owner).totalValueUsd);
  const afterUsd = decimalToScaled(getOwnerPortfolio(after, owner).totalValueUsd);
  return scaledToDecimal(afterUsd - beforeUsd);
}
