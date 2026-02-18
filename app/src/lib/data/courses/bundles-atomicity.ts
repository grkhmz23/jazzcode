import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/bundles-atomicity/challenges/lesson-4-build-flow";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/bundles-atomicity/challenges/lesson-5-validate-atomicity";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/bundles-atomicity/challenges/lesson-6-failure-handling";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/bundles-atomicity/challenges/lesson-7-bundle-composer";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/bundles-atomicity/challenges/lesson-8-flow-safety-checkpoint";

const lesson1: Lesson = {
  id: "bundles-v2-atomicity-model",
  slug: "bundles-v2-atomicity-model",
  title: "Atomicity concepts and why users assume all-or-nothing",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Atomicity concepts and why users assume all-or-nothing

Users rarely think in transaction graphs. They think in intents: "swap my token" or "close my position." When a workflow spans multiple transactions, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity and protocol-level execution can produce severe trust failures even when each transaction is technically valid. Defensive engineering starts by mapping user intent boundaries and showing where partial execution can occur.

In Solana systems, multi-step flows are common. You may need token approval-like setup, associated token account creation, route execution, and cleanup. Each step has independent confirmation behavior and can fail for different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid for unused accounts, or funds moved into intermediate holding accounts.

A rigorous model begins with explicit step typing. Every step should be tagged by function and risk: setup, value transfer, settlement, compensation, and cleanup. Then define dependencies between steps and mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration and wallet prompts must respect idempotency constraints.

Another key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk and your UI should block or require additional confirmation. Teams often postpone compensation design until incident response, but defensive course design should treat compensation as a first-class requirement.

Bundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering and invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, and fallback paths. It also enables stable unit tests that validate graph shape and risk reports.

From a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: "Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed." Hiding this reality may reduce initial friction but increases long-term mistrust.

Support and incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, and detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected and safely compensated, or did the flow violate defined invariants?

Ultimately, atomicity is a contract between engineering and user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, testing, and communication mandatory.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Operator mindset

Atomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees and residual risks must be explicit, testable, and observable in reports.

## Checklist
- Model flows by intent, not only by transaction count.
- Annotate each step with dependencies and idempotency.
- Require explicit compensation paths for value-transfer failures.
- Produce deterministic safety reports for each flow version.
- Teach users where all-or-nothing is guaranteed and where it is not.
`,
  blocks: [
    {
      type: "quiz",
      id: "bundles-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "bundles-v2-l1-q1",
          prompt: "Why do users still expect atomic behavior in multi-tx flows?",
          options: [
            "Because intent-level mental models are all-or-nothing",
            "Because protocols always guarantee it",
            "Because wallet adapters hide all failures",
          ],
          answerIndex: 0,
          explanation: "Users think in outcomes, not internal transaction decomposition.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "bundles-v2-flow-risk-points",
  slug: "bundles-v2-flow-risk-points",
  title: "Multi-transaction flows: approvals, ATA creation, swaps, refunds",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Multi-transaction flows: approvals, ATA creation, swaps, refunds

A reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, and after value transfer when cleanup or refund steps should run. This lesson maps common Solana flow stages and shows defensive controls that keep failure behavior predictable.

The first stage is prerequisite setup. Account initialization and ATA creation are often safe and idempotent if implemented correctly, but they still consume fees and may fail under congestion. If setup fails, users should see precise messaging and retry guidance. If setup succeeds and later steps fail, your state machine must remember setup completion to avoid duplicate account creation attempts.

The second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later instructions. Non-idempotent or overly broad permissions here amplify downstream risk. Flow validators should detect non-idempotent authorization steps and force explicit refund or revocation logic if subsequent steps fail.

The third stage is value transfer or swap execution. This is where market drift, stale quotes, and route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches and expected compensation behavior. This lets teams test policy without network noise.

The fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error and user-facing loss. Compensation steps must be discoverable, ordered, and testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.

The fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary accounts, or recording final status artifacts. Cleanup should be safe to retry and should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user accounts and backend state.

Defensive patterns include idempotency keys for orchestration, deterministic status transitions, and explicit issue codes for each risk category. For example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.

A flow graph explorer can teach these points effectively. By visualizing nodes and edges with risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.

During incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, and which invariants were violated. This reduces MTTR and avoids repeated misclassification.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Label setup, value, compensation, and cleanup steps explicitly.
- Treat non-idempotent setup as high-risk without compensating actions.
- Validate dependency graph integrity before execution planning.
- Encode deterministic issue codes and severity mapping.
- Keep simulator behavior offline and reproducible.
`,
  blocks: [
    {
      type: "terminal",
      id: "bundles-v2-l2-terminal",
      title: "Flow Graph Risk Walkthrough",
      steps: [
        {
          cmd: "Step set: approve -> swap",
          output: "Issue: missing-refund, non-idempotent risk",
          note: "No compensation path after swap failure.",
        },
        {
          cmd: "Step set: approve -> swap -> refund",
          output: "Issue count decreases; compensation path available",
          note: "Still verify idempotency on each step.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "bundles-v2-flow-explorer",
  slug: "bundles-v2-flow-explorer",
  title: "Explorer: flow graph steps and risk points",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: flow graph steps and risk points

Flow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step with dependency context, idempotency flag, and compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, and what protects users if a value step fails.

Start by treating each node as a contract. A node contract defines preconditions, side effects, and postconditions. Preconditions include required upstream steps and expected inputs. Side effects include account state changes or transfer intents. Postconditions include observable status updates and possible compensation requirements. When node contracts are explicit, validation rules become straightforward and deterministic.

Edges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge and validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives and brittle reports. Keep graph semantics strict and minimal.

Risk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, and cleanup-only. Report generation can then aggregate these tags into issue summaries and recommended mitigations.

A robust explorer also teaches "atomic in user model" versus "atomic on chain." You can annotate the whole flow with intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees and residual risk in plain language.

Deterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates transaction groupings and invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.

Engineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON and markdown outputs make review diffs reliable and reduce false positives in CI snapshots.

From a teaching standpoint, explorer sessions should include both safe and unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The course challenge sequence then asks learners to codify the same checks.

Finally, remember that atomicity work is reliability work. It is not a special security-only track. The same graph discipline helps product, backend, and support teams share one truth source for multi-step behavior.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Represent node contracts and dependency edges explicitly.
- Annotate risk tags directly in graph data.
- Distinguish user-intent atomicity from protocol guarantees.
- Generate deterministic bundle and report artifacts.
- Include unsafe example graphs in test fixtures.
`,
  blocks: [
    {
      type: "explorer",
      id: "bundles-v2-l3-explorer",
      title: "Flow Risk Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Unsafe flow without refund",
            address: "flow11111111111111111111111111111111111111",
            lamports: 3,
            owner: "FlowValidator1111111111111111111111111111111",
            executable: false,
            dataLen: 84,
          },
          {
            label: "Safe flow with compensation",
            address: "flow22222222222222222222222222222222222222",
            lamports: 1,
            owner: "FlowValidator1111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "bundles-v2-build-atomic-flow",
  slug: "bundles-v2-build-atomic-flow",
  title: "Challenge: implement buildAtomicFlow()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Build a normalized deterministic flow graph from steps and dependencies.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "bundles-v2-validate-atomicity",
  slug: "bundles-v2-validate-atomicity",
  title: "Challenge: implement validateAtomicity()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Detect partial execution risk, missing refunds, and non-idempotent steps.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "bundles-v2-failure-handling-patterns",
  slug: "bundles-v2-failure-handling-patterns",
  title: "Challenge: failure handling with idempotency keys",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Encode deterministic failure handling metadata, including compensation state.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "bundles-v2-bundle-composer",
  slug: "bundles-v2-bundle-composer",
  title: "Challenge: deterministic bundle composer",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Compose a deterministic bundle structure for an atomic flow. No relay calls.`,
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "bundles-v2-flow-safety-report",
  slug: "bundles-v2-flow-safety-report",
  title: "Checkpoint: flow safety report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `Generate a stable markdown flow safety report checkpoint artifact.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "bundles-v2-atomicity-foundations",
  title: "Atomicity Foundations",
  description:
    "User-intent expectations, flow decomposition, and deterministic risk-graph modeling for multi-step reliability.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "bundles-v2-project-journey",
  title: "Atomic Swap Flow Simulator",
  description:
    "Build, validate, and report deterministic flow safety with compensation checks, idempotency handling, and bundle artifacts.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const bundlesAtomicityCourse: Course = {
  id: "course-bundles-atomicity",
  slug: "bundles-atomicity",
  title: "Bundles & Transaction Atomicity",
  description:
    "Design defensive multi-transaction Solana flows with deterministic atomicity validation, compensation modeling, and audit-ready safety reporting.",
  difficulty: "advanced",
  duration: "9 hours",
  totalXP: 445,
  tags: ["atomicity", "bundles", "defensive-design", "solana"],
  imageUrl: "/images/courses/bundles-atomicity.jpg",
  modules: [module1, module2],
};
