export interface MigrationPlanInput {
  fromVersion: number;
  toVersion: number;
  accountCount: number;
  batchSize: number;
}

export interface MigrationStep {
  id: string;
  kind: "prepare" | "migrate-batch" | "verify" | "finalize";
  batchIndex?: number;
  startAccount?: number;
  endAccount?: number;
  description: string;
}

export interface MigrationPlan {
  fromVersion: number;
  toVersion: number;
  totalBatches: number;
  requiresMigration: boolean;
  steps: MigrationStep[];
}

export interface UpgradeSafetyInput {
  hasUpgradeAuthority: boolean;
  programDataMatchesReleaseHash: boolean;
  idlBreakingChanges: number;
  migrationBackfillComplete: boolean;
  dryRunPassed: boolean;
}

export interface UpgradeSafetyIssue {
  code:
    | "MISSING_UPGRADE_AUTHORITY"
    | "PROGRAM_HASH_MISMATCH"
    | "IDL_BREAKING_CHANGES"
    | "BACKFILL_INCOMPLETE"
    | "DRY_RUN_FAILED";
  severity: "high" | "medium";
  message: string;
}

export interface UpgradeReadinessSnapshot {
  plan: MigrationPlan;
  issues: UpgradeSafetyIssue[];
  releaseTag: string;
}

export interface UpgradeReadinessReport {
  json: string;
  markdown: string;
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    const keys = Object.keys(record).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
      out[key] = stableValue(record[key]);
    }
    return out;
  }
  return value;
}

export function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

export function planMigrationSteps(input: MigrationPlanInput): MigrationPlan {
  if (!Number.isInteger(input.fromVersion) || input.fromVersion < 1) {
    throw new Error("fromVersion must be an integer >= 1");
  }
  if (!Number.isInteger(input.toVersion) || input.toVersion < input.fromVersion) {
    throw new Error("toVersion must be an integer >= fromVersion");
  }
  if (!Number.isInteger(input.accountCount) || input.accountCount < 0) {
    throw new Error("accountCount must be an integer >= 0");
  }
  if (!Number.isInteger(input.batchSize) || input.batchSize <= 0) {
    throw new Error("batchSize must be an integer > 0");
  }

  const requiresMigration = input.toVersion > input.fromVersion;
  const totalBatches = requiresMigration
    ? Math.ceil(input.accountCount / Math.max(1, input.batchSize))
    : 0;

  const steps: MigrationStep[] = [
    {
      id: "01-prepare",
      kind: "prepare",
      description: "freeze writes and snapshot program-owned accounts",
    },
  ];

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex += 1) {
    const startAccount = batchIndex * input.batchSize;
    const endAccount = Math.min(input.accountCount - 1, startAccount + input.batchSize - 1);
    steps.push({
      id: `${String(batchIndex + 2).padStart(2, "0")}-migrate-batch-${batchIndex + 1}`,
      kind: "migrate-batch",
      batchIndex: batchIndex + 1,
      startAccount,
      endAccount,
      description: `migrate account range ${startAccount}-${endAccount} to v${input.toVersion}`,
    });
  }

  steps.push({
    id: `${String(steps.length + 1).padStart(2, "0")}-verify`,
    kind: "verify",
    description: "verify discriminators, bump seeds, and version markers",
  });
  steps.push({
    id: `${String(steps.length + 1).padStart(2, "0")}-finalize`,
    kind: "finalize",
    description: "enable writes and publish migration audit summary",
  });

  return {
    fromVersion: input.fromVersion,
    toVersion: input.toVersion,
    totalBatches,
    requiresMigration,
    steps,
  };
}

export function validateUpgradeSafety(input: UpgradeSafetyInput): UpgradeSafetyIssue[] {
  const issues: UpgradeSafetyIssue[] = [];

  if (!input.hasUpgradeAuthority) {
    issues.push({
      code: "MISSING_UPGRADE_AUTHORITY",
      severity: "high",
      message: "upgrade authority is missing or revoked for this release",
    });
  }

  if (!input.programDataMatchesReleaseHash) {
    issues.push({
      code: "PROGRAM_HASH_MISMATCH",
      severity: "high",
      message: "programdata hash differs from approved build artifact",
    });
  }

  if (input.idlBreakingChanges > 0) {
    issues.push({
      code: "IDL_BREAKING_CHANGES",
      severity: "medium",
      message: `detected ${input.idlBreakingChanges} breaking IDL changes requiring migration notes`,
    });
  }

  if (!input.migrationBackfillComplete) {
    issues.push({
      code: "BACKFILL_INCOMPLETE",
      severity: "medium",
      message: "account backfill is incomplete for target schema version",
    });
  }

  if (!input.dryRunPassed) {
    issues.push({
      code: "DRY_RUN_FAILED",
      severity: "high",
      message: "deterministic dry run failed and release should be blocked",
    });
  }

  return issues;
}

export function upgradeReadinessReport(snapshot: UpgradeReadinessSnapshot): UpgradeReadinessReport {
  const payload = {
    issueCount: snapshot.issues.length,
    issues: snapshot.issues,
    plan: snapshot.plan,
    releaseTag: snapshot.releaseTag,
  };

  const json = stableJson(payload);
  const markdown = [
    "# Anchor Upgrade Readiness Report",
    "",
    `- Release tag: ${snapshot.releaseTag}`,
    `- Requires migration: ${snapshot.plan.requiresMigration ? "yes" : "no"}`,
    `- Total batches: ${snapshot.plan.totalBatches}`,
    `- Total plan steps: ${snapshot.plan.steps.length}`,
    `- Safety issues: ${snapshot.issues.length}`,
    `- Blocking issues: ${snapshot.issues.filter((issue) => issue.severity === "high").length}`,
    "",
    "## Issues",
    ...(snapshot.issues.length === 0
      ? ["- none"]
      : snapshot.issues.map((issue) => `- [${issue.severity}] ${issue.code}: ${issue.message}`)),
  ].join("\n");

  return { json, markdown };
}
