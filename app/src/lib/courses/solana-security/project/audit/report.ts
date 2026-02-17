import fixturesJson from "@/lib/courses/solana-security/project/scenarios/fixtures.v1.json";
import { buildFindings } from "@/lib/courses/solana-security/project/audit/findings";
import { canonicalJson } from "@/lib/courses/solana-security/project/crypto/canonical-json";
import { sha256Hex } from "@/lib/courses/solana-security/project/crypto/sha256";
import { COURSE_ID, PATCH_IDS, REPORT_VERSION } from "@/lib/courses/solana-security/project/ids";
import { buildInstructionForScenario, securityScenarios } from "@/lib/courses/solana-security/project/exploit/reproduce";
import { runScenario, traceHash } from "@/lib/courses/solana-security/project/exploit/run";
import { checkVaultInvariants } from "@/lib/courses/solana-security/project/programs/vault/invariants";
import type { AuditReport } from "@/lib/courses/solana-security/project/types";

export function buildAuditReport(): AuditReport {
  const findings = buildFindings();

  const scenarios = securityScenarios.map((scenario) => {
    const vulnerable = runScenario("vulnerable", scenario);
    const fixed = runScenario("fixed", scenario);
    const drained = (BigInt(vulnerable.afterRecipientLamports) - BigInt(vulnerable.beforeRecipientLamports)).toString();

    return {
      id: scenario.id,
      steps: [
        `Load fixture ${scenario.id}`,
        "Execute vulnerable runtime withdraw",
        "Capture vulnerable trace hash",
        "Execute fixed runtime withdraw",
        "Capture fixed trace hash",
      ],
      vulnerableTraceHash: traceHash(vulnerable.trace),
      fixedTraceHash: traceHash(fixed.trace),
      impact: {
        drainedLamports: drained,
      },
      status: "reproduced" as const,
    };
  });

  const baselineScenario = securityScenarios[0];
  const baselineInstruction = buildInstructionForScenario(baselineScenario);
  const baselineOutcome = runScenario("fixed", baselineScenario);
  const baselineVaultPubkey = baselineInstruction.accounts.vaultPda;
  const invariants = checkVaultInvariants(baselineOutcome.snapshot, baselineVaultPubkey);

  const verificationResults = securityScenarios.map((scenario) => {
    const outcome = runScenario("fixed", scenario);
    return { id: scenario.id, ok: !outcome.ok };
  });

  return {
    course: COURSE_ID,
    version: REPORT_VERSION,
    fixturesHash: sha256Hex(canonicalJson(fixturesJson)),
    findings,
    reproduction: {
      scenarios,
    },
    remediation: {
      summary:
        "Patch enforces signer validation, strict vault owner checks, deterministic PDA derivation checks, and checked u64 arithmetic.",
      patchIds: [...PATCH_IDS],
    },
    verification: {
      invariants,
      results: verificationResults,
    },
  };
}
