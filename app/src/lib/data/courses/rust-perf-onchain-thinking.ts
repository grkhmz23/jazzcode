import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rust-perf-onchain-thinking/challenges/lesson-4-cost-model-estimate";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rust-perf-onchain-thinking/challenges/lesson-5-optimize-function";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rust-perf-onchain-thinking/challenges/lesson-6-serialization-costs";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rust-perf-onchain-thinking/challenges/lesson-7-suggest-optimizations";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rust-perf-onchain-thinking/challenges/lesson-8-perf-report-checkpoint";

const appendix = `
Performance engineering for on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines and CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline for regression detection. The model does not replace real profiling; it complements it by making early design tradeoffs explicit and reviewable.

When you model costs, keep weights documented and intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient and track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports with before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.

Serialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers and client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined with suggestion outputs and checkpoint reports, these models become practical guardrails for engineering quality.

Mature teams combine these deterministic models with periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients and rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation and keeps recommendations aligned with actual system behavior. The key is to treat model updates as versioned changes with explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why performance guidance changed and how improvements were verified.

Teams should also define performance budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete and avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets and require explicit waivers when thresholds are exceeded. Keep waiver text deterministic and tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable performance culture where improvements are intentional, measurable, and easy to audit.
`;

const lesson1: Lesson = {
  id: "rpot-v2-perf-mental-model",
  slug: "rpot-v2-perf-mental-model",
  title: "Performance mental model: allocations, clones, hashing",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Performance mental model: allocations, clones, hashing

Rust performance work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, and redundant hashing in loops.

A useful mental model starts with cost buckets. Allocation cost includes heap growth, allocator metadata, and cache disruption. Clone cost depends on object size and ownership patterns. Hash cost depends on bytes hashed and hash invocation frequency. Loop cost depends on iteration count and per-iteration work. Map lookup cost depends on data structure choice and access pattern.

The point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations and another performs one allocation, the former should trigger scrutiny even before microbenchmarking.

On-chain thinking reinforces this: compute budgets are finite, and predictable resource usage matters. Even off-chain indexers and simulators benefit from the same discipline because latency tails and CPU burn impact reliability.

Deterministic models are ideal for CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly and reject regressions early.

## Operator mindset

Performance guidance should be versioned and budgeted. Without explicit budgets and stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.
${appendix}`,
  blocks: [
    {
      type: "quiz",
      id: "rpot-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "rpot-v2-l1-q1",
          prompt: "Why use deterministic cost models before microbenchmarks?",
          options: ["They provide stable regression signals in CI", "They replace all profiling", "They remove need for tests"],
          answerIndex: 0,
          explanation: "Deterministic models make relative regressions easy to catch early.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "rpot-v2-data-structure-tradeoffs",
  slug: "rpot-v2-data-structure-tradeoffs",
  title: "Data structures: Vec, HashMap, BTreeMap tradeoffs",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Data structures: Vec, HashMap, BTreeMap tradeoffs

Data structure choice is one of the highest leverage performance decisions in Rust systems. Vec offers compact contiguous storage and predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation and hashing overhead. BTreeMap provides ordered keys and stable traversal costs with different memory locality characteristics.

In on-chain-adjacent simulations and indexers, workloads vary. If you mostly append and iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required for report output or canonical snapshots, BTreeMap can simplify stable behavior.

The wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts and use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.

Another practical tradeoff is allocation strategy. Reusing buffers and reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.

Keep design reviews concrete: expected reads, writes, key cardinality, ordering requirements, and mutation frequency. Then choose structures intentionally and document rationale.${appendix}`,
  blocks: [
    {
      type: "terminal",
      id: "rpot-v2-l2-terminal",
      title: "Structure Comparison",
      steps: [
        { cmd: "Vec append + scan", output: "low allocation, high scan cost", note: "Good for sequential work" },
        { cmd: "HashMap lookups", output: "fast random access, hash overhead", note: "Good for key-based fetch" },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "rpot-v2-cost-sandbox",
  slug: "rpot-v2-cost-sandbox",
  title: "Explorer: cost model sandbox",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: cost model sandbox

A cost sandbox lets teams test optimization hypotheses without waiting for full benchmark infrastructure. Provide operation counts, compute weighted costs, and inspect which buckets dominate total pressure.

The sandbox should separate baseline and optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.

Suggestion generation should be threshold-based and deterministic. For example, if allocation cost exceeds a threshold, recommend pre-allocation and buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.

Stable report outputs are critical for engineering workflows. JSON payloads feed CI checks, markdown summaries support code review and team communication. Keep key ordering stable so string equality tests remain meaningful.

Sandboxes are not production profilers, but they are excellent decision support tools when kept deterministic and aligned with known workload patterns.${appendix}`,
  blocks: [
    {
      type: "explorer",
      id: "rpot-v2-l3-explorer",
      title: "Cost Sandbox Snapshots",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Before optimization",
            address: "perf1111111111111111111111111111111111111",
            lamports: 220,
            owner: "PerfModel111111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
          {
            label: "After optimization",
            address: "perf2222222222222222222222222222222222222",
            lamports: 150,
            owner: "PerfModel111111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "rpot-v2-cost-model-estimate",
  slug: "rpot-v2-cost-model-estimate",
  title: "Challenge: implement CostModel::estimate()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Estimate deterministic operation costs from fixed weighting rules.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "rpot-v2-optimize-function-metrics",
  slug: "rpot-v2-optimize-function-metrics",
  title: "Challenge: optimize function metrics",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Apply deterministic before/after metric reductions and diff outputs.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "rpot-v2-serialization-costs",
  slug: "rpot-v2-serialization-costs",
  title: "Challenge: model serialization overhead",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Compute deterministic serialization overhead and byte savings.",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "rpot-v2-suggest-optimizations",
  slug: "rpot-v2-suggest-optimizations",
  title: "Challenge: implement suggestOptimizations()",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Generate stable optimization suggestions from deterministic metrics.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "rpot-v2-perf-report-checkpoint",
  slug: "rpot-v2-perf-report-checkpoint",
  title: "Checkpoint: stable perf report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: "Export deterministic JSON and markdown profiler reports.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "rpot-v2-foundations",
  title: "Performance Foundations",
  description:
    "Rust performance mental models, data-structure tradeoffs, and deterministic cost reasoning for reliable optimization decisions.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "rpot-v2-project-journey",
  title: "Compute Budget Profiler (Sim)",
  description:
    "Build deterministic profilers, recommendation engines, and report outputs aligned to explicit performance budgets.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rustPerfOnchainThinkingCourse: Course = {
  id: "course-rust-perf-onchain-thinking",
  slug: "rust-perf-onchain-thinking",
  title: "Rust Performance for On-chain Thinking",
  description:
    "Simulate and optimize compute-cost behavior with deterministic Rust-first tooling and budget-driven performance governance.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 445,
  tags: ["rust", "performance", "compute", "solana"],
  imageUrl: "/images/courses/rust-perf-onchain-thinking.svg",
  modules: [module1, module2],
};
