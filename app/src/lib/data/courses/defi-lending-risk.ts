import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/defi-lending-risk/challenges/lesson-4-interest-rates";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/defi-lending-risk/challenges/lesson-5-health-factor";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/defi-lending-risk/challenges/lesson-8-risk-report";

const lesson1: Lesson = {
  id: "lending-v2-pool-model",
  slug: "lending-v2-pool-model",
  title: "Lending pool model: supply, borrow, and utilization",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Lending pool model: supply, borrow, and utilization

Lending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, and utilization is essential before diving into interest rate models or liquidation logic.

A lending pool is a smart contract (or set of accounts on Solana) that holds a reserve of a single token — for example, USDC. Suppliers deposit tokens into the pool and receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens for the underlying asset plus accrued interest.

Borrowers interact with the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (for example, SOL). The protocol values the collateral in USD terms and allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.

The utilization ratio is the single most important metric in a lending pool. It is defined as:

utilization = totalBorrowed / totalSupply

where totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% and 85%, balancing yield for suppliers against withdrawal liquidity.

The reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest and the reserve factor is 10%, the protocol retains 1% and suppliers receive the effective yield on the remaining 9%. Reserve funds are used for protocol insurance, development, and governance treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.

Pool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool with 1,000 USDC total and 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.

On Solana specifically, lending pools are represented as program-derived accounts. The reserve account holds the token balance, a reserve config account stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), and individual obligation accounts track each user's deposits and borrows. Programs like Solend use the spl-token program for token custody and Pyth or Switchboard oracles for price feeds.

## Checklist
- Understand the relationship between supply, borrow, and utilization
- Know that utilization = totalBorrowed / totalSupply
- Recognize that the reserve factor reduces supplier yield
- Understand share-based accounting for deposits and borrows
- Identify the key on-chain accounts in a Solana lending pool

## Red flags
- Utilization at or near 100% (withdrawal liquidity crisis)
- Missing or zero reserve factor (no protocol safety buffer)
- Share-price manipulation through donation attacks
- Pools without oracle-backed price feeds for collateral valuation
`,
  blocks: [
    {
      type: "quiz",
      id: "lending-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "lending-v2-l1-q1",
          prompt: "What does a utilization ratio of 80% mean?",
          options: [
            "80% of supplied assets are currently borrowed",
            "80% of borrowers have been liquidated",
            "The pool has 80% of its maximum capacity",
          ],
          answerIndex: 0,
          explanation: "Utilization = totalBorrowed / totalSupply. At 80%, four-fifths of all deposited assets are currently lent out to borrowers.",
        },
        {
          id: "lending-v2-l1-q2",
          prompt: "How does the reserve factor affect supplier yield?",
          options: [
            "It reduces supplier yield by skimming a percentage of borrow interest",
            "It increases supplier yield by adding protocol subsidies",
            "It has no effect on supplier yield",
          ],
          answerIndex: 0,
          explanation: "The reserve factor takes a cut of borrow interest before distributing the rest to suppliers, reducing their effective APY.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "lending-v2-interest-curves",
  slug: "lending-v2-interest-curves",
  title: "Interest rate curves and the kink model",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Interest rate curves and the kink model

Interest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply and demand for liquidity. The piecewise-linear "kink" model is the dominant interest rate design used across DeFi lending protocols, from Compound and Aave on Ethereum to Solend and MarginFi on Solana.

The core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing and incentivize new deposits. The kink model achieves this with two linear segments joined at a critical utilization point called the "kink."

The kink model has four parameters: baseRate, slope1, slope2, and kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.

Below the kink, the borrow rate formula is:

borrowRate = baseRate + (utilization / kink) * slope1

This creates a gentle linear increase. At 50% utilization with a kink at 80%, baseRate of 2%, and slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.

Above the kink, the formula becomes:

borrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2

The full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. With slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.

The supply rate is derived from the borrow rate, utilization, and reserve factor:

supplyRate = borrowRate * utilization * (1 - reserveFactor)

Suppliers only earn on the portion of the pool that is actively borrowed, and the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, and 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.

Why the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a "liquidity death spiral" where all assets are borrowed and no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through governance — adjusting the kink point, slopes, and base rate to target different utilization profiles for different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.

Real-world Solana protocols often extend this model with additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points for more granular control, and dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.

## Checklist
- Understand the four parameters: baseRate, slope1, slope2, kink
- Calculate borrow rate below and above the kink
- Derive supply rate from borrow rate, utilization, and reserve factor
- Recognize why steep slope2 prevents liquidity crises
- Know that different assets use different kink parameters

## Red flags
- Slope2 too low (insufficient deterrent for high utilization)
- Kink set too high (leaves insufficient withdrawal buffer)
- Base rate at zero (no minimum cost of borrowing)
- Parameters unchanged despite market condition shifts
`,
  blocks: [
    {
      type: "quiz",
      id: "lending-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "lending-v2-l2-q1",
          prompt: "What happens to borrow rates when utilization exceeds the kink?",
          options: [
            "They increase steeply according to slope2",
            "They remain constant at the kink rate",
            "They decrease to attract more borrowers",
          ],
          answerIndex: 0,
          explanation: "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply and discourage further borrowing.",
        },
        {
          id: "lending-v2-l2-q2",
          prompt: "Why is the supply rate always lower than the borrow rate?",
          options: [
            "Suppliers only earn on the borrowed portion, and the reserve factor takes a cut",
            "The protocol subsidizes borrowers",
            "Supply rates are fixed by governance",
          ],
          answerIndex: 0,
          explanation: "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 and reserveFactor > 0, the supply rate is always less than the borrow rate.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "lending-v2-health-explorer",
  slug: "lending-v2-health-explorer",
  title: "Health factor monitoring and liquidation preview",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Health factor monitoring and liquidation preview

The health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential for both borrowers (to avoid liquidation) and liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, and react to health factor changes is a core skill for DeFi risk management.

The health factor formula is:

healthFactor = (collateralValue * liquidationThreshold) / borrowValue

where collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, and borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible for liquidation.

The liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — for example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, and you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.

When a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) and $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.

Health factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, with automated alerts below 1.3 and emergency actions below 1.2.

Monitoring dashboards should display: current health factor with color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices for each collateral asset, and historical health factor over time. On Solana, health factor data can be derived by reading obligation accounts and combining with oracle price feeds from Pyth or Switchboard.

Liquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.

Price scenario analysis extends monitoring to "what-if" questions. What happens to the health factor if SOL drops 20%? If both SOL and ETH drop 30%? If interest accrues for another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this course.

## Checklist
- Calculate health factor using weighted liquidation thresholds
- Distinguish between LTV (borrowing limit) and liquidation threshold
- Compute maximum additional borrow and liquidation shortfall
- Set up monitoring with color-coded health factor alerts
- Run price scenario analysis before major market events

## Red flags
- Health factor below 1.2 without active monitoring
- No alerts configured for health factor changes
- Ignoring weighted threshold calculations for multi-asset positions
- Failing to account for accruing interest in health factor projections
`,
  blocks: [
    {
      type: "terminal",
      id: "lending-v2-l3-health",
      title: "Health Factor Calculations",
      steps: [
        {
          cmd: "Position: 100 SOL @ $25, borrow 1000 USDC, threshold 0.80",
          output: "HF = (2500 * 0.80) / 1000 = 2.0000 [SAFE]",
          note: "Healthy position with 50% buffer before liquidation",
        },
        {
          cmd: "SOL drops to $15 ...",
          output: "HF = (1500 * 0.80) / 1000 = 1.2000 [WARNING]",
          note: "Only 20% buffer remaining — consider adding collateral",
        },
        {
          cmd: "SOL drops to $12 ...",
          output: "HF = (1200 * 0.80) / 1000 = 0.9600 [LIQUIDATABLE]",
          note: "Health factor below 1.0 — position is eligible for liquidation",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "lending-v2-interest-rates",
  slug: "lending-v2-interest-rates",
  title: "Challenge: Compute utilization-based interest rates",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Compute utilization-based interest rates

Implement the kink-based interest rate model used by lending protocols:

- Calculate the utilization ratio from total supply and total borrowed
- Apply the piecewise-linear kink model with baseRate, slope1, slope2, and kink
- Compute the borrow rate using the appropriate formula for below-kink and above-kink regions
- Derive the supply rate from borrow rate, utilization, and reserve factor
- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink
- Return all values formatted to 6 decimal places

Your implementation must be deterministic — same input always produces same output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "lending-v2-health-factor",
  slug: "lending-v2-health-factor",
  title: "Challenge: Compute health factor and liquidation status",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Compute health factor and liquidation status

Implement the health factor computation for a multi-asset lending position:

- Sum collateral and borrow values from an array of position objects
- Compute weighted average liquidation threshold across all collateral assets
- Calculate the health factor using the standard formula
- Determine liquidation eligibility (health factor below 1.0)
- Calculate maximum additional borrow capacity and liquidation shortfall
- Handle edge cases: no borrows (max health factor), no collateral, single asset

Return all USD values to 2 decimal places and health factor to 4 decimal places.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "lending-v2-liquidation-mechanics",
  slug: "lending-v2-liquidation-mechanics",
  title: "Liquidation mechanics: bonus, close factor, and bad debt",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Liquidation mechanics: bonus, close factor, and bad debt

Liquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange for the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, and failure modes — is essential for anyone building on or using lending protocols.

The liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive for performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators for gas costs and execution risk, and it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where transaction costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).

The close factor limits how much of a position can be liquidated in a single transaction. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one transaction, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages for mildly underwater positions, larger percentages (up to 100%) for deeply underwater positions.

The liquidation process on Solana follows these steps: (1) a liquidator identifies a position with health factor below 1.0 by scanning obligation accounts, (2) the liquidator calls the liquidation instruction specifying which debt to repay and which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.

Bad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.

Cascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds for volatile assets, liquidation rate limits (maximum liquidation volume per time window), and integration with deep liquidity sources.

Solana-specific considerations: liquidation bots on Solana benefit from low latency and low transaction costs. However, they must compete for transaction ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their transactions. Protocols must also handle Solana's account model — each obligation account must be refreshed with current oracle prices before liquidation can proceed, adding instructions and compute units to the liquidation transaction.

## Checklist
- Understand the liquidation bonus incentive structure
- Know how close factor limits single-transaction liquidation
- Track the flow of funds during a liquidation event
- Identify bad debt scenarios and protocol mitigation strategies
- Consider cascading liquidation risks in portfolio construction

## Red flags
- Liquidation bonus too low (liquidators are not incentivized to act quickly)
- Close factor at 100% (full liquidation in one shot, no borrower recourse)
- No reserve fund or insurance mechanism for bad debt
- Ignoring cascading liquidation risks in concentrated collateral pools
`,
  blocks: [
    {
      type: "quiz",
      id: "lending-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "lending-v2-l6-q1",
          prompt: "What is the purpose of the liquidation bonus?",
          options: [
            "It incentivizes liquidators to repay debt by offering collateral at a discount",
            "It rewards borrowers for maintaining healthy positions",
            "It increases the interest rate for all borrowers",
          ],
          answerIndex: 0,
          explanation: "The liquidation bonus compensates liquidators for gas costs and risk, ensuring positions are liquidated promptly to protect the protocol.",
        },
        {
          id: "lending-v2-l6-q2",
          prompt: "When does bad debt occur in a lending protocol?",
          options: [
            "When collateral value is insufficient to cover outstanding debt after liquidation",
            "When the reserve factor is set too high",
            "When utilization drops below the kink",
          ],
          answerIndex: 0,
          explanation: "Bad debt materializes when rapid price drops make collateral worth less than the debt, leaving the protocol with unrecoverable losses.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "lending-v2-oracle-risk",
  slug: "lending-v2-oracle-risk",
  title: "Oracle risk and stale pricing in lending",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Oracle risk and stale pricing in lending

Lending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, and liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.

On Solana, the two dominant oracle providers are Pyth Network and Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, and trading firms. Pyth publishes price, confidence interval, and exponential moving average (EMA) price for each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds and verification mechanisms. Most Solana lending protocols integrate both and use the more conservative price (lower for collateral, higher for borrows).

Stale prices are the most common oracle risk. A price is "stale" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update transactions, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices and either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations and enabling under-collateralized borrowing.

Confidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — for example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: for collateral valuation, use (price - confidence) to be conservative; for borrow valuation, use (price + confidence) to account for upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.

Price manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, and then lets the price revert — leaving the protocol with under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, and implementing borrow/withdrawal delays during high-volatility periods.

Solana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain accounts that protocols read. Each Pyth price account contains the latest price, confidence, EMA price, publish time, and status (Trading, Halted, Unknown). Protocols should check the status field — a "Halted" or "Unknown" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard accounts have similar freshness and confidence metadata.

Multi-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle and Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows and liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.

Circuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious and either verify against a secondary source or temporarily pause operations. Flash crashes and recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.

## Checklist
- Verify oracle freshness (publishTime within acceptable window)
- Use confidence intervals for conservative pricing
- Implement multi-oracle fallback strategies
- Check oracle status fields (Trading, Halted, Unknown)
- Set circuit breakers for extreme price movements

## Red flags
- Single oracle dependency with no fallback
- No staleness checks on price data
- Ignoring confidence intervals for collateral valuation
- Using spot prices without TWAP or time-weighting
- No circuit breakers for extreme price changes
`,
  blocks: [
    {
      type: "quiz",
      id: "lending-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "lending-v2-l7-q1",
          prompt: "Why should lending protocols use confidence-adjusted prices for collateral?",
          options: [
            "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
            "Confidence intervals make prices more accurate",
            "It increases the collateral value for borrowers",
          ],
          answerIndex: 0,
          explanation: "Using price minus confidence for collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile.",
        },
        {
          id: "lending-v2-l7-q2",
          prompt: "What should a protocol do when all oracle feeds are stale?",
          options: [
            "Pause new borrows and liquidations until fresh prices are available",
            "Use the last known price regardless of age",
            "Estimate the price from on-chain DEX data",
          ],
          answerIndex: 0,
          explanation: "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations and under-collateralized borrows during oracle outages.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "lending-v2-risk-report",
  slug: "lending-v2-risk-report",
  title: "Checkpoint: Generate a multi-scenario risk report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a multi-scenario risk report

Build the final risk report that combines all course concepts:

- Evaluate a base case using current position prices
- Apply price overrides from multiple named scenarios (bull, crash, etc.)
- Compute collateral value, borrow value, and health factor per scenario
- Identify which scenarios trigger liquidation (health factor < 1.0)
- Track the worst health factor across all scenarios
- Count total liquidation scenarios
- Output must be stable JSON with deterministic key ordering

This checkpoint validates your complete understanding of lending risk analysis.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "lending-v2-fundamentals",
  title: "Lending Fundamentals",
  description: "Lending pool mechanics, interest rate models, health factor monitoring, and rate computation.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "lending-v2-risk-management",
  title: "Risk Management",
  description: "Health factor computation, liquidation mechanics, oracle risk, and multi-scenario risk reporting.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const defiLendingRiskCourse: Course = {
  id: "course-defi-lending-risk",
  slug: "defi-lending-risk",
  title: "Lending & Liquidation Risk",
  description:
    "Master lending protocol mechanics: utilization-based interest rates, health factor monitoring, liquidation thresholds, and deterministic risk scenario reporting.",
  difficulty: "advanced",
  duration: "14 hours",
  totalXP: 400,
  tags: ["defi", "lending", "liquidation", "risk", "solana"],
  imageUrl: "/images/courses/defi-lending-risk.jpg",
  modules: [module1, module2],
};
