import type { Course, Module, Lesson, Challenge } from '@/types/content';

const createdAt = '2024-01-15T00:00:00Z';
const updatedAt = '2024-01-15T00:00:00Z';

const lesson1: Lesson = {
  id: 'lesson-1-what-is-solana',
  title: 'What is Solana?',
  slug: 'what-is-solana',
  type: 'content',
  content: `# What is Solana?

Solana is a high-performance, permissionless blockchain designed for global-scale applications. Founded by Anatoly Yakovenko in 2017 and launched in 2020, Solana addresses the blockchain trilemma—balancing decentralization, security, and scalability—through innovative architectural decisions that differentiate it from other Layer 1 blockchains.

## Proof of History: The Cryptographic Clock

At the heart of Solana lies **Proof of History (PoH)**, a novel mechanism that creates a verifiable passage of time without requiring validators to communicate with each other. PoH works by running a cryptographic hash function (SHA-256) in a sequence on a single core, using the previous output as the current input. This creates a long chain of hashes that proves time has passed between operations.

The PoH sequence looks like this:

\`\`\`
Hash 0: Start with a random value
Hash 1: SHA-256(Hash 0)
Hash 2: SHA-256(Hash 1)
Hash 3: SHA-256(Hash 2)
...and so on
\`\`\`

Because SHA-256 is deterministic, validators can verify this sequence in parallel by checking that Hash N correctly derives from Hash N-1. This creates a synchronized clock across the entire network, allowing validators to agree on the order of events without p2p communication.

## Sealevel: Parallel Transaction Execution

Solana's transaction processing engine, **Sealevel**, enables parallel execution of transactions by reading account access lists upfront. Before execution begins, Solana identifies which accounts each transaction touches and whether they are read-only or writable. Transactions that don't conflict (don't write to the same accounts) can execute simultaneously across GPU cores.

This is fundamentally different from Ethereum's EVM, which executes transactions sequentially. Sealevel's parallelization enables Solana to process **65,000+ transactions per second** with **400ms block times**—orders of magnitude faster than traditional blockchains.

## Validator Network Structure

Solana's consensus uses a **leader schedule** that rotates every 4 slots (approximately 1.6 seconds). The leader is responsible for:
- Ordering transactions
- Executing transactions
- Proposing blocks

The network operates in **slots** (400ms each) and **epochs** (432,000 slots, roughly 2 days). Validators stake SOL tokens to participate, with stake weight influencing block production probability and voting power in consensus.

## Comparison to Ethereum

| Feature | Solana | Ethereum |
|---------|--------|----------|
| Execution | Parallel (Sealevel) | Sequential (EVM) |
| Consensus | Proof of Stake + PoH | Proof of Stake |
| Block Time | ~400ms | ~12 seconds |
| TPS | 65,000+ theoretical | ~15-30 |
| State Model | Account-based with explicit data | Account-based with contract storage |

Ethereum processes one transaction at a time, reading and writing to the world state sequentially. Solana determines transaction dependencies beforehand and executes non-conflicting transactions in parallel, achieving dramatically higher throughput without sacrificing security.

Understanding these fundamental differences is essential for becoming an effective Solana developer.
`,
  xpReward: 20,
  order: 1,
  moduleId: 'module-1-getting-started',
};

const lesson2: Lesson = {
  id: 'lesson-2-accounts-model',
  title: 'The Accounts Model',
  slug: 'the-accounts-model',
  type: 'content',
  content: `# The Accounts Model

Unlike Ethereum's account model where smart contracts contain both code and storage, Solana uses a unified account model where **everything is an account**. Programs, data storage, token balances, and even system configurations are all represented as accounts. This design choice enables Solana's parallel execution and creates a clean separation between code and state.

## Account Structure

Every account on Solana contains the following fields:

\`\`\`typescript
import { AccountInfo, PublicKey } from '@solana/web3.js';

// Account structure as returned by connection.getAccountInfo()
interface AccountInfo<T> {
  /** The account's lamport balance (1 SOL = 1,000,000,000 lamports) */
  lamports: number;
  
  /** The program that owns this account and can modify it */
  owner: PublicKey;
  
  /** Raw byte array containing account data */
  data: T;
  
  /** Whether this account contains executable program code */
  executable: boolean;
  
  /** Epoch when rent was last deducted (legacy field, now mostly 0) */
  rentEpoch: bigint;
}
\`\`\`

The **owner** field is particularly important. Only the program specified as the owner can:
- Deduct lamports from the account
- Modify the account's data
- Change the account's owner (under specific conditions)

## Types of Accounts

### System Accounts
Wallet accounts owned by the **System Program** (11111111111111111111111111111111). These store SOL balances and can sign transactions. System accounts have minimal or no data fields.

### Program Accounts
Accounts marked as **executable** contain compiled BPF/SBF bytecode. Programs are stateless—their logic is immutable once deployed, but they interact with data accounts they own to maintain state. The program code itself is stored in the account's data field.

### Data Accounts
Non-executable accounts owned by programs that store application state. For example:
- Token accounts owned by the Token Program
- Program-derived addresses (PDAs) storing game state
- Metadata accounts for NFTs

## The Rent Mechanism

Historically, accounts paid periodic "rent" to remain on-chain. Today, Solana requires accounts to be **rent-exempt**—they must hold a minimum balance proportional to their data size, effectively prepaying 2 years of rent.

The rent-exempt minimum is calculated as:

\`\`\`
rent_exempt_minimum = (data_size + 128) * rent_rate
\`\`\`

For a typical token account (~165 bytes), this is approximately 0.00203928 SOL. If an account's balance drops below the rent-exempt threshold, it may be purged from the ledger.

## Program Ownership and Security

When you create an account and assign it to a program (like the Token Program), you grant that program exclusive rights to manage the account. This is why creating Associated Token Accounts requires the Token Program's involvement—the resulting account is owned by the Token Program, not your wallet.

Understanding account ownership is crucial for security. Never trust an account that claims to be a token account but isn't owned by the Token Program—this is a common attack vector in phishing attempts.
`,
  xpReward: 20,
  order: 2,
  moduleId: 'module-1-getting-started',
};

const lesson3: Lesson = {
  id: 'lesson-3-transactions-instructions',
  title: 'Transactions & Instructions',
  slug: 'transactions-and-instructions',
  type: 'content',
  content: `# Transactions & Instructions

Solana transactions are atomic operations that either succeed completely or fail entirely. Unlike Ethereum where a transaction calls a single smart contract function, Solana transactions can contain multiple instructions that execute sequentially, potentially invoking different programs in a single atomic batch.

## Transaction Anatomy

A Solana transaction consists of two main parts:

\`\`\`typescript
interface Transaction {
  /** Array of signatures, one per required signer */
  signatures: Signature[];
  
  /** The message containing all transaction details */
  message: Message;
}

interface Message {
  /** Number of required signatures, readonly accounts, etc. */
  header: MessageHeader;
  
  /** All account addresses referenced in the transaction */
  accountKeys: PublicKey[];
  
  /** Recent blockhash for transaction expiry */
  recentBlockhash: string;
  
  /** Array of instructions to execute */
  instructions: CompiledInstruction[];
}
\`\`\`

## Instructions

Each instruction specifies:

\`\`\`typescript
interface TransactionInstruction {
  /** The program to invoke */
  programId: PublicKey;
  
  /** Accounts the instruction will access */
  keys: AccountMeta[];
  
  /** Serialized instruction data */
  data: Buffer;
}

interface AccountMeta {
  pubkey: PublicKey;
  isSigner: boolean;    // Does this account need to sign?
  isWritable: boolean;  // Will this account be modified?
}
\`\`\`

## Building a Transfer Transaction

Here's how to build a simple SOL transfer:

\`\`\`typescript
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction 
} from '@solana/web3.js';

async function transferSOL(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  amountSOL: number
) {
  // Create the transfer instruction
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports: amountSOL * LAMPORTS_PER_SOL,
  });
  
  // Create a new transaction and add the instruction
  const transaction = new Transaction().add(transferInstruction);
  
  // Set the fee payer (defaults to first signer if not set)
  transaction.feePayer = sender.publicKey;
  
  // Get a recent blockhash (transactions expire after ~60 seconds)
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  
  // Sign and send the transaction
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]  // Array of signers
  );
  
  return signature;
}
\`\`\`

## Transaction Constraints

- **Size limit**: 1232 bytes maximum (MTU of IPv6 minus headers)
- **Compute budget**: 200,000 compute units default, up to 1.4M maximum
- **Expiry**: ~60-90 seconds (based on recent blockhash age)
- **Atomicity**: All instructions succeed or all fail

Compute units measure computational work. Simple transfers cost ~450 CU, while complex DeFi operations may use hundreds of thousands. You can request additional compute budget using the Compute Budget program.

Understanding these constraints is essential for designing efficient Solana applications that fit within network limits.
`,
  xpReward: 20,
  order: 3,
  moduleId: 'module-1-getting-started',
};

const lesson4: Challenge = {
  id: 'lesson-4-first-transaction',
  title: 'Your First Transaction',
  slug: 'your-first-transaction',
  type: 'challenge',
  content: `# Your First Transaction

In this challenge, you will implement a function that transfers SOL from one account to another using the Solana web3.js library. This is the most fundamental operation on Solana and forms the basis for all more complex interactions.

## Challenge

Complete the \`transferSOL\` function below. The function signature and connection setup are provided. You need to:

1. Create a transfer instruction using \`SystemProgram.transfer\`
2. Create a transaction and add the instruction
3. Set the fee payer and get a recent blockhash
4. Send the transaction and return the signature

The function should transfer the specified amount of SOL from the sender to the recipient.
`,
  xpReward: 50,
  order: 4,
  moduleId: 'module-1-getting-started',
  starterCode: `import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction 
} from '@solana/web3.js';

/**
 * Transfer SOL from sender to recipient
 * @param connection - Solana connection object
 * @param sender - Keypair of the sender (will sign and pay fees)
 * @param recipient - Public key of the recipient
 * @param amountSOL - Amount of SOL to transfer
 * @returns Transaction signature
 */
async function transferSOL(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  amountSOL: number
): Promise<string> {
  // TODO: Create the transfer instruction using SystemProgram.transfer
  // Remember to convert SOL to lamports using LAMPORTS_PER_SOL
  
  // TODO: Create a new Transaction and add the transfer instruction
  
  // TODO: Set the fee payer and get a recent blockhash
  
  // TODO: Send the transaction using sendAndConfirmTransaction
  // Don't forget to pass the sender as a signer
  
  return ''; // Replace with actual signature
}`,
  language: 'typescript',
  testCases: [
    {
      name: 'Creates transfer instruction with correct amount',
      input: '0.1 SOL',
      expectedOutput: 'Transaction includes SystemProgram.transfer with 100000000 lamports',
    },
    {
      name: 'Sets correct recipient',
      input: 'recipient pubkey',
      expectedOutput: 'Instruction accounts include recipient as writable',
    },
    {
      name: 'Transaction succeeds',
      input: 'send transaction',
      expectedOutput: 'Transaction confirmed',
    },
  ],
  hints: [
    'Use SystemProgram.transfer({ fromPubkey, toPubkey, lamports }) to create the instruction',
    'Convert SOL to lamports by multiplying by LAMPORTS_PER_SOL (1e9)',
    "Don't forget to add the instruction to the transaction using .add() before sending",
    'Use connection.getLatestBlockhash() to get a valid recent blockhash',
  ],
  solution: `import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction 
} from '@solana/web3.js';

async function transferSOL(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  amountSOL: number
): Promise<string> {
  // Create the transfer instruction
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports: amountSOL * LAMPORTS_PER_SOL,
  });
  
  // Create a new transaction and add the instruction
  const transaction = new Transaction().add(transferInstruction);
  
  // Set the fee payer and get a recent blockhash
  transaction.feePayer = sender.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  
  // Send the transaction
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );
  
  return signature;
}`,
};


const lesson5: Lesson = {
  id: 'lesson-5-programs-on-solana',
  title: 'Programs on Solana',
  slug: 'programs-on-solana',
  type: 'content',
  content: `# Programs on Solana

Programs on Solana are the equivalent of smart contracts on Ethereum, but with key architectural differences. Solana programs are stateless bytecode that operate on separate data accounts, enabling upgrades and more flexible deployment patterns than traditional smart contracts.

## BPF/SBF Bytecode Runtime

Solana programs compile to **Berkeley Packet Filter (BPF)** bytecode, specifically the Solana variant called SBF (Solana Bytecode Format). This is the same bytecode format used by Linux for kernel-space filtering, chosen because:
- It's portable across architectures
- It has a mature toolchain (via Rust and Clang)
- It supports efficient JIT compilation to native code
- The verifier ensures memory safety and deterministic execution

Programs are written in Rust (or C) and compiled to BPF target:
\`\`\`
rustc target: bpfel-unknown-unknown
\`\`\`

## Native vs On-Chain Programs

Solana has two categories of programs:

**Native Programs**: Built into the validator codebase, including:
- System Program (account creation, transfers)
- Stake Program (staking operations)
- Vote Program (validator voting)
- BPF Loader (deploying BPF programs)

**On-Chain Programs**: Deployed by users, including:
- SPL Token Program (fungible tokens)
- Associated Token Account Program
- Your custom programs built with Anchor or native Rust

## Upgrade Authority

Unlike Ethereum contracts that are immutable (unless explicitly designed with upgrade patterns), Solana programs have an **upgrade authority** that can modify the program code. This authority can be:
- A single keypair (common during development)
- A multisig (common for production protocols)
- Set to null (making the program immutable)

Upgrades work through buffer accounts—new bytecode is written to a buffer, then the loader copies it to the program account.

## Cross-Program Invocations (CPI)

Programs can call other programs through CPIs, enabling composability. Here's an example of a program invoking the Token Program:

\`\`\`rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program::invoke,
    pubkey::Pubkey,
};
use spl_token::instruction::transfer;

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Create the transfer instruction for SPL Token
    let transfer_ix = transfer(
        &spl_token::ID,           // Token program ID
        source_token_account,     // Source
        dest_token_account,       // Destination
        authority,                // Authority
        &[],                       // Signers (if PDA)
        amount,
    )?;
    
    // Invoke the token program
    invoke(
        &transfer_ix,
        &[
            source_account.clone(),
            dest_account.clone(),
            authority.clone(),
            token_program.clone(),
        ],
    )?;
    
    Ok(())
}
\`\`\`

## Program Deployment Structure

When you deploy a program, Solana creates:
1. **Program Account**: The executable account (marked executable, owned by BPF Loader)
2. **Program Data Account**: Stores the actual bytecode and upgrade authority

This separation allows the program account address to remain constant while the underlying code can be upgraded (if the upgrade authority permits it).

Understanding program architecture is essential for building composable, upgradeable protocols on Solana.
`,
  xpReward: 25,
  order: 1,
  moduleId: 'module-2-programs-and-pdas',
};

const lesson6: Lesson = {
  id: 'lesson-6-program-derived-addresses',
  title: 'Program Derived Addresses',
  slug: 'program-derived-addresses',
  type: 'content',
  content: `# Program Derived Addresses

**Program Derived Addresses (PDAs)** are one of Solana's most powerful features. They allow programs to deterministically generate addresses and sign transactions on behalf of those addresses—all without having a private key.

## Why PDAs Exist

On traditional blockchains, only accounts with private keys can sign transactions. This creates a problem: how can a program authorize an action when it doesn't have a secret key? PDAs solve this by:

1. Creating addresses that are derived from seeds (not from a public key)
2. Allowing the program that derived the address to "sign" for it

## How PDAs Work

PDAs are generated using the \`findProgramAddress\` function, which takes:
- **Seeds**: Array of byte arrays (often strings or public keys)
- **Program ID**: The program that will own this address

The function iterates through "bump" values (255 down to 0) until it finds an address that is NOT on the Ed25519 curve (meaning it has no corresponding private key).

\`\`\`typescript
import { PublicKey } from '@solana/web3.js';

// Derive a PDA for a user vault
const userPublicKey = new PublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
const programId = new PublicKey('YourProgramIdHere111111111111111111111111111');

const [pda, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from('vault'),           // Static seed
    userPublicKey.toBuffer(),       // User-specific seed
  ],
  programId
);

console.log('PDA:', pda.toBase58());
console.log('Bump:', bump); // The bump value that made this address valid
\`\`\`

## Canonical Bumps

The bump returned by \`findProgramAddress\` is the **canonical bump**—the highest valid bump (closest to 255). Using canonical bumps is recommended because:
- They're deterministic (same seeds always produce same result)
- They prevent address collision attacks
- Most programs expect canonical bumps

## Common PDA Patterns

**User Vaults**: Store user funds controlled by the program
\`\`\`
seeds = ["vault", user_pubkey]
\`\`\`

**Token Metadata**: Associate metadata with a token mint
\`\`\`
seeds = ["metadata", metadata_program_id, mint_pubkey]
\`\`\`

**Instruction Accounts**: Store instruction state
\`\`\`
seeds = ["instruction", user_pubkey, instruction_index]
\`\`\`

## Signing with PDAs

In your program, you sign CPIs with a PDA using \`invoke_signed\`:

\`\`\`rust
invoke_signed(
    &instruction,
    accounts,
    &[&[b"vault", user_pubkey.as_ref(), &[bump]]], // Seeds and bump
)?;
\`\`\`

The runtime verifies the PDA was correctly derived before allowing the signature. PDAs are fundamental to building secure, composable DeFi protocols on Solana.
`,
  xpReward: 25,
  order: 2,
  moduleId: 'module-2-programs-and-pdas',
};

const lesson7: Lesson = {
  id: 'lesson-7-spl-token-program',
  title: 'SPL Token Program',
  slug: 'spl-token-program',
  type: 'content',
  content: `# SPL Token Program

The **SPL Token Program** is Solana's standard for fungible and non-fungible tokens. It defines the interfaces and accounts for creating, minting, transferring, and managing tokens on Solana. Understanding SPL tokens is essential for any Solana developer.

## Mint Accounts

A **mint** represents a token type. Each mint account stores:

\`\`\`typescript
interface Mint {
  /** Whether the mint authority can mint new tokens */
  mintAuthority: PublicKey | null;
  
  /** Total supply of tokens */
  supply: bigint;
  
  /** Number of decimal places (0-255, usually 6 or 9) */
  decimals: number;
  
  /** Whether the token is frozen globally */
  isInitialized: boolean;
  
  /** Authority that can freeze token accounts */
  freezeAuthority: PublicKey | null;
}
\`\`\`

If \`mintAuthority\` is null, the token is fixed-supply (no more can be minted). If \`freezeAuthority\` is set, that authority can freeze any token account of this type.

## Token Accounts

While mints define token types, **token accounts** hold actual token balances. Unlike Ethereum where your wallet directly holds ERC-20 balances, Solana uses separate token accounts:

\`\`\`typescript
interface TokenAccount {
  /** The mint this account holds */
  mint: PublicKey;
  
  /** The owner of this token account */
  owner: PublicKey;
  
  /** Amount of tokens held */
  amount: bigint;
  
  /** The delegate authority (if any) */
  delegate: PublicKey | null;
  
  /** Delegated amount */
  delegatedAmount: bigint;
  
  /** Whether this account is frozen */
  isFrozen: boolean;
}
\`\`\`

## Associated Token Accounts (ATA)

ATAs provide deterministic token account addresses. Given a wallet and a mint, the ATA address is always the same:

\`\`\`typescript
import { getAssociatedTokenAddress } from '@solana/spl-token';

const ata = await getAssociatedTokenAddress(
  mint,           // Token mint
  wallet          // Owner wallet
);
\`\`\`

The ATA is derived as a PDA with seeds: \`[wallet, token_program, mint]\`

## Creating an ATA

\`\`\`typescript
import {
  getOrCreateAssociatedTokenAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,           // Connection
  payer,                // Keypair paying for creation
  mint,                 // Token mint
  wallet                // Wallet that will own the ATA
);

console.log('ATA Address:', tokenAccount.address.toBase58());
console.log('Current Balance:', tokenAccount.amount.toString());
\`\`\`

## Token-2022 Extensions

Token-2022 is a new program (program ID: \`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb\`) that adds extensions:

- **Transfer Fees**: Charge fees on token transfers
- **Interest-Bearing Tokens**: Tokens that accrue interest over time
- **Non-Transferable**: Soulbound tokens that can't be transferred
- **Metadata**: On-chain metadata for tokens
- **Permanent Delegate**: Delegates that can't be revoked

These extensions are opt-in and provide functionality similar to ERC-1400 security tokens but with better composability.

Mastering SPL tokens is essential for building DeFi applications, NFT marketplaces, and any application involving value transfer on Solana.
`,
  xpReward: 25,
  order: 3,
  moduleId: 'module-2-programs-and-pdas',
};

const lesson8: Challenge = {
  id: 'lesson-8-create-a-token',
  title: 'Create a Token',
  slug: 'create-a-token',
  type: 'challenge',
  content: `# Create a Token

In this challenge, you will create your own SPL token. You'll mint a new token, create an associated token account to hold it, and mint tokens to yourself. This is the foundation of building token-based applications on Solana.

## Challenge

Complete the \`createTokenAndMint\` function. The connection and payer are already set up. You need to:

1. Create a new token mint using \`createMint\`
2. Create an associated token account for the payer using \`getOrCreateAssociatedTokenAccount\`
3. Mint tokens to the associated token account using \`mintTo\`

The function should return an object containing the mint address and the associated token account address.
`,
  xpReward: 100,
  order: 4,
  moduleId: 'module-2-programs-and-pdas',
  starterCode: `import {
  Connection,
  Keypair,
  PublicKey,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

/**
 * Create a new token, create an ATA for the payer, and mint initial supply
 * @param connection - Solana connection object
 * @param payer - Keypair paying for transactions and mint authority
 * @param decimals - Number of decimals for the token (e.g., 9 for SOL-like)
 * @param initialSupply - Amount to mint (in smallest units, not adjusted for decimals)
 * @returns Object with mint and ATA addresses
 */
async function createTokenAndMint(
  connection: Connection,
  payer: Keypair,
  decimals: number,
  initialSupply: number
): Promise<{ mint: PublicKey; associatedTokenAccount: PublicKey }> {
  // TODO: Create a new mint using createMint()
  // Use payer as the mint authority
  
  // TODO: Create an associated token account for the payer
  // Use getOrCreateAssociatedTokenAccount()
  
  // TODO: Mint initialSupply tokens to the associated token account
  // Use mintTo() with payer as the mint authority
  
  // TODO: Return the mint address and ATA address
  return {
    mint: new PublicKey('11111111111111111111111111111111'),
    associatedTokenAccount: new PublicKey('11111111111111111111111111111111'),
  };
}`,
  language: 'typescript',
  testCases: [
    {
      name: 'Creates mint with correct decimals',
      input: 'decimals: 9',
      expectedOutput: 'Mint created with 9 decimals',
    },
    {
      name: 'Creates ATA for payer',
      input: 'payer pubkey',
      expectedOutput: 'ATA created and owned by payer',
    },
    {
      name: 'Mints correct initial supply',
      input: '1000000000',
      expectedOutput: 'ATA balance equals initialSupply',
    },
  ],
  hints: [
    'Use createMint(connection, payer, payer.publicKey, null, decimals) to create the mint',
    'Use getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey) for the ATA',
    'Use mintTo(connection, payer, mint, associatedTokenAccount.address, payer, initialSupply) to mint',
    'Make sure to await all async operations',
  ],
  solution: `import {
  Connection,
  Keypair,
  PublicKey,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

async function createTokenAndMint(
  connection: Connection,
  payer: Keypair,
  decimals: number,
  initialSupply: number
): Promise<{ mint: PublicKey; associatedTokenAccount: PublicKey }> {
  // Create a new mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,  // Mint authority
    null,             // Freeze authority (none)
    decimals
  );
  
  // Create an associated token account for the payer
  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  
  // Mint initial supply to the ATA
  await mintTo(
    connection,
    payer,
    mint,
    associatedTokenAccount.address,
    payer,  // Mint authority
    initialSupply
  );
  
  return {
    mint,
    associatedTokenAccount: associatedTokenAccount.address,
  };
}`,
};


const module1: Module = {
  id: 'module-1-getting-started',
  title: 'Getting Started',
  order: 1,
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: 'module-2-programs-and-pdas',
  title: 'Programs & PDAs',
  order: 2,
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaFundamentalsCourse: Course = {
  id: 'course-solana-fundamentals',
  title: 'Solana Fundamentals',
  slug: 'solana-fundamentals',
  description:
    'Master the core concepts of Solana blockchain development. Learn about Proof of History, the accounts model, transactions, programs, and PDAs through hands-on lessons and coding challenges.',
  difficulty: 'beginner',
  duration: '8 hours',
  totalXP: 285,
  thumbnailUrl: '/images/courses/solana-fundamentals.jpg',
  instructor: {
    name: 'Superteam Academy',
    avatarUrl: '/images/instructors/default.svg',
    bio: 'Official Superteam Brazil education content',
  },
  modules: [module1, module2],
  tags: ['solana', 'blockchain', 'web3', 'fundamentals'],
  language: 'en',
  createdAt,
  updatedAt,
};
