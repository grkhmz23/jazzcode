import { describe, expect, it } from "vitest";
import { buildAuditReport } from "@/lib/courses/solana-security/project/audit/report";
import { buildAuditMarkdown } from "@/lib/courses/solana-security/project/audit/markdown";
import { buildCheckpointArtifact } from "@/lib/courses/solana-security/project/checkpoint/build";

describe("solana security audit report", () => {
  it("builds deterministic audit report with stable scenario ordering", () => {
    const report = buildAuditReport();

    expect(report.course).toBe("solana-security");
    expect(report.version).toBe("v1");
    expect(report.reproduction.scenarios.map((scenario) => scenario.id)).toEqual([
      "signer-missing",
      "owner-missing",
      "pda-spoof",
    ]);
    expect(report.findings.map((finding) => finding.id)).toEqual(["SEC-001", "SEC-002", "SEC-003"]);
  });

  it("includes deterministic evidence hashes and patch ids", () => {
    const report = buildAuditReport();
    expect(report.fixturesHash).toBe("e95bff2e989d6bee3db3553f6ee9a17b06ab1280e727bf60b7424e1e7a59052d");
    expect(report.remediation.patchIds).toEqual([
      "patch-signer-check",
      "patch-owner-check",
      "patch-pda-check",
      "patch-safe-u64",
    ]);
  });

  it("builds checkpoint artifact with no validation issues", () => {
    const artifact = buildCheckpointArtifact();
    expect(artifact.issues).toEqual([]);
    expect(artifact.reportJson.length).toBeGreaterThan(300);
    expect(artifact.markdown).toContain("# Solana Security Audit Report");
  });

  it("markdown output is deterministic", () => {
    const first = buildAuditMarkdown();
    const second = buildAuditMarkdown();
    expect(first).toBe(second);
  });
});
