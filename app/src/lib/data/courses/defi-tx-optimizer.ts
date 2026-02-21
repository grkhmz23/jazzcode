import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-tx-optimizer/challenges/lesson-4-tx-plan";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-tx-optimizer/challenges/lesson-5-lut-planner";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-tx-optimizer/challenges/lesson-8-send-strategy";

const lesson1: Lesson = {
  id: "txopt-v2-why-fail",
  slug: "txopt-v2-why-fail",
  title: "Why DeFi transactions fail: CU limits, size, and blockhash expiry",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Why DeFi transactions fail: CU limits, size, and blockhash expiry

DeFi transactions on Solana fail for three primary reasons: compute budget exhaustion, transaction size overflow, and blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix for each is fundamentally different. Misdiagnosing the failure category leads to wasted effort and frustrated users.

## Compute budget exhaustion

Every Solana transaction executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per transaction, which is sufficient for simple transfers but far too low for complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or transactions that interact with multiple protocols easily exceed 400,000 CUs. When a transaction exceeds its compute budget, the runtime aborts execution and returns a \`ComputeBudgetExceeded\` error. The transaction fee is still charged because the validator performed work before the limit was hit.

The solution is the \`SetComputeUnitLimit\` instruction from the Compute Budget Program. This instruction must be the first instruction in the transaction (by convention) and tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the transaction first, observe the actual CU consumption, add a 10% safety margin, and use that as the limit.

## Transaction size limits

Solana transactions have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire transaction packet including signatures, message header, account keys, recent blockhash, and instruction data. Each account key consumes 32 bytes. A transaction referencing 30 unique accounts uses 960 bytes for account keys alone, leaving very little room for instruction data and signatures.

DeFi transactions are particularly account-heavy. A single Raydium CLMM swap requires the user wallet, input token account, output token account, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, and program IDs. Chaining multiple swaps in a single transaction can easily push the account count past 40, which exceeds the 1,232-byte limit with standard account encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each account reference from 32 bytes to just 1 byte for accounts stored in the lookup table.

## Blockhash expiry

Every Solana transaction includes a recent blockhash that serves as a replay protection mechanism and a timestamp. A blockhash is valid for approximately 60 seconds (roughly 150 slots at 400ms per slot). If a transaction is not included in a block before the blockhash expires, it becomes permanently invalid and can never be processed. The transaction simply disappears without any on-chain error record.

Blockhash expiry is the most insidious failure mode because it produces no error message. The transaction is silently dropped. This happens frequently during network congestion when transactions queue for longer than expected, or when users take too long to review and approve a transaction in their wallet. The correct handling is to monitor for confirmation with a timeout, and if the transaction is not confirmed within 30 seconds, fetch a new blockhash, rebuild and re-sign the transaction, and resubmit.

## Interaction between failure modes

These three failure modes often interact. A developer might add more instructions to avoid multiple transactions (reducing blockhash expiry risk), but this increases both CU consumption and transaction size. Optimizing for one dimension can worsen another. The art of transaction optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, and fast enough submission to land before the blockhash expires.

## Production triage rule

Diagnose transaction failures in strict order:
1. did it fit and simulate,
2. did it propagate and include,
3. did it confirm before expiry.

This sequence prevents noisy fixes and reduces false assumptions during incidents.

## Diagnostic checklist
- Check transaction logs for \`ComputeBudgetExceeded\` when CU is the issue
- Check serialized transaction size against the 1,232-byte limit
- Monitor confirmation status to detect silent blockhash expiry
- Simulate transactions before sending to catch CU and account issues early
- Track failure rates by category to identify systemic problems
`,
  blocks: [
    {
      type: "quiz",
      id: "txopt-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "txopt-v2-l1-q1",
          prompt: "What is the default compute unit budget for a Solana transaction?",
          options: [
            "200,000 CUs",
            "1,400,000 CUs",
            "50,000 CUs",
          ],
          answerIndex: 0,
          explanation: "Solana allocates 200,000 CUs by default. DeFi transactions almost always need more, requiring an explicit SetComputeUnitLimit instruction.",
        },
        {
          id: "txopt-v2-l1-q2",
          prompt: "What happens when a transaction's blockhash expires before it is confirmed?",
          options: [
            "The transaction is silently dropped with no on-chain error",
            "The transaction fails with a BlockhashExpired error on-chain",
            "The validator retries with a fresh blockhash automatically",
          ],
          answerIndex: 0,
          explanation: "Expired blockhash transactions are never processed and produce no on-chain record. The client must detect the timeout and resubmit with a fresh blockhash.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "txopt-v2-compute-budget",
  slug: "txopt-v2-compute-budget",
  title: "Compute budget instructions and priority fee strategy",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Compute budget instructions and priority fee strategy

The Compute Budget Program provides two critical instructions that every serious DeFi transaction should include: \`SetComputeUnitLimit\` and \`SetComputeUnitPrice\`. Together, they control how much computation your transaction can perform and how much you are willing to pay for priority inclusion in a block.

## SetComputeUnitLimit

This instruction sets the maximum number of compute units the transaction can consume. The value must be between 1 and 1,400,000 (the per-transaction maximum on Solana). The instruction takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.

Choosing the right limit requires profiling. Use \`simulateTransaction\` on an RPC node to execute the transaction without landing it on-chain. The simulation response includes \`unitsConsumed\`, which tells you exactly how many CUs the transaction used. Add a 10% safety margin to this value: \`Math.ceil(unitsConsumed * 1.1)\`. This margin accounts for minor variations in CU consumption between simulation and actual execution (e.g., different slot, slightly different account state).

Setting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation and execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety and cost efficiency.

## SetComputeUnitPrice

This instruction sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: \`priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\` lamports.

For example, with a CU limit of 200,000 and a CU price of 5,000 micro-lamports: \`ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports\`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature for user transactions).

## Priority fee market dynamics

Solana validators order transactions within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.

The priority fee market is highly dynamic. Strategies for choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query \`getRecentPrioritizationFees\` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) and price accordingly.

## Fee calculation formula

The total transaction fee follows this formula:

\`\`\`
baseFee = 5000 lamports (per signature)
priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports
totalFee = baseFee + priorityFee
\`\`\`

When building a transaction planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.

## Instruction ordering

Compute budget instructions must appear before any other instructions in the transaction. The runtime processes them during transaction validation, before executing program instructions. Placing them after other instructions is technically allowed but violates convention and may cause issues with some tools and wallets.

## Practical recommendations
- Always include both SetComputeUnitLimit and SetComputeUnitPrice
- Simulate first, then set CU limit to ceil(consumed * 1.1)
- Sample recent fees and use the 75th percentile for reliable inclusion
- Display the total fee estimate to users before they sign
- Cap the CU limit at 1,400,000 (Solana maximum per transaction)
`,
  blocks: [
    {
      type: "quiz",
      id: "txopt-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "txopt-v2-l2-q1",
          prompt: "How is the priority fee calculated in lamports?",
          options: [
            "ceil(computeUnitLimit * computeUnitPrice / 1,000,000)",
            "computeUnitLimit * computeUnitPrice",
            "computeUnitPrice / computeUnitLimit",
          ],
          answerIndex: 0,
          explanation: "The CU price is denominated in micro-lamports per CU. Dividing by 1,000,000 converts micro-lamports to lamports. The ceiling function ensures rounding up to the nearest lamport.",
        },
        {
          id: "txopt-v2-l2-q2",
          prompt: "Why is setting the CU limit to exactly the simulated value risky?",
          options: [
            "CU consumption can vary slightly between simulation and execution due to state changes",
            "The runtime does not accept exact values",
            "Simulation always underreports CU usage by 50%",
          ],
          answerIndex: 0,
          explanation: "Account state may change between simulation and execution, causing minor CU variations. A 10% margin absorbs these differences.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "txopt-v2-cost-explorer",
  slug: "txopt-v2-cost-explorer",
  title: "Transaction cost estimation and fee planning",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Transaction cost estimation and fee planning

Accurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a transaction will cost before they sign it. Validators need sufficient fees to prioritize your transaction. Getting fee estimation right means understanding the components, profiling real transactions, and adapting to market conditions.

## Components of transaction cost

A Solana transaction's cost has three components: (1) the base fee, which is 5,000 lamports per signature and is fixed by protocol; (2) the priority fee, which is variable and determined by the compute unit price you set; and (3) the rent cost for any new accounts created by the transaction (e.g., creating an Associated Token Account costs approximately 2,039,280 lamports in rent-exempt minimum balance).

For DeFi transactions that do not create new accounts, the cost is simply base fee plus priority fee. For transactions that create ATAs or other accounts, the rent deposits significantly increase the total cost and should be displayed separately in the UI since rent is recoverable when the account is closed.

## CU profiling

Profiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations and their typical CU ranges:

- SOL transfer: 2,000-5,000 CUs
- SPL token transfer: 4,000-8,000 CUs
- Create ATA (idempotent): 25,000-35,000 CUs
- Simple AMM swap (constant product): 60,000-120,000 CUs
- CLMM swap (concentrated liquidity): 100,000-200,000 CUs
- Multi-hop route (2 legs): 200,000-400,000 CUs
- Flash loan + swap: 300,000-600,000 CUs

These ranges vary based on pool state, tick array crossings in CLMM pools, and program version. Profiling your specific use case with simulation produces much more accurate estimates than using generic ranges.

## Fee market analysis

The priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.

Fetching recent fee data from \`getRecentPrioritizationFees\` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:
- 25th percentile: economy — may take multiple blocks to land
- 50th percentile: standard — lands in 1-2 blocks under normal conditions
- 75th percentile: fast — high probability of next-block inclusion
- 90th percentile: urgent — nearly guaranteed next-block inclusion

## Fee tiers for user selection

Present fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:

- Low priority: 100 micro-lamports/CU — suitable for non-urgent operations
- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations
- High priority: 10,000 micro-lamports/CU — time-sensitive trades

Each tier produces a different total fee: \`baseFee + ceil(cuLimit * tierPrice / 1,000,000)\`. Display all three alongside estimated confirmation times to help users make informed decisions.

## Dynamic fee adjustment

Production systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds and update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure transactions land. During quiet periods, reduce fees to save users money.

## Cost display best practices
- Show total fee in both lamports and SOL equivalent
- Separate base fee, priority fee, and rent deposits
- Indicate the priority level and expected confirmation time
- Update fee estimates in real-time as market conditions change
- Warn users when fees are unusually high compared to recent averages
`,
  blocks: [
    {
      type: "terminal",
      id: "txopt-v2-l3-fees",
      title: "Fee Calculation Examples",
      steps: [
        {
          cmd: "Simple transfer (5,000 CU, 1000 uL/CU)",
          output: "Base: 5,000 | Priority: ceil(5000*1000/1e6) = 5 | Total: 5,005 lamports",
          note: "Low compute = minimal priority fee",
        },
        {
          cmd: "DeFi swap (200,000 CU, 5000 uL/CU)",
          output: "Base: 5,000 | Priority: ceil(200000*5000/1e6) = 1,000 | Total: 6,000 lamports",
          note: "Higher compute increases priority cost proportionally",
        },
        {
          cmd: "Complex route (400,000 CU, 10000 uL/CU)",
          output: "Base: 5,000 | Priority: ceil(400000*10000/1e6) = 4,000 | Total: 9,000 lamports",
          note: "High CU + high priority = significant fee",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "txopt-v2-tx-plan",
  slug: "txopt-v2-tx-plan",
  title: "Challenge: Build a transaction plan with compute budgeting",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Build a transaction plan with compute budgeting

Build a transaction planning function that analyzes a set of instructions and produces a complete transaction plan:

- Sum estimatedCU from all instructions and add a 10% safety margin (ceiling)
- Cap the compute unit limit at 1,400,000 (Solana maximum)
- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)
- Calculate total fee: base fee (5,000 lamports) + priority fee
- Count unique account keys across all instructions
- Add 2 to instruction count for SetComputeUnitLimit and SetComputeUnitPrice
- Flag needsVersionedTx when unique accounts exceed 35

Your plan must be fully deterministic -- same input always produces same output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "txopt-v2-lut-planner",
  slug: "txopt-v2-lut-planner",
  title: "Challenge: Plan Address Lookup Table usage",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Plan Address Lookup Table usage

Build a function that determines the optimal Address Lookup Table strategy for a transaction:

- Collect all unique account keys across instructions
- Check which keys exist in available LUTs
- Calculate transaction size: base overhead (200 bytes) + keys * 32 bytes each
- With LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each
- Recommend "legacy" if the transaction fits in 1,232 bytes without LUT
- Recommend "use-existing-lut" if LUT keys make it fit
- Recommend "create-new-lut" if it still does not fit even with available LUTs
- Return byte savings from LUT usage

Your planner must be fully deterministic -- same input always produces same output.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "txopt-v2-reliability",
  slug: "txopt-v2-reliability",
  title: "Reliability patterns: retry, re-quote, resend vs rebuild",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Reliability patterns: retry, re-quote, resend vs rebuild

Production DeFi applications must handle transaction failures gracefully. The difference between a frustrating and a reliable experience comes down to retry strategy: knowing when to resend the same transaction, when to rebuild with fresh parameters, and when to abort and inform the user.

## Failure classification

Transaction failures fall into two categories: retryable and non-retryable. Correct classification is the foundation of any retry strategy.

Retryable failures include: (1) blockhash expired -- the transaction was not included in time, re-fetch blockhash and resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off and retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; and (5) transaction not found after send -- may need to resend.

Non-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) account does not exist -- expected account is missing; (4) program error with specific error code -- the program logic rejected the transaction; and (5) invalid instruction data -- the transaction was constructed incorrectly.

## Resend vs rebuild

Resending means submitting the exact same signed transaction bytes again. This is safe because Solana deduplicates transactions by signature -- if the original transaction was already processed, the resend is ignored. Resending is appropriate when: the transaction was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the transaction was not propagated to the leader.

Rebuilding means constructing a new transaction from scratch with fresh parameters: new blockhash, possibly updated account state, re-simulated CU estimate, and new signature. Rebuilding is necessary when: the blockhash expired (cannot resend with stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or account state changed (e.g., ATA was created by another transaction in the meantime).

The decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid instruction), abort with a clear error.

## Exponential backoff with jitter

Retry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:

\`\`\`
delay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter
\`\`\`

With a base delay of 500ms and a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.

Cap retries at 3 attempts for user-initiated transactions. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). For backend/automated transactions, higher retry counts (5-10) may be acceptable.

## Blockhash refresh on retry

Every retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild transaction message with new blockhash, (3) re-sign with user wallet (or programmatic keypair), (4) simulate the rebuilt transaction, (5) send if simulation succeeds.

For wallet-connected applications, re-signing requires another user interaction (wallet popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity and are not universally supported.

## User-facing retry UX

Present retry progress clearly: show the attempt number, what went wrong, and what is happening next. Example states: "Sending transaction..." -> "Transaction not confirmed, retrying (2/3)..." -> "Refreshing quote..." -> "Success!" or "Failed after 3 attempts. [Try Again] [Cancel]". Never retry silently -- users should always know what is happening with their transaction.

## Checklist
- Classify every failure as retryable or non-retryable
- Use exponential backoff (500ms base, 2x multiplier) with jitter
- Cap retries at 3 for user-initiated transactions
- Refresh blockhash on every rebuild attempt
- Distinguish resend (same bytes) from rebuild (new transaction)
- Show retry progress in the UI with clear status messages
`,
  blocks: [
    {
      type: "quiz",
      id: "txopt-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "txopt-v2-l6-q1",
          prompt: "When should you rebuild a transaction instead of resending it?",
          options: [
            "When the blockhash has expired or pool state has changed",
            "Whenever any error occurs",
            "Only when the user manually clicks retry",
          ],
          answerIndex: 0,
          explanation: "Rebuilding is necessary when the transaction's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes.",
        },
        {
          id: "txopt-v2-l6-q2",
          prompt: "Why add random jitter to retry delays?",
          options: [
            "To prevent many clients from retrying at the exact same moment and overwhelming the network",
            "To make the delay shorter on average",
            "Jitter is required by the Solana protocol",
          ],
          answerIndex: 0,
          explanation: "Without jitter, all clients using the same backoff formula would retry simultaneously, creating thundering herd problems on the RPC infrastructure.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "txopt-v2-ux-errors",
  slug: "txopt-v2-ux-errors",
  title: "UX: actionable error messages for transaction failures",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# UX: actionable error messages for transaction failures

Raw Solana error messages are cryptic. "Transaction simulation failed: Error processing Instruction 2: custom program error: 0x1771" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential for DeFi application quality.

## Error taxonomy

Solana transaction errors fall into several categories, each requiring different user-facing treatment:

Wallet errors: insufficient SOL balance, insufficient token balance, wallet disconnected, user rejected signature request. These are the most common and simplest to handle. The message should state what is missing and how to fix it: "Insufficient SOL balance. You need at least 0.05 SOL to cover transaction fees. Current balance: 0.01 SOL."

Program errors: these are custom error codes from on-chain programs. Each program defines its own error codes. For example, Jupiter aggregator might return error 6001 for "slippage tolerance exceeded," while Raydium returns a different code for the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary for each protocol you integrate with.

Network errors: RPC node unavailable, connection timeout, rate limited. These are transient and should be presented with automatic retry: "Network temporarily unavailable. Retrying in 3 seconds..." The user should not need to take action unless all retries fail.

Compute errors: compute budget exceeded, transaction too large. These indicate the transaction was constructed incorrectly (from the user's perspective). The message should explain the situation and offer a solution: "Transaction too complex for a single submission. Splitting into two transactions..."

## Mapping program errors

The most important error mappings for DeFi applications:

Slippage exceeded: "Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price." This is actionable -- the user can refresh and try again.

Insufficient liquidity: "Not enough liquidity in the pool for this swap size. Try reducing the swap amount or using a different route." This tells the user what to do.

Stale oracle: "Price oracle data is outdated. This can happen during high volatility. Please wait a moment and try again." This sets expectations.

Account not initialized: "Your token account for [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent." This explains the additional cost.

## Error message principles

Good error messages follow these principles: (1) State what happened in plain language. Not "Error 0x1771" but "The swap price changed too much." (2) Explain why it happened. "Prices move quickly during high volatility." (3) Tell the user what to do. "Tap Refresh to get an updated quote, or increase your slippage tolerance." (4) Provide technical details in a collapsible section for power users: "Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded)."

## Error recovery flows

Each error category should have a defined recovery flow:

Balance errors: show current balance, required balance, and a link to fund the wallet or swap for the needed token. Pre-calculate the exact shortfall.

Slippage errors: automatically re-quote with the same parameters. If the new quote is acceptable, present it with a "Swap at new price" button. If the price moved significantly, warn the user before proceeding.

Timeout errors: show a transaction explorer link so the user can verify whether the transaction actually succeeded. Include a "Check Status" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.

Simulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error and recovery action. This saves users from paying fees on doomed transactions.

## Logging and monitoring

Log every error with full context: timestamp, wallet address (anonymized), transaction signature (if available), program ID, error code, mapped message, and recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.

## Checklist
- Map all known program error codes to human-readable messages
- Include actionable recovery steps in every error message
- Provide technical details in a collapsible section
- Automatically re-quote on slippage failures
- Log all errors with full context for monitoring
`,
  blocks: [
    {
      type: "terminal",
      id: "txopt-v2-l7-errors",
      title: "Error Mapping Examples",
      steps: [
        {
          cmd: "Raw: custom program error: 0x1771",
          output: "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh for updated quote.\"",
          note: "Slippage exceeded -> actionable message",
        },
        {
          cmd: "Raw: Attempt to debit an account but found no record of a prior credit",
          output: "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund wallet to continue.\"",
          note: "Balance error -> show exact shortfall",
        },
        {
          cmd: "Raw: Transaction was not confirmed in 30.00 seconds",
          output: "Mapped: \"Transaction pending. Check status or retry with higher priority fee.\" [Check Status] [Retry]",
          note: "Timeout -> offer both check and retry options",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "txopt-v2-send-strategy",
  slug: "txopt-v2-send-strategy",
  title: "Checkpoint: Generate a send strategy report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a send strategy report

Build the final send strategy report that combines all course concepts into a comprehensive transaction optimization plan:

- Build a tx plan: sum CU estimates with 10% margin (capped at 1,400,000), calculate priority fee, count unique accounts and total instructions (+2 for compute budget)
- Plan LUT strategy: calculate sizes with and without LUT, recommend legacy / use-existing-lut / create-new-lut
- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)
- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash
- Preserve the input timestamp in the output

This checkpoint validates your complete understanding of transaction optimization.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "txopt-v2-fundamentals",
  title: "Transaction Fundamentals",
  description:
    "Transaction failure diagnosis, compute budget mechanics, priority-fee strategy, and fee estimation foundations.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "txopt-v2-optimization",
  title: "Optimization & Strategy",
  description:
    "Address Lookup Table planning, reliability/retry patterns, actionable error UX, and full send-strategy reporting.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const defiTxOptimizerCourse: Course = {
  id: "course-defi-tx-optimizer",
  slug: "defi-tx-optimizer",
  title: "DeFi Transaction Optimizer",
  description:
    "Master Solana DeFi transaction optimization: compute/fee tuning, ALT strategy, reliability patterns, and deterministic send-strategy planning.",
  difficulty: "advanced",
  duration: "12 hours",
  totalXP: 400,
  tags: ["defi", "transactions", "optimization", "compute", "solana"],
  imageUrl: "/images/courses/defi-tx-optimizer.svg",
  modules: [module1, module2],
};
