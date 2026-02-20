import { z } from "zod";

export const PREFLIGHT_MIN_DEPLOY_BALANCE_SOL = 1;

export const preflightCheckCodeSchema = z.enum([
  "RUNNER_MODE",
  "RUNNER_REMOTE_HEALTH",
  "TOOLCHAIN_ANCHOR",
  "TOOLCHAIN_CARGO",
  "TOOLCHAIN_SOLANA",
  "RPC_DEVNET_REACHABLE",
  "WALLET_CONNECTED",
  "WALLET_BALANCE_MINIMUM",
]);

export type PreflightCheckCode = z.infer<typeof preflightCheckCodeSchema>;

export const preflightCheckSeveritySchema = z.enum(["pass", "warn", "fail"]);
export type PreflightCheckSeverity = z.infer<typeof preflightCheckSeveritySchema>;

export const preflightModeSchema = z.enum(["local", "remote"]);
export type PreflightMode = z.infer<typeof preflightModeSchema>;

export const preflightCheckSchema = z.object({
  code: preflightCheckCodeSchema,
  title: z.string().min(1),
  severity: preflightCheckSeveritySchema,
  message: z.string().min(1),
  action: z.string().optional(),
  details: z.record(z.string(), z.string()).optional(),
});

export type PreflightCheck = z.infer<typeof preflightCheckSchema>;

export const preflightReportSchema = z.object({
  ready: z.boolean(),
  checkedAt: z.string().datetime(),
  mode: preflightModeSchema,
  minimumDeployBalanceSol: z.number().positive(),
  blockingCodes: z.array(preflightCheckCodeSchema),
  warningCodes: z.array(preflightCheckCodeSchema),
  checks: z.array(preflightCheckSchema),
});

export type PreflightReport = z.infer<typeof preflightReportSchema>;

export function evaluatePreflightReadiness(checks: PreflightCheck[]): {
  ready: boolean;
  blockingCodes: PreflightCheckCode[];
  warningCodes: PreflightCheckCode[];
} {
  const blockingCodes = checks
    .filter((check) => check.severity === "fail")
    .map((check) => check.code);
  const warningCodes = checks
    .filter((check) => check.severity === "warn")
    .map((check) => check.code);

  return {
    ready: blockingCodes.length === 0,
    blockingCodes,
    warningCodes,
  };
}

export function createPreflightReport(input: {
  mode: PreflightMode;
  checks: PreflightCheck[];
  checkedAt?: Date;
  minimumDeployBalanceSol?: number;
}): PreflightReport {
  const checkedAt = (input.checkedAt ?? new Date()).toISOString();
  const readiness = evaluatePreflightReadiness(input.checks);

  return preflightReportSchema.parse({
    ready: readiness.ready,
    checkedAt,
    mode: input.mode,
    minimumDeployBalanceSol:
      input.minimumDeployBalanceSol ?? PREFLIGHT_MIN_DEPLOY_BALANCE_SOL,
    blockingCodes: readiness.blockingCodes,
    warningCodes: readiness.warningCodes,
    checks: input.checks,
  });
}
