import type { DashboardState, OwnerState } from "../types";

export function createEmptyOwnerState(): OwnerState {
  return {
    lamports: "0",
    atas: {},
    balances: {},
    positions: {},
  };
}

export function createEmptyDashboardState(): DashboardState {
  return {
    owners: {},
    mints: {},
    prices: {},
    eventsApplied: {},
    eventsCorrected: {},
    history: [],
    eventJournal: [],
  };
}
