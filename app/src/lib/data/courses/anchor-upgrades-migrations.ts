import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/anchor-upgrades-migrations/challenges/lesson-4-migration-steps";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/anchor-upgrades-migrations/challenges/lesson-5-upgrade-safety";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/anchor-upgrades-migrations/challenges/lesson-7-report-markdown";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/anchor-upgrades-migrations/challenges/lesson-8-checkpoint";

const opsAppendix = `

This lesson should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures for each upgrade class: schema-only changes, instruction behavior changes, and authority changes. For every class, capture expected artifacts and compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, and what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document with explicit slot windows, RPC provider failover plan, and support messaging templates. If a release is paused, the plan should already define whether to retry with the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown and stable JSON, teams avoid panic changes during incidents and can audit exactly what happened after the fact. The same approach improves onboarding: new engineers learn from concrete evidence trails instead of tribal memory.
`;

const lesson1: Lesson = {
  id: "aum-v2-upgrade-authority-lifecycle",
  slug: "aum-v2-upgrade-authority-lifecycle",
  title: "Upgrade authority lifecycle in Anchor programs",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Upgrade authority lifecycle in Anchor programs

Anchor makes instruction development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, and missing checks between build artifacts and deployed programdata. This lesson teaches a practical lifecycle model that maps directly to how Anchor programs are deployed and governed.

Start with a strict authority model. Define who can sign upgrades and under which conditions. A single hot wallet is not acceptable for mature systems. Typical setups use a multisig or governance path to approve artifacts, then a controlled signer to perform deployment. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, and rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.

Next, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before and after deployment in your pipeline simulation. Even when this course stays deterministic and does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.

Authority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require governance timelocks and emergency pause conditions. Neither is universally correct. The key is consistency with explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this governance tradeoff for you; it only provides the program framework.

Release communication is part of security. Users and integrators need predictable language about what changed and whether state migration is required. For example, if you add new account fields but keep backward decoding compatibility, your report should say migration is optional for old accounts and mandatory for new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy and downtime expectations. Ambiguous language creates support load and increases operational risk.

Finally, design your release pipeline for deterministic dry runs. Simulate migration steps, validation checks, and report generation locally. The goal is to eliminate unforced errors before any transaction is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm and reviewable.

## Operator mindset

Anchor upgrades are operations work with cryptographic consequences. Authority controls, migration sequencing, and rollback criteria should be treated as release contracts, not informal habits.
${opsAppendix}
## Checklist
- Define clear authority ownership and approval flow.
- Require artifact hash match before rollout.
- Document authority transition and rollback policy.
- Publish migration impact in deterministic report fields.
- Block releases when dry-run evidence is missing.
`,
  blocks: [
    {
      type: "quiz",
      id: "aum-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "aum-v2-l1-q1",
          prompt: "What is the most defensible release gate before deployment?",
          options: [
            "Compare approved build hash to expected programdata hash policy input",
            "Ship quickly and validate hash later",
            "Rely on signer memory without written report",
          ],
          answerIndex: 0,
          explanation:
            "Hash matching is a deterministic control that prevents artifact drift during deployment.",
        },
        {
          id: "aum-v2-l1-q2",
          prompt: "Why is release communication part of upgrade safety?",
          options: [
            "Integrators need exact migration impact and timing to avoid operational errors",
            "Because Anchor automatically writes support tickets",
            "Because all upgrades are backward compatible",
          ],
          answerIndex: 0,
          explanation:
            "Unclear upgrade messaging causes integration mistakes and user-facing incidents.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "aum-v2-account-versioning-and-migrations",
  slug: "aum-v2-account-versioning-and-migrations",
  title: "Account versioning and migration strategy",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Account versioning and migration strategy

Solana accounts are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing account fields can be safe, risky, or catastrophic depending on how version markers, discriminators, and decode logic are handled. This lesson focuses on migration planning that is deterministic, testable, and production-oriented.

The first rule is explicit version markers. Do not infer schema version from account size alone because reallocations and optional fields can make that ambiguous. Include a version field and define what each version guarantees. Your migration planner can then segment account ranges by version and apply deterministic transforms. Without explicit markers, teams often guess state shape and ship brittle one-off scripts.

Second, separate compatibility mode from migration mode. Compatibility mode means new code can read old and new versions while writes may still target old shape for a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while account batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state and broken assumptions.

Batching is a practical necessity. Large protocols cannot migrate every account in one transaction or one slot. Your plan should define batch size, ordering, and integrity checks. For example, process account indexes in deterministic ascending order and verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch with idempotent logic. Deterministic batch identifiers make this auditable and easier to recover.

Plan for dry-run and rollback before execution. A migration plan should include prepare, migrate, verify, and finalize steps with explicit criteria. Prepare can freeze new writes and snapshot baseline metrics. Verify can compare counts by version and check critical invariants. Finalize can re-enable writes and publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.

Anchor adds value here through typed account contexts and constraints, but migrations still require careful data engineering. For every changed account type, maintain deterministic test fixtures: old bytes, expected new bytes, and expected structured decode output. This catches layout regressions early and builds confidence when migrating real state.

Treat migration metrics as product metrics too. Users care about downtime, failed actions, and consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication and orchestration as they are about code.
${opsAppendix}
## Checklist
- Use explicit version markers in account data.
- Define compatibility and migration modes separately.
- Migrate in deterministic batches with idempotent retries.
- Keep dry-run fixtures for byte-level and structured outputs.
- Publish migration status and completion evidence.
`,
  blocks: [
    {
      type: "terminal",
      id: "aum-v2-l2-terminal",
      title: "Migration Batch Walkthrough",
      steps: [
        {
          cmd: "prepare --freeze-writes --snapshot-count=12000",
          output: "status=ok frozen=true snapshot=12000",
          note: "Freeze writes before touching account schema.",
        },
        {
          cmd: "migrate --batch=3 --range=2000-2999 --target=v3",
          output: "status=ok migrated=1000 failed=0",
          note: "Batch IDs are deterministic and replayable.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "aum-v2-upgrade-risk-explorer",
  slug: "aum-v2-upgrade-risk-explorer",
  title: "Explorer: upgrade risk matrix",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: upgrade risk matrix

A useful upgrade explorer should show cause-and-effect between release inputs and safety outcomes. If a flag changes, engineers should immediately see how severity and readiness changes. This lesson teaches how to build and read a deterministic risk matrix for Anchor upgrades.

The matrix starts with five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, and dry-run pass status. These cover governance, artifact integrity, compatibility risk, data readiness, and execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.

Each matrix row represents a release candidate state. For every row, compute issue codes and severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI and easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.

Severity calibration should be conservative. Missing upgrade authority, hash mismatch, and failed dry run are high severity because they directly block safe rollout. Incomplete backfill and IDL breaking changes are usually medium severity: sometimes resolvable with migration notes and staged release windows, but still risky if ignored.

The explorer should also teach false confidence patterns. For example, a release with zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release with breaking changes can still be safe if migration plan is complete, compatibility notes are clear, and rollout is staged with monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.

From a workflow perspective, the matrix output should feed both engineering and support. Engineering uses JSON for machine checks and gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked and why. If these outputs disagree, your generation path is wrong. Use one canonical payload and derive both formats.

Finally, integrate the explorer into code review. Require reviewers to reference matrix output for each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in deployment scripts.
${opsAppendix}
## Checklist
- Use a canonical risk payload with stable ordering.
- Mark authority/hash/dry-run failures as blocking.
- Keep JSON and markdown generated from one source.
- Validate matrix behavior with deterministic fixtures.
- Treat explorer output as part of PR review evidence.
`,
  blocks: [
    {
      type: "explorer",
      id: "aum-v2-l3-explorer",
      title: "Upgrade Risk Scenarios",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Release candidate A",
            address: "AUpg111111111111111111111111111111111111111",
            lamports: 3000,
            owner: "BPFLoaderUpgradeab1e11111111111111111111111",
            executable: false,
            dataLen: 128,
          },
          {
            label: "Release candidate B",
            address: "AUpg222222222222222222222222222222222222222",
            lamports: 4500,
            owner: "BPFLoaderUpgradeab1e11111111111111111111111",
            executable: false,
            dataLen: 160,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "aum-v2-plan-migration-steps",
  slug: "aum-v2-plan-migration-steps",
  title: "Challenge: implement migration step planner",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content:
    "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, and requiresMigration.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "aum-v2-validate-upgrade-safety",
  slug: "aum-v2-validate-upgrade-safety",
  title: "Challenge: implement upgrade safety gate checks",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content:
    "Implement deterministic blocking issue checks for authority, artifact hash, and dry-run status.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "aum-v2-rollback-and-incident-playbooks",
  slug: "aum-v2-rollback-and-incident-playbooks",
  title: "Rollback strategy and incident playbooks",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Rollback strategy and incident playbooks

Even strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected account edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback and incident playbooks before any deployment begins. This lesson covers pragmatic rollback design for Anchor-based systems.

Rollback starts with explicit trigger conditions. Do not wait for subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, and publish incident status.

A common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.

Anchor account constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling for affected account identification, reprocessing queues, and reconciliation summaries. Keep these tools pure and replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.

Communication is part of rollback. Engineering, support, and partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, and next checkpoint time. Avoid free-form updates that diverge across channels.

Post-incident learning must be concrete. For each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions and confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.

Finally, distinguish between emergency stop controls and full rollback procedures. Emergency stop is for immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.
${opsAppendix}
## Checklist
- Define measurable rollback triggers in advance.
- Classify incident phase before selecting response path.
- Keep recovery tooling replayable and deterministic.
- Share one canonical incident report format.
- Add regression fixtures after every rollback event.
`,
  blocks: [
    {
      type: "quiz",
      id: "aum-v2-l6-quiz",
      title: "Incident Response Check",
      questions: [
        {
          id: "aum-v2-l6-q1",
          prompt: "What should happen first when rollback trigger thresholds are hit?",
          options: [
            "Enter defined response mode: pause risky actions and publish status",
            "Continue migration batches to avoid confusion",
            "Delete all historical reports",
          ],
          answerIndex: 0,
          explanation:
            "Trigger conditions should map to immediate deterministic response actions.",
        },
        {
          id: "aum-v2-l6-q2",
          prompt: "Why add deterministic fixtures after an incident?",
          options: [
            "To prove policy changes prevent the same failure path",
            "To increase deploy complexity without benefit",
            "To replace all code reviews",
          ],
          answerIndex: 0,
          explanation:
            "Incident fixtures turn lessons into enforceable regression tests.",
        },
      ],
    },
  ],
};

const lesson7: Challenge = {
  id: "aum-v2-upgrade-report-markdown",
  slug: "aum-v2-upgrade-report-markdown",
  title: "Challenge: build stable upgrade markdown summary",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Generate deterministic markdown from releaseTag, totalBatches, and issueCount.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "aum-v2-upgrade-readiness-checkpoint",
  slug: "aum-v2-upgrade-readiness-checkpoint",
  title: "Checkpoint: upgrade readiness artifact",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content:
    "Produce the final deterministic checkpoint artifact with release tag, readiness flag, and migration batch count.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "aum-v2-module-1",
  title: "Upgrade Foundations",
  description:
    "Authority lifecycle, account versioning strategy, and deterministic upgrade risk modeling for Anchor releases.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "aum-v2-module-2",
  title: "Migration Execution",
  description:
    "Safety validation gates, rollback planning, and deterministic readiness artifacts for controlled migration execution.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const anchorUpgradesMigrationsCourse: Course = {
  id: "anchor-upgrades-migrations",
  slug: "anchor-upgrades-migrations",
  title: "Anchor Upgrades & Account Migrations",
  description:
    "Design production-safe Anchor release workflows with deterministic migration planning, upgrade gates, rollback playbooks, and readiness evidence.",
  difficulty: "advanced",
  duration: "8 hours",
  totalXP: 440,
  tags: ["anchor", "solana", "upgrades", "migrations", "program-management"],
  imageUrl: "/images/courses/anchor-upgrades-migrations.jpg",
  modules: [module1, module2],
};
