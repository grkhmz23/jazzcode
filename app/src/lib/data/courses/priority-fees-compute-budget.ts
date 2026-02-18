import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/priority-fees-compute-budget/challenges/lesson-4-compute-plan";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/priority-fees-compute-budget/challenges/lesson-5-priority-fee";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/priority-fees-compute-budget/challenges/lesson-6-confirmation-policy";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/priority-fees-compute-budget/challenges/lesson-7-fee-report-markdown";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/priority-fees-compute-budget/challenges/lesson-8-fee-optimizer-checkpoint";

const lesson1: Lesson = {
  id: "pfcb-v2-fee-market-reality",
  slug: "pfcb-v2-fee-market-reality",
  title: "Fee markets on Solana: what actually moves inclusion",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Fee markets on Solana: what actually moves inclusion

Priority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention for compute, validator scheduling pressure, local leader behavior, and the transaction's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic and then overpay during recovery. This lesson gives a practical, defensive framework for pricing inclusion without relying on superstition.

A transaction does not compete only on total lamports paid. It competes on requested compute unit price and resource footprint under slot-level pressure. If you request very high compute units and low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, wallets should treat compute limit and compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands with 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose and your price is high, you overpay.

Defensive engineering starts with synthetic sample sets and deterministic policy simulation. Even if your production system eventually consumes live telemetry, your course project and baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, and spike. A calm regime might show p50 and p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.

Another misunderstood point is confirmation UX. Users often interpret "submitted" as "done," but processed status is still vulnerable to rollback scenarios and reordering. For high-value flows, the UI should explain exactly why it waits for confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language with protocol reality by attaching explicit state labels and expected next actions.

A robust fee policy also defines failure classes. If a transaction misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion and degrade user trust. Good systems cap retries and emit deterministic diagnostics that make support and analytics useful.

You should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, and warnings. By keeping this deterministic and serializable, teams can diff policy versions and verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.

Finally, keep user education integrated into the product flow. A short explanation that "network congestion increased your priority fee to improve inclusion probability" reduces confusion and failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic and repeated mistakes.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Operator mindset

Fee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, and fallback actions explicitly so operators can respond quickly when regimes shift.

## Checklist
- Couple compute limit and compute price decisions in one policy output.
- Use percentile targeting plus volatility guard for unstable markets.
- Treat confirmation states as distinct UX contracts.
- Cap retries and classify misses before adjusting fees.
- Emit deterministic policy reports for audits and regressions.
`,
  blocks: [
    {
      type: "quiz",
      id: "pfcb-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "pfcb-v2-l1-q1",
          prompt: "Why should compute unit limit and price be planned together?",
          options: [
            "Because inclusion depends on both requested resources and bid intensity",
            "Because compute unit limit is ignored by validators",
            "Because priority fee is fixed per transaction",
          ],
          answerIndex: 0,
          explanation:
            "A large CU request with weak price can lose inclusion, while aggressive price on oversized CU can overpay.",
        },
        {
          id: "pfcb-v2-l1-q2",
          prompt: "What does a wide p90 vs p50 spread usually indicate?",
          options: [
            "A volatile fee regime where a guard premium may be needed",
            "A bug in transaction serialization",
            "Guaranteed finalized confirmation",
          ],
          answerIndex: 0,
          explanation: "Spread growth signals unstable contention and lower reliability for naive median pricing.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "pfcb-v2-compute-budget-failure-modes",
  slug: "pfcb-v2-compute-budget-failure-modes",
  title: "Compute budget basics and common failure modes",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Compute budget basics and common failure modes

Most transaction failures blamed on "network issues" are actually planning errors in compute budget and payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, and explain the result before signing. This lesson focuses on failure modes that recur in production wallets and DeFi frontends.

The first class is explicit compute exhaustion. When instruction paths consume more than the transaction limit, execution aborts and users still pay base fees for work already attempted. Teams frequently set one global limit for all routes, which is convenient but unreliable. Route complexity differs by pool topology, account cache warmth, and account creation branches. Planning must operate on per-flow estimates, not app-wide constants.

The second class is excessive compute requests paired with aggressive bid pricing. This can cause overpayment and user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower and upper bounds, applies a margin to synthetic or simulated expected compute, and clamps to protocol max. If a requested override is present, the system should still clamp and document why. Deterministic reasoning strings are useful because support and QA can inspect exactly why a plan was chosen.

The third class is transaction size pressure. Large account metas and instruction data increase serialization footprint, and large payloads often correlate with higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when transaction size exceeds a threshold and recommend route simplification or decomposition. In this course, we keep it deterministic: no RPC checks, only input-driven policy outputs.

A related failure class is memory pressure in workloads that deserialize heavy account sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit and stable. Ambiguous heuristics create policy churn that is hard to test.

Good confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. For low-value actions, processed plus pending indicator can be acceptable. For high-risk value transfer, confirmed or finalized should gate "success" copy. Engineers should encode this as policy output rather than ad hoc component logic.

A mature planner also returns warnings. Examples include "override clamped to max," "size indicates high serialization risk," or "sample set too small for confident bid." Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.

In deterministic environments, each policy branch should be testable with small synthetic fixtures. You want stable outputs for JSON snapshots, markdown reports, and support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Compute plans should be bounded, deterministic, and explainable.
- Planner should expose warning signals, not only numeric outputs.
- Confirmation messaging should reflect actual settlement guarantees.
- Inputs must be validated; invalid estimates should fail fast.
- Unit tests should cover clamp logic and edge thresholds.
`,
  blocks: [
    {
      type: "terminal",
      id: "pfcb-v2-l2-terminal",
      title: "Compute Planner Cases",
      steps: [
        {
          cmd: "Case A: CU [30000, 20000], size=700",
          output: "units=80000, heapBytes=0, reason=standard footprint",
          note: "Floor protects small estimates.",
        },
        {
          cmd: "Case B: CU [260000, 250000], size=1200",
          output: "units=561000, heapBytes=262144, reason=large footprint",
          note: "Large payload triggers heap recommendation.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "pfcb-v2-planner-explorer",
  slug: "pfcb-v2-planner-explorer",
  title: "Explorer: compute budget planner inputs to plan",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: compute budget planner inputs to plan

Explorers are useful only when they expose policy tradeoffs clearly. For a fee and compute planner, that means visualizing how input estimates, percentile targets, and confirmation requirements produce a deterministic recommendation. This lesson frames an explorer as a decision table that can be replayed by engineers, support staff, and users.

Start with the three input groups: workload profile, fee samples, and UX confirmation target. Workload profile includes synthetic instruction CU estimates and payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness for the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, and warnings.

The key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious and traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: "guard applied." This approach teaches policy causality and prevents magical thinking about fees.

Explorer design should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth and spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults and frustrated users. A cautious user may still choose medium urgency if confidence is low and warnings are high.

A defensive explorer includes side-by-side outputs for JSON and markdown summary. JSON provides machine-readable deterministic artifacts for snapshots and regression tests. Markdown provides human-readable communication for support and incident reviews. Both should derive from the same payload to avoid divergence.

In production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs and inspect whether the policy selected reasonable values. If not, policy changes can be proposed with test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.

From an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of "it felt wrong," teams can point to exact sample sets, percentile choice, spread guard status, and final plan fields. This clarity is a force multiplier for reliability work.

The last design principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust and encourage users to interpret outputs correctly.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Show clear mapping from each input control to each output field.
- Expose volatility guard activation as an explicit state.
- Keep confidence and urgency as separate concepts.
- Produce identical output for repeated identical inputs.
- Export JSON and markdown from the same canonical payload.
`,
  blocks: [
    {
      type: "explorer",
      id: "pfcb-v2-l3-explorer",
      title: "Planner Snapshot Samples",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Scenario calm-market",
            address: "plan11111111111111111111111111111111111111",
            lamports: 1800,
            owner: "ComputeBudget111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
          {
            label: "Scenario volatile-market",
            address: "plan22222222222222222222222222222222222222",
            lamports: 5500,
            owner: "ComputeBudget111111111111111111111111111111",
            executable: false,
            dataLen: 128,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "pfcb-v2-plan-compute-budget",
  slug: "pfcb-v2-plan-compute-budget",
  title: "Challenge: implement planComputeBudget()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "pfcb-v2-estimate-priority-fee",
  slug: "pfcb-v2-estimate-priority-fee",
  title: "Challenge: implement estimatePriorityFee()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Implement policy-based priority fee estimation using synthetic sample arrays and deterministic warnings.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "pfcb-v2-confirmation-ux-policy",
  slug: "pfcb-v2-confirmation-ux-policy",
  title: "Challenge: confirmation level decision engine",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Encode confirmation UX policy for processed, confirmed, and finalized states using deterministic risk bands.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "pfcb-v2-fee-plan-summary-markdown",
  slug: "pfcb-v2-fee-plan-summary-markdown",
  title: "Challenge: build feePlanSummary markdown",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Build stable markdown output for a fee strategy summary that users and support teams can review quickly.`,
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "pfcb-v2-fee-optimizer-checkpoint",
  slug: "pfcb-v2-fee-optimizer-checkpoint",
  title: "Checkpoint: Fee Optimizer report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `Produce a deterministic checkpoint report JSON for the Fee Optimizer final project artifact.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "pfcb-v2-foundations",
  title: "Fee and Compute Foundations",
  description:
    "Inclusion mechanics, compute/fee coupling, and explorer-driven policy design with deterministic reliability framing.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "pfcb-v2-project-journey",
  title: "Fee Optimizer Project Journey",
  description:
    "Implement deterministic planners, confirmation policy engines, and stable fee strategy artifacts for release review.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const priorityFeesComputeBudgetCourse: Course = {
  id: "course-priority-fees-compute-budget",
  slug: "priority-fees-compute-budget",
  title: "Priority Fees & Compute Budget",
  description:
    "Defensive Solana fee engineering with deterministic compute planning, adaptive priority policy, and confirmation-aware UX reliability contracts.",
  difficulty: "advanced",
  duration: "9 hours",
  totalXP: 445,
  tags: ["solana", "fees", "compute-budget", "reliability"],
  imageUrl: "/images/courses/priority-fees-compute-budget.jpg",
  modules: [module1, module2],
};
