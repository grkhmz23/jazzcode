export interface OperationCostInput {
  allocations: number;
  clones: number;
  hashBytes: number;
  loopIterations: number;
  mapLookups: number;
  encodeBytes: number;
  decodeBytes: number;
}

export interface CostEstimate {
  allocationsCost: number;
  cloneCost: number;
  hashCost: number;
  loopCost: number;
  mapLookupCost: number;
  serializationCost: number;
  totalCost: number;
}

export interface BenchmarkCaseInput {
  name: string;
  baseline: OperationCostInput;
  optimized: OperationCostInput;
}

export interface BenchmarkMetrics {
  name: string;
  before: CostEstimate;
  after: CostEstimate;
  reduction: number;
  reductionPct: number;
}

export class CostModel {
  static estimate(ops: OperationCostInput): CostEstimate {
    if (
      ops.allocations < 0 ||
      ops.clones < 0 ||
      ops.hashBytes < 0 ||
      ops.loopIterations < 0 ||
      ops.mapLookups < 0 ||
      ops.encodeBytes < 0 ||
      ops.decodeBytes < 0
    ) {
      throw new Error("operation counts must be non-negative");
    }

    const allocationsCost = ops.allocations * 18;
    const cloneCost = ops.clones * 8;
    const hashCost = Math.ceil(ops.hashBytes / 32) * 11;
    const loopCost = ops.loopIterations * 2;
    const mapLookupCost = ops.mapLookups * 5;
    const serializationCost = Math.ceil((ops.encodeBytes + ops.decodeBytes) / 16) * 7;
    const totalCost =
      allocationsCost + cloneCost + hashCost + loopCost + mapLookupCost + serializationCost;

    return {
      allocationsCost,
      cloneCost,
      hashCost,
      loopCost,
      mapLookupCost,
      serializationCost,
      totalCost,
    };
  }
}

export function runBenchmarkCase(input: BenchmarkCaseInput): BenchmarkMetrics {
  const before = CostModel.estimate(input.baseline);
  const after = CostModel.estimate(input.optimized);
  const reduction = before.totalCost - after.totalCost;
  const reductionPct = before.totalCost === 0 ? 0 : Number(((reduction / before.totalCost) * 100).toFixed(2));

  return {
    name: input.name,
    before,
    after,
    reduction,
    reductionPct,
  };
}

export function suggestOptimizations(metrics: CostEstimate): string[] {
  const suggestions: string[] = [];
  if (metrics.allocationsCost > 80) {
    suggestions.push("Pre-allocate vectors and reuse buffers to reduce allocation churn.");
  }
  if (metrics.cloneCost > 80) {
    suggestions.push("Replace unnecessary clones with references or small copy primitives.");
  }
  if (metrics.mapLookupCost > 120) {
    suggestions.push("Avoid repeated map lookups in inner loops; cache lookups per account.");
  }
  if (metrics.serializationCost > 120) {
    suggestions.push("Batch serialization and avoid repeated encode/decode cycles.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Current profile is balanced; keep regressions tracked with deterministic benchmarks.");
  }
  return suggestions.sort((a, b) => a.localeCompare(b));
}

function stableOrder(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableOrder(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = stableOrder(record[key]);
        return acc;
      }, {});
  }
  return value;
}

export function perfReport(before: CostEstimate, after: CostEstimate): { json: string; markdown: string } {
  const reduction = before.totalCost - after.totalCost;
  const reductionPct = before.totalCost === 0 ? 0 : Number(((reduction / before.totalCost) * 100).toFixed(2));
  const payload = {
    after,
    before,
    reduction,
    reductionPct,
  };

  return {
    json: JSON.stringify(stableOrder(payload)),
    markdown: [
      "# Compute Budget Profiler Report",
      "",
      `- Before total: ${before.totalCost}`,
      `- After total: ${after.totalCost}`,
      `- Reduction: ${reduction}`,
      `- Reduction %: ${reductionPct}`,
    ].join("\n"),
  };
}
