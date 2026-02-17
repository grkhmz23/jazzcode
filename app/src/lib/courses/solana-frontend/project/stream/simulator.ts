import { sortEvents } from "../normalization/ordering";
import type { DashboardEvent } from "../types";

export interface StreamTick {
  index: number;
  at: number;
  event: DashboardEvent;
}

export function simulateDeterministicStream(
  events: DashboardEvent[],
  stepMs = 100,
): StreamTick[] {
  const ordered = sortEvents(events);
  return ordered.map((event, index) => ({
    index,
    at: index * stepMs,
    event,
  }));
}
