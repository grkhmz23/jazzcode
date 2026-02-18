import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-perps-risk-console/challenges/lesson-4-pnl-calc";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-perps-risk-console/challenges/lesson-5-funding-accrual";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-perps-risk-console/challenges/lesson-8-risk-console-report";

const lesson1: Lesson = {
  id: "perps-v2-mental-model",
  slug: "perps-v2-mental-model",
  title: "Perpetual futures: base positions, entry price, and mark vs oracle",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Perpetual futures: base positions, entry price, and mark vs oracle

Perpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures with expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, and the distinction between mark and oracle prices is the foundation of every risk calculation that follows.

## Position anatomy

A perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), and margin (the collateral deposited). When you open a long position of 10 SOL-PERP at \$22.50 with \$225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.

Entry price is not simply the price at the moment you clicked "buy." If you add to an existing position, the entry price updates to the weighted average of the old and new fills. For example, if you hold 5 SOL-PERP at \$20 and buy 5 more at \$25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = \$22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry and current price.

## Mark price vs oracle price

On-chain perpetual protocols maintain two distinct prices: the mark price and the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges and publish updates on-chain every 400 milliseconds. The oracle price is the "truth" — the real-world value of the underlying asset.

The mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply and demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).

Mark price is used for all PnL calculations and liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price and trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.

## Why this matters for risk

Every risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price and margin. If you confuse mark and oracle, or miscalculate entry price after position averaging, every downstream number is wrong.

On Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate with slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads and rejecting prices with excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price and flag stale oracles (timestamps older than a few seconds).

## Checklist
- Understand that perpetual futures never expire and use funding to track spot
- Track entry price as a weighted average across all fills
- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)
- Monitor oracle staleness and confidence intervals
- Compute notional value as size * markPrice

## Red flags
- Using last-traded price instead of mark price for PnL
- Forgetting to update entry price on position additions
- Ignoring oracle confidence intervals during volatile markets
- Assuming mark price equals oracle price (the premium matters)
`,
  blocks: [
    {
      type: "quiz",
      id: "perps-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "perps-v2-l1-q1",
          prompt: "Why do perpetual futures protocols use a mark price instead of the last-traded price?",
          options: [
            "Mark price smooths out manipulation by incorporating oracle data, preventing artificial liquidations",
            "Mark price is cheaper to compute on-chain",
            "Last-traded price is not available on Solana",
          ],
          answerIndex: 0,
          explanation: "Mark price incorporates the oracle price as a stability anchor. Using last-traded price alone would allow a single large trade to trigger cascading liquidations through price manipulation.",
        },
        {
          id: "perps-v2-l1-q2",
          prompt: "If you hold 8 SOL-PERP at $20 and buy 2 more at $30, what is your new entry price?",
          options: [
            "$22.00",
            "$25.00",
            "$20.00",
          ],
          answerIndex: 0,
          explanation: "Weighted average: (8 * 20 + 2 * 30) / 10 = (160 + 60) / 10 = $22.00. The entry price shifts toward the new fill price proportional to the additional size.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "perps-v2-funding",
  slug: "perps-v2-funding",
  title: "Funding rates: why they exist and how they accrue",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Funding rates: why they exist and how they accrue

Funding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs and shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.

## The convergence mechanism

Consider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to \$23 while the SOL oracle price is \$22. The premium is \$1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs and attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts and encouraging longs.

The funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark and oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.

## How funding accrues

Funding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position and calculates: fundingPayment = positionSize * entryPrice * fundingRate. For a 10 SOL-PERP position at \$25 entry with a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = \$0.025 per interval.

The direction of payment depends on the position side and the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) and shorts receive (their margin increases). When negative: shorts pay and longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.

Cumulative funding matters more than any single payment. A position held for 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +\$100 unrealized PnL but have paid -\$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL and cumulative funding separately so traders see the full picture.

## Funding on Solana protocols

Solana perps protocols like Drift, Mango Markets, and Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model with configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.

On-chain funding settlement on Solana happens through cranked instructions. A keeper bot calls a "settle funding" instruction at each interval, which iterates through positions and adjusts their realized PnL accounts. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact with the position.

## Impact on risk monitoring

For risk console purposes, you must track: (1) the current funding rate and whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, and (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting for funding drag. Always include funding in your total return calculations.

## Checklist
- Understand that positive funding rate means longs pay shorts
- Calculate funding payment as size * price * rate per interval
- Track cumulative funding over the position's lifetime
- Account for funding when computing real return (PnL + funding)
- Monitor for extreme funding rates that signal market imbalance

## Red flags
- Ignoring funding costs in PnL reporting
- Confusing funding direction (positive rate = longs pay)
- Not accounting for lazy settlement on Solana protocols
- Assuming funding is continuous rather than discrete-interval
`,
  blocks: [
    {
      type: "quiz",
      id: "perps-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "perps-v2-l2-q1",
          prompt: "When the perpetual mark price is above the oracle (spot) price, who pays funding?",
          options: [
            "Longs pay shorts — the positive premium makes long positions expensive to hold",
            "Shorts pay longs — shorts are rewarded for being correct",
            "Both sides pay the protocol a fee",
          ],
          answerIndex: 0,
          explanation: "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand and pushes the perp price back toward spot.",
        },
        {
          id: "perps-v2-l2-q2",
          prompt: "A 10 SOL-PERP position at $25 entry faces a 0.01% funding rate. What is the per-period payment?",
          options: [
            "$0.025 (10 * 25 * 0.0001)",
            "$0.25 (10 * 25 * 0.001)",
            "$2.50 (10 * 25 * 0.01)",
          ],
          answerIndex: 0,
          explanation: "Funding payment = size * entryPrice * rate = 10 * 25 * 0.0001 = $0.025 per funding interval.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "perps-v2-pnl-explorer",
  slug: "perps-v2-pnl-explorer",
  title: "PnL visualization: tracking profit over time",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# PnL visualization: tracking profit over time

Profit and loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, and trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential for risk management and strategy refinement.

## Unrealized vs realized PnL

Unrealized PnL represents the paper profit or loss on your open position. For a long position: unrealizedPnL = size * (markPrice - entryPrice). For a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes with every price tick and represents what you would gain or lose if you closed the position right now at the mark price.

Realized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at \$20 and close 5 contracts at \$25, you realize 5 * (25 - 20) = \$25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of \$20. Realized PnL is permanent — it has already been credited to your margin account. Unrealized PnL fluctuates and may increase or decrease.

Total PnL = realized + unrealized + cumulative funding. This is the true measure of position performance. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.

## Return on equity (ROE)

ROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position with \$25 unrealized PnL on \$225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. With 10x leverage, a 5% price move produces approximately 50% ROE.

ROE is the primary performance metric for comparing positions across different sizes and leverage levels. A \$10 profit on \$100 margin (10% ROE) represents better capital efficiency than \$10 profit on \$1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.

## Time-series visualization

Plotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving with each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.

For Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles for longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, and funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds and updates the PnL display accordingly.

## Break-even analysis

The break-even price accounts for all costs: trading fees, funding payments, and slippage. For a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at \$22.50 with \$0.50 in total costs on a 10-unit position, your break-even is \$22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.

## Visualization best practices

Effective PnL dashboards use color coding consistently: green for positive PnL, red for negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL and percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.

## Checklist
- Separate unrealized, realized, and funding components in the display
- Calculate ROE relative to initial margin, not current margin
- Include break-even price accounting for all costs
- Update PnL in near-real-time using mark price feeds
- Annotate funding events on the PnL time series

## Red flags
- Showing only unrealized PnL without funding impact
- Computing ROE against notional value instead of margin
- Not distinguishing realized from unrealized PnL
- Updating PnL using oracle price instead of mark price
`,
  blocks: [
    {
      type: "terminal",
      id: "perps-v2-l3-pnl",
      title: "PnL Breakdown Example",
      steps: [
        {
          cmd: "Position: 10 SOL-PERP Long @ $22.50, margin $225",
          output: "Entry: $22.50 | Mark: $25.00 | Size: 10",
          note: "Position snapshot at current mark price",
        },
        {
          cmd: "Unrealized PnL",
          output: "10 * ($25.00 - $22.50) = $25.00 | ROE: +11.11%",
          note: "Long PnL = size * (mark - entry)",
        },
        {
          cmd: "Cumulative funding (3 periods @ 0.01%)",
          output: "3 * 10 * $22.50 * 0.0001 = -$0.07 (paid)",
          note: "Positive rate: longs pay funding",
        },
        {
          cmd: "Total PnL",
          output: "$25.00 + (-$0.07) = $24.93 | Net ROE: +11.08%",
          note: "True return includes funding drag",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "perps-v2-pnl-calc",
  slug: "perps-v2-pnl-calc",
  title: "Challenge: Calculate perpetual futures PnL",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Calculate perpetual futures PnL

Implement a PnL calculator for perpetual futures positions:

- Compute unrealized PnL based on entry price vs mark price
- Handle both long and short positions correctly
- Calculate notional value as size * markPrice
- Compute ROE (return on equity) as a percentage of initial margin
- Format all outputs with appropriate decimal precision

Your calculator must be deterministic — same input always produces the same output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "perps-v2-funding-accrual",
  slug: "perps-v2-funding-accrual",
  title: "Challenge: Simulate funding rate accrual",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Simulate funding rate accrual

Build a funding accrual simulator that processes discrete funding intervals:

- Iterate through an array of funding rates and compute the payment for each period
- Longs pay (subtract from balance) when the funding rate is positive
- Shorts receive (add to balance) when the funding rate is positive
- Track cumulative funding, average rate, and net margin impact
- Handle negative funding rates where the direction reverses

The simulator must be deterministic — same inputs always produce the same result.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "perps-v2-margin-liquidation",
  slug: "perps-v2-margin-liquidation",
  title: "Margin ratio and liquidation thresholds",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Margin ratio and liquidation thresholds

Margin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, and how liquidation prices are calculated is essential for risk monitoring.

## Initial margin and leverage

Initial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position with \$250 notional value and \$25 margin is 10x leveraged. Higher leverage amplifies both gains and losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.

Solana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) and lower leverage (5x-10x) on altcoins with thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.

## Maintenance margin

The maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin accounts for unrealized PnL and funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.

When the margin ratio drops below the MMR, the position is eligible for liquidation. Protocols don't wait for the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, and potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes "bad debt" that must be absorbed by an insurance fund or socialized across other traders.

## Liquidation price calculation

The liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. For a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. For a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.

This formula accounts for the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) and the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply "entry price minus margin per unit" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.

For example, consider a 10 SOL-PERP long at \$22.50 with \$225 margin and 5% MMR. The notional at entry is 10 * 22.50 = \$225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near \$2.05 in this well-margined case. With higher leverage (less margin), the liquidation price would be much closer to entry.

## Cascading liquidations

During sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a "liquidation spiral" — can cause prices to move far beyond what fundamentals justify.

On Solana, liquidation is performed by keeper bots that submit liquidation transactions. These bots compete for liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation transactions compete for block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.

## Risk monitoring thresholds

A production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), and (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.

## Checklist
- Calculate effective margin including unrealized PnL and funding
- Compute margin ratio as effectiveMargin / notionalValue
- Derive liquidation price from entry price, margin, and MMR
- Set warning thresholds above the MMR to give early alerts
- Account for liquidation fees in worst-case scenarios

## Red flags
- Computing liquidation price without accounting for the maintenance buffer
- Ignoring funding in effective margin calculations
- Not alerting traders before they reach the liquidation threshold
- Assuming the mark price at liquidation equals the execution price (slippage exists)
`,
  blocks: [
    {
      type: "quiz",
      id: "perps-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "perps-v2-l6-q1",
          prompt: "Why is the maintenance margin rate set above zero?",
          options: [
            "To ensure remaining collateral covers liquidation fees and slippage, preventing bad debt",
            "To make it harder for traders to open positions",
            "To generate more revenue for the protocol",
          ],
          answerIndex: 0,
          explanation: "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees and absorb slippage during the close. Without it, positions could go underwater, creating bad debt.",
        },
        {
          id: "perps-v2-l6-q2",
          prompt: "What causes a cascading liquidation spiral?",
          options: [
            "Forced position closes push the price further, triggering more liquidations in a feedback loop",
            "Too many traders opening positions at the same time",
            "Oracle prices updating too slowly",
          ],
          answerIndex: 0,
          explanation: "When liquidation engines close positions by selling into the market, the selling pressure moves the price further against remaining positions, triggering their liquidations too — a self-reinforcing feedback loop.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "perps-v2-common-bugs",
  slug: "perps-v2-common-bugs",
  title: "Common bugs: sign errors, units, and funding direction",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Common bugs: sign errors, units, and funding direction

Perpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, and funding direction bugs are among the most frequent and costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This lesson catalogs the most common pitfalls and how to avoid them.

## Sign errors in PnL calculations

The most fundamental bug: getting the sign wrong on PnL for short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) with a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative for shorts and using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, and liquidation prices all need absolute size.

Rule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.

## Unit and decimal mismatches

Solana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers with specific exponents. Mixing these without proper conversion produces catastrophically wrong values.

Example: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) and you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space with a consistent exponent.

Rule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable for display/simulation code) or entirely in integer base units with explicit scaling factors (required for on-chain code). Never mix the two.

## Funding direction confusion

The funding direction rule is: "positive funding rate means longs pay shorts." This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about "who benefits." When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation for providing the other side.

In code, the mistake looks like this:
- WRONG: if (side === "long") totalFunding += payment;
- RIGHT: if (side === "long") totalFunding -= payment;

When the funding rate is positive and the side is long, the payment reduces the trader's balance. When negative and long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.

## Liquidation price off-by-one

The liquidation price formula must account for the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.

Another variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid \$5 in funding, its effective margin is \$5 less than the initial deposit, and the liquidation price is correspondingly closer to the entry price.

## Margin ratio denominator

Margin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price for notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position with \$225 entry notional that has moved to \$250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.

## Integer overflow in funding accumulation

When accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), and after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (with a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient for display, but intermediate calculations should preserve full precision.

## Testing strategy

Every perps calculation should have test cases covering: (1) Long with profit, (2) Long with loss, (3) Short with profit, (4) Short with loss, (5) Positive funding rate for both sides, (6) Negative funding rate for both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.

## Checklist
- Use separate formulas for long and short PnL, not sign-encoded size
- Define and enforce a canonical unit convention (human-readable vs base units)
- Test all four combinations of funding direction (2 sides x 2 rate signs)
- Include maintenance margin in liquidation price calculations
- Use mark price (not entry price) for notional value in margin ratio

## Red flags
- Negative position sizes used to encode short direction
- Mixing lamport-scale and dollar-scale values in the same calculation
- Funding payment that adds to long balances when the rate is positive
- Liquidation price computed at zero margin instead of maintenance margin
- Margin ratio using entry-price notional instead of mark-price notional
`,
  blocks: [
    {
      type: "quiz",
      id: "perps-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "perps-v2-l7-q1",
          prompt: "Why should position size always be stored as a positive number?",
          options: [
            "Negative size creates sign-convention bugs in notional, funding, margin, and liquidation calculations",
            "Solana accounts cannot store negative numbers",
            "Positive numbers use less storage space",
          ],
          answerIndex: 0,
          explanation: "When size carries the direction sign, every formula that uses size must account for the sign — not just PnL, but also notional value, funding payments, and liquidation price. Keeping size positive and branching on a separate 'side' field is safer and more explicit.",
        },
        {
          id: "perps-v2-l7-q2",
          prompt: "A long position has a positive funding rate of 0.01%. What happens to the trader's balance?",
          options: [
            "The balance decreases — longs pay when the funding rate is positive",
            "The balance increases — longs receive positive funding",
            "Nothing — funding only affects shorts",
          ],
          answerIndex: 0,
          explanation: "Positive funding rate means the perp is trading above spot. Longs pay shorts to discourage the long-heavy imbalance. The long trader's effective margin decreases by the funding payment amount.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "perps-v2-risk-console-report",
  slug: "perps-v2-risk-console-report",
  title: "Checkpoint: Generate a Risk Console Report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a Risk Console Report

Build the comprehensive risk console report that integrates all course concepts:

- Calculate unrealized PnL and ROE for the position
- Accumulate funding payments across all provided funding rate intervals
- Compute effective margin (initial + PnL + funding) and margin ratio
- Derive the liquidation price accounting for maintenance margin and funding
- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds
- Output must be stable JSON with deterministic structure

This checkpoint validates your complete understanding of perpetual futures risk management.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "perps-v2-fundamentals",
  title: "Perps Fundamentals",
  description: "Perpetual futures mechanics, funding rate accrual, PnL visualization, and core calculation challenges.",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5],
};

const module2: Module = {
  id: "perps-v2-risk",
  title: "Risk & Monitoring",
  description: "Margin ratio monitoring, liquidation thresholds, common implementation bugs, and full risk console report generation.",
  lessons: [lesson6, lesson7, lesson8],
};

export const defiPerpsRiskConsoleCourse: Course = {
  id: "course-defi-perps-risk-console",
  slug: "defi-perps-risk-console",
  title: "Perps Risk Console",
  description:
    "Master perpetual futures mechanics: PnL calculations, funding rate accrual, margin monitoring, liquidation simulation, and deterministic risk console reporting.",
  difficulty: "advanced",
  duration: "14 hours",
  totalXP: 400,
  tags: ["defi", "perps", "perpetuals", "risk", "solana"],
  imageUrl: "/images/courses/defi-perps-risk-console.jpg",
  modules: [module1, module2],
};
