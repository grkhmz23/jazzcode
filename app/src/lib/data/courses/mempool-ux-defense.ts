import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/mempool-ux-defense/challenges/lesson-4-evaluate-risk";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/mempool-ux-defense/challenges/lesson-5-slippage-guard";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/mempool-ux-defense/challenges/lesson-6-price-impact-policy";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/mempool-ux-defense/challenges/lesson-7-safety-banner";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/mempool-ux-defense/challenges/lesson-8-protection-config-checkpoint";

const lesson1: Lesson = {
  id: "mempoolux-v2-quote-execution-gap",
  slug: "mempoolux-v2-quote-execution-gap",
  title: "What can go wrong between quote and execution",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# What can go wrong between quote and execution

A swap quote is a prediction, not a guarantee. Between quote generation and execution, liquidity changes, competing orders land, and network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach and enforce the gap between quote time and execution time. This course is defensive by design: no exploit strategies, only protective policy and communication.

The first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously and degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.

The second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate transactions fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds and recommend values based on route characteristics, not a single static default.

The third risk is price impact misunderstanding. Price impact measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to "fix" impact-heavy trades that should instead be resized or rerouted.

The fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency and timing drift. A risk engine should account for hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.

The fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, and critical. Grades should be accompanied by reasons, so warnings are explainable.

Protective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, and clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence and keep advanced controls available without forcing novices into risky settings.

Policy engines should produce deterministic artifacts for testability. Given identical input tuples, risk grade and warnings should remain identical. This enables stable unit tests and predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.

The goal is not zero failed swaps; the goal is informed, bounded risk with transparent behavior. Users accept tradeoffs when systems are honest and consistent.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Operator mindset

Protected swap UX is policy UX. Defaults, warnings, and block states should be deterministic, explainable, and versioned so teams can defend decisions during incidents.

## Checklist
- Track quote age and apply graded stale-quote policies.
- Separate price impact education from slippage controls.
- Incorporate route hops and liquidity into risk scoring.
- Emit deterministic risk reasons for UX copy.
- Block execution only when policy thresholds are clearly crossed.
`,
  blocks: [
    {
      type: "quiz",
      id: "mempoolux-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "mempoolux-v2-l1-q1",
          prompt: "What is the primary difference between slippage and price impact?",
          options: [
            "Slippage is user tolerance; impact is market footprint",
            "They are identical metrics",
            "Price impact only applies on CEXs",
          ],
          answerIndex: 0,
          explanation:
            "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "mempoolux-v2-slippage-guardrails",
  slug: "mempoolux-v2-slippage-guardrails",
  title: "Slippage controls and guardrails",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Slippage controls and guardrails

Slippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, and clear consequences when users attempt risky overrides. This lesson focuses on guardrail design that reduces avoidable losses while preserving user agency.

A strong policy starts with minimum and maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned with typical route behavior. For many flows this is moderate, then dynamically adjusted by quote freshness and impact context.

Guardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage and request refresh before signing. If quote age becomes severely stale, execution should be blocked with a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.

Impact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.

Override behavior must be deterministic. When a user-selected value exceeds policy max, clamp it and emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust and prevents support confusion.

Copy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, and what to do next. For example: "Quote is stale; refresh before signing to avoid outdated execution terms." This is better than "staleness threshold exceeded." Engineers can keep technical details in debug exports.

Guardrails should also integrate with route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high and slippage recommendation is near max, the UI should highlight additional caution and maybe suggest smaller size.

From an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, and blocked flag. This function can be unit tested across edge scenarios and reused in frontend and backend validation paths.

Finally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old and new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Define min, default, and max slippage as explicit policy values.
- Apply stale-quote logic before execution and adjust recommendations.
- Clamp unsafe overrides with clear warning messages.
- Surface blocked state only for clearly defined severe conditions.
- Keep policy deterministic and version-reviewable.
`,
  blocks: [
    {
      type: "terminal",
      id: "mempoolux-v2-l2-terminal",
      title: "Guardrail Decision Table",
      steps: [
        {
          cmd: "Quote age 13s, stale threshold 12s",
          output: "warning=refresh-before-signing, recommendedBps lowered",
          note: "Staleness triggers caution.",
        },
        {
          cmd: "Quote age 22s and impact very high",
          output: "blocked=true, warning=trade blocked by safety policy",
          note: "Severe risk path.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "mempoolux-v2-freshness-explorer",
  slug: "mempoolux-v2-freshness-explorer",
  title: "Explorer: quote freshness timer and decision table",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: quote freshness timer and decision table

A quote freshness explorer should make policy behavior obvious under time pressure. Users and engineers need to see when a quote transitions from safe to warning to blocked. This lesson defines a decision table approach that pairs timer state with slippage and impact context.

The timer should not be a decorative countdown. It is a state driver with explicit thresholds. For example, 0-10 seconds may be low concern, 10-20 seconds warning, and above 20 seconds blocked for certain route classes. Thresholds can vary by asset class and liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.

Decision tables combine timer bands with additional signals: projected impact, hop count, and liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.

An effective explorer view presents both grade and recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.

Engineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact and low liquidity; or stale quote with low impact and high liquidity. These fixtures prevent simplistic heuristics from dominating policy and help teams calibrate thresholds intentionally.

The explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage and stale quotes increase adverse execution risk, and that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive and practical.

For reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade for a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.

Output formatting should remain stable. Use canonical JSON order for exported config, and stable markdown for support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.

Finally, link explorer states to UI banners. If grade is critical, banner severity should be error with explicit action. If grade is medium, warning banner with optional guidance may suffice. This mapping is implemented in later challenges.


This material should be operationalized with deterministic fixtures and explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, and severe stress. For each scenario, compare policy outputs before and after changes, and require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned with runtime behavior, and makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, and they keep fixture ownership explicit so updates remain intentional and auditable.

## Checklist
- Treat freshness timer as policy input, not visual decoration.
- Combine timer state with impact, hops, and liquidity signals.
- Emit grade plus actionable recommendation.
- Test conflicting-signal fixtures for policy balance.
- Keep exported artifacts deterministic and stable.
`,
  blocks: [
    {
      type: "explorer",
      id: "mempoolux-v2-l3-explorer",
      title: "Freshness Snapshot Samples",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Fresh quote, strong liquidity",
            address: "risk11111111111111111111111111111111111111",
            lamports: 10,
            owner: "SwapPolicy111111111111111111111111111111111",
            executable: false,
            dataLen: 72,
          },
          {
            label: "Stale quote, weak liquidity",
            address: "risk22222222222222222222222222222222222222",
            lamports: 90,
            owner: "SwapPolicy111111111111111111111111111111111",
            executable: false,
            dataLen: 96,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "mempoolux-v2-evaluate-swap-risk",
  slug: "mempoolux-v2-evaluate-swap-risk",
  title: "Challenge: implement evaluateSwapRisk()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Implement deterministic swap risk grading from quote, slippage, impact, hops, and liquidity inputs.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "mempoolux-v2-slippage-guard",
  slug: "mempoolux-v2-slippage-guard",
  title: "Challenge: implement slippageGuard()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: `Build bounded slippage recommendations with warnings and hard-block states.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "mempoolux-v2-impact-vs-slippage",
  slug: "mempoolux-v2-impact-vs-slippage",
  title: "Challenge: model price impact vs slippage",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Encode a deterministic interpretation of impact-to-tolerance ratio for user education.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "mempoolux-v2-swap-safety-banner",
  slug: "mempoolux-v2-swap-safety-banner",
  title: "Challenge: build swapSafetyBanner()",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: `Map deterministic risk grades to defensive banner copy and severity.`,
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "mempoolux-v2-protection-config-export",
  slug: "mempoolux-v2-protection-config-export",
  title: "Checkpoint: swap protection config export",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: `Export a stable deterministic policy config artifact for the Protected Swap UI checkpoint.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "mempoolux-v2-foundations",
  title: "Mempool Reality and UX Defense",
  description:
    "Quote-to-execution risk modeling, slippage guardrails, and defensive user education for safer swap decisions.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "mempoolux-v2-project-journey",
  title: "Protected Swap UI Project Journey",
  description:
    "Implement deterministic policy engines, safety messaging, and stable protection-config artifacts for release governance.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const mempoolUxDefenseCourse: Course = {
  id: "course-mempool-ux-defense",
  slug: "mempool-ux-defense",
  title: "Mempool Reality & Anti-Sandwich UX",
  description:
    "Defensive swap UX engineering with deterministic risk grading, bounded slippage policies, and incident-ready safety communication.",
  difficulty: "advanced",
  duration: "9 hours",
  totalXP: 445,
  tags: ["mempool", "ux", "slippage", "risk-policy"],
  imageUrl: "/images/courses/mempool-ux-defense.jpg",
  modules: [module1, module2],
};
