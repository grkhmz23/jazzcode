import { createEmptyDashboardState, createEmptyOwnerState } from "./state";
import { sortEvents } from "../normalization/ordering";
import type {
  DashboardEvent,
  DashboardHistoryItem,
  DashboardState,
  OwnerState,
} from "../types";

const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function parseU64(value: string, field: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid ${field}: ${value}`);
  }
  const parsed = BigInt(value);
  if (parsed < BigInt(0) || parsed > U64_MAX) {
    throw new Error(`${field} out of u64 range: ${value}`);
  }
  return parsed;
}

function parsePrice(value: string): string {
  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new Error(`Invalid priceUsd: ${value}`);
  }
  return value;
}

function getOrCreateOwner(state: DashboardState, owner: string): OwnerState {
  if (!state.owners[owner]) {
    state.owners[owner] = createEmptyOwnerState();
  }
  return state.owners[owner];
}

function findOwnerByAta(state: DashboardState, ata: string): { owner: string; mint: string } | null {
  for (const [owner, ownerState] of Object.entries(state.owners)) {
    for (const [mint, ownerAta] of Object.entries(ownerState.atas)) {
      if (ownerAta === ata) {
        return { owner, mint };
      }
    }
  }
  return null;
}

function setBalance(ownerState: OwnerState, mint: string, amount: bigint): void {
  ownerState.balances[mint] = amount.toString();
  ownerState.positions[mint] = { amount: amount.toString() };
}

function changeBalance(ownerState: OwnerState, mint: string, delta: bigint): void {
  const current = parseU64(ownerState.balances[mint] ?? "0", `balance(${mint})`);
  const next = current + delta;
  if (next < BigInt(0)) {
    throw new Error(`Negative balance for mint ${mint}`);
  }
  setBalance(ownerState, mint, next);
}

function historyItem(event: DashboardEvent, summary: string): DashboardHistoryItem {
  return {
    ts: event.ts,
    id: event.id,
    type: event.type,
    summary,
  };
}

function applyEffectiveEvent(state: DashboardState, event: DashboardEvent): string {
  switch (event.type) {
    case "AirdropLamports": {
      const ownerState = getOrCreateOwner(state, event.owner);
      const lamports = parseU64(event.lamports, "lamports");
      const current = parseU64(ownerState.lamports, "owner lamports");
      ownerState.lamports = (current + lamports).toString();
      return `Airdropped ${event.lamports} lamports to ${event.owner}`;
    }
    case "CreateMint": {
      state.mints[event.mint] = {
        mint: event.mint,
        symbol: event.symbol,
        decimals: event.decimals,
      };
      return `Created mint ${event.symbol} (${event.mint})`;
    }
    case "CreateAta": {
      const ownerState = getOrCreateOwner(state, event.owner);
      ownerState.atas[event.mint] = event.ata;
      if (!ownerState.balances[event.mint]) {
        setBalance(ownerState, event.mint, BigInt(0));
      }
      return `Created ATA ${event.ata} for ${event.owner}`;
    }
    case "MintTo": {
      const target = findOwnerByAta(state, event.toAta);
      if (!target) {
        throw new Error(`MintTo target ATA not found: ${event.toAta}`);
      }
      const ownerState = getOrCreateOwner(state, target.owner);
      changeBalance(ownerState, target.mint, parseU64(event.amount, "mint amount"));
      return `Minted ${event.amount} to ${event.toAta}`;
    }
    case "Transfer": {
      const from = findOwnerByAta(state, event.fromAta);
      const to = findOwnerByAta(state, event.toAta);
      if (!from || !to) {
        throw new Error(`Transfer ATA not found: ${event.fromAta} -> ${event.toAta}`);
      }
      const amount = parseU64(event.amount, "transfer amount");
      const fromOwner = getOrCreateOwner(state, from.owner);
      const toOwner = getOrCreateOwner(state, to.owner);
      changeBalance(fromOwner, from.mint, -amount);
      changeBalance(toOwner, to.mint, amount);
      return `Transferred ${event.amount} ${event.mint} ${event.fromAta} -> ${event.toAta}`;
    }
    case "SwapMock": {
      const ownerState = getOrCreateOwner(state, event.owner);
      const inAmount = parseU64(event.inAmount, "swap inAmount");
      const outAmount = parseU64(event.outAmount, "swap outAmount");
      changeBalance(ownerState, event.inMint, -inAmount);
      changeBalance(ownerState, event.outMint, outAmount);
      return `Swapped ${event.inAmount} ${event.inMint} to ${event.outAmount} ${event.outMint}`;
    }
    case "PriceUpdateMock": {
      state.prices[event.mint] = { priceUsd: parsePrice(event.priceUsd), ts: event.ts };
      return `Price update ${event.mint}=${event.priceUsd}`;
    }
    case "Correction": {
      return `Correction for ${event.replacesEventId}`;
    }
  }
}

function rebuildFromJournal(
  journal: DashboardEvent[],
  correctedIds: Record<string, true>,
): DashboardState {
  const next = createEmptyDashboardState();
  const sorted = sortEvents(journal);

  for (const event of sorted) {
    next.eventsApplied[event.id] = true;
    if (event.type === "Correction") {
      next.eventsCorrected[event.replacesEventId] = true;
      next.history.push(historyItem(event, applyEffectiveEvent(next, event)));
      continue;
    }

    if (correctedIds[event.id]) {
      next.eventsCorrected[event.id] = true;
      next.history.push(historyItem(event, `Corrected event skipped: ${event.id}`));
      continue;
    }

    const summary = applyEffectiveEvent(next, event);
    next.history.push(historyItem(event, summary));
  }

  next.eventJournal = sorted;
  return next;
}

export function reduceDashboardEvents(events: DashboardEvent[]): DashboardState {
  const seen: Record<string, true> = {};
  const journal: DashboardEvent[] = [];
  const corrected: Record<string, true> = {};

  for (const event of events) {
    if (seen[event.id]) {
      continue;
    }
    seen[event.id] = true;
    journal.push(event);
    if (event.type === "Correction") {
      corrected[event.replacesEventId] = true;
    }
  }

  return rebuildFromJournal(journal, corrected);
}

export function applyDashboardEvent(state: DashboardState, event: DashboardEvent): DashboardState {
  if (state.eventsApplied[event.id]) {
    return state;
  }

  const nextJournal = [...state.eventJournal, event];
  const corrected = { ...state.eventsCorrected };
  if (event.type === "Correction") {
    corrected[event.replacesEventId] = true;
  }

  return rebuildFromJournal(nextJournal, corrected);
}
