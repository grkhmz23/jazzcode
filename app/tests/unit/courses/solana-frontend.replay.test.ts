import { describe, expect, it } from "vitest";
import streamFixture from "@/lib/courses/solana-frontend/project/fixtures/dashboard.stream.v1.json";
import { buildSnapshotsFromFixture } from "@/lib/courses/solana-frontend/project/stream/replay";
import { buildDashboardView } from "@/lib/courses/solana-frontend/project/queries/filter";
import { computeDeltaBetweenSnapshots } from "@/lib/courses/solana-frontend/project/model/selectors";
import { buildDashboardSummaryJson } from "@/lib/courses/solana-frontend/project/checkpoint/summary";

describe("solana frontend replay and query layer", () => {
  it("builds deterministic snapshots with stable checksum", () => {
    const first = buildSnapshotsFromFixture(streamFixture, 5);
    const second = buildSnapshotsFromFixture(streamFixture, 5);

    expect(first.snapshots.length).toBeGreaterThan(0);
    expect(first.checksum).toBe(second.checksum);
    expect(first.snapshots.map((snapshot) => snapshot.checksum)).toEqual(
      second.snapshots.map((snapshot) => snapshot.checksum),
    );
  });

  it("builds stable query-layer view ordering and fixed-scale value math", () => {
    const replay = buildSnapshotsFromFixture(streamFixture, 5);
    const owner = streamFixture.owner;

    const view = buildDashboardView(replay.finalState, owner, {
      nonZeroOnly: true,
      search: "us",
      sortBy: "valueUsd",
      descending: true,
    });

    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows[0].symbol).toBe("USDC");
    expect(view.totalValueUsd).toMatch(/^\d+\.\d{6}$/);

    const before = replay.snapshots[0].state;
    const after = replay.snapshots[replay.snapshots.length - 1].state;
    expect(computeDeltaBetweenSnapshots(before, after, owner)).toMatch(/^-?\d+\.\d{6}$/);
  });

  it("emits stable checkpoint summary JSON", () => {
    const json = buildDashboardSummaryJson({
      fixture: streamFixture,
      owner: streamFixture.owner,
      interval: 5,
      query: { nonZeroOnly: true, sortBy: "valueUsd", descending: true },
    });

    const parsed = JSON.parse(json) as {
      owner: string;
      tokenCount: number;
      totalValueUsd: string;
      topTokens: Array<{ mint: string; symbol: string }>;
      determinism: { modelVersion: string; fixtureHash: string };
    };

    expect(Object.keys(parsed)).toEqual([
      "owner",
      "tokenCount",
      "totalValueUsd",
      "topTokens",
      "recent",
      "invariants",
      "determinism",
    ]);
    expect(parsed.owner).toBe(streamFixture.owner);
    expect(parsed.tokenCount).toBeGreaterThan(0);
    expect(parsed.totalValueUsd).toMatch(/^\d+\.\d{6}$/);
    expect(parsed.determinism.modelVersion).toBe("solana-frontend-dashboard-v2");
    expect(parsed.determinism.fixtureHash).toMatch(/^[a-f0-9]{64}$/);
  });
});
