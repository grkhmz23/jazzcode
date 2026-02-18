import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-4-swap-plan";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-5-swap-state-machine";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-8-swap-report";

const lesson1: Lesson = {
  id: "swap-v2-mental-model",
  slug: "swap-v2-mental-model",
  title: "Swap mental model: mints, ATAs, decimals, and routes",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Swap mental model: mints, ATAs, decimals, and routes

Token swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token accounts (ATAs), decimal precision, and route composition — is essential before writing any swap code.

Every SPL token on Solana is defined by a mint account. The mint specifies the token's total supply, decimals (0–9), and authority. When you swap "SOL for USDC," you are actually swapping wrapped SOL (mint \`So11111111111111111111111111111111111111112\`) for USDC (mint \`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.

Associated Token Accounts (ATAs) are deterministic addresses derived from a wallet and a mint using the Associated Token Account program. For every token a wallet holds, there must be an ATA. If the recipient does not have an ATA for the output mint, the swap transaction must include a \`createAssociatedTokenAccountIdempotent\` instruction — a common source of transaction failures when omitted.

Decimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying "22.5 USDC," the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early and keep all math in integer space until the final display step.

Routes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple "legs" — for example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.

Route optimization considers: pool liquidity depth, fee tiers, price impact per leg, and the total compute cost of including multiple legs in one transaction. More legs means more instructions, more accounts, and higher compute unit consumption — there is a practical limit to route complexity within Solana's transaction size and compute budget constraints.

## Checklist
- Identify input and output mints by their full base58 addresses
- Ensure ATAs exist for both input and output tokens before swapping
- Convert all amounts to raw integer form using the correct decimal places
- Understand that routes may have multiple legs through different AMM programs
- Consider compute budget implications of complex routes

## Red flags
- Mixing decimal scales between different mints
- Forgetting to create output ATA before the swap instruction
- Assuming all swaps are single-hop direct routes
- Ignoring fees charged by intermediate pools in multi-hop routes
`,
  blocks: [
    {
      type: "quiz",
      id: "swap-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "swap-v2-l1-q1",
          prompt: "Why must native SOL be wrapped before swapping?",
          options: [
            "SPL token programs only operate on token accounts, not native SOL",
            "Wrapping encrypts the SOL for privacy",
            "Native SOL cannot be transferred on Solana",
          ],
          answerIndex: 0,
          explanation: "AMM programs interact with SPL token accounts. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs.",
        },
        {
          id: "swap-v2-l1-q2",
          prompt: "What happens if the recipient has no ATA for the output token?",
          options: [
            "The swap transaction fails unless the ATA is created in the same transaction",
            "Solana automatically creates the ATA",
            "The tokens are sent to the system program",
          ],
          answerIndex: 0,
          explanation: "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the transaction handles this safely.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "swap-v2-slippage",
  slug: "swap-v2-slippage",
  title: "Slippage and price impact: protecting swap outcomes",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Slippage and price impact: protecting swap outcomes

Slippage is the difference between the expected output amount at quote time and the actual amount received at execution time. In volatile markets with active trading, pool reserves change between when you request a quote and when your transaction lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.

Price impact measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero price impact. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. Price impact is calculated at quote time and should be displayed to users before they confirm.

The slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.

Setting slippage too tight (e.g., 1 bps) causes frequent transaction failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range for most swaps is 30–100 bps, with higher values for volatile or low-liquidity pairs.

Sandwich attacks exploit predictable slippage tolerances. An attacker observes your pending transaction in the mempool, submits a transaction to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin and may cause them to skip your transaction entirely.

Dynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, and historical transaction success rates. Advanced aggregators compute recommended slippage per-route to balance execution reliability with protection. When building swap UIs, always show both the quoted output and the minimum guaranteed output so users understand their worst-case outcome.

## Checklist
- Calculate minOutAmount using integer arithmetic (BigInt)
- Display both expected and minimum output amounts to users
- Use 30–100 bps as default slippage for most pairs
- Show price impact percentage prominently for large swaps
- Consider dynamic slippage based on pool conditions

## Red flags
- Using floating-point math for slippage calculations
- Setting extremely loose slippage (>500 bps) without user warning
- Not displaying price impact for large swaps
- Ignoring sandwich attack vectors in slippage design
`,
  blocks: [
    {
      type: "quiz",
      id: "swap-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "swap-v2-l2-q1",
          prompt: "What is 50 basis points of slippage on a 1,000,000 output?",
          options: [
            "5,000 (minOut = 995,000)",
            "50,000 (minOut = 950,000)",
            "500 (minOut = 999,500)",
          ],
          answerIndex: 0,
          explanation: "50 bps = 0.5%. 1,000,000 × 50 / 10,000 = 5,000. So minOut = 995,000.",
        },
        {
          id: "swap-v2-l2-q2",
          prompt: "Why should minOutAmount use BigInt instead of floating point?",
          options: [
            "Floating point introduces rounding errors in token amounts",
            "BigInt is faster than floating point",
            "Solana only accepts BigInt in transactions",
          ],
          answerIndex: 0,
          explanation: "Token amounts are integers. Floating-point math can produce off-by-one errors that cause transaction failures or incorrect minimum amounts.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "swap-v2-route-explorer",
  slug: "swap-v2-route-explorer",
  title: "Route visualization: understanding swap legs and fees",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Route visualization: understanding swap legs and fees

Swap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, and where fees are deducted along the way.

A route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., "Whirlpool," "Raydium"), the input and output mints for that leg, the fee charged by the pool (denominated in the output token), and the percentage of the total input allocated to this leg.

Split routes divide the input amount across multiple paths. For example, 60% might go through Raydium SOL/USDC and 40% through Orca SOL/USDC. Splitting across pools reduces price impact because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.

Fee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route with lower per-leg fees might still be more expensive if it requires more hops.

When rendering route information, show: the overall path (input mint → [intermediate mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, price impact as a percentage, and the final output amounts (quoted and minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).

Effective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. For SOL → USDC, this gives the effective USD price of SOL for this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees and price impact. This "execution cost" metric is the most honest summary of swap quality.

Route caching and expiration matter for UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires and the route must be re-fetched. The UI should clearly indicate quote freshness and automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.

## Checklist
- Show each leg with AMM label, mints, fee, and split percentage
- Display total fees summed across all legs
- Calculate and display effective price (output/input)
- Indicate quote expiration time to users
- Color-code routes by complexity (hops count)

## Red flags
- Hiding fees from the user display
- Not showing price impact for large swaps
- Allowing execution of expired quotes
- Displaying only the best-case output without minimum
`,
  blocks: [
    {
      type: "terminal",
      id: "swap-v2-l3-route",
      title: "Route Example",
      steps: [
        {
          cmd: "Quote: 1 SOL → USDC",
          output: "Route: SOL →[Whirlpool 30bps]→ USDC | 100% | Fee: 6,750 lamports",
          note: "Single-hop direct route",
        },
        {
          cmd: "Quote: 50 SOL → USDC (split)",
          output: "Leg 1: SOL →[Raydium]→ USDC | 60% | Fee: 40,500\nLeg 2: SOL →[Orca]→ USDC | 40% | Fee: 27,000",
          note: "Split route reduces price impact",
        },
        {
          cmd: "Effective price",
          output: "22.50 USDC/SOL (market: 22.55) | Cost: 0.22%",
          note: "Total execution cost includes fees + impact",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "swap-v2-swap-plan",
  slug: "swap-v2-swap-plan",
  title: "Challenge: Build a normalized SwapPlan from a quote",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Build a normalized SwapPlan from a quote

Parse a raw aggregator quote response and produce a normalized SwapPlan:

- Extract input/output mints and amounts from the quote
- Calculate minOutAmount using BigInt slippage arithmetic
- Map each route leg to a normalized structure with AMM label, mints, fees, and percentage
- Handle zero slippage correctly (minOut equals outAmount)
- Ensure all amounts remain as string representations of integers

Your SwapPlan must be fully deterministic — same input always produces same output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "swap-v2-state-machine",
  slug: "swap-v2-state-machine",
  title: "Challenge: Implement swap UI state machine",
  type: "challenge",
  xpReward: 55,
  duration: "45 min",
  language: "typescript",
  content: `# Challenge: Implement swap UI state machine

Build a deterministic state machine for the swap UI flow:

- States: idle → quoting → ready → sending → confirming → success | error
- Process a sequence of events and track all state transitions
- Invalid transitions should move to the error state with a descriptive message
- The error state supports RESET (back to idle) and RETRY (back to quoting)
- Track transition history as an array of {from, event, to} objects

The state machine must be fully deterministic — same event sequence always produces same result.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "swap-v2-tx-anatomy",
  slug: "swap-v2-tx-anatomy",
  title: "Swap transaction anatomy: instructions, accounts, and compute",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Swap transaction anatomy: instructions, accounts, and compute

A swap transaction on Solana is a carefully ordered sequence of instructions that together achieve an atomic token exchange. Understanding each instruction's role, the account list requirements, and compute budget considerations is essential for building reliable swap flows.

The typical swap transaction contains these instructions in order: (1) Compute Budget: SetComputeUnitLimit and SetComputeUnitPrice to ensure the transaction has enough compute and appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent for the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL account and sync its balance. (4) Swap instruction(s): the actual AMM program calls that execute the swap, referencing all required pool accounts. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL account and recover SOL.

Account requirements scale with route complexity. A single-hop swap through Whirlpool requires approximately 12–15 accounts (user wallet, token accounts, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ accounts, pushing against the transaction size limit. Address Lookup Tables (ALTs) mitigate this by compressing account references from 32 bytes to 1 byte each, but require a separate setup transaction.

Compute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the transaction to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.

Priority fees determine transaction ordering. During high-demand periods (popular mints, volatile markets), transactions compete for block space. The priority fee (in micro-lamports per compute unit) determines where your transaction lands in the leader's queue. Too low and the transaction may not be included; too high and the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.

Transaction simulation before submission catches many errors: insufficient balance, missing accounts, compute budget exceeded, slippage exceeded. Simulating saves the user from paying transaction fees on doomed transactions. The simulation result includes compute units consumed, log messages, and any error codes — all useful for debugging.

Versioned transactions (v0) are required when using Address Lookup Tables. Legacy transactions cannot reference ALTs. Most modern swap aggregators return versioned transaction messages. Wallets must support versioned transaction signing (most do, but some older wallet adapters may not).

## Checklist
- Include compute budget instructions at the start of the transaction
- Create output ATA if it doesn't exist
- Handle SOL wrapping/unwrapping for native SOL swaps
- Simulate transactions before submission
- Use versioned transactions when ALTs are needed

## Red flags
- Omitting compute budget instructions (uses default 200k limit)
- Not creating output ATA before the swap instruction
- Forgetting to unwrap WSOL after receiving native SOL output
- Skipping simulation and sending potentially invalid transactions
`,
  blocks: [
    {
      type: "quiz",
      id: "swap-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "swap-v2-l6-q1",
          prompt: "Why are compute budget instructions placed first in a swap transaction?",
          options: [
            "The runtime reads them before executing other instructions to set limits",
            "They must be first for signature verification",
            "Other instructions depend on their output",
          ],
          answerIndex: 0,
          explanation: "Compute budget instructions configure the transaction's CU limit and price before any program execution begins.",
        },
        {
          id: "swap-v2-l6-q2",
          prompt: "What is the primary benefit of Address Lookup Tables for swaps?",
          options: [
            "They compress account references from 32 bytes to 1 byte, fitting more accounts in a transaction",
            "They make transactions faster to execute",
            "They reduce the number of required signatures",
          ],
          answerIndex: 0,
          explanation: "ALTs allow transactions to reference many accounts without exceeding the 1232-byte transaction size limit.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "swap-v2-reliability",
  slug: "swap-v2-reliability",
  title: "Reliability patterns: retries, stale quotes, and latency",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Reliability patterns: retries, stale quotes, and latency

Production swap flows must handle the reality of network latency, expired quotes, and transaction failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust with real money.

Quote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the transaction, and it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer and automatically re-quote when the timer expires. Never allow users to send transactions based on quotes older than 30 seconds.

Retry strategies must distinguish between retryable and non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch and re-sign), and rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid account state, slippage exceeded (pool price moved too far, re-quote required), and program errors indicating invalid instruction data.

Exponential backoff with jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, with random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message with actionable options: "Quote expired — refresh and try again" rather than generic "Transaction failed."

Blockhash management affects reliability. A transaction's blockhash must be recent (within ~60 seconds / 150 slots). If a transaction fails and you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the transaction with the new blockhash, re-sign, and re-submit. This is why swap transaction building should be a reusable function that accepts a blockhash parameter.

Latency budgets help set user expectations. Typical Solana transaction confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: "Submitting..." → "Confirming..." with block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted transaction, but you can stop polling and let the blockhash expire).

Transaction status polling should use WebSocket subscriptions (signatureSubscribe) for real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load and introduces latency. Subscribe immediately after sendTransaction returns a signature, and set a timeout for maximum wait time.

## Checklist
- Show quote freshness countdown and auto-refresh
- Classify errors as retryable vs non-retryable
- Use exponential backoff with jitter for retries
- Get fresh blockhash on each retry attempt
- Use WebSocket subscriptions for confirmation

## Red flags
- Retrying non-retryable errors (wastes time and fees)
- No retry limit (infinite retry loops)
- Sending transactions with stale quotes (>30 seconds)
- Polling getTransaction instead of subscribing
`,
  blocks: [
    {
      type: "terminal",
      id: "swap-v2-l7-retry",
      title: "Retry Flow",
      steps: [
        {
          cmd: "Attempt 1",
          output: "Error: 429 Rate Limited",
          note: "Retryable — back off 500ms",
        },
        {
          cmd: "Attempt 2 (after 500ms + jitter)",
          output: "Error: Blockhash expired",
          note: "Retryable — get fresh blockhash",
        },
        {
          cmd: "Attempt 3 (after 1000ms + jitter)",
          output: "Success: Signature abc123",
          note: "Transaction confirmed after retry",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "swap-v2-swap-report",
  slug: "swap-v2-swap-report",
  title: "Checkpoint: Generate a SwapRunReport",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a SwapRunReport

Build the final swap run report that combines all course concepts:

- Summarize the route with leg details and total fees (using BigInt summation)
- Compute the effective price as outAmount / inAmount (9 decimal precision)
- Include the state machine outcome (finalState from the UI flow)
- Collect all errors from the state result and additional error sources
- Output must be stable JSON with deterministic key ordering

This checkpoint validates your complete understanding of swap aggregation.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "swap-v2-fundamentals",
  title: "Swap Fundamentals",
  description: "Token swap mechanics, slippage protection, route visualization, and swap plan construction.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "swap-v2-execution",
  title: "Execution & Reliability",
  description: "State machine design, transaction anatomy, reliability patterns, and final report generation.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const defiSwapAggregatorCourse: Course = {
  id: "course-defi-swap-aggregator",
  slug: "defi-swap-aggregator",
  title: "DeFi Swap Aggregation",
  description:
    "Master swap aggregation mechanics: quote parsing, route optimization, slippage protection, and deterministic swap plan generation for Solana DeFi.",
  difficulty: "intermediate",
  duration: "12 hours",
  totalXP: 400,
  tags: ["defi", "swap", "aggregator", "jupiter", "solana"],
  imageUrl: "/images/courses/defi-swap-aggregator.jpg",
  modules: [module1, module2],
};
