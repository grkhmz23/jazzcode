import { applyDashboardEvent } from "../model/reducer";
import { createEmptyDashboardState } from "../model/state";
import { canonicalJson, sha256Hex } from "../normalization/canonical-json";
import { sortEvents } from "../normalization/ordering";
import type { DashboardEvent, Snapshot, SnapshotBuildResult } from "../types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseEventsFromFixture(fixture: unknown): DashboardEvent[] {
  if (!isObject(fixture)) {
    throw new Error("Fixture must be an object");
  }
  const maybeEvents = fixture.events;
  if (!Array.isArray(maybeEvents)) {
    throw new Error("Fixture must include events[]");
  }
  return maybeEvents as DashboardEvent[];
}

export function buildSnapshotsFromFixture(
  fixture: unknown,
  interval: number,
): SnapshotBuildResult {
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error("interval must be a positive integer");
  }

  const ordered = sortEvents(parseEventsFromFixture(fixture));
  let state = createEmptyDashboardState();
  const snapshots: Snapshot[] = [];

  for (let index = 0; index < ordered.length; index += 1) {
    state = applyDashboardEvent(state, ordered[index]);
    const nextIndex = index + 1;
    if (nextIndex % interval === 0 || nextIndex === ordered.length) {
      const snapshotState = JSON.parse(JSON.stringify(state)) as typeof state;
      const checksum = sha256Hex(canonicalJson(snapshotState));
      snapshots.push({
        eventIndex: nextIndex,
        eventId: ordered[index].id,
        state: snapshotState,
        checksum,
      });
    }
  }

  const finalChecksum = sha256Hex(
    canonicalJson({
      snapshots: snapshots.map((snapshot) => ({
        eventIndex: snapshot.eventIndex,
        eventId: snapshot.eventId,
        checksum: snapshot.checksum,
      })),
      finalHistorySize: state.history.length,
    }),
  );

  return {
    finalState: state,
    snapshots,
    checksum: finalChecksum,
  };
}
