import { buildAuditReport } from "@/lib/courses/solana-security/project/audit/report";

export function buildAuditMarkdown(): string {
  const report = buildAuditReport();
  const findingLines = report.findings
    .map((finding) => `- ${finding.id} [${finding.severity}] ${finding.title}`)
    .join("\n");
  const scenarioLines = report.reproduction.scenarios
    .map((scenario) => `- ${scenario.id}: vulnerable=${scenario.vulnerableTraceHash} fixed=${scenario.fixedTraceHash}`)
    .join("\n");

  return [
    "# Solana Security Audit Report",
    "",
    `Course: ${report.course}`,
    `Version: ${report.version}`,
    `Fixtures Hash: ${report.fixturesHash}`,
    "",
    "## Findings",
    findingLines,
    "",
    "## Reproduction",
    scenarioLines,
    "",
    "## Remediation",
    report.remediation.summary,
  ].join("\n");
}
