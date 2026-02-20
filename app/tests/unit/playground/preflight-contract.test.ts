import { describe, expect, it } from "vitest";
import {
  PREFLIGHT_MIN_DEPLOY_BALANCE_SOL,
  createPreflightReport,
  evaluatePreflightReadiness,
  preflightReportSchema,
  type PreflightCheck,
} from "@/lib/playground/preflight/types";

describe("playground preflight contract", () => {
  it("marks report as not ready when any check fails", () => {
    const checks: PreflightCheck[] = [
      {
        code: "RUNNER_MODE",
        title: "Runner mode",
        severity: "pass",
        message: "Local runner mode is active.",
      },
      {
        code: "TOOLCHAIN_ANCHOR",
        title: "Anchor CLI",
        severity: "fail",
        message: "anchor binary is not available.",
        action: "Install Anchor CLI in runner environment.",
      },
      {
        code: "WALLET_BALANCE_MINIMUM",
        title: "Wallet funding",
        severity: "warn",
        message: "Balance is below recommended deploy threshold.",
      },
    ];

    const readiness = evaluatePreflightReadiness(checks);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockingCodes).toEqual(["TOOLCHAIN_ANCHOR"]);
    expect(readiness.warningCodes).toEqual(["WALLET_BALANCE_MINIMUM"]);

    const report = createPreflightReport({
      mode: "local",
      checks,
      checkedAt: new Date("2026-02-20T00:00:00.000Z"),
    });

    expect(preflightReportSchema.parse(report)).toEqual(report);
    expect(report.ready).toBe(false);
    expect(report.mode).toBe("local");
    expect(report.minimumDeployBalanceSol).toBe(PREFLIGHT_MIN_DEPLOY_BALANCE_SOL);
  });

  it("marks report as ready when only pass/warn checks exist", () => {
    const report = createPreflightReport({
      mode: "remote",
      checks: [
        {
          code: "RUNNER_MODE",
          title: "Runner mode",
          severity: "pass",
          message: "Remote runner mode is active.",
        },
        {
          code: "RPC_DEVNET_REACHABLE",
          title: "Devnet RPC",
          severity: "warn",
          message: "RPC latency is elevated.",
        },
      ],
    });

    expect(report.ready).toBe(true);
    expect(report.blockingCodes).toEqual([]);
    expect(report.warningCodes).toEqual(["RPC_DEVNET_REACHABLE"]);
  });
});
