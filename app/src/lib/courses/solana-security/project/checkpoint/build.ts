import { buildAuditMarkdown } from "@/lib/courses/solana-security/project/audit/markdown";
import { buildAuditReport } from "@/lib/courses/solana-security/project/audit/report";
import { validateAuditReport } from "@/lib/courses/solana-security/project/checkpoint/validate";

export function buildCheckpointArtifact(): { reportJson: string; markdown: string; issues: string[] } {
  const report = buildAuditReport();
  const issues = validateAuditReport(report);
  return {
    reportJson: JSON.stringify(report),
    markdown: buildAuditMarkdown(),
    issues,
  };
}
