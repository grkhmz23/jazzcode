import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rust-async-indexer-pipeline/challenges/lesson-4-pipeline-run";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rust-async-indexer-pipeline/challenges/lesson-5-retry-policy";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rust-async-indexer-pipeline/challenges/lesson-6-idempotency-dedupe";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rust-async-indexer-pipeline/challenges/lesson-7-snapshot-reducer";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rust-async-indexer-pipeline/challenges/lesson-8-pipeline-report-checkpoint";

const appendix = `
Async reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers and threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler with deterministic tick advancement provides a clean environment for validating bounded concurrency, retry sequencing, and backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, and completion order is reproducible.

Backpressure design should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably and metrics should expose this. Deterministic tests can assert queue length, total ticks, and completion order for stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.

Reorg-safe indexing pipelines require idempotency and stable reducers. Duplicate deliveries should collapse by key, and snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy and incident triage slows down. Stable JSON and markdown reports prevent that by keeping artifacts comparable between runs and between code versions.

Operational teams should maintain scenario catalogs for burst traffic, retry storms, and partial-stage failures. Each scenario should specify expected queue depth, retry schedule, and final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios and learn system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.

Another important discipline is stage-level observability contracts. Each stage should emit deterministic counters for accepted work, deferred work, retries, and dropped events. Without these counters, backpressure incidents become anecdotal and tuning decisions become reactive. With deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI with mocked scheduler runs, and regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, and explicit failure budgets. For educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.

Teams should capture one-page runbooks for each failure mode and link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, and communication templates for fast coordination.
`;

const lesson1: Lesson = {
  id: "raip-v2-async-fundamentals",
  slug: "raip-v2-async-fundamentals",
  title: "Async fundamentals: futures, tasks, channels",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Async fundamentals: futures, tasks, channels

Rust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, and channels coordinate data flow. For indexers, this architecture supports high throughput but requires careful control of concurrency and backpressure.

A common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure and queue growth. Defensive design uses bounded concurrency with explicit task budgets.

Channels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues and tick-based progression.

The key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging and regression testing become guesswork. Simulated executors solve this by removing wall-clock dependence.${appendix}`,
  blocks: [
    {
      type: "quiz",
      id: "raip-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "raip-v2-l1-q1",
          prompt: "Why prefer bounded concurrency for indexer tasks?",
          options: ["It prevents runaway memory and queue growth", "It guarantees zero failures", "It eliminates retries"],
          answerIndex: 0,
          explanation: "Bounded concurrency keeps load behavior controlled and observable.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "raip-v2-backpressure-concurrency",
  slug: "raip-v2-backpressure-concurrency",
  title: "Concurrency limits and backpressure",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Concurrency limits and backpressure

Backpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient design sets explicit concurrency caps and queue semantics that are easy to reason about.

Semaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this with a running list and remaining tick counters.

Retry behavior interacts with backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded and inspectable.

Design reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, and how is fairness maintained. Stable run reports provide concrete answers.${appendix}`,
  blocks: [
    {
      type: "terminal",
      id: "raip-v2-l2-terminal",
      title: "Backpressure Examples",
      steps: [
        {
          cmd: "concurrency=2, tasks=5",
          output: "queue grows to 3 before draining",
          note: "bounded and predictable",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "raip-v2-pipeline-graph-explorer",
  slug: "raip-v2-pipeline-graph-explorer",
  title: "Explorer: pipeline graph and concurrency",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: pipeline graph and concurrency

Pipeline graphs help teams communicate stage boundaries, concurrency budgets, and retry behaviors. A graph that shows ingest, dedupe, retry, and snapshot stages with explicit capacities is far more actionable than prose descriptions.

In deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, and transitions are logged in timeline snapshots. This makes race conditions and starvation visible.

A good explorer shows total ticks, completion order, and per-tick running/completed sets. These artifacts become checkpoints for regression tests.

Pair graph exploration with idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers and sorted outputs make this easy to verify.

The final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures and compare expected versus actual behavior quickly.${appendix}`,
  blocks: [
    {
      type: "explorer",
      id: "raip-v2-l3-explorer",
      title: "Pipeline Graph Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Run baseline",
            address: "pipea111111111111111111111111111111111111",
            lamports: 6,
            owner: "AsyncPipe111111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
          {
            label: "Run with retries",
            address: "pipea222222222222222222222222222222222222",
            lamports: 8,
            owner: "AsyncPipe111111111111111111111111111111111",
            executable: false,
            dataLen: 112,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "raip-v2-pipeline-run",
  slug: "raip-v2-pipeline-run",
  title: "Challenge: implement Pipeline::run()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Simulate bounded-concurrency execution with deterministic task ordering.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "raip-v2-retry-policy",
  slug: "raip-v2-retry-policy",
  title: "Challenge: implement RetryPolicy schedule",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Generate deterministic retry delay schedules for linear and exponential policies.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "raip-v2-idempotency-dedupe",
  slug: "raip-v2-idempotency-dedupe",
  title: "Challenge: idempotency key dedupe",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Deduplicate replay events by deterministic idempotency keys.",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "raip-v2-snapshot-reducer",
  slug: "raip-v2-snapshot-reducer",
  title: "Challenge: implement SnapshotReducer",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Build deterministic snapshot state from simulated event streams.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "raip-v2-pipeline-report-checkpoint",
  slug: "raip-v2-pipeline-report-checkpoint",
  title: "Checkpoint: pipeline run report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: "Export deterministic run report artifacts for the async pipeline simulation.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "raip-v2-foundations",
  title: "Async Pipeline Foundations",
  description: "Async/concurrency fundamentals for deterministic indexer design.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "raip-v2-project-journey",
  title: "Reorg-safe Async Pipeline Project Journey",
  description: "Implement deterministic scheduling, retries, reducers, and report exports.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rustAsyncIndexerPipelineCourse: Course = {
  id: "course-rust-async-indexer-pipeline",
  slug: "rust-async-indexer-pipeline",
  title: "Concurrency & Async for Indexers (Rust)",
  description: "Rust-first async pipeline simulation with bounded concurrency and reorg-safe reducers.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 445,
  tags: ["rust", "async", "indexer", "pipeline"],
  imageUrl: "/images/courses/rust-async-indexer-pipeline.jpg",
  modules: [module1, module2],
};
