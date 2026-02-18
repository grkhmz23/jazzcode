import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-4-tick-math";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-5-position-fees";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-8-position-report";

const lesson1: Lesson = {
  id: "clmm-v2-vs-cpmm",
  slug: "clmm-v2-vs-cpmm",
  title: "CLMM vs constant product: why ticks exist",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# CLMM vs constant product: why ticks exist

Concentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker design. To understand why they exist, we must first understand the limitations of the constant product model and then examine how tick-based systems solve those problems on Solana.

## The constant product model and its inefficiency

The original AMM design, popularized by Uniswap V2 and adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x and y are the reserves of two tokens and k is a constant. When a trader swaps token A for token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.

The problem with this approach is capital inefficiency. If a SOL/USDC pool holds \$10 million in liquidity, and SOL trades between \$20 and \$30 for months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below \$1 or above \$1000 never participates in trades, earns no fees, yet still dilutes the returns for liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.

## Concentrated liquidity: the core insight

CLMMs, pioneered by Uniswap V3 and implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, and Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: "I want to provide liquidity only between \$20 and \$30 for SOL/USDC." This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.

The capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP with 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.

## Why ticks exist

To implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, and the relationship between tick index and price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.

Ticks serve several critical purposes. First, they provide the boundaries for liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.

Tick spacing is an important optimization. Not every tick is usable in every pool. Pools with higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs and state size. A pool with tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where account sizes and compute units matter.

## Solana-specific CLMM considerations

On Solana, CLMMs face unique architectural challenges. The account model requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, for example, uses tick array accounts that each hold 88 ticks worth of data. The program must load the correct tick array accounts as instructions, which means swaps that cross many ticks require more accounts and more compute units.

The Solana runtime's 1232-byte transaction size limit and 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple transactions, and position management operations must be carefully optimized to fit within these constraints.

## LP decision framework

Before opening any CLMM position, answer three questions:
1. What price regime am I targeting (mean-reverting vs trending)?
2. How actively can I rebalance when out-of-range?
3. What failure budget can I tolerate for fees vs IL vs rebalance costs?

CLMM returns come from strategy discipline, not just math formulas.

## Checklist
- Understand that x*y=k spreads liquidity across all prices, wasting capital
- CLMMs let LPs concentrate capital in specific price ranges
- Ticks discretize the price space at 1 basis point intervals
- Tick spacing varies by pool fee tier for on-chain efficiency
- Solana CLMMs use tick array accounts for state management

## Red flags
- Assuming CLMM positions behave like constant product positions
- Ignoring tick spacing when placing position boundaries
- Underestimating compute costs for swaps crossing many ticks
- Forgetting that out-of-range positions earn zero fees
`,
  blocks: [
    {
      type: "quiz",
      id: "clmm-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "clmm-v2-l1-q1",
          prompt: "What is the main advantage of CLMMs over constant product AMMs?",
          options: [
            "Capital efficiency — LPs concentrate liquidity where trades happen",
            "Lower transaction fees for traders",
            "No need for oracle price feeds",
          ],
          answerIndex: 0,
          explanation: "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices.",
        },
        {
          id: "clmm-v2-l1-q2",
          prompt: "Why do CLMMs use ticks to discretize the price space?",
          options: [
            "To define position boundaries and track liquidity transitions efficiently",
            "To make prices easier for humans to read",
            "To reduce the number of tokens in the pool",
          ],
          answerIndex: 0,
          explanation: "Ticks provide discrete price points for position boundaries, liquidity transitions, and efficient fee tracking at tick crossings.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "clmm-v2-price-tick",
  slug: "clmm-v2-price-tick",
  title: "Price, tick, and sqrtPrice: core conversions",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Price, tick, and sqrtPrice: core conversions

The mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, and the sqrtPriceX64. Understanding how to convert between these representations is essential for building any CLMM integration on Solana.

## Tick to price conversion

The fundamental relationship between a tick index and price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, and negative ticks yield prices less than 1.

For example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.

The inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.

## The sqrtPrice representation

CLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.

First, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), and the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.

Second, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 and stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. For tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.

On Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool account state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth for the current pool price.

## Decimal handling and token precision

Real-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a "raw" price that must be adjusted for decimals. If token0 is SOL (9 decimals) and token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.

This decimal adjustment is critical and a common source of bugs. Always track which token is token0 and which is token1 in the pool, and apply the correct decimal scaling when converting between on-chain tick values and display prices.

## Tick spacing and alignment

Not every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (for stable pairs with 0.01% fee), 8 (for 0.04% fee pools), 64 (for 0.30% fee pools), and 128 (for 1.00% fee pools).

To align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior for both positive and negative ticks. For example, with tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.

## Precision considerations

Floating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick and back, the result may differ by 1 tick due to floating-point precision limits. For on-chain operations, always use the integer tick index as the source of truth and derive the price from it, never the reverse.

The sqrtPriceX64 computation using BigInt avoids floating-point issues for the final representation, but the intermediate sqrt and pow operations still use JavaScript's 64-bit floats. For production systems processing large values, consider using dedicated decimal libraries or performing these computations with higher-precision arithmetic.

## Checklist
- price = 1.0001^tick for tick-to-price conversion
- tick = round(ln(price) / ln(1.0001)) for price-to-tick conversion
- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))
- Align ticks to tick spacing: floor(tick / spacing) * spacing
- Adjust for token decimals when displaying human-readable prices

## Red flags
- Ignoring decimal differences between token0 and token1
- Using floating-point price as source of truth instead of tick index
- Forgetting tick spacing alignment when creating positions
- Overflow in sqrtPriceX64 computation for extreme tick values
`,
  blocks: [
    {
      type: "quiz",
      id: "clmm-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "clmm-v2-l2-q1",
          prompt: "What is the sqrtPriceX64 value for tick 0 (price = 1.0)?",
          options: [
            "2^64 = 18446744073709551616",
            "1",
            "2^128",
          ],
          answerIndex: 0,
          explanation: "At tick 0, price = 1.0, sqrt(1.0) = 1.0, and sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616.",
        },
        {
          id: "clmm-v2-l2-q2",
          prompt: "Why do CLMMs store sqrtPrice instead of price directly?",
          options: [
            "It simplifies the AMM math — token amounts become linear in sqrtPrice",
            "It uses less storage space on-chain",
            "It makes the price harder for MEV bots to read",
          ],
          answerIndex: 0,
          explanation: "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler and more gas-efficient.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "clmm-v2-range-explorer",
  slug: "clmm-v2-range-explorer",
  title: "Range positions: in-range and out-of-range dynamics",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Range positions: in-range and out-of-range dynamics

A CLMM position is defined by its lower tick and upper tick. These two boundaries determine the price range in which the position is active, earns fees, and holds a mix of both tokens. Understanding in-range and out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.

## Anatomy of a range position

When an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, and the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.

If the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.

## In-range behavior

When the current pool price is within a position's range, the position is in-range and actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity and generates fees for the LP.

The fee accrual mechanism works as follows: the pool tracks a global fee_growth value for each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, and uncollected fees are the difference between the current global growth and the position's snapshot, multiplied by the position's liquidity.

In-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, and it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.

## Out-of-range behavior

When the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).

An out-of-range position is effectively a limit order that has been filled. If you set a range above the current price and the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful for implementing range orders and dollar-cost averaging strategies.

Out-of-range positions still exist on-chain and can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait for the price to return to their range. If the price returns, the position automatically becomes active again and starts earning fees.

## Position composition at boundaries

At the exact lower tick, the position holds 100% token0 and 0% token1. At the exact upper tick, it holds 0% token0 and 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.

The token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) and amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) and amount1 = 0. When out-of-range above, amount0 = 0 and amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).

## Active liquidity and the liquidity curve

The pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage for traders.

On Solana, this active liquidity is stored in the Whirlpool account's liquidity field and is updated whenever the price crosses a tick boundary where positions start or end. The tick array accounts store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.

## Checklist
- In-range positions earn fees and hold both tokens
- Out-of-range positions earn zero fees and hold one token
- Token composition varies continuously within the range
- Active liquidity is the sum of all in-range positions
- Fee growth tracking uses global vs position-level snapshots

## Red flags
- Expecting fees from out-of-range positions
- Ignoring the single-sided nature of out-of-range holdings
- Forgetting to account for IL in concentrated positions
- Assuming position composition is static within a range
`,
  blocks: [
    {
      type: "terminal",
      id: "clmm-v2-l3-states",
      title: "Position States",
      steps: [
        {
          cmd: "Position: SOL/USDC range [tick -1000, tick 1000]",
          output: "Current tick: 500 -> Status: IN-RANGE, holds SOL + USDC, earning fees",
          note: "Price within range, position is active",
        },
        {
          cmd: "Price moves up: current tick -> 1500",
          output: "Status: OUT-OF-RANGE (above), holds 100% USDC, earning 0 fees",
          note: "All SOL was sold as price rose through the range",
        },
        {
          cmd: "Price drops back: current tick -> -500",
          output: "Status: IN-RANGE, holds SOL + USDC, earning fees again",
          note: "Position reactivates when price returns to range",
        },
        {
          cmd: "Price drops further: current tick -> -2000",
          output: "Status: OUT-OF-RANGE (below), holds 100% SOL, earning 0 fees",
          note: "All USDC was sold as price fell through the range",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "clmm-v2-tick-math",
  slug: "clmm-v2-tick-math",
  title: "Challenge: Implement tick/price conversion helpers",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Implement tick/price conversion helpers

Implement the core tick math functions used in every CLMM integration:

- Convert a tick index to a human-readable price using price = 1.0001^tick
- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding
- Reverse-convert a price back to the nearest tick index
- Align a tick index to the pool's tick spacing

Your implementation will be tested against known tick values including tick 0, positive ticks, and negative ticks.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "clmm-v2-position-fees",
  slug: "clmm-v2-position-fees",
  title: "Challenge: Simulate position fee accrual",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Simulate position fee accrual

Implement a fee accrual simulator for a CLMM position over a price path:

- Convert lower and upper tick boundaries to prices
- Walk through each price in the path and determine in-range or out-of-range status
- Accrue fees proportional to trade volume when in-range
- Compute annualized fee APR
- Track periods in-range vs out-of-range
- Determine current status from the final price

This simulates the real-world behavior of concentrated liquidity positions as prices move.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "clmm-v2-range-strategy",
  slug: "clmm-v2-range-strategy",
  title: "Range strategies: tight, wide, and rebalancing rules",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Range strategies: tight, wide, and rebalancing rules

Choosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, and rebalancing frequency. This lesson covers the major strategies and the tradeoffs between them.

## Tight ranges: maximum efficiency, maximum risk

A tight range concentrates all liquidity into a narrow price band. For example, providing liquidity for SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, and the LP earns a proportionally larger share of trading fees.

However, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring and rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token and stops earning fees. The LP also realizes impermanent loss on each range crossing, and the gas costs of frequent rebalancing can eat into profits.

Tight ranges work best for stable pairs (USDC/USDT) where the price rarely deviates significantly, for professional LPs who can automate rebalancing, and for short-term positions where the LP has a strong directional view.

## Wide ranges: passive and resilient

A wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer and requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.

Wide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, and LPs who want to minimize rebalancing costs and IL realization events.

The extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior and never goes out-of-range. While capital-inefficient, it provides maximum resilience and is appropriate for very volatile or low-liquidity pairs.

## Asymmetric ranges and directional bets

LPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range and you hold SOL, preserving your long exposure.

Conversely, a range set below the current price acts like a limit buy order. You deposit USDC, and if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.

## Rebalancing strategies

Rebalancing is the process of closing an out-of-range position and opening a new one centered on the current price. The key decisions are: when to rebalance, and how to set the new range.

Time-based rebalancing checks the position at fixed intervals (hourly, daily) and rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.

Threshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.

On Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity and burning the position NFT), and opening a new position with updated range. These operations typically fit in two to three transactions depending on the number of accounts involved.

## Automated vault strategies

Several protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits and automatically create, monitor, and rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, and volatility-adjusted range widths.

When evaluating automated vaults, consider: the strategy's historical performance, the management and performance fees, the rebalancing frequency and associated costs, and the vault's transparency about its position management logic.

## Checklist
- Tight ranges maximize efficiency but require active management
- Wide ranges provide resilience at the cost of efficiency
- Asymmetric ranges can express directional views
- Rebalancing triggers: time-based, price-based, or threshold-based
- Consider automated vaults for passive management

## Red flags
- Using tight ranges without monitoring or automation
- Rebalancing too frequently, losing fees to gas costs
- Ignoring the realized IL at each rebalancing event
- Assuming past APR will predict future returns
`,
  blocks: [
    {
      type: "quiz",
      id: "clmm-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "clmm-v2-l6-q1",
          prompt: "What is the main tradeoff of using a tight price range?",
          options: [
            "Higher capital efficiency but more frequent out-of-range events and rebalancing",
            "Lower fees but less impermanent loss",
            "More tokens required to open the position",
          ],
          answerIndex: 0,
          explanation: "Tight ranges concentrate capital for higher efficiency and fee share, but the position goes out-of-range more often, requiring active management.",
        },
        {
          id: "clmm-v2-l6-q2",
          prompt: "When should an LP consider a full-range (all ticks) position?",
          options: [
            "For very volatile pairs where the price may swing dramatically",
            "Only for stablecoin pairs",
            "Never — it is always suboptimal",
          ],
          answerIndex: 0,
          explanation: "Full-range positions replicate constant product behavior and never go out-of-range, making them suitable for highly volatile or unpredictable pairs.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "clmm-v2-risk-review",
  slug: "clmm-v2-risk-review",
  title: "CLMM risks: rounding, overflow, and tick spacing errors",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# CLMM risks: rounding, overflow, and tick spacing errors

Building reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed transactions, or lost funds. This lesson catalogs the most common pitfalls in tick math, fee computation, and position management on Solana.

## Floating-point rounding in tick conversions

The tick-to-price formula price = 1.0001^tick and its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. For most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.

However, rounding errors accumulate in compound operations. Converting a tick to a price and back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick and then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.

The Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses "round half to even" (banker's rounding) in some environments. For CLMM math, always round toward the nearest valid tick and then align to tick spacing.

## Overflow in sqrtPriceX64 computation

The sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled with BigInt. The intermediate computation sqrt(price) * 2^64 can overflow a 64-bit float for extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, and sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.

Always use BigInt for the final sqrtPriceX64 value. For intermediate computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). For client-side JavaScript, the practical risk is manageable for common token pairs but must be tested at boundary conditions.

## Tick spacing alignment errors

A frequent bug is creating positions with tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting transactions: aligned = floor(tick / tickSpacing) * tickSpacing.

Be careful with negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test with negative ticks explicitly.

## Fee computation precision

Fee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.

Both the subtraction and the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic and wrapping subtraction (since fee_growth is monotonically increasing and wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.

A common mistake is computing fees with JavaScript Numbers, which lose precision for large BigInt values. Always use BigInt for fee calculations and only convert to Number at the final display step, after applying decimal adjustments.

## Decimal mismatch between tokens

Different tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.

Always track the decimal places of both tokens in the pool and apply them when converting between raw amounts and display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.

## Account and compute unit limits

Solana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array accounts (each swap can reference at most a few tick arrays), and account size limits for position management.

When building swap transactions, estimate the number of tick crossings and include sufficient tick array accounts. If a swap would cross more ticks than can be accommodated, the transaction will fail. Splitting large swaps across multiple transactions or using a routing protocol helps mitigate this risk.

## Checklist
- Use integer tick index as canonical, derive price from it
- Use BigInt for sqrtPriceX64 and all fee computations
- Always align ticks to tick spacing with floor division
- Test with negative ticks, zero ticks, and extreme ticks
- Apply correct decimal places for each token in the pool

## Red flags
- Using JavaScript Number for sqrtPriceX64 or fee amounts
- Forgetting wrapping subtraction for fee growth deltas
- Truncating instead of flooring for negative tick alignment
- Computing IL or fees without matching token decimals
`,
  blocks: [
    {
      type: "quiz",
      id: "clmm-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "clmm-v2-l7-q1",
          prompt: "Why should you always use BigInt for sqrtPriceX64 values?",
          options: [
            "JavaScript Number cannot safely represent 128-bit integers",
            "BigInt is faster than Number for CLMM math",
            "Solana requires BigInt in transaction instructions",
          ],
          answerIndex: 0,
          explanation: "sqrtPriceX64 is a u128 value that can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1). BigInt provides arbitrary precision integer arithmetic.",
        },
        {
          id: "clmm-v2-l7-q2",
          prompt: "What happens when negative ticks are aligned with floor division?",
          options: [
            "They round toward negative infinity — e.g., -100 with spacing 64 becomes -128",
            "They round toward zero — e.g., -100 with spacing 64 becomes -64",
            "They are rejected by the program",
          ],
          answerIndex: 0,
          explanation: "Floor division rounds toward negative infinity: floor(-100/64) = -2, so -100 aligns to -2 * 64 = -128. This is correct CLMM behavior.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "clmm-v2-position-report",
  slug: "clmm-v2-position-report",
  title: "Checkpoint: Generate a Position Report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a Position Report

Implement a comprehensive LP position report generator that combines all CLMM concepts:

- Convert tick boundaries to human-readable prices
- Determine in-range or out-of-range status from the current price
- Aggregate fee history into total earned fees per token
- Compute annualized fee APR
- Calculate impermanent loss percentage
- Return a complete, deterministic position report

This checkpoint validates your understanding of tick math, fee accrual, range dynamics, and position analysis.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "clmm-v2-fundamentals",
  title: "CLMM Fundamentals",
  description:
    "Concentrated liquidity concepts, tick/price math, and range-position behavior needed to reason about CLMM execution.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "clmm-v2-positions",
  title: "Positions & Risk",
  description:
    "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, and deterministic position risk reporting.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const defiClmmLiquidityCourse: Course = {
  id: "course-defi-clmm-liquidity",
  slug: "defi-clmm-liquidity",
  title: "CLMM Liquidity Engineering",
  description:
    "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy design, fee/IL dynamics, and deterministic LP position reporting.",
  difficulty: "advanced",
  duration: "14 hours",
  totalXP: 400,
  tags: ["defi", "clmm", "liquidity", "orca", "solana"],
  imageUrl: "/images/courses/defi-clmm-liquidity.jpg",
  modules: [module1, module2],
};
