import type { DashboardEvent } from "../types";

export function compareEvents(a: DashboardEvent, b: DashboardEvent): number {
  if (a.ts !== b.ts) {
    return a.ts - b.ts;
  }
  return a.id.localeCompare(b.id);
}

export function sortEvents(events: DashboardEvent[]): DashboardEvent[] {
  return [...events].sort(compareEvents);
}
