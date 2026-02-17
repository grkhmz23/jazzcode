import type { Finding } from "@/lib/courses/solana-security/project/types";

export function buildFindings(): Finding[] {
  return [
    {
      id: "SEC-001",
      title: "Missing signer check on withdraw authority",
      severity: "critical",
      likelihood: "high",
      description:
        "The vulnerable runtime allows withdraw execution when authority pubkey matches state but did not sign the instruction.",
      recommendation: "Require authority signer and verify authority relation against vault state.",
      evidenceRefs: ["scenario:signer-missing", "trace:withdraw-signer-missing"],
    },
    {
      id: "SEC-002",
      title: "Missing owner validation for vault account",
      severity: "high",
      likelihood: "high",
      description:
        "The vulnerable runtime accepts a vault account with non-program owner, enabling account substitution.",
      recommendation: "Check vault owner equals program id before any state transition.",
      evidenceRefs: ["scenario:owner-missing", "trace:withdraw-owner-missing"],
    },
    {
      id: "SEC-003",
      title: "PDA derivation mismatch accepted",
      severity: "high",
      likelihood: "medium",
      description:
        "The vulnerable runtime skips strict PDA and bump verification, allowing spoofed vault addresses.",
      recommendation: "Re-derive PDA from canonical seeds + bump and require exact match.",
      evidenceRefs: ["scenario:pda-spoof", "trace:withdraw-pda-spoof"],
    },
  ];
}
