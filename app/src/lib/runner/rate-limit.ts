const RUNNER_LIMIT = 30;
const RUNNER_WINDOW_MS = 60_000;

const store = new Map<string, { count: number; resetAt: number }>();

export async function enforceRunnerRateLimit(identifier: string): Promise<void> {
  const now = Date.now();
  const current = store.get(identifier);

  if (!current || current.resetAt <= now) {
    store.set(identifier, { count: 1, resetAt: now + RUNNER_WINDOW_MS });
    return;
  }

  if (current.count >= RUNNER_LIMIT) {
    throw new Error("Runner rate limit exceeded");
  }

  store.set(identifier, { ...current, count: current.count + 1 });
}
