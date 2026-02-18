export interface PipelineTask {
  id: string;
  stage: string;
  durationTicks: number;
}

export interface PipelineRunInput {
  tasks: PipelineTask[];
  concurrency: number;
}

export interface TickSnapshot {
  tick: number;
  running: string[];
  completed: string[];
}

export interface PipelineRunResult {
  totalTicks: number;
  completedOrder: string[];
  timeline: TickSnapshot[];
}

export interface RetryPolicyInput {
  maxRetries: number;
  baseDelayTicks: number;
  backoff: "linear" | "exponential";
  maxDelayTicks: number;
}

export interface IndexedEvent {
  key: string;
  op: "upsert" | "delete";
  value?: number;
}

export interface SnapshotResult {
  state: Record<string, number>;
  appliedKeys: string[];
}

interface RunningTask {
  id: string;
  remaining: number;
}

export class Pipeline {
  run(input: PipelineRunInput): PipelineRunResult {
    if (input.concurrency <= 0) {
      throw new Error("concurrency must be > 0");
    }
    if (input.tasks.some((task) => task.durationTicks <= 0)) {
      throw new Error("task duration must be > 0");
    }

    const queue = input.tasks.map((task) => ({ ...task }));
    const running: RunningTask[] = [];
    const completedOrder: string[] = [];
    const timeline: TickSnapshot[] = [];
    let tick = 0;

    while (queue.length > 0 || running.length > 0) {
      while (running.length < input.concurrency && queue.length > 0) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        running.push({ id: next.id, remaining: next.durationTicks });
      }

      tick += 1;
      const completedThisTick: string[] = [];

      for (const item of running) {
        item.remaining -= 1;
      }

      for (let i = running.length - 1; i >= 0; i -= 1) {
        if (running[i].remaining === 0) {
          completedThisTick.push(running[i].id);
          completedOrder.push(running[i].id);
          running.splice(i, 1);
        }
      }

      completedThisTick.sort((a, b) => a.localeCompare(b));
      timeline.push({
        tick,
        running: running.map((item) => item.id).sort((a, b) => a.localeCompare(b)),
        completed: completedThisTick,
      });
    }

    return {
      totalTicks: tick,
      completedOrder,
      timeline,
    };
  }
}

export function buildRetryPolicy(input: RetryPolicyInput): number[] {
  if (input.maxRetries < 0 || input.baseDelayTicks <= 0 || input.maxDelayTicks <= 0) {
    throw new Error("invalid retry policy inputs");
  }

  const schedule: number[] = [];
  for (let attempt = 1; attempt <= input.maxRetries; attempt += 1) {
    const rawDelay =
      input.backoff === "exponential"
        ? input.baseDelayTicks * 2 ** (attempt - 1)
        : input.baseDelayTicks * attempt;
    schedule.push(Math.min(rawDelay, input.maxDelayTicks));
  }
  return schedule;
}

export function snapshotReducer(events: IndexedEvent[]): SnapshotResult {
  const state: Record<string, number> = {};
  const appliedKeys: string[] = [];

  for (const event of events) {
    appliedKeys.push(event.key);
    if (event.op === "delete") {
      delete state[event.key];
      continue;
    }
    state[event.key] = event.value ?? 0;
  }

  const sortedState = Object.keys(state)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, number>>((acc, key) => {
      acc[key] = state[key];
      return acc;
    }, {});

  return {
    state: sortedState,
    appliedKeys: [...appliedKeys].sort((a, b) => a.localeCompare(b)),
  };
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

export function pipelineRunReport(result: PipelineRunResult): { json: string; markdown: string } {
  return {
    json: JSON.stringify(stableOrder(result)),
    markdown: [
      "# Async Pipeline Run Report",
      "",
      `- Total ticks: ${result.totalTicks}`,
      `- Completed tasks: ${result.completedOrder.join(", ")}`,
      `- Timeline entries: ${result.timeline.length}`,
    ].join("\n"),
  };
}
