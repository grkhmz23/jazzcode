export interface SolanaPerformanceLocalState {
  version: 1;
  completedLessonIds: string[];
  lastPerfReportJson: string | null;
  benchmarkResults: BenchmarkResult[];
  optimizationHistory: OptimizationEntry[];
  updatedAt: string;
}

export interface BenchmarkResult {
  id: string;
  lessonId: string;
  timestamp: string;
  computeUnits: number;
  accountSize: number;
  rentLamports: number;
  transactionTimeMs: number;
}

export interface OptimizationEntry {
  id: string;
  timestamp: string;
  optimizationType: "layout" | "cpi" | "account-allocation" | "compute" | "other";
  description: string;
  beforeMetrics: {
    computeUnits: number;
    accountSize: number;
  };
  afterMetrics: {
    computeUnits: number;
    accountSize: number;
  };
  savingsPercent: number;
}

const STORAGE_PREFIX = "jazzcode:solana-performance";
const VERSION = 1;

function key(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const set = new Set<string>();
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim().length > 0) {
      set.add(entry);
    }
  }
  return [...set];
}

function normalizeBenchmarkResults(value: unknown): BenchmarkResult[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is BenchmarkResult =>
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.lessonId === "string" &&
      typeof item.computeUnits === "number",
  );
}

function normalizeOptimizationHistory(value: unknown): OptimizationEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is OptimizationEntry =>
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.description === "string" &&
      typeof item.savingsPercent === "number",
  );
}

export function createDefaultSolanaPerformanceLocalState(): SolanaPerformanceLocalState {
  return {
    version: VERSION,
    completedLessonIds: [],
    lastPerfReportJson: null,
    benchmarkResults: [],
    optimizationHistory: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadSolanaPerformanceLocalState(scope: string): SolanaPerformanceLocalState {
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) {
      return createDefaultSolanaPerformanceLocalState();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSolanaPerformanceLocalState();
    }

    const record = parsed as Record<string, unknown>;
    return {
      version: VERSION,
      completedLessonIds: normalizeLessonIds(record.completedLessonIds),
      lastPerfReportJson:
        typeof record.lastPerfReportJson === "string" ? record.lastPerfReportJson : null,
      benchmarkResults: normalizeBenchmarkResults(record.benchmarkResults),
      optimizationHistory: normalizeOptimizationHistory(record.optimizationHistory),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return createDefaultSolanaPerformanceLocalState();
  }
}

export function saveSolanaPerformanceLocalState(
  scope: string,
  state: SolanaPerformanceLocalState,
): void {
  const normalized: SolanaPerformanceLocalState = {
    version: VERSION,
    completedLessonIds: normalizeLessonIds(state.completedLessonIds),
    lastPerfReportJson:
      typeof state.lastPerfReportJson === "string" ? state.lastPerfReportJson : null,
    benchmarkResults: normalizeBenchmarkResults(state.benchmarkResults),
    optimizationHistory: normalizeOptimizationHistory(state.optimizationHistory),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key(scope), JSON.stringify(normalized));
}

export function clearSolanaPerformanceLocalState(scope: string): void {
  localStorage.removeItem(key(scope));
}

export function addBenchmarkResult(
  scope: string,
  result: Omit<BenchmarkResult, "timestamp">,
): void {
  const state = loadSolanaPerformanceLocalState(scope);
  state.benchmarkResults.push({
    ...result,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 50 benchmark results
  if (state.benchmarkResults.length > 50) {
    state.benchmarkResults = state.benchmarkResults.slice(-50);
  }
  saveSolanaPerformanceLocalState(scope, state);
}

export function addOptimizationEntry(
  scope: string,
  entry: Omit<OptimizationEntry, "id" | "timestamp">,
): void {
  const state = loadSolanaPerformanceLocalState(scope);
  state.optimizationHistory.push({
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  // Keep only last 100 optimization entries
  if (state.optimizationHistory.length > 100) {
    state.optimizationHistory = state.optimizationHistory.slice(-100);
  }
  saveSolanaPerformanceLocalState(scope, state);
}
