import { describe, expect, it } from "vitest";
import {
  planMigrationSteps,
  upgradeReadinessReport,
  validateUpgradeSafety,
} from "@/lib/courses/anchor-upgrades-migrations/project/upgrade-planner";
import {
  createDefaultAnchorUpgradesMigrationsLocalState,
  migrateAnchorUpgradesMigrationsLocalState,
} from "@/lib/courses/anchor-upgrades-migrations/local-state";

describe("anchor upgrades migrations project", () => {
  it("plans migration steps deterministically", () => {
    const plan = planMigrationSteps({ fromVersion: 1, toVersion: 3, accountCount: 10, batchSize: 4 });
    expect(plan.totalBatches).toBe(3);
    expect(plan.steps[0].kind).toBe("prepare");
    expect(plan.steps.at(-1)?.kind).toBe("finalize");
  });

  it("validates upgrade safety with blocking issues", () => {
    const issues = validateUpgradeSafety({
      hasUpgradeAuthority: false,
      programDataMatchesReleaseHash: false,
      idlBreakingChanges: 2,
      migrationBackfillComplete: true,
      dryRunPassed: false,
    });
    expect(issues.map((issue) => issue.code)).toEqual([
      "MISSING_UPGRADE_AUTHORITY",
      "PROGRAM_HASH_MISMATCH",
      "IDL_BREAKING_CHANGES",
      "DRY_RUN_FAILED",
    ]);
  });

  it("builds stable readiness report", () => {
    const plan = planMigrationSteps({ fromVersion: 2, toVersion: 2, accountCount: 0, batchSize: 50 });
    const report = upgradeReadinessReport({ plan, issues: [], releaseTag: "v2.2.0" });

    expect(report.json).toBe(
      '{"issueCount":0,"issues":[],"plan":{"fromVersion":2,"requiresMigration":false,"steps":[{"description":"freeze writes and snapshot program-owned accounts","id":"01-prepare","kind":"prepare"},{"description":"verify discriminators, bump seeds, and version markers","id":"02-verify","kind":"verify"},{"description":"enable writes and publish migration audit summary","id":"03-finalize","kind":"finalize"}],"totalBatches":0,"toVersion":2},"releaseTag":"v2.2.0"}',
    );
    expect(report.markdown).toContain("# Anchor Upgrade Readiness Report");
  });

  it("rejects invalid plan input", () => {
    expect(() =>
      planMigrationSteps({ fromVersion: 2, toVersion: 1, accountCount: 100, batchSize: 10 }),
    ).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateAnchorUpgradesMigrationsLocalState({ completedLessonIds: ["l1", "l1"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["l1"]);
    expect(createDefaultAnchorUpgradesMigrationsLocalState().lastReportJson).toBeNull();
  });
});
