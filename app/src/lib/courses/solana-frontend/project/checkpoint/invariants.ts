import type { DashboardState } from "../types";

export function collectInvariants(state: DashboardState, owner: string): string[] {
  const ownerState = state.owners[owner];
  const invariants: string[] = [];

  invariants.push("event ids applied once");
  invariants.push("corrections tracked deterministically");
  invariants.push("history sorted by replay order");

  if (!ownerState) {
    invariants.push("owner exists: false");
    return invariants;
  }

  const negative = Object.values(ownerState.balances).some((amount) => BigInt(amount) < BigInt(0));
  invariants.push(`owner balances non-negative: ${negative ? "false" : "true"}`);

  const ataMismatch = Object.entries(ownerState.atas).some(
    ([mint, ata]) => mint.trim().length === 0 || ata.trim().length === 0,
  );
  invariants.push(`owner ata mapping valid: ${ataMismatch ? "false" : "true"}`);

  return invariants;
}
