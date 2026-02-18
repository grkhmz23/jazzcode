import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-on-solana/challenges/lesson-4-quote-cpmm";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-on-solana/challenges/lesson-5-router-best";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/defi-on-solana/challenges/lesson-6-safety-minout";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-on-solana/challenges/lesson-8-checkpoint";

const lesson1: Lesson = {
  id: "defi-v2-amm-basics-fees-slippage-impact",
  slug: "defi-v2-amm-basics-fees-slippage-impact",
  title: "AMM basics on Solana: pools, fees, slippage, and price impact",
  type: "content",
  xpReward: 35,
  duration: "50 min",
  content: `# AMM basics on Solana: pools, fees, slippage, and price impact

When users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves and route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly and consistently that model is represented.

In a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, and the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve and experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.

On Solana, swaps also occur across varied pool designs and fee tiers. Some pools are deep and low fee; others are shallow but still attractive for small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, and route hop count. A route with slightly higher fee can still produce higher net output if reserves are materially deeper.

Slippage and price impact are often conflated in UI copy, but they answer different questions. Price impact asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly and compute minOut deterministically from outAmount and slippage bps.

Deterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values and route ranking. Those tiny differences create major operational pain in tests, incident response, and support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting for users should happen only at presentation boundaries.

Even in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast with typed errors, not fallback behavior. These checks mirror production expectations and train the same engineering discipline needed for real integrations.

A robust frontend mental model is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit and typed, the same planner can power UI previews, tests, and diagnostics with minimal drift.

## Quick numeric intuition

If two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.

## What you should internalize from this lesson

- Execution quality is output-at-size, not headline spot price.
- Slippage tolerance is a user protection bound, not a market forecast.
- Deterministic integer math is a product feature, not only a technical preference.

### Pitfalls

1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.
2. Treating slippage tolerance as if it were the same metric as price impact.
3. Using floating point in route ranking or minOut logic.

### Production Checklist

1. Keep amount math in integer-safe paths.
2. Surface outAmount, fee impact, and minOut separately.
3. Enforce invariant checks for each hop simulation.
4. Keep route ranking deterministic with explicit tie-breakers.
5. Log enough context to reproduce route decisions.
`,
  blocks: [
    {
      type: "quiz",
      id: "defi-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "defi-v2-l1-q1",
          prompt: "Which metric should drive route selection at execution size?",
          options: [
            "Deterministic outAmount from full route simulation",
            "Displayed ticker price only",
            "Lowest hop count only",
          ],
          answerIndex: 0,
          explanation: "Route quality is output-at-size, not headline spot labels.",
        },
        {
          id: "defi-v2-l1-q2",
          prompt: "What does slippage tolerance directly determine?",
          options: [
            "The minOut acceptance bound",
            "Pool fee tier",
            "Route enumeration depth",
          ],
          answerIndex: 0,
          explanation: "minOut is computed from quote outAmount and slippage bps.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "defi-v2-quote-anatomy-and-risk",
  slug: "defi-v2-quote-anatomy-and-risk",
  title: "Quote anatomy: in/out, fees, minOut, and worst-case execution",
  type: "content",
  xpReward: 35,
  duration: "50 min",
  content: `# Quote anatomy: in/out, fees, minOut, and worst-case execution

A production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, and what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes and execution deviations look arbitrary.

The first mandatory fields are inAmount and outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings for exact comparisons and invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.

Second, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. For route explainability and debugging, users and engineers need pool-level fee contributions. This is particularly important for two-hop routes where one leg may be cheap and the other expensive.

Third, minOut must be explicit, reproducible, and tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional for serious UX. It is the user’s principal safety guard against stale quotes and rapid market movement between quote and submission.

Fourth, quote freshness and worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid for a moment, not forever. In production, stale quote handling and forced re-quote boundaries prevent accidental execution with outdated assumptions.

A useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, and minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails and cleaner state transitions.

For this course, lesson logic remains offline and deterministic, but the same design prepares teams for real Jupiter integrations later. By the time network adapters are introduced, your model and tests already guarantee stable route math and explainability.

Quote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, and minOut from the exact planning state. Without that, teams rely on post-hoc guesses.

### Pitfalls

1. Displaying outAmount without minOut and route-level fees.
2. Mutating selected quote objects in place instead of creating snapshots.
3. Computing fee percentages from rounded UI values instead of raw amounts.

### Production Checklist

1. Keep quote payloads immutable and versioned.
2. Store per-hop fee contributions and total fee amount.
3. Compute and show minOut from explicit slippage bps.
4. Preserve raw amounts and decimals separately.
5. Expose route freshness metadata in UI state.
`,
  blocks: [
    {
      type: "explorer",
      id: "defi-v2-l2-explorer",
      title: "Quote Account Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Pool SOL/USDC Vault A",
            address: "PoolVaultSol1111111111111111111111111111111111",
            lamports: 1000000000,
            owner: "AMMProgram1111111111111111111111111111111111",
            executable: false,
            dataLen: 256,
          },
          {
            label: "Pool SOL/USDC Vault B",
            address: "PoolVaultUsdc11111111111111111111111111111111",
            lamports: 230000000,
            owner: "AMMProgram1111111111111111111111111111111111",
            executable: false,
            dataLen: 256,
          },
        ],
      },
    },
    {
      type: "quiz",
      id: "defi-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "defi-v2-l2-q1",
          prompt: "What is the deterministic minOut formula?",
          options: [
            "floor(outAmount * (10000 - slippageBps) / 10000)",
            "outAmount + slippageBps",
            "floor(outAmount / slippageBps)",
          ],
          answerIndex: 0,
          explanation: "minOut is a bounded percentage reduction from outAmount.",
        },
        {
          id: "defi-v2-l2-q2",
          prompt: "Why keep per-hop fee breakdowns?",
          options: [
            "For explainability and debugging route-level cost",
            "Only for CSS rendering",
            "To replace route IDs",
          ],
          answerIndex: 0,
          explanation: "Per-hop fee attribution makes route behavior auditable.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "defi-v2-routing-fragmentation-two-hop",
  slug: "defi-v2-routing-fragmentation-two-hop",
  title: "Routing: why two-hop can beat one-hop",
  type: "content",
  xpReward: 35,
  duration: "50 min",
  content: `# Routing: why two-hop can beat one-hop

Users often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC and USDC -> JUP pools together can produce better net output despite two fees and two curve traversals. A production router should evaluate both one-hop and two-hop candidates and rank them deterministically.

The engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted with the same input amount, same deterministic arithmetic, and same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.

Two-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit and stable.

Liquidity fragmentation introduces another subtle point: intermediate mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware and not reused blindly across different trade amounts.

For offline course logic, we model pools as a static universe and simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, and validate safety constraints at each hop.

Routing quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, and path change. Silent route switching feels suspicious even when mathematically correct.

In larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This course intentionally limits scope to one-hop and two-hop deterministic candidates so core reasoning remains clear and testable.

From an implementation perspective, route objects should be treated as typed artifacts with stable IDs and explicit hop metadata. That discipline reduces accidental coupling between UI state and planner internals. When engineers can serialize a route candidate, replay it with the same input, and get the same result, incident response becomes straightforward.

### Pitfalls

1. Assuming direct pairs always outperform multi-hop routes.
2. Reusing quotes computed for one trade size at another size.
3. Non-deterministic tie-breaking that causes route flicker.

### Production Checklist

1. Enumerate one-hop and two-hop routes systematically.
2. Quote every candidate with the same deterministic math path.
3. Keep tie-break policy explicit and stable.
4. Simulate virtual reserves without mutating source fixtures.
5. Surface route-change reasons in UI.
`,
  blocks: [
    {
      type: "quiz",
      id: "defi-v2-l3-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "defi-v2-l3-q1",
          prompt: "What is the primary ranking objective in this course router?",
          options: [
            "Maximize outAmount",
            "Minimize hop count always",
            "Choose first enumerated route",
          ],
          answerIndex: 0,
          explanation: "outAmount is primary; hops and route ID are tie-breakers.",
        },
        {
          id: "defi-v2-l3-q2",
          prompt: "Why simulate virtual reserves per candidate route?",
          options: [
            "To keep route quotes deterministic and independent",
            "To avoid computing fees",
            "To bypass slippage bounds",
          ],
          answerIndex: 0,
          explanation: "Virtual simulation avoids shared-state contamination.",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "defi-v2-quote-cpmm",
  slug: "defi-v2-quote-cpmm",
  title: "Implement token/pool model + constant-product quote calc",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Implement token/pool model + constant-product quote calc

Implement deterministic CPMM quoting:
- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)
- fee = floor(inAmount * feeBps / 10000)
- impactBps from spot vs effective execution price
- return outAmount, feeAmount, inAfterFee, impactBps
`,
  language: "typescript",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "defi-v2-router-best",
  slug: "defi-v2-router-best",
  title: "Implement route enumeration and best-route selection",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Implement route enumeration and best-route selection

Implement deterministic route planner:
- enumerate one-hop and two-hop candidates
- quote each candidate at exact input size
- select best route using stable tie-breakers
`,
  language: "typescript",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "defi-v2-safety-minout",
  slug: "defi-v2-safety-minout",
  title: "Implement slippage/minOut, fee breakdown, and safety invariants",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Implement slippage/minOut, fee breakdown, and safety invariants

Implement deterministic safety layer:
- apply slippage to compute minOut
- simulate route with virtual reserve updates
- return structured errors for invalid pools/routes
- enforce non-negative reserve and bounded output invariants
`,
  language: "typescript",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Lesson = {
  id: "defi-v2-production-swap-ux",
  slug: "defi-v2-production-swap-ux",
  title: "Production swap UX: stale quotes, protection, and simulation",
  type: "content",
  xpReward: 35,
  duration: "50 min",
  content: `# Production swap UX: stale quotes, protection, and simulation

A deterministic route engine is necessary but not sufficient for production. Users experience DeFi through timing, messaging, and safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, and error communication are weak.

Stale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age and invalidate plans beyond a strict threshold. When invalidation happens, route and minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes and support burden.

User protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched account assumptions. Safety validation should run before any wallet prompt and should return explicit, typed errors. “Something went wrong” is not enough in swap flows.

Simulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, and whether re-quoting could help. Generic error banners create user churn.

Retry logic must be bounded and stateful. Blind retries with unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). For deterministic planner errors, force state change before retry.

Another production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, and invariant results for each attempt. These logs make incident triage and postmortems dramatically faster. Without structured traces, teams often blame “market conditions” for planner bugs.

Pagination and list updates also affect trust. Swap history UIs should preserve deterministic ordering and avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when transactions are correct.

Optional live integrations should be feature-flagged and isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable and protects core behavior from third-party schema changes.

Finally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason and a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.

### Pitfalls

1. Allowing stale quotes to remain actionable without forced re-quote.
2. Retrying deterministic planner errors without changing route or inputs.
3. Hiding failure reason details behind generic notifications.

### Production Checklist

1. Track quote freshness and invalidate aggressively.
2. Enforce pre-submit invariant validation.
3. Separate retryable network failures from deterministic planner failures.
4. Log route and safety metadata for every attempt.
5. Keep offline engine as canonical model for optional live adapters.
`,
  blocks: [
    {
      type: "quiz",
      id: "defi-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "defi-v2-l7-q1",
          prompt: "What should happen when quote freshness expires?",
          options: [
            "Re-quote and recompute route/minOut before submit",
            "Submit with stale plan",
            "Increase slippage automatically without notifying user",
          ],
          answerIndex: 0,
          explanation: "Freshness boundaries should trigger deterministic recomputation.",
        },
        {
          id: "defi-v2-l7-q2",
          prompt: "Which failures are not solved by blind retries?",
          options: [
            "Deterministic planner and invariant failures",
            "Transient network congestion",
            "Temporary RPC timeout",
          ],
          answerIndex: 0,
          explanation: "Planner errors require input/route changes, not repetition.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "defi-v2-checkpoint",
  slug: "defi-v2-checkpoint",
  title: "Produce stable SwapPlan + SwapSummary checkpoint",
  type: "challenge",
  xpReward: 60,
  duration: "45 min",
  content: `# Produce stable SwapPlan + SwapSummary checkpoint

Compose deterministic checkpoint artifacts:
- build swap plan from selected route quote
- include fixtureHash and modelVersion
- emit stable summary with path, minOut, fee totals, impact, and invariants
`,
  language: "typescript",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "defi-v2-module-swap-fundamentals",
  title: "Swap Fundamentals",
  description:
    "Understand CPMM math, quote anatomy, and deterministic routing tradeoffs with safety-first user protections.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "defi-v2-module-offline-jupiter-planner",
  title: "Jupiter-Style Swap Planner Project (Offline)",
  description:
    "Build deterministic quoting, route selection, and minOut safety checks, then package stable checkpoint artifacts for reproducible reviews.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const defiSolanaCourse: Course = {
  id: "course-defi-solana",
  slug: "defi-solana",
  title: "DeFi on Solana",
  description:
    "Advanced project-journey course for engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, and reproducible diagnostics.",
  difficulty: "advanced",
  duration: "12 hours",
  totalXP: 335,
  imageUrl: "/images/courses/defi-solana.jpg",
  tags: ["defi", "swap", "routing", "jupiter", "offline", "deterministic"],
  modules: [module1, module2],
};
