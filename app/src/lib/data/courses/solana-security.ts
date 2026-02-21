import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/solana-security/challenges/lesson-4-exploit-signer-owner";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-security/challenges/lesson-5-exploit-pda";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/solana-security/challenges/lesson-6-patch-validate";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-security/challenges/lesson-8-audit-report";

const lesson1: Lesson = {
  id: "security-v2-threat-model",
  slug: "security-v2-threat-model",
  title: "Solana threat model for auditors: accounts, owners, signers, writable, PDAs",
  type: "content",
  xpReward: 45,
  duration: "55 min",
  content: `# Solana threat model for auditors: accounts, owners, signers, writable, PDAs

Security work on Solana starts with one non-negotiable fact: instruction callers choose the account list. Programs do not receive trusted implicit context. They receive exactly the account metas and instruction data encoded in a transaction message. This design is powerful for composability and performance, but it means almost every critical exploit is an account validation exploit in disguise. If you internalize this early, your audits become more mechanical and less guess-based.

A good mental model is to treat each instruction as a contract boundary with five mandatory validations: identity, authority, ownership, mutability, and derivation. Identity asks whether the supplied account is the account the instruction expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether account data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested and justified. Derivation asks whether PDA paths are deterministic and verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.

Signer checks are not optional on privileged paths. If the instruction changes authority, moves funds, or updates risk parameters, the authority account must be a signer and must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship and verify that relation is enforced before state mutation.

Owner checks are equally critical. Programs often parse account bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is account substitution. It is the root cause of many catastrophic incidents and should be surfaced early in review notes.

PDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, and versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation and equality checks in all sensitive paths.

Writable flags matter for two reasons: correctness and attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.

Finally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow and invalidate all higher-level assumptions.

## Auditor workflow per instruction

For each handler, run the same sequence: identify privileged outcome, list required accounts, verify signer/owner/PDA relationships, verify writable scope, then test malformed account lists. Repeating this fixed loop prevents “I think it looks safe” audits.

## What you should be able to do after this lesson

- Turn a vague concern into a concrete validation checklist.
- Explain why account substitution and PDA spoofing recur in Solana incidents.
- Build deterministic negative-path scenarios before writing remediation notes.

## Checklist
- Map each instruction to a clear privilege model.
- Verify authority account is required signer for privileged actions.
- Verify authority key equality against stored state authority.
- Verify every parsed account has explicit owner validation.
- Verify each PDA is re-derived from canonical seeds and bump.
- Verify writable accounts are minimal and justified.
- Verify arithmetic uses checked operations for u64 transitions.
- Verify negative-path tests exist for unauthorized and malformed accounts.

## Red flags
- Privileged state updates without signer checks.
- Parsing unchecked account data from unknown owners.
- PDA acceptance based on partial seed checks.
- Handlers that trust client-provided bump blindly.
- Arithmetic updates using plain + and - on balances.

## How to verify (simulator)
- Run vulnerable mode on signer-missing scenario and inspect trace.
- Re-run fixed mode and confirm ERR_NOT_SIGNER.
- Execute owner-missing scenario and compare vulnerable vs fixed outcomes.
- Execute pda-spoof scenario and confirm fixed mode emits ERR_BAD_PDA.
- Compare trace hashes to verify deterministic event ordering.
`,
  blocks: [
    {
      type: "quiz",
      id: "security-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "security-v2-l1-q1",
          prompt: "Why are account owner checks mandatory before deserializing state?",
          options: [
            "Because callers can pass arbitrary accounts and forged byte layouts",
            "Because owner checks improve rendering speed",
            "Because owner checks replace signer checks",
          ],
          answerIndex: 0,
          explanation:
            "Without owner checks, account substitution allows attacker-controlled bytes to be parsed as trusted state.",
        },
        {
          id: "security-v2-l1-q2",
          prompt: "What should be verified for a privileged withdraw path?",
          options: [
            "Expected authority key, signer requirement, owner check, and PDA derivation",
            "Only that the vault account is writable",
            "Only that an amount field exists",
          ],
          answerIndex: 0,
          explanation:
            "Privileged transitions need full identity and authority validation.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "security-v2-evidence-chain",
  slug: "security-v2-evidence-chain",
  title: "Evidence chain: reproduce, trace, impact, fix, verify",
  type: "content",
  xpReward: 45,
  duration: "55 min",
  content: `# Evidence chain: reproduce, trace, impact, fix, verify

Strong security reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, and verify that the same steps now fail with expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.

Reproduction should be deterministic and minimal. Every scenario should declare initial accounts, authority/signer flags, vault ownership assumptions, and instruction inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops and triage slows down. In this course lab, scenarios are fixture-driven and offline so every replay produces the same state transitions.

Trace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed and where validation was skipped. They also help map exploitability to code-level checks. For example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.

Impact analysis should be quantitative. For signer and owner bugs, compute drained lamports or unauthorized state changes. For PDA bugs, show mismatch between expected derived address and accepted address. For arithmetic bugs, show underflow or overflow conditions and resulting corruption. Impact details inform severity and prioritization.

Patch validation should not just say “fixed.” It should prove exploit steps now fail for the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.

Verification closes the chain with invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, and no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.

When teams do this consistently, reports become executable documentation. New engineers can replay scenarios and understand why controls exist. Incident response becomes faster because prior failure signatures and remediation patterns are already captured.

## Checklist
- Define each scenario with explicit initial state and instruction inputs.
- Capture deterministic, ordered trace events for each run.
- Hash traces with canonical JSON for reproducibility.
- Quantify impact using before/after deltas.
- Map each finding to explicit evidence references.
- Re-run identical scenarios in fixed mode.
- Verify fixed-mode failures use expected error codes.
- Record post-fix invariant results with stable IDs.

## Red flags
- Reports with no reproduction steps.
- Non-deterministic traces that change between runs.
- Impact described qualitatively without deltas.
- Patch claims without fixed-mode replay evidence.
- Invariant lists omitted from verification section.

## How to verify (simulator)
- Run signer-missing in vulnerable mode, save trace hash.
- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.
- Run owner-missing and confirm ERR_BAD_OWNER in fixed mode.
- Run pda-spoof and compare expected/accepted PDA fields.
- Generate audit report JSON and markdown summary from checkpoint builder.
`,
  blocks: [
    {
      type: "explorer",
      id: "security-v2-l2-account-explorer",
      title: "Trace Account Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Vault account (vulnerable run)",
            address: "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            lamports: 300,
            owner: "VaultProgram111111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
          {
            label: "Recipient account (post exploit)",
            address: "Recipient111111111111111111111111111111111111",
            lamports: 710,
            owner: "SystemProgram1111111111111111111111111111111111",
            executable: false,
            dataLen: 0,
          },
        ],
      },
    },
    {
      type: "quiz",
      id: "security-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "security-v2-l2-q1",
          prompt: "What is the purpose of trace hashing in an audit workflow?",
          options: [
            "To prove deterministic replay and evidence integrity",
            "To replace structured test assertions",
            "To randomize scenario ordering",
          ],
          answerIndex: 0,
          explanation:
            "Canonical trace hashes make replay evidence comparable and tamper-evident.",
        },
        {
          id: "security-v2-l2-q2",
          prompt: "Which sequence represents a valid evidence chain?",
          options: [
            "Reproduce -> trace -> impact -> fix -> verify",
            "Fix -> reproduce -> trace -> release",
            "Trace -> release -> verify",
          ],
          answerIndex: 0,
          explanation: "This order ensures claims are demonstrated and patch effectiveness is validated.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "security-v2-bug-classes",
  slug: "security-v2-bug-classes",
  title: "Common Solana bug classes and mitigations",
  type: "content",
  xpReward: 45,
  duration: "55 min",
  content: `# Common Solana bug classes and mitigations

Auditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, and unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, and tests negative paths intentionally.

**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer and key relation. Yet teams miss it when refactoring account structs or switching between typed and unchecked account wrappers. Auditors should scan all state-mutating handlers and ask: who can call this and what proves authorization?

**Missing owner checks** create account substitution risk. Programs may deserialize account bytes and trust semantic fields without proving the account is owned by the expected program. In mixed CPI systems, this is especially dangerous because account shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing and strict account type usage.

**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between instructions. One handler derives ["vault", authority], another derives [authority, "vault"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, and tests that intentionally pass malformed PDA candidates.

**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, and scope-limited delegated authorities.

**Integer overflow/underflow** remains a practical class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable for balances and fee logic. Mitigation is checked operations, u128 intermediates for multiply/divide paths, and boundary-focused tests.

Mitigation quality depends on verification quality. Unit tests should include adversarial account substitutions, malformed seeds, missing signers, and boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.

The audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations and concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI and release gates.

## Checklist
- Enumerate all privileged instructions and expected signers.
- Verify owner checks before parsing external account layouts.
- Pin and document PDA seed schemas and bump usage.
- Validate CPI target program IDs against allowlist.
- Minimize writable and signer account metas in CPI.
- Enforce checked math for all u64 state transitions.
- Add negative tests for each bug class.
- Require deterministic traces for security-critical tests.

## Red flags
- Any privileged mutation path without explicit signer requirement.
- Any unchecked account deserialization path.
- Any instruction that accepts bump without re-derivation.
- Any CPI call to dynamic or user-selected program ID.
- Any unchecked arithmetic on balances or supply values.

## How to verify (simulator)
- Use lesson 4 scenario to confirm unauthorized withdraw in vulnerable mode.
- Use lesson 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.
- Use lesson 6 patch suite to verify fixed-mode errors by code.
- Run checkpoint report and ensure all scenarios are marked reproduced.
- Inspect invariant result array for all fixed-mode scenarios.
`,
  blocks: [
    {
      type: "quiz",
      id: "security-v2-l3-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "security-v2-l3-q1",
          prompt: "What is the strongest mitigation for PDA spoof risks?",
          options: [
            "Canonical seed schema with exact re-derivation + bump verification",
            "Accepting any PDA-like prefix",
            "Trusting client-provided bump values",
          ],
          answerIndex: 0,
          explanation: "Deterministic re-derivation closes spoofable PDA substitution paths.",
        },
        {
          id: "security-v2-l3-q2",
          prompt: "Why are negative-path tests required for audit confidence?",
          options: [
            "Because most exploitable bugs only appear under malformed or adversarial input",
            "Because happy-path tests cover all security cases",
            "Because traces are optional without them",
          ],
          answerIndex: 0,
          explanation:
            "Security failures are usually adversarial edge cases, so tests must target those edges directly.",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "security-v2-exploit-signer-owner",
  slug: "security-v2-exploit-signer-owner",
  title: "Break it: exploit missing signer + owner checks",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `# Break it: exploit missing signer + owner checks

Implement a deterministic exploit-proof formatter for signer/owner vulnerabilities.

Expected output fields:
- scenario
- before/after vault balance
- before/after recipient lamports
- trace hash
- explanation with drained lamports

Use canonical key ordering so tests can assert exact JSON output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "security-v2-exploit-pda-spoof",
  slug: "security-v2-exploit-pda-spoof",
  title: "Break it: exploit PDA spoof mismatch",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `# Break it: exploit PDA spoof mismatch

Implement a deterministic PDA spoof proof output.

You must show:
- expected PDA
- accepted PDA
- mismatch boolean
- trace hash

This lesson validates evidence generation for derivation mismatches.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "security-v2-patch-validate",
  slug: "security-v2-patch-validate",
  title: "Fix it: validations + invariant suite",
  type: "challenge",
  xpReward: 65,
  duration: "45 min",
  language: "typescript",
  content: `# Fix it: validations + invariant suite

Implement patch validation output that confirms:
- signer check
- owner check
- PDA check
- safe u64 arithmetic
- exploit blocked state with error code

Keep output deterministic for exact assertion.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Lesson = {
  id: "security-v2-writing-reports",
  slug: "security-v2-writing-reports",
  title: "Writing audit reports: severity, likelihood, blast radius, remediation",
  type: "content",
  xpReward: 45,
  duration: "55 min",
  content: `# Writing audit reports: severity, likelihood, blast radius, remediation

A strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, and what exact change prevents recurrence. Security writing quality directly affects fix quality because implementation teams ship what they can interpret.

Severity should be tied to impact and exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement with low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths and available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions and whether attacker capital or privileged positioning is required.

Likelihood should capture practical exploitability, not theoretical possibility. For example, if a bug requires impossible account states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard instruction with crafted account metas, likelihood is high. Be specific.

Blast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or governance authority. This framing helps teams stage incident response and patch rollout.

Recommendations must be precise and testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, and verify PDA from ["vault", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.

Evidence references are also important. Each finding should point to deterministic traces, scenario IDs, and checkpoint artifacts so another engineer can replay without interpretation gaps.

Finally, include verification results. A patch is not complete until exploit scenarios fail deterministically and invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.

Report structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering and concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.

A reliable pattern is one finding per vulnerability class with explicit evidence references grouped by scenario ID. That allows QA, auditors, and protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs and compare trace hashes to detect regressions in report assumptions.

## Checklist
- State explicit vulnerability class and affected instruction path.
- Include reproducible scenario ID and deterministic trace hash.
- Quantify impact with concrete state/balance deltas.
- Assign severity with rationale tied to exploit preconditions.
- Assign likelihood based on realistic attacker capabilities.
- Describe blast radius at account/protocol boundary.
- Provide exact remediation steps and expected error codes.
- Include verification outcomes and invariant results.

## Red flags
- Severity labels without impact rationale.
- Recommendations without concrete validation rules.
- No reproduction steps or trace references.
- No fixed-mode verification evidence.
- No distinction between impact and likelihood.

## How to verify (simulator)
- Generate report JSON from checkpoint builder.
- Confirm findings include evidenceRefs for each scenario.
- Confirm remediation includes patch IDs.
- Confirm verification results mark each scenario as blocked in fixed mode.
- Generate markdown summary and compare to report content ordering.
`,
  blocks: [
    {
      type: "quiz",
      id: "security-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "security-v2-l7-q1",
          prompt: "What is the key difference between severity and likelihood?",
          options: [
            "Severity measures impact; likelihood measures practical exploitability",
            "They are interchangeable labels",
            "Likelihood is only for low-severity bugs",
          ],
          answerIndex: 0,
          explanation: "Good reports separate damage potential from exploit feasibility.",
        },
        {
          id: "security-v2-l7-q2",
          prompt: "Which recommendation is most actionable?",
          options: [
            "Require signer + owner + PDA checks with explicit error codes",
            "Improve security in this function",
            "Add more comments",
          ],
          answerIndex: 0,
          explanation: "Actionable recommendations map directly to code changes and tests.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "security-v2-audit-report-checkpoint",
  slug: "security-v2-audit-report-checkpoint",
  title: "Checkpoint: deterministic AuditReport JSON + markdown",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `# Checkpoint: deterministic AuditReport JSON + markdown

Create the final deterministic checkpoint payload:
- course + version
- scenario IDs
- finding count

This checkpoint mirrors the final course artifact produced by the simulator report builder.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "security-v2-threat-model-and-method",
  title: "Threat Model & Audit Method",
  description:
    "Account-centric threat modeling, deterministic exploit reproduction, and evidence discipline for credible audit findings.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "security-v2-vuln-lab",
  title: "Vuln Lab Project Journey",
  description:
    "Exploit, patch, verify, and produce audit-ready artifacts with deterministic traces and invariant-backed conclusions.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const solanaSecurityCourse: Course = {
  id: "course-solana-security",
  slug: "solana-security",
  title: "Solana Security & Auditing",
  description:
    "Production-grade deterministic vuln lab for Solana auditors who need repeatable exploit evidence, precise remediation guidance, and high-signal audit artifacts.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 2200,
  tags: ["security", "audit", "vuln-lab", "solana"],
  imageUrl: "/images/courses/solana-security.svg",
  modules: [module1, module2],
};
