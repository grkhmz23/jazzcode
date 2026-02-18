export interface ComputeBudgetInputs {
  estimatedInstructionCus: number[];
  requestedUnits?: number;
  txSizeBytes: number;
}

export interface ComputeBudgetPlan {
  units: number;
  heapBytes?: number;
  reason: string;
}

export interface PriorityFeePolicy {
  minMicroLamports: number;
  maxMicroLamports: number;
  targetPercentile: 50 | 75 | 90;
  volatilityGuardBps: number;
}

export interface PriorityFeeEstimate {
  microLamports: number;
  confidence: "low" | "medium" | "high";
  warnings: string[];
}

export interface FeePlanSnapshot {
  computePlan: ComputeBudgetPlan;
  priorityFee: PriorityFeeEstimate;
  confirmationLevel: "processed" | "confirmed" | "finalized";
}

export interface FeePlanSummary {
  json: string;
  markdown: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function percentile(values: number[], p: 50 | 75 | 90): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[clamp(idx, 0, sorted.length - 1)];
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const next: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      next[key] = stableValue(obj[key]);
    }
    return next;
  }
  return value;
}

export function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

export function planComputeBudget(inputs: ComputeBudgetInputs): ComputeBudgetPlan {
  if (!Array.isArray(inputs.estimatedInstructionCus) || inputs.estimatedInstructionCus.length === 0) {
    throw new Error("estimatedInstructionCus must be a non-empty array");
  }
  if (inputs.txSizeBytes <= 0) {
    throw new Error("txSizeBytes must be positive");
  }

  const totalCu = inputs.estimatedInstructionCus.reduce((sum, current) => {
    if (!Number.isFinite(current) || current <= 0) {
      throw new Error("estimatedInstructionCus contains invalid CU values");
    }
    return sum + current;
  }, 0);

  const baseline = Math.ceil(totalCu * 1.1);
  const minimum = 80_000;
  const maximum = 1_400_000;
  let units = clamp(baseline, minimum, maximum);

  if (typeof inputs.requestedUnits === "number" && Number.isFinite(inputs.requestedUnits)) {
    units = clamp(Math.round(inputs.requestedUnits), minimum, maximum);
  }

  const shouldAllocateHeap = inputs.txSizeBytes > 1_000 || totalCu > 500_000;
  const reason =
    units === maximum
      ? "capped at protocol max after safety margin"
      : shouldAllocateHeap
        ? "safety-margin compute plan with heap for large transaction footprint"
        : "safety-margin compute plan for standard transaction footprint";

  return {
    units,
    heapBytes: shouldAllocateHeap ? 262_144 : undefined,
    reason,
  };
}

export function estimatePriorityFee(
  samples: number[],
  policy: PriorityFeePolicy,
): PriorityFeeEstimate {
  const warnings: string[] = [];
  const cleanSamples = samples.filter((sample) => Number.isFinite(sample) && sample > 0);
  if (cleanSamples.length === 0) {
    return {
      microLamports: policy.minMicroLamports,
      confidence: "low",
      warnings: ["no valid fee samples; using policy minimum"],
    };
  }

  const baseTarget = percentile(cleanSamples, policy.targetPercentile);
  const p50 = percentile(cleanSamples, 50);
  const p90 = percentile(cleanSamples, 90);
  const spreadBps = p50 > 0 ? Math.round(((p90 - p50) / p50) * 10_000) : 0;

  let adjusted = baseTarget;
  if (spreadBps > policy.volatilityGuardBps) {
    adjusted = Math.ceil(baseTarget * 1.1);
    warnings.push("volatility guard applied (+10%)");
  }

  const microLamports = clamp(
    adjusted,
    Math.max(1, policy.minMicroLamports),
    Math.max(policy.minMicroLamports, policy.maxMicroLamports),
  );

  if (samples.length !== cleanSamples.length) {
    warnings.push("ignored non-positive or invalid samples");
  }

  const confidence: "low" | "medium" | "high" =
    cleanSamples.length >= 20 && spreadBps <= 3_000
      ? "high"
      : cleanSamples.length >= 8
        ? "medium"
        : "low";

  return { microLamports, confidence, warnings };
}

export function feePlanSummary(plan: FeePlanSnapshot): FeePlanSummary {
  const payload = {
    computePlan: plan.computePlan,
    confirmationLevel: plan.confirmationLevel,
    priorityFee: plan.priorityFee,
  };

  const json = stableJson(payload);
  const markdown = [
    "# Fee Optimizer Report",
    "",
    `- Confirmation level: ${plan.confirmationLevel}`,
    `- Compute units: ${plan.computePlan.units}`,
    `- Heap bytes: ${plan.computePlan.heapBytes ?? 0}`,
    `- Priority fee: ${plan.priorityFee.microLamports} micro-lamports/CU (${plan.priorityFee.confidence})`,
    `- Warnings: ${plan.priorityFee.warnings.length === 0 ? "none" : plan.priorityFee.warnings.join(", ")}`,
    `- Reason: ${plan.computePlan.reason}`,
  ].join("\n");

  return { json, markdown };
}
