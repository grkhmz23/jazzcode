import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rpc-reliability-latency/challenges/lesson-4-rpc-policy";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rpc-reliability-latency/challenges/lesson-5-select-endpoint";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rpc-reliability-latency/challenges/lesson-6-cache-invalidation";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rpc-reliability-latency/challenges/lesson-7-metrics-reducer";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rpc-reliability-latency/challenges/lesson-8-rpc-health-checkpoint";

const lesson1: Lesson = {
  id: "rpc-v2-failure-landscape",
  slug: "rpc-v2-failure-landscape",
  title: "RPC failures in real life: timeouts, 429s, stale nodes",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# RPC failures in real life: timeouts, 429s, stale nodes

Reliable client infrastructure begins with realistic failure assumptions. RPC calls fail for many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, and occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.

Timeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable and retries trigger too late. Good policy defines request timeout by operation type and sets bounded retry schedules.

HTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas and burst controls. A resilient client observes 429 ratio per endpoint and adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.

Stale node lag is particularly dangerous for state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency and success rate.

Multi-provider strategy is the baseline for serious applications. Even when one provider is excellent, outages and regional issues happen. A client should maintain endpoint metadata, collect health samples, and choose endpoints by deterministic policy rather than random rotation.

Observability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, and histogram buckets. Without this telemetry, teams tune retry policies by anecdote. With telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.

Deterministic policy modeling is valuable before production integration. You can simulate endpoint samples and verify that selection behavior is stable and explainable. If the chosen endpoint changes unexpectedly for identical input samples, your scoring function needs refinement.

Caching adds complexity. Cache misses and stale reads are not just performance details; they affect correctness. Invalidation policy should react to account changes and node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy and metrics help navigate this tradeoff.

The core message is pragmatic: assume RPC instability, design for graceful degradation, and measure everything with deterministic reducers that can be unit tested.


Operational readiness also requires owning fixture updates as providers change rate-limit behavior and latency profiles. If fixture sets stay static, policy tuning optimizes for old incidents and misses new failure signatures. Keep a cadence for reviewing percentile distributions, endpoint score drift, and retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.

This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Treat timeouts, 429s, and stale lag as default conditions.
- Use multi-provider endpoint selection with health scoring.
- Include slot lag in endpoint quality calculations.
- Define retry schedules with bounded backoff.
- Instrument latency and success metrics continuously.
`,
  blocks: [
    {
      type: "quiz",
      id: "rpc-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "rpc-v2-l1-q1",
          prompt: "Why is slot lag important in endpoint scoring?",
          options: [
            "Fast responses can still be wrong if the node is stale",
            "Slot lag only affects validator rewards",
            "Slot lag is equivalent to timeout",
          ],
          answerIndex: 0,
          explanation: "Latency alone cannot guarantee freshness of chain state.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "rpc-v2-multi-endpoint-strategies",
  slug: "rpc-v2-multi-endpoint-strategies",
  title: "Multi-endpoint strategies: hedged requests and fallbacks",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Multi-endpoint strategies: hedged requests and fallbacks

Multi-endpoint design is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals and operation urgency. This lesson focuses on deterministic strategy patterns you can validate offline.

Fallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy and only used for high-value paths.

Endpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, and optional static weight for trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.

Rate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there and prefer alternatives. This avoids retry storms and helps maintain aggregate throughput.

Regional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.

Circuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded and avoid selecting it for a cooling period. Deterministic simulations can model this behavior without real network calls.

Observability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.

In many systems, endpoint policy and retry policy are separate modules. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts and delays, metrics reducer evaluates outcomes. This separation improves testability and change safety.

Finally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility and debugging. Deterministic order supports reliable incident analysis.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Score endpoints using multiple reliability signals.
- Use deterministic tie-breaking to avoid flapping.
- Apply rate-limit-aware traffic shifting.
- Keep fallback and retry policy responsibilities separate.
- Emit endpoint reasoning for operational debugging.
`,
  blocks: [
    {
      type: "terminal",
      id: "rpc-v2-l2-terminal",
      title: "Endpoint Selection Simulation",
      steps: [
        {
          cmd: "Endpoint A: success=0.96 p95=140ms lag=1",
          output: "score=92.60",
          note: "Healthy candidate.",
        },
        {
          cmd: "Endpoint B: success=0.90 p95=90ms lag=3 429=0.1",
          output: "score lower due to throttling and lag",
          note: "Fast but less reliable under pressure.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "rpc-v2-retry-explorer",
  slug: "rpc-v2-retry-explorer",
  title: "Explorer: retry/backoff simulator",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: retry/backoff simulator

Retry and backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency and provider pressure. This lesson builds a deterministic view of retry policy outputs and their tradeoffs.

A retry schedule has three core dimensions: number of attempts, per-attempt timeout, and delay before each retry. Exponential backoff grows delay rapidly and reduces pressure in prolonged incidents. Linear backoff grows slower and can be useful for short-lived blips. Both need max-delay caps to avoid runaway wait times.

The first attempt should always be represented in the schedule with zero delay. This improves traceability and ensures telemetry can map attempt index to behavior consistently. Many teams model only retries and lose visibility into full request lifecycle.

Policy inputs should be validated. Negative retries or non-positive timeouts are configuration errors and should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.

The simulator should also show expected user-facing latency envelope. For example, timeout 900ms with two retries and exponential delays of 100ms and 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.

Retry policy must integrate with endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps modules separate, it should explain this interaction.

Jitter is often used in distributed systems to prevent synchronization spikes. In this deterministic course we omit jitter from challenge outputs for snapshot stability, but teams should understand where jitter fits in production.

Metrics reducers provide feedback loop for tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram and quantile outputs make this tradeoff visible.

A final best practice is policy versioning. When retry settings change, compare outputs for fixture scenarios before deployment. This catches accidental behavior changes and enables confident rollbacks.

Operational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, and latency distributions change over time, and static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, and document threshold changes so retry and selection policies remain explainable and reproducible under current network conditions.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Represent full schedule including initial attempt.
- Validate retry configuration inputs strictly.
- Bound delays with max caps.
- Estimate user-facing worst-case latency from schedule.
- Review policy changes against deterministic fixtures.
`,
  blocks: [
    {
      type: "explorer",
      id: "rpc-v2-l3-explorer",
      title: "Retry Policy Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Exponential schedule",
            address: "rpc11111111111111111111111111111111111111",
            lamports: 3,
            owner: "RpcPolicy1111111111111111111111111111111111",
            executable: false,
            dataLen: 80,
          },
          {
            label: "Linear schedule",
            address: "rpc22222222222222222222222222222222222222",
            lamports: 4,
            owner: "RpcPolicy1111111111111111111111111111111111",
            executable: false,
            dataLen: 80,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "rpc-v2-rpc-policy",
  slug: "rpc-v2-rpc-policy",
  title: "Challenge: implement rpcPolicy()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Build deterministic timeout and retry schedule outputs from policy input.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "rpc-v2-select-endpoint",
  slug: "rpc-v2-select-endpoint",
  title: "Challenge: implement selectRpcEndpoint()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Choose the best endpoint deterministically from health samples and endpoint metadata.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "rpc-v2-cache-invalidation-policy",
  slug: "rpc-v2-cache-invalidation-policy",
  title: "Challenge: caching and invalidation policy",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Emit deterministic cache invalidation actions when account updates and lag signals arrive.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "rpc-v2-metrics-reducer",
  slug: "rpc-v2-metrics-reducer",
  title: "Challenge: metrics reducer and histogram buckets",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Reduce simulated RPC events into deterministic histogram and p50/p95 metrics.`,
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "rpc-v2-health-report-checkpoint",
  slug: "rpc-v2-health-report-checkpoint",
  title: "Checkpoint: RPC health report export",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `Export deterministic JSON and markdown health report artifacts for multi-provider reliability review.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "rpc-v2-foundations",
  title: "RPC Reliability Foundations",
  description: "Real-world RPC failures, endpoint strategy, and retry policy modeling.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "rpc-v2-project-journey",
  title: "RPC Multi-Provider Client Project Journey",
  description: "Build deterministic policy, selection, metrics, and health report exports.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rpcReliabilityLatencyCourse: Course = {
  id: "course-rpc-reliability-latency",
  slug: "rpc-reliability-latency",
  title: "RPC Reliability & Latency Engineering",
  description:
    "Engineer multi-provider Solana RPC clients with deterministic retry, routing, caching, and observability policies.",
  difficulty: "advanced",
  duration: "9 hours",
  totalXP: 445,
  tags: ["rpc", "latency", "reliability", "observability"],
  imageUrl: "/images/courses/rpc-reliability-latency.jpg",
  modules: [module1, module2],
};
