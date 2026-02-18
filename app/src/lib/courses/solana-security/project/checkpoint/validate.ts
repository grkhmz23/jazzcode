import type { AuditReport } from "@/lib/courses/solana-security/project/types";

export function validateAuditReport(report: AuditReport): string[] {
  const issues: string[] = [];

  if (report.course !== "solana-security") {
    issues.push("course must equal solana-security");
  }
  if (report.version !== "v2") {
    issues.push("version must equal v2");
  }
  if (report.findings.length < 3) {
    issues.push("at least three findings required");
  }
  for (const scenario of report.reproduction.scenarios) {
    if (scenario.status !== "reproduced") {
      issues.push(`scenario ${scenario.id} must be reproduced`);
    }
  }

  return issues;
}
