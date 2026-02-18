const RUNNER_LIMIT = 30;
const RUNNER_WINDOW_MS = 60_000;

const store = new Map<string, { count: number; resetAt: number }>();

export type RunnerRateLimitStatus = {
  limit: number;
  remaining: number;
  resetAt: number;
};

export async function enforceRunnerRateLimit(identifier: string): Promise<RunnerRateLimitStatus> {
  const now = Date.now();
  const current = store.get(identifier);

  if (!current || current.resetAt <= now) {
    const resetAt = now + RUNNER_WINDOW_MS;
    store.set(identifier, { count: 1, resetAt });
    return {
      limit: RUNNER_LIMIT,
      remaining: RUNNER_LIMIT - 1,
      resetAt,
    };
  }

  if (current.count >= RUNNER_LIMIT) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new Error(`Runner rate limit exceeded. Retry after ${retryAfterSec}s.`);
  }

  const next = { ...current, count: current.count + 1 };
  store.set(identifier, next);
  return {
    limit: RUNNER_LIMIT,
    remaining: Math.max(0, RUNNER_LIMIT - next.count),
    resetAt: next.resetAt,
  };
}
