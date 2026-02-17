export interface SpeedrunState {
  enabled: boolean;
  running: boolean;
  startedAt: number | null;
  endedAt: number | null;
}

export function createSpeedrunState(): SpeedrunState {
  return {
    enabled: false,
    running: false,
    startedAt: null,
    endedAt: null,
  };
}

export function toggleSpeedrun(current: SpeedrunState, enabled: boolean): SpeedrunState {
  if (!enabled) {
    return {
      enabled: false,
      running: false,
      startedAt: null,
      endedAt: null,
    };
  }

  return {
    ...current,
    enabled: true,
  };
}

export function maybeStartSpeedrun(current: SpeedrunState, nowMs: number): SpeedrunState {
  if (!current.enabled || current.running || current.endedAt) {
    return current;
  }

  return {
    ...current,
    running: true,
    startedAt: nowMs,
  };
}

export function stopSpeedrun(current: SpeedrunState, nowMs: number): SpeedrunState {
  if (!current.running) {
    return current;
  }

  return {
    ...current,
    running: false,
    endedAt: nowMs,
  };
}

export function getSpeedrunTimeMs(current: SpeedrunState, nowMs: number): number | null {
  if (!current.startedAt) {
    return null;
  }
  if (current.endedAt) {
    return Math.max(0, current.endedAt - current.startedAt);
  }
  if (current.running) {
    return Math.max(0, nowMs - current.startedAt);
  }
  return null;
}

export function formatDuration(ms: number | null): string {
  if (ms === null) {
    return "--:--";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
}
