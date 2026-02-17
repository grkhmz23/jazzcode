export type Address = string;

export interface AirdropLamportsEvent {
  type: "AirdropLamports";
  id: string;
  ts: number;
  owner: Address;
  lamports: string;
}

export interface CreateMintEvent {
  type: "CreateMint";
  id: string;
  ts: number;
  mint: Address;
  decimals: number;
  symbol: string;
}

export interface CreateAtaEvent {
  type: "CreateAta";
  id: string;
  ts: number;
  owner: Address;
  mint: Address;
  ata: Address;
}

export interface MintToEvent {
  type: "MintTo";
  id: string;
  ts: number;
  mint: Address;
  toAta: Address;
  amount: string;
}

export interface TransferEvent {
  type: "Transfer";
  id: string;
  ts: number;
  mint: Address;
  fromAta: Address;
  toAta: Address;
  amount: string;
}

export interface SwapMockEvent {
  type: "SwapMock";
  id: string;
  ts: number;
  owner: Address;
  inMint: Address;
  outMint: Address;
  inAmount: string;
  outAmount: string;
}

export interface PriceUpdateMockEvent {
  type: "PriceUpdateMock";
  id: string;
  ts: number;
  mint: Address;
  priceUsd: string;
}

export interface CorrectionEvent {
  type: "Correction";
  id: string;
  ts: number;
  replacesEventId: string;
}

export type DashboardEvent =
  | AirdropLamportsEvent
  | CreateMintEvent
  | CreateAtaEvent
  | MintToEvent
  | TransferEvent
  | SwapMockEvent
  | PriceUpdateMockEvent
  | CorrectionEvent;

export interface MintMeta {
  mint: Address;
  symbol: string;
  decimals: number;
}

export interface PositionState {
  amount: string;
  valueUsd?: string;
}

export interface OwnerState {
  lamports: string;
  atas: Record<string, string>;
  balances: Record<string, string>;
  positions: Record<string, PositionState>;
}

export interface DashboardHistoryItem {
  ts: number;
  id: string;
  type: DashboardEvent["type"];
  summary: string;
}

export interface DashboardState {
  owners: Record<string, OwnerState>;
  mints: Record<string, MintMeta>;
  prices: Record<string, { priceUsd: string; ts: number }>;
  eventsApplied: Record<string, true>;
  eventsCorrected: Record<string, true>;
  history: DashboardHistoryItem[];
  eventJournal: DashboardEvent[];
}

export interface Snapshot {
  eventIndex: number;
  eventId: string;
  state: DashboardState;
  checksum: string;
}

export interface SnapshotBuildResult {
  finalState: DashboardState;
  snapshots: Snapshot[];
  checksum: string;
}

export type SortField = "balance" | "valueUsd" | "recent";

export interface DashboardQuery {
  search?: string;
  nonZeroOnly?: boolean;
  sortBy?: SortField;
  descending?: boolean;
}

export interface DashboardTokenRow {
  mint: string;
  symbol: string;
  amount: string;
  valueUsd: string;
  recentTs: number;
}

export interface DashboardViewModel {
  owner: string;
  totalValueUsd: string;
  rows: DashboardTokenRow[];
}

export interface DashboardSummary {
  owner: string;
  tokenCount: number;
  totalValueUsd: string;
  topTokens: Array<{ mint: string; symbol: string; amount: string; valueUsd: string }>;
  recent: Array<{ id: string; ts: number; summary: string }>;
  invariants: string[];
  determinism: {
    fixtureHash: string;
    modelVersion: string;
  };
}
