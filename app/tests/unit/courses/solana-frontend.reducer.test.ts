import { describe, expect, it } from "vitest";
import { applyDashboardEvent, reduceDashboardEvents } from "@/lib/courses/solana-frontend/project/model/reducer";
import { createEmptyDashboardState } from "@/lib/courses/solana-frontend/project/model/state";
import type { DashboardEvent } from "@/lib/courses/solana-frontend/project/types";

const owner = "Owner111111111111111111111111111111111111111";
const mint = "USDC111111111111111111111111111111111111111";
const ownerAta = "AtaOwnerUSDC11111111111111111111111111111111";
const traderAta = "AtaTraderUSDC1111111111111111111111111111111";

const baseEvents: DashboardEvent[] = [
  { type: "CreateMint", id: "m1", ts: 1, mint, decimals: 6, symbol: "USDC" },
  { type: "CreateAta", id: "a1", ts: 2, owner, mint, ata: ownerAta },
  { type: "CreateAta", id: "a2", ts: 2, owner: "Trader11111111111111111111111111111111111111", mint, ata: traderAta },
  { type: "MintTo", id: "x1", ts: 3, mint, toAta: ownerAta, amount: "1000000" },
];

describe("solana frontend reducer", () => {
  it("is idempotent when the same event id is applied twice", () => {
    let state = createEmptyDashboardState();
    state = applyDashboardEvent(state, baseEvents[0]);
    state = applyDashboardEvent(state, baseEvents[1]);
    state = applyDashboardEvent(state, baseEvents[2]);
    state = applyDashboardEvent(state, baseEvents[3]);

    const once = state.owners[owner].balances[mint];
    state = applyDashboardEvent(state, baseEvents[3]);
    const twice = state.owners[owner].balances[mint];

    expect(once).toBe("1000000");
    expect(twice).toBe("1000000");
  });

  it("removes replaced event effects after correction", () => {
    const corrected = reduceDashboardEvents([
      ...baseEvents,
      {
        type: "Transfer",
        id: "t1",
        ts: 4,
        mint,
        fromAta: ownerAta,
        toAta: traderAta,
        amount: "250000",
      },
      {
        type: "Correction",
        id: "c1",
        ts: 5,
        replacesEventId: "t1",
      },
    ]);

    expect(corrected.eventsCorrected.t1).toBe(true);
    expect(corrected.owners[owner].balances[mint]).toBe("1000000");
  });

  it("produces same final state for out-of-order equivalent event sets", () => {
    const ordered = reduceDashboardEvents([
      ...baseEvents,
      {
        type: "PriceUpdateMock",
        id: "p1",
        ts: 6,
        mint,
        priceUsd: "1.000000",
      },
    ]);

    const shuffled = reduceDashboardEvents([
      {
        type: "PriceUpdateMock",
        id: "p1",
        ts: 6,
        mint,
        priceUsd: "1.000000",
      },
      baseEvents[3],
      baseEvents[0],
      baseEvents[2],
      baseEvents[1],
    ]);

    expect(shuffled.owners[owner].balances[mint]).toBe(ordered.owners[owner].balances[mint]);
    expect(shuffled.history.map((item) => item.id)).toEqual(ordered.history.map((item) => item.id));
  });
});
