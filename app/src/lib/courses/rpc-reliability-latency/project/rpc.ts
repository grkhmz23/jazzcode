export interface RpcPolicyInput {
  timeoutMs: number;
  maxRetries: number;
  backoff: {
    kind: "exponential" | "linear";
    baseDelayMs: number;
    maxDelayMs: number;
  };
}

export interface RpcScheduleEntry {
  attempt: number;
  timeoutMs: number;
  delayBeforeAttemptMs: number;
}

export interface RpcEndpoint {
  id: string;
  url: string;
  region: string;
  weight: number;
}

export interface RpcHealthSample {
  endpointId: string;
  successRate: number;
  p95LatencyMs: number;
  rateLimitedRatio: number;
  slotLag: number;
}

export interface EndpointSelection {
  chosen: RpcEndpoint;
  reasoning: string;
}

export interface RpcMetricEvent {
  latencyMs: number;
  ok: boolean;
}

export interface RpcMetrics {
  total: number;
  success: number;
  error: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  histogram: Record<string, number>;
}

export interface RpcHealthReport {
  json: string;
  markdown: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) {
    return 0;
  }
  const index = Math.ceil((p / 100) * sortedValues.length) - 1;
  return sortedValues[clamp(index, 0, sortedValues.length - 1)];
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

export function rpcPolicy(input: RpcPolicyInput): RpcScheduleEntry[] {
  if (input.timeoutMs <= 0 || input.maxRetries < 0) {
    throw new Error("invalid timeout or retry input");
  }

  const schedule: RpcScheduleEntry[] = [];
  const attempts = input.maxRetries + 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let delay = 0;
    if (attempt > 0) {
      delay =
        input.backoff.kind === "exponential"
          ? input.backoff.baseDelayMs * 2 ** (attempt - 1)
          : input.backoff.baseDelayMs * attempt;
      delay = Math.min(delay, input.backoff.maxDelayMs);
    }

    schedule.push({
      attempt,
      timeoutMs: input.timeoutMs,
      delayBeforeAttemptMs: delay,
    });
  }

  return schedule;
}

export function selectRpcEndpoint(
  endpoints: RpcEndpoint[],
  healthSamples: RpcHealthSample[],
): EndpointSelection {
  if (endpoints.length === 0) {
    throw new Error("at least one endpoint is required");
  }

  const byId = new Map(healthSamples.map((sample) => [sample.endpointId, sample]));

  const scored = endpoints.map((endpoint) => {
    const sample = byId.get(endpoint.id);
    const successRate = sample?.successRate ?? 0.5;
    const p95LatencyMs = sample?.p95LatencyMs ?? 1_000;
    const rateLimitedRatio = sample?.rateLimitedRatio ?? 0.25;
    const slotLag = sample?.slotLag ?? 20;

    const score =
      successRate * 100 +
      endpoint.weight * 2 -
      p95LatencyMs * 0.03 -
      rateLimitedRatio * 120 -
      slotLag * 2;

    return {
      endpoint,
      score,
      successRate,
      p95LatencyMs,
      rateLimitedRatio,
      slotLag,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.endpoint.id.localeCompare(b.endpoint.id));
  const best = scored[0];

  return {
    chosen: best.endpoint,
    reasoning: `selected ${best.endpoint.id} score=${best.score.toFixed(2)} success=${best.successRate.toFixed(2)} p95=${best.p95LatencyMs}ms`,
  };
}

export function metricsReducer(events: RpcMetricEvent[]): RpcMetrics {
  const latencies = events.map((event) => event.latencyMs).sort((a, b) => a - b);
  const histogram = {
    "0-49": 0,
    "50-99": 0,
    "100-249": 0,
    "250-499": 0,
    "500+": 0,
  };

  let success = 0;
  for (const event of events) {
    if (event.ok) {
      success += 1;
    }
    if (event.latencyMs < 50) {
      histogram["0-49"] += 1;
    } else if (event.latencyMs < 100) {
      histogram["50-99"] += 1;
    } else if (event.latencyMs < 250) {
      histogram["100-249"] += 1;
    } else if (event.latencyMs < 500) {
      histogram["250-499"] += 1;
    } else {
      histogram["500+"] += 1;
    }
  }

  return {
    total: events.length,
    success,
    error: events.length - success,
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    histogram,
  };
}

export function rpcHealthReport(metrics: RpcMetrics): RpcHealthReport {
  const payload = stableOrder(metrics);
  const json = JSON.stringify(payload);
  const markdown = [
    "# RPC Health Report",
    "",
    `- Total requests: ${metrics.total}`,
    `- Success: ${metrics.success}`,
    `- Errors: ${metrics.error}`,
    `- P50 latency: ${metrics.p50LatencyMs}ms`,
    `- P95 latency: ${metrics.p95LatencyMs}ms`,
    `- Histogram 0-49ms: ${metrics.histogram["0-49"]}`,
    `- Histogram 50-99ms: ${metrics.histogram["50-99"]}`,
    `- Histogram 100-249ms: ${metrics.histogram["100-249"]}`,
    `- Histogram 250-499ms: ${metrics.histogram["250-499"]}`,
    `- Histogram 500ms+: ${metrics.histogram["500+"]}`,
  ].join("\n");

  return { json, markdown };
}
