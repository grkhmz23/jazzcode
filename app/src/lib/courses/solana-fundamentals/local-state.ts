export interface SolanaTransferSummary {
  from: string;
  to: string;
  lamports: number;
  feePayer: string;
  recentBlockhash: string;
  instructionProgramId: string;
}

export interface SolanaWalletKeypair {
  publicKey: string;
  secretKey: number[];
}

export interface SolanaFundamentalsLocalState {
  version: 1;
  completedLessonIds: string[];
  walletKeypair: SolanaWalletKeypair | null;
  lastTransferSummary: SolanaTransferSummary | null;
  updatedAt: string;
}

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = "jazzcode:solana-fundamentals";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCompletedLessons(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && item.trim().length > 0) {
      unique.add(item);
    }
  }
  return Array.from(unique);
}

function normalizeWalletKeypair(value: unknown): SolanaWalletKeypair | null {
  if (!isObject(value)) {
    return null;
  }
  const publicKey = value.publicKey;
  const secretKey = value.secretKey;
  if (typeof publicKey !== "string" || !Array.isArray(secretKey)) {
    return null;
  }
  const normalizedSecret: number[] = [];
  for (const item of secretKey) {
    if (typeof item !== "number" || !Number.isInteger(item) || item < 0 || item > 255) {
      return null;
    }
    normalizedSecret.push(item);
  }
  if (normalizedSecret.length === 0) {
    return null;
  }
  return {
    publicKey,
    secretKey: normalizedSecret,
  };
}

function normalizeTransferSummary(value: unknown): SolanaTransferSummary | null {
  if (!isObject(value)) {
    return null;
  }
  if (
    typeof value.from !== "string" ||
    typeof value.to !== "string" ||
    typeof value.lamports !== "number" ||
    !Number.isFinite(value.lamports) ||
    typeof value.feePayer !== "string" ||
    typeof value.recentBlockhash !== "string" ||
    typeof value.instructionProgramId !== "string"
  ) {
    return null;
  }
  return {
    from: value.from,
    to: value.to,
    lamports: value.lamports,
    feePayer: value.feePayer,
    recentBlockhash: value.recentBlockhash,
    instructionProgramId: value.instructionProgramId,
  };
}

export function createDefaultSolanaFundamentalsState(): SolanaFundamentalsLocalState {
  return {
    version: STORAGE_VERSION,
    completedLessonIds: [],
    walletKeypair: null,
    lastTransferSummary: null,
    updatedAt: new Date().toISOString(),
  };
}

function storageKey(userScope: string): string {
  return `${STORAGE_PREFIX}:${userScope}`;
}

function migrateToCurrentState(raw: unknown): SolanaFundamentalsLocalState {
  const fallback = createDefaultSolanaFundamentalsState();
  if (!isObject(raw)) {
    return fallback;
  }

  const completedLessonIds = normalizeCompletedLessons(
    raw.completedLessonIds ?? raw.completedLessons
  );
  const walletKeypair = normalizeWalletKeypair(raw.walletKeypair);
  const lastTransferSummary = normalizeTransferSummary(raw.lastTransferSummary);

  return {
    version: STORAGE_VERSION,
    completedLessonIds,
    walletKeypair,
    lastTransferSummary,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaFundamentalsState(userScope: string): SolanaFundamentalsLocalState {
  try {
    const raw = localStorage.getItem(storageKey(userScope));
    if (!raw) {
      return createDefaultSolanaFundamentalsState();
    }
    const parsed: unknown = JSON.parse(raw);
    return migrateToCurrentState(parsed);
  } catch {
    return createDefaultSolanaFundamentalsState();
  }
}

export function saveSolanaFundamentalsState(
  userScope: string,
  state: SolanaFundamentalsLocalState
): void {
  const normalized: SolanaFundamentalsLocalState = {
    ...state,
    version: STORAGE_VERSION,
    completedLessonIds: normalizeCompletedLessons(state.completedLessonIds),
    walletKeypair: normalizeWalletKeypair(state.walletKeypair),
    lastTransferSummary: normalizeTransferSummary(state.lastTransferSummary),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storageKey(userScope), JSON.stringify(normalized));
}

export function clearSolanaFundamentalsState(userScope: string): void {
  localStorage.removeItem(storageKey(userScope));
}
