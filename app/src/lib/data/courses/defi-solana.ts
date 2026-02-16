import type { Course, Module, Lesson, Challenge } from '@/types/content';

const createdAt = '2024-03-01T00:00:00Z';
const updatedAt = '2024-03-01T00:00:00Z';

const lesson1: Lesson = {
  id: 'lesson-1-token-swaps-amms',
  title: 'Token Swaps & AMMs',
  slug: 'token-swaps-and-amms',
  type: 'content',
  content: `# Token Swaps & AMMs

Automated Market Makers (AMMs) form the foundation of DeFi trading. Unlike traditional orderbook exchanges, AMMs use mathematical formulas to price assets and enable permissionless trading without requiring buyers and sellers to match.

## The Constant Product Formula

The most common AMM model uses the constant product formula: **x * y = k**

Where:
- **x**: Reserve of token A
- **y**: Reserve of token B
- **k**: Constant product (invariant)

When a trader swaps token A for token B, the product x*y must remain constant (excluding fees). This creates the price curve where larger trades have higher price impact.

Price calculation example:
\`\`\`
Pool: 1000 SOL + 20000 USDC (k = 20,000,000)
Trader wants to swap 10 SOL for USDC

New SOL reserve: 1000 + 10 = 1010
New USDC reserve: k / 1010 = 19,801.98
USDC received: 20,000 - 19,801.98 = 198.02

Effective price: 198.02 / 10 = 19.802 USDC/SOL
Spot price before: 20,000 / 1000 = 20 USDC/SOL
\`\`\`

## Liquidity Pools

Users deposit token pairs into liquidity pools and receive LP tokens representing their share:

\`\`\`typescript
// Calculate LP tokens minted for deposit
const lpTokens = Math.min(
  (tokenA_Amount * totalLpSupply) / poolTokenA_Reserve,
  (tokenB_Amount * totalLpSupply) / poolTokenB_Reserve
);
\`\`\`

LP providers earn fees (typically 0.3% per trade) proportional to their share but face **impermanent loss**—the opportunity cost of providing liquidity versus holding tokens.

## Concentrated Liquidity (CLMM)

Orca and Raydium V4 implement concentrated liquidity where LPs specify price ranges. Instead of spreading liquidity across all prices (0 to infinity), LPs concentrate capital where trading happens most:

- Higher capital efficiency (10-100x)
- Custom price ranges
- Multiple positions per LP
- Trading fees only earned within the active range

## MEV on Solana

Maximum Extractable Value (MEV) includes:

**Sandwich Attacks**: Attacker sees large pending swap, front-runs with buy, victim executes at worse price, attacker back-sells for profit.

**Jito Bundles**: Solana's MEV solution bundles transactions atomically, ensuring fair ordering and protecting users from sandwich attacks.

## Slippage & Price Impact

- **Price Impact**: How much the trade moves the pool price (inherent to AMM math)
- **Slippage Tolerance**: Maximum acceptable price movement between quote and execution (typically 0.5-1%)

Understanding these mechanics is essential for building trading interfaces that protect users from excessive losses.
`,
  xpReward: 30,
  order: 1,
  moduleId: 'module-1-defi-primitives',
};

const lesson2: Lesson = {
  id: 'lesson-2-lending-protocols',
  title: 'Lending Protocols',
  slug: 'lending-protocols',
  type: 'content',
  content: `# Lending Protocols

Lending protocols enable users to supply assets for yield or borrow assets against collateral. Solana's high throughput makes lending operations efficient and composable across the DeFi ecosystem.

## Overcollateralized Lending Model

Unlike traditional lending, DeFi loans require collateral worth more than the borrowed amount:

**Example Flow:**
1. User deposits 100 SOL worth \$10,000 as collateral
2. Protocol allows borrowing up to 70% LTV (Loan-to-Value) = \$7,000
3. User borrows 7,000 USDC
4. User must repay USDC + interest to reclaim SOL

## Interest Rate Curves

Borrowing costs follow utilization-based curves:

\`\`\`
Utilization = Total Borrowed / Total Supplied
Borrow APY = Base Rate + (Multiplier * Utilization)
\`\`\`

At low utilization (few borrowers), rates are low to attract borrowing. At high utilization, rates spike to attract suppliers and prevent bank runs. Solend and Kamino use dynamic curves that adjust based on market conditions.

## Health Factor & Liquidation

The **Health Factor** measures position safety:

\`\`\`
Health Factor = (Collateral Value * Liquidation Threshold) / Borrowed Value
Health Factor < 1.0 → Position eligible for liquidation
\`\`\`

**Liquidation Mechanics:**
- Liquidators repay a portion of the debt
- They receive collateral at a discount (liquidation bonus, typically 5-10%)
- This incentivizes liquidators to monitor and close risky positions
- Liquidation threshold is typically lower than max LTV to create a safety buffer

## Flash Loans

Solana supports flash loans—borrow assets without collateral, use them in same transaction, repay plus fee. If not repaid, transaction reverts atomically. Common uses:

- Arbitrage between DEXs
- Collateral swapping
- Self-liquidation
- Yield farming optimization

## Protocol Comparison

| Protocol | Max LTV | Liquidation Bonus | Unique Features |
|----------|---------|-------------------|-----------------|
| Solend | 75% | 5% | Isolated pools, mSOL rewards |
| MarginFi | 80% | 2.5% | Native yield bearing deposits |
| Kamino | 85% | 5% | Automated vault strategies |

Lending protocol integration requires careful monitoring of health factors and liquidation risks.
`,
  xpReward: 30,
  order: 2,
  moduleId: 'module-1-defi-primitives',
};

const lesson3: Lesson = {
  id: 'lesson-3-oracles-price-feeds',
  title: 'Oracles & Price Feeds',
  slug: 'oracles-and-price-feeds',
  type: 'content',
  content: `# Oracles & Price Feeds

DeFi protocols need accurate price data to determine collateral values, liquidations, and swap rates. Blockchains cannot natively access external market data—this is the **oracle problem** that Pyth and Switchboard solve.

## Why DeFi Needs Oracles

Without external price feeds:
- Lending protocols cannot value collateral
- AMMs cannot detect arbitrage opportunities
- Perpetual exchanges cannot mark positions to market
- Stablecoins cannot maintain pegs

On-chain manipulation is trivial (single large trade), so protocols rely on off-chain oracle networks.

## Pyth Network (Pull Oracle)

Pyth uses a **pull model** where protocols request prices when needed rather than having prices pushed continuously.

**Price Account Structure:**
\`\`\`typescript
interface PriceData {
  price: bigint;        // Current price (integer representation)
  confidence: bigint;   // Uncertainty range (95% confidence)
  exponent: number;     // Price = price * 10^exponent
  status: number;       // 1=trading, 2=auction, 3=halted
  publishTime: bigint;  // Unix timestamp of last update
}
\`\`\`

**Using @pythnetwork/price-service-client:**

\`\`\`typescript
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { PublicKey } from '@solana/web3.js';

const connection = new PriceServiceConnection('https://hermes.pyth.network');

// SOL/USD price feed ID
const SOL_PRICE_FEED_ID = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

async function getSolPrice() {
  const priceFeeds = await connection.getLatestPriceFeeds([SOL_PRICE_FEED_ID]);
  const feed = priceFeeds[0];
  
  const price = feed.getPriceUnchecked();
  const readablePrice = Number(price.price) * Math.pow(10, price.exponent);
  const confidence = Number(price.confidence) * Math.pow(10, price.exponent);
  
  console.log(\`SOL/USD: \$\${readablePrice} ± \$\${confidence}\`);
  
  // Check confidence interval
  if (confidence / readablePrice > 0.01) { // >1% uncertainty
    console.warn('High price uncertainty!');
  }
  
  return { price: readablePrice, confidence };
}
\`\`\`

## Switchboard (Push Oracle)

Switchboard uses a **push model** where oracles continuously update on-chain:

- **Oracle Queues**: Validators stake tokens and run oracle software
- **Aggregators**: Combine multiple data sources (CEX, DEX, aggregators)
- **VRF**: Verifiable Random Function for on-chain randomness

## Oracle Attacks & Mitigations

**Flash Loan Manipulation**: Attacker borrows millions to manipulate on-chain price for single block.
**Mitigation**: Use time-weighted average prices (TWAP), multi-source aggregation.

**Outdated Prices**: Stale data during volatility.
**Mitigation**: Confidence intervals, max staleness checks.

**Single Source Failure**: One exchange glitching.
**Mitigation**: Pyth aggregates 40+ sources, Switchboard uses multiple oracles.

## Best Practices

- Always check confidence intervals
- Implement circuit breakers for extreme deviations
- Use multiple oracle providers for critical systems
- Validate price freshness with publishTime
`,
  xpReward: 30,
  order: 3,
  moduleId: 'module-1-defi-primitives',
};


const lesson4: Lesson = {
  id: 'lesson-4-integrating-jupiter',
  title: 'Integrating Jupiter',
  slug: 'integrating-jupiter',
  type: 'content',
  content: `# Integrating Jupiter

Jupiter is Solana's premier DEX aggregator, routing trades across all major liquidity sources to find the best prices. The Jupiter v6 API provides programmatic access to swap routing for dApp integrations.

## Jupiter API Overview

**Base URL**: \`https://quote-api.jup.ag/v6\`

The swap flow has two steps:
1. **Quote**: Get route information (price, slippage, route)
2. **Swap**: Get transaction for user to sign and send

## Getting a Quote

**GET /quote** endpoint parameters:

\`\`\`typescript
interface QuoteParams {
  inputMint: string;      // Token to sell (e.g., SOL mint)
  outputMint: string;     // Token to buy (e.g., USDC mint)
  amount: string;         // Amount in input token's smallest unit (lamports)
  slippageBps: number;    // Slippage tolerance in basis points (50 = 0.5%)
  onlyDirectRoutes?: boolean; // Skip intermediate hops
  asLegacyTransaction?: boolean; // Use legacy vs versioned tx
  platformFeeBps?: number;  // Platform fee (e.g., 25 = 0.25%)
}
\`\`\`

**Quote Response:**

\`\`\`typescript
interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string; // Min out with slippage
  swapMode: 'ExactIn' | 'ExactOut';
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;  // e.g., "Raydium", "Orca"
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
}
\`\`\`

## Complete Swap Flow

\`\`\`typescript
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function executeSwap(
  wallet: WalletContextState,
  connection: Connection,
  amountLamports: number
) {
  // Step 1: Get quote
  const quoteParams = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint: USDC_MINT,
    amount: amountLamports.toString(),
    slippageBps: '50', // 0.5%
  });

  const quoteRes = await fetch(\`\${JUPITER_QUOTE_API}?\${quoteParams}\`);
  const quote: QuoteResponse = await quoteRes.json();

  console.log('Expected output:', quote.outAmount);
  console.log('Price impact:', quote.priceImpactPct, '%');
  console.log('Route:', quote.routePlan.map(r => r.swapInfo.label).join(' -> '));

  // Step 2: Get swap transaction
  const swapBody = {
    quoteResponse: quote,
    userPublicKey: wallet.publicKey!.toBase58(),
    wrapAndUnwrapSol: true, // Auto-wrap/unwrap SOL
    feeAccount: undefined,  // Set if collecting platform fees
  };

  const swapRes = await fetch(JUPITER_SWAP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(swapBody),
  });

  const { swapTransaction } = await swapRes.json();

  // Step 3: Deserialize and sign
  const transaction = VersionedTransaction.deserialize(
    Buffer.from(swapTransaction, 'base64')
  );

  const signed = await wallet.signTransaction!(transaction);

  // Step 4: Send and confirm
  const signature = await connection.sendTransaction(signed, {
    maxRetries: 3,
    skipPreflight: false,
  });

  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
}
\`\`\`

## Jupiter SDK

For React apps, use the official SDK:

\`\`\`bash
npm install @jup-ag/react-hook
\`\`\`

\`\`\`typescript
import { useJupiter } from '@jup-ag/react-hook';

function SwapComponent() {
  const { routeMap, getQuote, executeSwap } = useJupiter({
    connection,
    routeCacheDuration: 10000, // Cache routes for 10s
  });

  // Get available input tokens
  const inputTokens = routeMap.getInputTokens();
}
\`\`\`

## Advanced Features

**Strict Token List**: Filter to validated tokens only:
\`\`\`
strictTokenList=true
\`\`\`

**Direct Routes Only**: Skip intermediate swaps:
\`\`\`
onlyDirectRoutes=true
\`\`\`

Jupiter's aggregation provides better prices than any single DEX, making it essential for DeFi applications.
`,
  xpReward: 35,
  order: 1,
  moduleId: 'module-2-building-defi',
};

const lesson5: Lesson = {
  id: 'lesson-5-building-a-vault',
  title: 'Building a Vault',
  slug: 'building-a-vault',
  type: 'content',
  content: `# Building a Vault

Vaults are smart contracts that accept deposits, issue share tokens, and deploy capital into yield strategies. They're the foundation of yield aggregators like Kamino and Tulip.

## Vault Architecture

**Core Components:**

\`\`\`rust
#[account]
pub struct Vault {
    pub authority: Pubkey,           // Admin address
    pub token_mint: Pubkey,          // Underlying asset (e.g., USDC)
    pub share_mint: Pubkey,          // Vault share token (e.g., vUSDC)
    pub total_deposits: u64,         // Total assets under management
    pub total_shares: u64,           // Total share token supply
    pub strategies: Vec<Pubkey>,     // Approved strategy accounts
    pub performance_fee_bps: u16,    // Fee on yield (e.g., 1000 = 10%)
    pub management_fee_bps: u16,     // Annual fee on AUM (e.g., 100 = 1%)
    pub bump: u8,
}

#[account]
pub struct Strategy {
    pub vault: Pubkey,
    pub protocol: String,           // e.g., "Solend", "Raydium"
    pub allocation_bps: u16,        // Percentage of funds (10000 = 100%)
    pub total_deposited: u64,
    pub is_active: bool,
}
\`\`\`

## Deposit Flow

When users deposit, the vault:
1. Transfers tokens from user to vault
2. Calculates shares to mint: \`shares = deposit_amount * total_shares / total_deposits\`
3. Mints share tokens to user
4. Updates total_deposits

\`\`\`rust
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let user_shares = &mut ctx.accounts.user_shares;
    
    // Transfer tokens to vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;
    
    // Calculate shares
    let shares_to_mint = if vault.total_shares == 0 {
        amount // First deposit gets 1:1 shares
    } else {
        amount.checked_mul(vault.total_shares)
            .unwrap()
            .checked_div(vault.total_deposits)
            .unwrap()
    };
    
    // Mint share tokens
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.share_mint.to_account_info(),
                to: user_shares.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            &[&[b"vault", vault.token_mint.as_ref(), &[vault.bump]]],
        ),
        shares_to_mint,
    )?;
    
    vault.total_deposits = vault.total_deposits.checked_add(amount).unwrap();
    vault.total_shares = vault.total_shares.checked_add(shares_to_mint).unwrap();
    
    Ok(())
}
\`\`\`

## Share Price Calculation

Share price represents the value of one share in underlying tokens:

\`\`\`
Share Price = Total Assets / Total Shares

Example:
- Vault has 10,000 USDC
- 9,000 shares outstanding
- Share price = 1.111 USDC per share

User redeems 100 shares → receives 111.11 USDC
\`\`\`

## Withdraw Flow

1. Burn user's share tokens
2. Calculate redemption: \`amount = shares * total_deposits / total_shares\`
3. Withdraw from strategies (may involve strategy-specific logic)
4. Transfer tokens to user

## Fee Structure

**Management Fee**: Charged on AUM annually
\`\`\`rust
let management_fee = vault.total_deposits
    .checked_mul(vault.management_fee_bps)
    .unwrap()
    .checked_div(10000)
    .unwrap()
    .checked_div(365) // Daily accrual
    .unwrap();
\`\`\`

**Performance Fee**: Charged on yield
\`\`\`rust
let yield_earned = current_value - previous_value;
let performance_fee = yield_earned
    .checked_mul(vault.performance_fee_bps)
    .unwrap()
    .checked_div(10000)
    .unwrap();
\`\`\`

## Security Considerations

- **Reentrancy**: Use checks-effects-interactions pattern
- **Oracle Dependency**: Use multiple price sources
- **Access Control**: Restrict strategy management to multisig
- **Emergency Pause**: Circuit breaker for extreme conditions

Vaults abstract yield complexity from users while taking fees for management—a sustainable DeFi business model.
`,
  xpReward: 35,
  order: 2,
  moduleId: 'module-2-building-defi',
};

const lesson6: Challenge = {
  id: 'lesson-6-build-a-swap-ui',
  title: 'Build a Swap UI',
  slug: 'build-a-swap-ui',
  type: 'challenge',
  content: `# Build a Swap UI

In this challenge, you will build a complete swap interface using Jupiter's v6 API. The component will allow users to swap SOL for USDC with real-time quotes and transaction execution.

## Challenge

Complete the SwapComponent below. The wallet connection and basic UI structure are provided. You need to:

1. Call Jupiter /quote API when the user enters an amount
2. Display the quote information (expected output, price impact, route)
3. Call /swap endpoint to get the transaction
4. Sign and send the transaction using the wallet

## Requirements

- Handle loading states during API calls
- Display human-readable amounts (not raw lamports)
- Show error messages if the swap fails
- Display a link to the transaction on Solana Explorer after success
`,
  xpReward: 150,
  order: 3,
  moduleId: 'module-2-building-defi',
  starterCode: `import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState, useCallback } from 'react';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function SwapComponent() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // TODO: Fetch quote from Jupiter when amount changes
  const fetchQuote = useCallback(async (solAmount: string) => {
    // Convert SOL to lamports
    // Call Jupiter /quote API
    // Set quote state
  }, []);

  // TODO: Execute the swap
  const executeSwap = async () => {
    if (!quote || !publicKey || !signTransaction) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call Jupiter /swap API with quoteResponse and userPublicKey
      // Deserialize the transaction (VersionedTransaction.deserialize)
      // Sign the transaction
      // Send and confirm
      // Set txSignature for success display
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return <p>Connect wallet to swap</p>;
  }

  return (
    <div className="swap-container">
      <h2>Swap SOL → USDC</h2>
      
      <div>
        <input
          type="number"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            fetchQuote(e.target.value);
          }}
        />
      </div>

      {quote && (
        <div className="quote-info">
          {/* TODO: Display quote details */}
          {/* Show expected USDC output */}
          {/* Show price impact */}
          {/* Show route info */}
        </div>
      )}

      <button 
        onClick={executeSwap} 
        disabled={!quote || loading}
      >
        {loading ? 'Swapping...' : 'Swap'}
      </button>

      {error && <p className="error">{error}</p>}
      
      {txSignature && (
        <a 
          href={\`https://explorer.solana.com/tx/\${txSignature}?cluster=devnet\`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
}

interface QuoteResponse {
  outAmount: string;
  priceImpactPct: string;
  routePlan: Array<{ swapInfo: { label: string } }>;
}`,
  language: 'typescript',
  testCases: [
    {
      name: 'Fetches quote correctly',
      input: 'amount: 1 SOL',
      expectedOutput: 'quote.outAmount is set with expected USDC',
    },
    {
      name: 'Displays swap details',
      input: 'valid quote',
      expectedOutput: 'price impact and route are shown',
    },
    {
      name: 'Handles errors gracefully',
      input: 'invalid amount or network error',
      expectedOutput: 'error message displayed to user',
    },
  ],
  hints: [
    'Convert SOL to lamports: Number(solAmount) * LAMPORTS_PER_SOL',
    'Jupiter quote URL: \`\${JUPITER_QUOTE_API}?inputMint=\${SOL_MINT}&outputMint=\${USDC_MINT}&amount=\${lamports}&slippageBps=50\`',
    'Deserialize swap transaction: VersionedTransaction.deserialize(Buffer.from(swapTransaction, \'base64\'))',
    'Always set slippageBps (50 = 0.5% slippage tolerance)',
    'Convert output amount from USDC (6 decimals): (Number(quote.outAmount) / 1e6).toFixed(2)',
  ],
  solution: `import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState, useCallback } from 'react';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function SwapComponent() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const fetchQuote = useCallback(async (solAmount: string) => {
    if (!solAmount || Number(solAmount) <= 0) {
      setQuote(null);
      return;
    }
    
    try {
      const lamports = Math.floor(Number(solAmount) * LAMPORTS_PER_SOL);
      const params = new URLSearchParams({
        inputMint: SOL_MINT,
        outputMint: USDC_MINT,
        amount: lamports.toString(),
        slippageBps: '50',
      });
      
      const response = await fetch(\`\${JUPITER_QUOTE_API}?\${params}\`);
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      console.error('Quote error:', err);
      setQuote(null);
    }
  }, []);

  const executeSwap = async () => {
    if (!quote || !publicKey || !signTransaction) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get swap transaction
      const response = await fetch(JUPITER_SWAP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          wrapAndUnwrapSol: true,
        }),
      });
      
      const { swapTransaction } = await response.json();
      
      // Deserialize and sign
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(swapTransaction, 'base64')
      );
      
      const signed = await signTransaction(transaction);
      
      // Send transaction
      const signature = await connection.sendTransaction(signed, {
        maxRetries: 3,
      });
      
      await connection.confirmTransaction(signature, 'confirmed');
      setTxSignature(signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return <p>Connect wallet to swap</p>;
  }

  const expectedOutput = quote 
    ? (Number(quote.outAmount) / 1e6).toFixed(2)
    : null;

  return (
    <div className="swap-container">
      <h2>Swap SOL → USDC</h2>
      
      <div>
        <input
          type="number"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            fetchQuote(e.target.value);
          }}
        />
      </div>

      {quote && expectedOutput && (
        <div className="quote-info">
          <p>Expected output: {expectedOutput} USDC</p>
          <p>Price impact: {Number(quote.priceImpactPct).toFixed(4)}%</p>
          <p>Route: {quote.routePlan.map(r => r.swapInfo.label).join(' → ')}</p>
        </div>
      )}

      <button 
        onClick={executeSwap} 
        disabled={!quote || loading}
      >
        {loading ? 'Swapping...' : 'Swap'}
      </button>

      {error && <p className="error">{error}</p>}
      
      {txSignature && (
        <a 
          href={\`https://explorer.solana.com/tx/\${txSignature}?cluster=devnet\`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
}

interface QuoteResponse {
  outAmount: string;
  priceImpactPct: string;
  routePlan: Array<{ swapInfo: { label: string } }>;
}`,
};


const module1: Module = {
  id: 'module-1-defi-primitives',
  title: 'DeFi Primitives',
  order: 1,
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-2-building-defi',
  title: 'Building DeFi',
  order: 2,
  lessons: [lesson4, lesson5, lesson6],
};

export const defiSolanaCourse: Course = {
  id: 'course-defi-solana',
  title: 'DeFi on Solana',
  slug: 'defi-solana',
  description:
    'Understand and build DeFi applications on Solana. Learn about AMMs, lending, oracles, Jupiter integration, and vault program design.',
  difficulty: 'advanced',
  duration: '12 hours',
  totalXP: 310,
  thumbnailUrl: '/images/courses/defi-solana.jpg',
  instructor: {
    name: 'Superteam Academy',
    avatarUrl: '/images/instructors/default.svg',
    bio: 'Official Superteam Brazil education content',
  },
  modules: [module1, module2],
  tags: ['defi', 'jupiter', 'trading', 'advanced'],
  language: 'en',
  createdAt,
  updatedAt,
};
