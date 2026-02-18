import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/indexing-webhooks-pipelines/challenges/lesson-4-dedupe-events";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/indexing-webhooks-pipelines/challenges/lesson-5-apply-confirmations";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/indexing-webhooks-pipelines/challenges/lesson-6-backfill-idempotency";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/indexing-webhooks-pipelines/challenges/lesson-7-snapshot-integrity";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/indexing-webhooks-pipelines/challenges/lesson-8-pipeline-report-checkpoint";

const lesson1: Lesson = {
  id: "indexpipe-v2-indexing-basics",
  slug: "indexpipe-v2-indexing-basics",
  title: "Indexing 101: logs, accounts, and transaction parsing",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Indexing 101: logs, accounts, and transaction parsing

Reliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, and how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed instructions, but production pipelines need deterministic keying, replay controls, and state application rules that survive retries and reorgs.

A basic pipeline has four stages: ingest, dedupe, confirmation gating, and state apply. Ingest captures raw events with enough metadata to reconstruct ordering context: slot, signature, instruction index, event type, and affected account. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.

Many teams fail in the first stage by capturing incomplete event identity fields. If you omit instruction index or event kind, collisions appear and dedupe becomes unsafe. Composite keys should be explicit and stable. They should also be derived purely from event payload so keys remain reproducible in tests and backfills.

Parsing strategy matters too. Logs are convenient but can drift across program versions. Parsed instruction data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.

Idempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift and downstream analytics become untrustworthy. Deterministic dedupe with composite keys is the first line of defense.

The apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.

Snapshot design should prioritize auditability. Keep applied event keys, pending keys, and finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects and why. They also simplify integrity checks later.

Finally, keep deterministic outputs central to your developer workflow. Pipeline reports and snapshots should be exportable in stable formats for test snapshots and incident analysis. Reliability work depends on reproducible evidence.


To keep this durable, teams should document fixture ownership and rotate review responsibilities so event taxonomy stays aligned with protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, and recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve with production reality and every stage still reports clear, machine-verifiable state transitions under replay and stress.

This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Operator mindset

Indexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion with weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.

## Checklist
- Capture complete event identity fields at ingest time.
- Normalize events from logs and parsed instructions into one schema.
- Use deterministic composite keys for dedupe.
- Sort events stably before state application.
- Track applied, pending, and finalized sets in snapshots.
`,
  blocks: [
    {
      type: "quiz",
      id: "indexpipe-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "indexpipe-v2-l1-q1",
          prompt: "Why is instruction index important in event keys?",
          options: [
            "It helps prevent collisions when one transaction emits similar events",
            "It reduces RPC cost directly",
            "It replaces confirmation checks",
          ],
          answerIndex: 0,
          explanation:
            "Instruction index distinguishes same-signature events that would otherwise collide in dedupe.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "indexpipe-v2-reorg-confirmation-reality",
  slug: "indexpipe-v2-reorg-confirmation-reality",
  title: "Reorgs and fork choice: why confirmed is not finalized",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Reorgs and fork choice: why confirmed is not finalized

Confirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive design acknowledges this and encodes reversible state transitions.

Reorg-aware indexing starts with depth thresholds. For each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.

Why maintain provisional state at all? Because users and systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances with settlement badges. Automated systems can choose whether to act on provisional or finalized data.

Fork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys and supports replay, you can recompute snapshot deterministically from deduped events and updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.

Deterministic apply logic helps here. If the same deduped event set and same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.

Another reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed and observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.

Integrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite and non-negative under your business rules, and snapshot counts should align with event sets. Failing these checks should mark snapshot as invalid and block downstream export.

Communication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.

The overarching principle is to make uncertainty explicit and reversible. Reorg-safe pipelines are less about predicting forks and more about handling them cleanly when they happen.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Define confirmed and finalized depth thresholds explicitly.
- Separate pending, applied, and finalized event sets.
- Keep replayable deterministic apply logic.
- Run integrity checks on every snapshot export.
- Surface settlement confidence clearly in UI and APIs.
`,
  blocks: [
    {
      type: "terminal",
      id: "indexpipe-v2-l2-terminal",
      title: "Depth-Based Confirmation",
      steps: [
        {
          cmd: "headSlot=120, eventSlot=119, confirmedDepth=3",
          output: "depth=1 -> pending",
          note: "Not yet applied.",
        },
        {
          cmd: "headSlot=120, eventSlot=115, confirmedDepth=3",
          output: "depth=5 -> applied",
          note: "Candidate for provisional state.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "indexpipe-v2-pipeline-explorer",
  slug: "indexpipe-v2-pipeline-explorer",
  title: "Explorer: ingest to dedupe to confirm to apply",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: ingest to dedupe to confirm to apply

A pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. For indexing reliability, the core stages are ingest, dedupe, confirmation gating, and apply. Each stage must expose deterministic inputs and outputs.

Ingest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates and out-of-order delivery are expected. The explorer should show raw count and normalized schema count so users can verify parser coverage.

Dedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts and list dropped duplicates. This transparency helps debug webhook retries and backfill overlap behavior.

Confirmation stage partitions deduped events into pending, applied, and finalized sets based on depth policy. The explorer should make head slot and policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.

Apply stage computes account balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances and event key lists. Sorted output is crucial for snapshot equality testing.

Integrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, and stable event references. The explorer should display PASS/FAIL and issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.

For backfills, explorer scenarios should include missing-slot windows and idempotency keys. This demonstrates how replay-safe job planning interacts with the same dedupe and apply rules. A reliable backfill system does not bypass core pipeline logic.

Deterministic report generation closes the loop. Export markdown for human review and JSON for machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.

A well-designed explorer becomes a teaching tool and an operational tool. During incidents, teams can replay problematic event sets and compare outputs across policy versions. During onboarding, new engineers learn stage responsibilities quickly without production access.

Operational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities and document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions and event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, and preserves confidence that ingest, dedupe, confirmation gating, and apply stages still produce reproducible results under stress.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Show per-stage counts and transformations.
- Make confirmation policy parameters explicit.
- Render sorted deterministic snapshots.
- Gate exports on integrity checks.
- Keep report payloads stable for regression tests.
`,
  blocks: [
    {
      type: "explorer",
      id: "indexpipe-v2-l3-explorer",
      title: "Pipeline Stage Snapshots",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Deduped event set",
            address: "pipe11111111111111111111111111111111111111",
            lamports: 2,
            owner: "IndexerPipeline11111111111111111111111111111",
            executable: false,
            dataLen: 128,
          },
          {
            label: "Finalized snapshot",
            address: "pipe22222222222222222222222222222222222222",
            lamports: 4,
            owner: "IndexerPipeline11111111111111111111111111111",
            executable: false,
            dataLen: 196,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "indexpipe-v2-dedupe-events",
  slug: "indexpipe-v2-dedupe-events",
  title: "Challenge: implement dedupeEvents()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Implement stable event deduplication with deterministic composite keys.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "indexpipe-v2-apply-confirmations",
  slug: "indexpipe-v2-apply-confirmations",
  title: "Challenge: implement applyWithConfirmations()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Apply events deterministically with confirmation depth policy and pending/finalized sets.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "indexpipe-v2-backfill-idempotency",
  slug: "indexpipe-v2-backfill-idempotency",
  title: "Challenge: backfill and idempotency planning",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Create deterministic backfill planning output with replay-safe idempotency keys.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "indexpipe-v2-snapshot-integrity",
  slug: "indexpipe-v2-snapshot-integrity",
  title: "Challenge: snapshot integrity checks",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Implement deterministic snapshotIntegrityCheck() outputs for negative and structural failures.`,
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "indexpipe-v2-pipeline-report-checkpoint",
  slug: "indexpipe-v2-pipeline-report-checkpoint",
  title: "Checkpoint: pipeline report export",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `Generate a stable markdown report artifact for the Reorg-Safe Indexer checkpoint.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "indexpipe-v2-foundations",
  title: "Indexer Reliability Foundations",
  description:
    "Event identity modeling, confirmation semantics, and deterministic ingest-to-apply pipeline behavior.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "indexpipe-v2-project-journey",
  title: "Reorg-Safe Indexer Project Journey",
  description:
    "Build dedupe, confirmation-aware apply logic, integrity gates, and stable reporting artifacts for operational triage.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const indexingWebhooksPipelinesCourse: Course = {
  id: "course-indexing-webhooks-pipelines",
  slug: "indexing-webhooks-pipelines",
  title: "Indexers, Webhooks & Reorg-Safe Pipelines",
  description:
    "Build production-grade deterministic indexing pipelines for duplicate-safe ingestion, reorg handling, and integrity-first reporting.",
  difficulty: "advanced",
  duration: "9 hours",
  totalXP: 445,
  tags: ["indexing", "webhooks", "reorgs", "reliability"],
  imageUrl: "/images/courses/indexing-webhooks-pipelines.jpg",
  modules: [module1, module2],
};
