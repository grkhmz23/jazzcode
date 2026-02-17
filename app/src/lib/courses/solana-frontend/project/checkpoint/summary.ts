import { MODEL_VERSION, DEFAULT_SNAPSHOT_INTERVAL } from "../constants";
import { getRecentActivity } from "../model/selectors";
import { canonicalJson, sha256Hex } from "../normalization/canonical-json";
import { buildDashboardView } from "../queries/filter";
import { buildSnapshotsFromFixture } from "../stream/replay";
import { collectInvariants } from "./invariants";
import type { DashboardQuery, DashboardSummary } from "../types";

export function buildDashboardSummary(input: {
  fixture: unknown;
  owner: string;
  interval?: number;
  query?: DashboardQuery;
}): DashboardSummary {
  const replay = buildSnapshotsFromFixture(input.fixture, input.interval ?? DEFAULT_SNAPSHOT_INTERVAL);
  const finalState = replay.finalState;
  const view = buildDashboardView(finalState, input.owner, input.query ?? {});
  const topTokens = view.rows
    .slice(0, 3)
    .map((row) => ({ mint: row.mint, symbol: row.symbol, amount: row.amount, valueUsd: row.valueUsd }));

  return {
    owner: input.owner,
    tokenCount: view.rows.length,
    totalValueUsd: view.totalValueUsd,
    topTokens,
    recent: getRecentActivity(finalState, input.owner, 5),
    invariants: collectInvariants(finalState, input.owner),
    determinism: {
      fixtureHash: sha256Hex(canonicalJson(input.fixture)),
      modelVersion: MODEL_VERSION,
    },
  };
}

export function buildDashboardSummaryJson(input: {
  fixture: unknown;
  owner: string;
  interval?: number;
  query?: DashboardQuery;
}): string {
  const summary = buildDashboardSummary(input);
  return JSON.stringify({
    owner: summary.owner,
    tokenCount: summary.tokenCount,
    totalValueUsd: summary.totalValueUsd,
    topTokens: summary.topTokens,
    recent: summary.recent,
    invariants: summary.invariants,
    determinism: summary.determinism,
  });
}
