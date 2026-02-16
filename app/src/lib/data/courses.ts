import type { Course, Lesson, LessonContext } from "@/types";

export const COURSES: Course[] = [
  // ============================================================================
  // COURSE 1: Solana Fundamentals
  // ============================================================================
  {
    id: "course-sf",
    slug: "solana-fundamentals",
    title: "Solana Fundamentals",
    description: "Master the fundamentals of Solana blockchain development. Learn accounts, transactions, programs, and build your first applications on the world's fastest blockchain.",
    thumbnail: "/images/courses/solana-fundamentals.jpg",
    difficulty: "beginner",
    durationMinutes: 480,
    totalXP: 2000,
    trackId: "track-foundations",
    tags: ["solana", "web3.js", "beginner", "typescript"],
    instructorName: "Superteam Brazil",
    instructorAvatar: "/images/instructors/superteam.jpg",
    enrolledCount: 3200,
    publishedAt: "2024-01-15T00:00:00Z",
    modules: [
      {
        id: "mod-sf-1",
        title: "Getting Started",
        description: "Introduction to Solana's architecture and core concepts",
        order: 1,
        lessons: [
          {
            id: "les-1",
            title: "What is Solana?",
            description: "Understanding Solana's unique architecture and consensus mechanism",
            type: "content",
            order: 1,
            xpReward: 50,
            durationMinutes: 20,
            content: `# What is Solana?

Solana is a high-performance, permissionless blockchain designed for global adoption. Founded by Anatoly Yakovenko in 2017, Solana addresses the blockchain trilemma—balancing decentralization, security, and scalability—through innovative architectural decisions.

## Proof of History (PoH)

Unlike traditional blockchains that rely solely on timestamps, Solana introduces **Proof of History**, a cryptographic clock that enables nodes to agree on the order of events without communicating with each other. PoH works by running a sequential hash function (SHA-256) continuously, using the previous output as the next input. This creates a verifiable timeline of events that validators can reference.

The key innovation is that PoH allows validators to **parallelize transaction processing**. Because the historical record proves the order of events, validators can execute transactions ahead of time and verify them later, dramatically increasing throughput.

## Parallel Execution with Sealevel

Solana's transaction processing engine, **Sealevel**, is the world's first parallel smart contract runtime. While Ethereum processes transactions sequentially, Solana identifies transactions that don't conflict (don't touch the same accounts) and executes them simultaneously across GPU cores.

This parallelization enables Solana to process **65,000+ transactions per second** with 400ms block times—orders of magnitude faster than traditional blockchains.

## Tower BFT Consensus

Solana uses **Tower Byzantine Fault Tolerance**, a consensus mechanism optimized for PoH. Validators stake SOL tokens to participate in block production. When validators vote on a block, they "lock out" from voting on conflicting chains for a period, creating a cryptographic commitment that makes finality extremely fast—typically within 12 seconds (32 confirmations).

## Gulf Stream: Mempool-less Transaction Forwarding

Traditional blockchains use mempools (transaction pools) where pending transactions wait. Solana's **Gulf Stream** forwards transactions directly to validators before the current block is finalized. This allows validators to start processing transactions early, reducing confirmation times and enabling extremely high throughput.

## Why Build on Solana?

- **Low costs**: Transactions cost fractions of a penny ($0.00025 average)
- **Fast finality**: Sub-second confirmation for most transactions
- **Growing ecosystem**: Thousands of applications and millions of users
- **Energy efficient**: Proof of Stake with minimal environmental impact
- **Developer friendly**: Robust tooling, extensive documentation, and active community`,
          },
          {
            id: "les-2",
            title: "Accounts Model",
            description: "Deep dive into Solana's account-based storage system",
            type: "content",
            order: 2,
            xpReward: 50,
            durationMinutes: 25,
            content: `# Accounts Model

Solana uses an **account-based model** that differs significantly from Ethereum's account model. Everything on Solana—wallet balances, program code, program state, and even data storage—is stored in accounts.

## Account Structure

Every account on Solana has the following structure:

- **Address (Pubkey)**: A 32-byte public key that uniquely identifies the account
- **Lamports**: The account's balance in lamports (1 SOL = 1,000,000,000 lamports)
- **Data**: A byte array that can store arbitrary data (up to 10MB)
- **Owner**: The program that has authority to modify the account
- **Executable**: A boolean indicating if this account contains program code
- **Rent Epoch**: Tracks when rent was last paid (legacy field, rent now burned)

## Types of Accounts

### System Accounts
Wallet accounts owned by the **System Program**. These store SOL balances and can sign transactions. System accounts have no data field (or minimal data).

### Program Accounts
Accounts marked as **executable** contain compiled program code (BPF bytecode). Programs are stateless—their code is immutable once deployed, but they can read/write to other accounts they own.

### Data Accounts
Non-executable accounts owned by programs that store application state. For example:
- Token accounts (owned by the Token Program)
- Program-derived addresses (PDAs)
- Custom data storage for your applications

## Rent and Rent Exemption

Historically, accounts had to pay "rent" to remain on-chain. Today, accounts must be **rent-exempt**—they must hold a minimum balance proportional to their data size. This minimum is calculated as:

\`\`\`
rent_exempt_minimum = (data_size + 128) * rent_rate
\`\`\`

For a typical token account (~165 bytes), this is approximately 0.00203928 SOL.

## Program Ownership

The **owner** field is critical for security. Only the owner program can:
- Deduct lamports from the account
- Modify the account's data
- Change the account's owner (rare)

When you create an account and assign it to a program (like the Token Program), you're giving that program exclusive rights to manage that account. This is why you need to create "Associated Token Accounts"—accounts owned by the Token Program that hold your tokens.

## Cross-Program Invocation (CPI)

Programs can call other programs through CPIs. When Program A calls Program B, Program B receives Program A as the signer (unless using PDA signatures). This enables composability—you can build protocols that interact with Serum, Mango, or any other Solana program.`,
          },
          {
            id: "les-3",
            title: "Your First Transaction",
            description: "Write code to transfer SOL between accounts",
            type: "challenge",
            order: 3,
            xpReward: 150,
            durationMinutes: 45,
            content: `# Your First Transaction Challenge

In this challenge, you'll implement a function that transfers SOL from one account to another using \`@solana/web3.js\`.

## Requirements

Implement \`transferSol\` that:
1. Creates a transfer instruction using SystemProgram.transfer
2. Creates a transaction with the instruction
3. Sets the fee payer
4. Signs and sends the transaction
5. Returns the transaction signature
`,
            challenge: {
              language: "typescript",
              instructions: "Implement the transferSol function that transfers lamports from the sender to the recipient. Use the provided connection to send the transaction.",
              starterCode: `import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";

async function transferSol(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  lamports: number
): Promise<string> {
  // TODO: Create transfer instruction
  
  // TODO: Create transaction and add instruction
  
  // TODO: Set fee payer and sign
  
  // TODO: Send and return signature
  return "";
}`,
              solutionCode: `import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";

async function transferSol(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  lamports: number
): Promise<string> {
  // Create transfer instruction
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports,
  });
  
  // Create transaction and add instruction
  const transaction = new Transaction().add(transferInstruction);
  
  // Set fee payer and sign
  transaction.feePayer = sender.publicKey;
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  
  // Sign transaction
  transaction.sign(sender);
  
  // Send raw transaction
  const signature = await connection.sendRawTransaction(transaction.serialize());
  
  return signature;
}`,
              testCases: [
                { id: "t1", name: "Transfers 1 SOL", input: "[1000000000]", expectedOutput: "signature", hidden: true },
                { id: "t2", name: "Transfers 0.5 SOL", input: "[500000000]", expectedOutput: "signature", hidden: true },
                { id: "t3", name: "Transfers small amount", input: "[1000]", expectedOutput: "signature", hidden: true },
              ],
              hints: ["Use SystemProgram.transfer() to create the instruction", "Don't forget to set transaction.feePayer", "Use connection.getLatestBlockhash() for recentBlockhash"],
              timeoutMs: 5000,
            },
          },
          {
            id: "les-4",
            title: "Transactions & Instructions",
            description: "Understanding Solana transaction anatomy and lifecycle",
            type: "content",
            order: 4,
            xpReward: 50,
            durationMinutes: 30,
            content: `# Transactions & Instructions

Solana transactions are atomic units of work composed of one or more **instructions**. Understanding how transactions work is essential for building reliable applications.

## Transaction Anatomy

A Solana transaction contains:

1. **Instructions**: Array of operations to execute
2. **Accounts**: List of all accounts the transaction will read or write
3. **Signers**: Signatures from required accounts
4. **Recent Blockhash**: Prevents replay attacks (expires after ~90 seconds)
5. **Compute Budget**: Limits on compute units (default: 200,000 CUs)

## Instructions

An instruction specifies:
- **Program ID**: The program to execute
- **Accounts**: List of accounts with read/write/signer flags
- **Data**: Serialized instruction parameters

\`\`\`typescript
interface Instruction {
  programId: PublicKey;
  keys: AccountMeta[];
  data: Buffer;
}
\`\`\`

Each account in the keys array specifies:
- **pubkey**: The account address
- **isSigner**: Whether this account must sign the transaction
- **isWritable**: Whether the program can modify this account

## Transaction Lifecycle

1. **Creation**: Client builds transaction with instructions
2. **Signing**: Required accounts sign the transaction
3. **Submission**: Client sends to an RPC node
4. **Preflight**: RPC validates transaction (account existence, signatures, recent blockhash)
5. **Forwarding**: RPC forwards to the current/future leader
6. **Processing**: Leader executes instructions in parallel where possible
7. **Confirmation**: Validators vote on the block containing the transaction
8. **Finalization**: After 32 confirmations, transaction is finalized

## Recent Blockhash

Every transaction must include a **recent blockhash**—a hash of a recent block. This serves two purposes:
- **Replay protection**: Old blockhashes expire (~90 seconds)
- **Lifetime management**: Transactions that don't land within the window fail

You fetch recent blockhashes via RPC:\n\`getLatestBlockhash\`.

## Compute Units and Fees

Solana uses **compute units (CUs)** to measure execution cost:
- Base cost: 5,000 CUs per signature
- Program execution: varies by instruction
- Default limit: 200,000 CUs per transaction
- Max limit: 1,400,000 CUs

Priority fees (optional) allow you to bid for faster inclusion during congestion:
\`\`\`
priority_fee = compute_units_consumed * priority_rate
\`\`\`

## Atomicity

Transactions are **atomic**—either all instructions succeed and all state changes are committed, or the entire transaction fails and no changes occur. This enables complex DeFi operations like flash loans where multiple steps must all succeed.

## Common Errors

- **BlockhashNotFound**: Transaction expired before landing
- **InsufficientFunds**: Not enough SOL for fees or transfers
- **ProgramFailedToComplete**: Exceeded compute budget or runtime error
- **AlreadyProcessed**: Transaction already landed (idempotent)`,
          },
        ],
      },
      {
        id: "mod-sf-2",
        title: "Programs & PDAs",
        description: "Understanding Solana programs and Program Derived Addresses",
        order: 2,
        lessons: [
          {
            id: "les-5",
            title: "Programs on Solana",
            description: "How programs work on Solana's BPF runtime",
            type: "content",
            order: 1,
            xpReward: 50,
            durationMinutes: 25,
            content: `# Programs on Solana

Solana programs (smart contracts) are compiled to **Berkeley Packet Filter (BPF)** bytecode and executed by the Solana runtime. Unlike Ethereum, programs are stateless—their code is immutable, but they operate on separate data accounts.

## BPF Runtime

Solana uses a modified eBPF (extended BPF) virtual machine for program execution:
- **Deterministic**: Same inputs always produce same outputs
- **Metered**: Compute units are tracked and limited
- **Sandboxed**: Programs cannot access unauthorized memory
- **Optimized**: JIT compilation to native code for performance

Programs are written in Rust or C, compiled to ELF format containing BPF bytecode, then deployed to the blockchain.

## Program Deployment

When you deploy a program:
1. Your code is compiled to BPF bytecode
2. A loader program (BPF Loader) stores the bytecode in an executable account
3. The program account is marked as **executable**
4. The program ID (account address) is derived from a public key you control

Once deployed, program code is **immutable**. To update, you deploy a new program and migrate users.

## Upgrade Authority

Each program has an **upgrade authority**—the address that can modify the program. If you set this to a key you control, you can upgrade. If you set it to \`None\`, the program is immutable forever.

\`\`\`rust
// Setting upgrade authority to None (immutable)
set_upgrade_authority(&program_id, &current_authority, None)?;
\`\`\`

## Program State Management

Since programs are stateless, where does data live? In **separate accounts** owned by the program:

\`\`\`
User Account (owned by Program) -> Stores user data
Program Account (executable)    -> Stores code only
\`\`\`

Your program defines structures for state:

\`\`\`rust
#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub name: String,
    pub created_at: i64,
}
\`\`\`

## Cross-Program Invocation (CPI)

Programs can call other programs via CPIs, enabling composability:

\`\`\`rust
// Calling the Token Program to mint tokens
invoke(
  &spl_token::instruction::mint_to(
    token_program,
    mint,
    account,
    authority,
    &[],
    amount,
  )?,
  &[mint.clone(), account.clone(), authority.clone()],
)?;
\`\`\`

CPIs preserve the caller's privileges—you can use PDAs to sign on behalf of your program.

## Common Programs

- **System Program**: Creates accounts, transfers SOL
- **Token Program**: SPL token standard (transfers, mints)
- **Associated Token Account Program**: Creates token accounts
- **Stake Program**: Delegation and staking operations
- **Vote Program**: Validator voting`,
          },
          {
            id: "les-6",
            title: "Program Derived Addresses",
            description: "Understanding PDAs and deterministic addressing",
            type: "content",
            order: 2,
            xpReward: 50,
            durationMinutes: 30,
            content: `# Program Derived Addresses (PDAs)

**Program Derived Addresses** are special accounts that are deterministically derived from seeds and a program ID. They enable programs to "own" accounts and sign transactions.

## What are PDAs?

PDAs are accounts that:
- Are derived from seeds (arbitrary bytes) + program ID
- Do **not** have a private key (off-curve)
- Can be "signed for" by the program that derived them
- Enable deterministic addressing (same inputs = same address)

## Deriving PDAs

PDAs are found using \`findProgramAddressSync\`:

\`\`\`typescript
import { PublicKey } from "@solana/web3.js";

const [pda, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("user"),
    userPublicKey.toBuffer(),
  ],
  programId
);
\`\`\`

Parameters:
- **Seeds**: Array of byte arrays (strings must be converted to buffers)
- **Program ID**: The program that will own this PDA

Returns:
- **PDA**: The derived address
- **Bump**: A number (1-255) that ensures the address is valid (off the Ed25519 curve)

## The Bump

Not all seed combinations produce valid PDAs (some fall on the Ed25519 curve). The bump is a nonce that shifts the address off the curve. \`findProgramAddressSync\` starts with bump=255 and decrements until it finds a valid PDA.

## Program Signing with PDAs

The key superpower: programs can "sign" for PDAs they derived:

\`\`\`rust
// In your program
let seeds = &[b"user", user_key.as_ref(), &[bump]];
let signer = &[&seeds[..]];

invoke_signed(
  &instruction,
  accounts,
  signer, // The program "signs" as the PDA
)?;
\`\`\`

## Common PDA Patterns

### 1. User Data Storage
\`\`\`
["user", user_pubkey] -> User profile account
\`\`\`

### 2. Token Vaults
\`\`\`
["vault", mint_pubkey] -> Program-controlled token account
\`\`\`

### 3. Authority Delegation
\`\`\`
["authority", game_id] -> Program authority for a game
\`\`\`

### 4. Seeds with Multiple Keys
\`\`\`
["escrow", party_a, party_b] -> Escrow between two parties
\`\`\`

## Deterministic Addressing

Because PDAs are deterministic, you can compute addresses client-side without making RPC calls:

\`\`\`typescript
// Client knows the PDA without querying the chain
const userPda = PublicKey.findProgramAddressSync(
  [Buffer.from("user"), wallet.publicKey.toBuffer()],
  programId
)[0];
\`\`\`

This enables:
- Checking if a user has initialized an account
- Sending funds to computed addresses
- Optimistic UI updates`,
          },
          {
            id: "les-7",
            title: "SPL Token Program",
            description: "Understanding tokens, mints, and Associated Token Accounts",
            type: "content",
            order: 3,
            xpReward: 50,
            durationMinutes: 30,
            content: `# SPL Token Program

The **SPL Token Program** is Solana's standard for fungible and non-fungible tokens. It enables minting, transferring, and managing tokens on Solana.

## Key Concepts

### Mint
A **mint** represents a token type. It stores:
- Supply: Total tokens in existence
- Decimals: Precision (e.g., 6 for USDC)
- Mint authority: Address that can create new tokens
- Freeze authority: Address that can freeze accounts

### Token Account
A **token account** holds tokens of a specific mint for a specific owner:
- Associated with one mint
- Associated with one owner
- Stores the token balance
- Can be frozen

### Associated Token Account (ATA)
An **ATA** is a deterministic token account derived from:
- Owner's wallet address
- Token mint address

\`\`\`
ATA = findProgramAddress([owner, tokenProgram, mint], ataProgram)
\`\`\`

ATAs ensure each wallet has exactly one token account per mint.

## Token Operations

### Creating a Mint
\`\`\`typescript
import { createMint } from "@solana/spl-token";

const mint = await createMint(
  connection,
  payer,           // Fee payer
  mintAuthority,   // Who can mint
  freezeAuthority, // Who can freeze (null for none)
  6                // Decimals
);
\`\`\`

### Creating Token Accounts
\`\`\`typescript
import { createAssociatedTokenAccount } from "@solana/spl-token";

const ata = await createAssociatedTokenAccount(
  connection,
  payer,
  mint,
  owner
);
\`\`\`

### Minting Tokens
\`\`\`typescript
import { mintTo } from "@solana/spl-token";

await mintTo(
  connection,
  payer,
  mint,
  destination, // Token account
  mintAuthority,
  amount       // Raw amount (not accounting for decimals)
);
\`\`\`

### Transferring Tokens
\`\`\`typescript
import { transfer } from "@solana/spl-token";

await transfer(
  connection,
  payer,
  source,      // Source token account
  destination, // Destination token account
  owner,       // Owner of source
  amount
);
\`\`\`

## Token-2022 Extensions

Token-2022 is the next-generation token standard with optional extensions:
- Transfer fees
- Confidential transfers
- Non-transferable tokens (soulbound)
- Interest-bearing tokens
- Permanent delegate

## Metadata

For NFTs and tokens with metadata, use the **Metaplex Token Metadata** program:
- On-chain name, symbol, URI
- Creator royalties
- Collection verification`,
          },
          {
            id: "les-8",
            title: "Create a Token",
            description: "Build a script to create an SPL token with metadata",
            type: "challenge",
            order: 4,
            xpReward: 200,
            durationMinutes: 60,
            content: `# Create a Token Challenge

Build a function that creates an SPL token mint with associated metadata. This combines everything you've learned about accounts, PDAs, and the Token Program.

## Requirements

Implement \`createTokenWithMetadata\` that:
1. Creates a new mint with 6 decimals
2. Creates an associated token account for the creator
3. Mints 1,000,000 tokens to the creator's ATA
4. Returns the mint public key
`,
            challenge: {
              language: "typescript",
              instructions: "Create an SPL token mint with the specified parameters. Create an associated token account for the creator and mint 1,000,000 tokens (raw amount, accounting for 6 decimals).",
              starterCode: `import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";

async function createTokenWithMetadata(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey
): Promise<PublicKey> {
  // TODO: Create a new mint with 6 decimals
  
  // TODO: Create an associated token account for the payer
  
  // TODO: Mint 1,000,000 tokens (1 token with 6 decimals = 1,000,000) to the payer's ATA
  
  // TODO: Return the mint public key
  return PublicKey.default;
}`,
              solutionCode: `import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createMint, createAssociatedTokenAccount, mintTo, getAssociatedTokenAddress } from "@solana/spl-token";

async function createTokenWithMetadata(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey
): Promise<PublicKey> {
  // Create a new mint with 6 decimals
  const mint = await createMint(
    connection,
    payer,
    mintAuthority,
    null, // No freeze authority
    6
  );
  
  // Create an associated token account for the payer
  const ata = await createAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  
  // Mint 1,000,000 tokens (1 token with 6 decimals = 1,000,000) to the payer's ATA
  await mintTo(
    connection,
    payer,
    mint,
    ata,
    payer, // Mint authority is the payer in this case
    1000000
  );
  
  return mint;
}`,
              testCases: [
                { id: "t1", name: "Creates valid mint", input: "[]", expectedOutput: "PublicKey", hidden: true },
                { id: "t2", name: "Creates ATA correctly", input: "[]", expectedOutput: "PublicKey", hidden: true },
                { id: "t3", name: "Mints correct amount", input: "[]", expectedOutput: "PublicKey", hidden: true },
              ],
              hints: ["Use createMint() with 6 decimals", "Use createAssociatedTokenAccount() for the ATA", "Remember: 1 token with 6 decimals = 1,000,000 base units"],
              timeoutMs: 5000,
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // COURSE 2: Anchor Development
  // ============================================================================
  {
    id: "course-ad",
    slug: "anchor-development",
    title: "Anchor Development",
    description: "Master the Anchor framework for building Solana programs in Rust. Learn account constraints, Cross-Program Invocations, testing patterns, and ship production-ready programs.",
    thumbnail: "/images/courses/anchor.jpg",
    difficulty: "intermediate",
    durationMinutes: 540,
    totalXP: 2500,
    trackId: "track-foundations",
    tags: ["anchor", "rust", "programs", "intermediate"],
    instructorName: "Anchor Collective",
    instructorAvatar: "/images/instructors/anchor.jpg",
    enrolledCount: 1800,
    publishedAt: "2024-02-01T00:00:00Z",
    modules: [
      {
        id: "mod-ad-1",
        title: "Anchor Basics",
        description: "Introduction to the Anchor framework and core concepts",
        order: 1,
        lessons: [
          {
            id: "les-9",
            title: "What is Anchor?",
                description: "Framework overview and IDL generation",
            type: "content",
            order: 1,
            xpReward: 75,
            durationMinutes: 25,
            content: `# What is Anchor?

**Anchor** is a framework for Solana program development that simplifies building secure, composable applications. Created by Armani Ferrante, Anchor abstracts away much of the boilerplate associated with raw Solana development.

## Key Features

### 1. IDL Generation
Anchor automatically generates an **Interface Description Language (IDL)** file from your Rust code. The IDL describes your program's accounts, instructions, and types—enabling:
- TypeScript client generation
- Automatic serialization/deserialization
- Cross-program composability

### 2. Account Constraints
Anchor's **\`#[account]\`** macro and constraint system enforce security checks declaratively:

\`\`\`rust
#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + UserProfile::SIZE
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`

### 3. CPI Helpers
Anchor generates Cross-Program Invocation helpers automatically:

\`\`\`rust
// Calling another Anchor program
let cpi_program = ctx.accounts.other_program.to_account_info();
let cpi_accounts = OtherProgramInstruction {
    account: ctx.accounts.account.to_account_info(),
};
let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
other_program::cpi::instruction(cpi_ctx, data)?;
\`\`\`

## Project Structure

\`\`\`
my-anchor-project/
├── Anchor.toml          # Anchor configuration
├── Cargo.toml           # Workspace configuration
├── programs/
│   └── my_program/
│       ├── Cargo.toml   # Program dependencies
│       └── src/
│           └── lib.rs   # Program code
├── tests/
│   └── my_program.ts    # TypeScript tests
└── migrations/
    └── deploy.ts        # Deployment scripts
\`\`\`

## Anchor.toml

Configuration file specifying:
- Cluster connection (localnet, devnet, mainnet)
- Program IDs
- Wallet paths
- Script definitions

## Build and Deploy

\`\`\`bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
\`\`\`

## TypeScript Client

Anchor generates a typed client from your IDL:

\`\`\`typescript
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { MyProgram } from "./types/my_program";

const provider = AnchorProvider.env();
const program = new Program<MyProgram>(idl, provider);

// Type-safe instruction calls
await program.methods
  .initializeUser("Alice")
  .accounts({
    userProfile: userPda,
    signer: wallet.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .rpc();
\`\`\``,
          },
          {
            id: "les-10",
            title: "Account Constraints",
                description: "Deep dive into Anchor's constraint system",
            type: "content",
            order: 2,
            xpReward: 75,
            durationMinutes: 35,
            content: `# Account Constraints

Anchor's constraint system is where the framework truly shines. Instead of manually writing validation logic, you declare constraints that Anchor enforces automatically.

## Basic Constraints

### init
Creates a new account owned by the program:

\`\`\`rust
#[account(
    init,
    payer = user,
    space = 8 + UserProfile::INIT_SPACE
)]
pub user_profile: Account<'info, UserProfile>,
\`\`\`

### mut
Marks an account as mutable:

\`\`\`rust
#[account(mut)]
pub user: Signer<'info>,
\`\`\`

### signer
Ensures the account signed the transaction:

\`\`\`rust
#[account(signer)]
pub authority: AccountInfo<'info>,
\`\`\`

## Advanced Constraints

### has_one
Ensures an account's field matches another account:

\`\`\`rust
#[account(
    has_one = authority, // user_profile.authority must match authority.key()
)]
pub user_profile: Account<'info, UserProfile>,
pub authority: Signer<'info>,
\`\`\`

### seeds and bump (PDA verification)
Verifies an account is a valid PDA with the given seeds:

\`\`\`rust
#[account(
    seeds = [b"user", user.key().as_ref()],
    bump,
)]
pub user_pda: Account<'info, UserData>,
\`\`\`

The \`bump\` constraint tells Anchor to find and verify the correct bump nonce.

### constraint (custom logic)
Arbitrary boolean expressions:

\`\`\`rust
#[account(
    constraint = user_profile.created_at > 0,
    constraint = user_profile.name.len() <= 32,
)]
pub user_profile: Account<'info, UserProfile>,
\`\`\`

### address
Ensures an account matches a specific public key:

\`\`\`rust
#[account(address = system_program::ID)]
pub system_program: Program<'info, System>,
\`\`\`

## Realloc (resizing)

Resize accounts dynamically:

\`\`\`rust
#[account(
    mut,
    realloc = 8 + UserProfile::INIT_SPACE + new_name.len(),
    realloc::payer = user,
    realloc::zero = false,
)]
pub user_profile: Account<'info, UserProfile>,
\`\`\`

## Closing Accounts

Close an account and return rent:

\`\`\`rust
#[account(
    mut,
    close = user, // Lamports go to user
)]
pub user_profile: Account<'info, UserProfile>,
\`\`\`

## Security Best Practices

1. **Always use constraints over manual checks**—they're harder to miss
2. **Verify PDAs with seeds**—don't trust client-provided PDAs
3. **Use has_one for ownership**—prevents accidental privilege escalation
4. **Check account initialization**—prevent re-initialization attacks
5. **Validate token accounts**—check mint and owner`,
          },
          {
            id: "les-11",
            title: "Build a Counter",
            description: "Create your first Anchor program - a simple counter",
            type: "challenge",
            order: 3,
            xpReward: 200,
            durationMinutes: 60,
            content: `# Build a Counter Challenge

Create a complete Anchor program that implements a counter. This is the "Hello World" of Solana development.

## Requirements

Implement an Anchor program with:
1. \`initialize\` - Creates a counter account with value 0
2. \`increment\` - Increments the counter by 1
3. \`decrement\` - Decrements the counter by 1 (can't go below 0)

## Program Structure

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // TODO: Initialize counter to 0
    }
    
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        // TODO: Increment counter
    }
    
    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        // TODO: Decrement counter (min 0)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // TODO: Define accounts
}

#[derive(Accounts)]
pub struct Update<'info> {
    // TODO: Define accounts
}

#[account]
pub struct Counter {
    // TODO: Define counter state
}
\`\`\``,
            challenge: {
              language: "typescript",
              instructions: "Complete the Anchor counter program. The initialize instruction should create a counter account with value 0. The increment instruction should add 1. The decrement instruction should subtract 1 but not go below 0.",
              starterCode: `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // TODO: Initialize counter to 0
        Ok(())
    }
    
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        // TODO: Increment counter by 1
        Ok(())
    }
    
    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        // TODO: Decrement counter by 1, min 0
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // TODO: Define initialize accounts
}

#[derive(Accounts)]
pub struct Update<'info> {
    // TODO: Define update accounts (counter must be mutable)
}

#[account]
pub struct Counter {
    // TODO: Define counter state (value: u64)
}`,
              solutionCode: `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = 0;
        counter.authority = ctx.accounts.user.key();
        Ok(())
    }
    
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = counter.value.checked_add(1).unwrap();
        Ok(())
    }
    
    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        if counter.value > 0 {
            counter.value = counter.value.checked_sub(1).unwrap();
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + Counter::INIT_SPACE)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub value: u64,
    pub authority: Pubkey,
}`,
              testCases: [
                { id: "t1", name: "Initializes counter to 0", input: "[]", expectedOutput: "0", hidden: true },
                { id: "t2", name: "Increments correctly", input: "[]", expectedOutput: "1", hidden: true },
                { id: "t3", name: "Decrements correctly", input: "[]", expectedOutput: "0", hidden: true },
                { id: "t4", name: "Won't go below 0", input: "[]", expectedOutput: "0", hidden: true },
              ],
              hints: ["Use #[account(init, payer = user, space = 8 + Counter::INIT_SPACE)] for initialization", "Use has_one = authority to ensure only the creator can update", "Use checked_add/checked_sub to prevent overflow"],
              timeoutMs: 5000,
            },
          },
        ],
      },
      {
        id: "mod-ad-2",
        title: "Advanced Patterns",
        description: "Cross-program invocations, error handling, and testing",
        order: 2,
        lessons: [
          {
            id: "les-12",
            title: "Cross-Program Invocations",
                description: "Calling other programs from your Anchor program",
            type: "content",
            order: 1,
            xpReward: 75,
            durationMinutes: 30,
            content: `# Cross-Program Invocations (CPI)

**Cross-Program Invocations** allow Solana programs to call other programs, enabling composability. Anchor makes CPIs type-safe and straightforward.

## Basic CPI

Call another Anchor program:

\`\`\`rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}
\`\`\`

## CPI with Signer Seeds (PDA Signing)

When calling from a PDA, your program can sign on behalf of the PDA:

\`\`\`rust
pub fn transfer_from_vault(ctx: Context<TransferFromVault>, amount: u64) -> Result<()> {
    let vault_seeds = &[
        b"vault",
        ctx.accounts.game.key().as_ref(),
        &[ctx.bumps.vault],
    ];
    let signer_seeds = &[&vault_seeds[..]];
    
    let cpi_accounts = Transfer {
        from: ctx.accounts.vault_token_account.to_account_info(),
        to: ctx.accounts.recipient.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer_seeds,
    );
    
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}
\`\`\`

The key is \`CpiContext::new_with_signer\` which passes the PDA seeds for signing.

## Invoking System Program

Create accounts via CPI:

\`\`\`rust
use anchor_lang::system_program::{self, CreateAccount};

pub fn create_account(ctx: Context<CreateAccountExample>) -> Result<()> {
    let cpi_accounts = CreateAccount {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.new_account.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        cpi_accounts,
    );
    
    system_program::create_account(
        cpi_ctx,
        1000000, // Lamports
        0,       // Space
        &ctx.accounts.program_id,
    )?;
    
    Ok(())
}
\`\`\`

## Error Handling in CPIs

CPI errors propagate automatically:

\`\`\`rust
match token::transfer(cpi_ctx, amount) {
    Ok(()) => msg!("Transfer succeeded"),
    Err(e) => {
        msg!("Transfer failed: {:?}", e);
        return Err(e);
    }
}
\`\`\`

## CPI Guardrails

- **Compute budget**: CPIs consume compute units (default: 200,000 CU)
- **Depth limit**: Max 4 levels of CPI depth
- **Signer privileges**: PDA signing only works for PDAs derived by your program
- **Account validation**: Always validate accounts passed to CPIs`,
          },
          {
            id: "les-13",
            title: "Error Handling",
                description: "Custom errors and the require! macro",
            type: "content",
            order: 2,
            xpReward: 75,
            durationMinutes: 25,
            content: `# Error Handling

Anchor provides robust error handling through custom error types and the \`require!\` macro.

## Custom Errors

Define errors in your program:

\`\`\`rust
#[error_code]
pub enum MyError {
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Account already initialized")]
    AlreadyInitialized,
}
\`\`\`

The \`#[msg]\` attribute provides human-readable error messages.

## The require! Macro

\`require!\` is Anchor's assertion macro:

\`\`\`rust
pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(
        ctx.accounts.user.balance >= amount,
        MyError::InsufficientFunds
    );
    
    require!(
        amount > 0,
        MyError::InvalidAmount
    );
    
    // Safe to withdraw
    ctx.accounts.user.balance -= amount;
    Ok(())
}
\`\`\`

If the condition fails, the transaction reverts with the specified error.

## require_keys_eq!

Compare public keys:

\`\`\`rust
require_keys_eq!(
    ctx.accounts.token_account.owner,
    ctx.accounts.user.key(),
    MyError::Unauthorized
);
\`\`\`

## require_eq! and require_neq!

Compare values:

\`\`\`rust
require_eq!(game.state, GameState::Active, MyError::GameNotActive);
require_neq!(player.status, Status::Banned, MyError::PlayerBanned);
\`\`\`

## Error Propagation

Use the \`?\` operator to propagate errors:

\`\`\`rust
pub fn complex_operation(ctx: Context<Complex>) -> Result<()> {
    step_one(ctx)?;              // Returns early on error
    step_two(ctx)?;              // Returns early on error
    risky_cpi_call(ctx)?;        // Returns early on error
    Ok(())
}
\`\`\`

## AnchorError

Catch and handle Anchor-specific errors:

\`\`\`rust
use anchor_lang::error::AnchorError;

match result {
    Ok(()) => msg!("Success"),
    Err(Error::AnchorError(anchor_err)) => {
        msg!("Anchor error: {:?}", anchor_err.error_name());
    }
    Err(_) => msg!("Unknown error"),
}
\`\`\``,
          },
          {
            id: "les-14",
            title: "Testing with Bankrun",
            description: "Write comprehensive tests for Anchor programs",
            type: "challenge",
            order: 3,
            xpReward: 250,
            durationMinutes: 75,
            content: `# Testing with Bankrun Challenge

Write a comprehensive test for a voting program using Anchor's Bankrun testing framework.

## Program Under Test

\`\`\`rust
#[program]
pub mod voting {
    use super::*;
    
    pub fn initialize_poll(ctx: Context<InitializePoll>, question: String) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        require!(question.len() <= 100, VotingError::QuestionTooLong);
        poll.question = question;
        poll.yes_votes = 0;
        poll.no_votes = 0;
        poll.authority = ctx.accounts.authority.key();
        Ok(())
    }
    
    pub fn vote(ctx: Context<Vote>, vote_yes: bool) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        if vote_yes {
            poll.yes_votes += 1;
        } else {
            poll.no_votes += 1;
        }
        Ok(())
    }
}

#[error_code]
pub enum VotingError {
    #[msg("Question too long")]
    QuestionTooLong,
}
\`\`\`

## Requirements

Write tests that verify:
1. Poll initialization works
2. Voting updates counts correctly
3. Question length validation works`,
            challenge: {
              language: "typescript",
              instructions: "Complete the test file for the voting program. Test that: 1) A poll can be initialized with a question, 2) Users can vote yes/no and counts are tracked, 3) Long questions (>100 chars) are rejected.",
              starterCode: `import { describe, it } from "vitest";
import { Program } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";

describe("voting", () => {
  // TODO: Set up provider and program
  
  it("Initializes a poll", async () => {
    // TODO: Test poll initialization
  });
  
  it("Tracks yes votes", async () => {
    // TODO: Test yes voting
  });
  
  it("Tracks no votes", async () => {
    // TODO: Test no voting
  });
  
  it("Rejects long questions", async () => {
    // TODO: Test validation
  });
});`,
              solutionCode: `import { describe, it, expect } from "vitest";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";

describe("voting", () => {
  const provider = AnchorProvider.env();
  const program = new Program<Voting>(IDL, provider);
  
  it("Initializes a poll", async () => {
    const poll = web3.Keypair.generate();
    const question = "Do you like Solana?";
    
    await program.methods
      .initializePoll(question)
      .accounts({
        poll: poll.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([poll])
      .rpc();
    
    const pollAccount = await program.account.poll.fetch(poll.publicKey);
    expect(pollAccount.question).toBe(question);
    expect(pollAccount.yesVotes.toNumber()).toBe(0);
    expect(pollAccount.noVotes.toNumber()).toBe(0);
  });
  
  it("Tracks yes votes", async () => {
    const poll = web3.Keypair.generate();
    
    await program.methods
      .initializePoll("Test question?")
      .accounts({
        poll: poll.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([poll])
      .rpc();
    
    await program.methods
      .vote(true)
      .accounts({
        poll: poll.publicKey,
      })
      .rpc();
    
    const pollAccount = await program.account.poll.fetch(poll.publicKey);
    expect(pollAccount.yesVotes.toNumber()).toBe(1);
    expect(pollAccount.noVotes.toNumber()).toBe(0);
  });
  
  it("Tracks no votes", async () => {
    const poll = web3.Keypair.generate();
    
    await program.methods
      .initializePoll("Test question?")
      .accounts({
        poll: poll.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([poll])
      .rpc();
    
    await program.methods
      .vote(false)
      .accounts({
        poll: poll.publicKey,
      })
      .rpc();
    
    const pollAccount = await program.account.poll.fetch(poll.publicKey);
    expect(pollAccount.yesVotes.toNumber()).toBe(0);
    expect(pollAccount.noVotes.toNumber()).toBe(1);
  });
  
  it("Rejects long questions", async () => {
    const poll = web3.Keypair.generate();
    const longQuestion = "a".repeat(101);
    
    await expect(
      program.methods
        .initializePoll(longQuestion)
        .accounts({
          poll: poll.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([poll])
        .rpc()
    ).rejects.toThrow();
  });
});`,
              testCases: [
                { id: "t1", name: "Initializes poll", input: "[]", expectedOutput: "pass", hidden: true },
                { id: "t2", name: "Tracks yes votes", input: "[]", expectedOutput: "pass", hidden: true },
                { id: "t3", name: "Tracks no votes", input: "[]", expectedOutput: "pass", hidden: true },
                { id: "t4", name: "Rejects long questions", input: "[]", expectedOutput: "pass", hidden: true },
              ],
              hints: ["Use provider.wallet.publicKey for the signer", "Generate a new Keypair for the poll account", "Use .rpc() to send transactions"],
              timeoutMs: 5000,
            },
          },
        ],
      },
    ],
  },
  // ============================================================================
  // COURSE 3: Token Extensions & DeFi
  // ============================================================================
  {
    id: "course-ted",
    slug: "token-extensions-defi",
    title: "Token Extensions & DeFi",
    description: "Explore Solana's Token-2022 standard with transfer hooks and confidential transfers. Build DeFi primitives including AMM design, oracle integration, and token swaps.",
    thumbnail: "/images/courses/token-defi.jpg",
    difficulty: "intermediate",
    durationMinutes: 600,
    totalXP: 3000,
    trackId: "track-defi",
    tags: ["token-2022", "defi", "amm", "intermediate"],
    instructorName: "DeFi Collective",
    instructorAvatar: "/images/instructors/defi.jpg",
    enrolledCount: 1200,
    publishedAt: "2024-03-01T00:00:00Z",
    modules: [
      {
        id: "mod-ted-1",
        title: "Token-2022 Extensions",
        description: "Advanced token functionality with the Token-2022 program",
        order: 1,
        lessons: [
          {
            id: "les-15",
            title: "Introduction to Token-2022",
            description: "Overview of the next-generation token standard",
            type: "content",
            order: 1,
            xpReward: 100,
            durationMinutes: 25,
            content: `# Introduction to Token-2022

**Token-2022** (also known as Token Extensions) is the next evolution of Solana's token standard. While maintaining backward compatibility with the original SPL Token program, Token-2022 introduces optional extensions that enable powerful new functionality.

## Why Token-2022?

The original Token Program is simple and efficient but lacks features needed by modern DeFi applications:
- Transfer fees (for revenue models)
- Confidential transfers (privacy)
- Non-transferable tokens (soulbound)
- Interest-bearing tokens (yield-bearing assets)
- Permanent delegates (compliance)

Token-2022 solves this through a modular extension system where mints opt-in to specific features.

## Architecture

Token-2022 uses **extension-based design**:
- **Base token functionality**: Same as SPL Token (mint, transfer, burn)
- **Extensions**: Optional features added to mints or token accounts
- **Backward compatible**: Existing integrations work without changes

\`\`\`
Mint Account
├── Base Token Data (supply, decimals, authorities)
├── Extension 1 (e.g., Transfer Fee)
├── Extension 2 (e.g., Metadata Pointer)
└── ...
\`\`\`

## Key Extensions

### Transfer Fee
Automatically deduct fees on transfers:
- Fee basis points (e.g., 100 = 1%)
- Maximum fee cap
- Fee withdrawal authority
- Harvest to mint account

### Confidential Transfers
Hide transfer amounts using zero-knowledge proofs:
- Pedersen commitments for balances
- Range proofs for validity
- Optional auditor keys for compliance

### Non-Transferable (Soulbound)
Prevent token transfers after initial distribution:
- Perfect for credentials, reputation, governance
- Can still burn tokens
- Cannot be reversed once enabled

### Interest Bearing
Track yield accrual natively:
- APR stored on mint
- UI amount calculated automatically
- No rebase transactions needed

### Permanent Delegate
Assign an irrevocable delegate:
- Compliance and recovery scenarios
- Cannot be revoked by owner
- Can transfer/burn on behalf of owner

## Creating a Token-2022 Mint

\`\`\`typescript
import { createMint, ExtensionType, createInitializeTransferFeeConfigInstruction } from "@solana/spl-token";

// Size calculation includes extensions
const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

// Create account with space for extensions
const transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  // Initialize transfer fee extension
  createInitializeTransferFeeConfigInstruction(
    mint.publicKey,
    transferFeeConfigAuthority.publicKey,
    withdrawWithheldAuthority.publicKey,
    100, // 1% fee (100 basis points)
    BigInt(1000000), // Maximum fee
    TOKEN_2022_PROGRAM_ID
  ),
  // Initialize mint
  createInitializeMintInstruction(
    mint.publicKey,
    6, // Decimals
    mintAuthority.publicKey,
    null, // Freeze authority
    TOKEN_2022_PROGRAM_ID
  )
);
\`\`\``,
          },
          {
            id: "les-16",
            title: "Transfer Hooks",
            description: "Execute custom logic on token transfers",
            type: "content",
            order: 2,
            xpReward: 100,
            durationMinutes: 35,
            content: `# Transfer Hooks

**Transfer Hooks** are the most powerful Token-2022 extension, enabling programs to execute custom logic whenever tokens are transferred.

## Use Cases

- **Compliance checks**: Verify KYC/AML status before allowing transfers
- **Blacklists**: Prevent sanctioned addresses from receiving tokens
- **Transfer quotas**: Limit daily transfer volumes
- **Royalties**: Enforce NFT royalties on every sale
- **Dynamic fees**: Adjust fees based on market conditions

## How Transfer Hooks Work

1. A mint is configured with a **Transfer Hook Program ID**
2. When any transfer instruction is called, Token-2022:
   - Validates the transfer
   - Calls the Transfer Hook Program via CPI
   - Only completes the transfer if the hook succeeds

## Implementation

### Step 1: Create Hook Program

\`\`\`rust
use solana_program::account_info::AccountInfo;
use spl_transfer_hook_interface::instruction::ExecuteInstruction;

pub fn process_execute(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let source_account = next_account_info(account_info_iter)?;
    let mint = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let owner = next_account_info(account_info_iter)?;
    
    // Custom validation logic
    if is_blacklisted(destination_account.key) {
        return Err(MyError::BlacklistedAddress.into());
    }
    
    // Verify compliance
    if !has_valid_kyc(owner.key) {
        return Err(MyError::KYCRequired.into());
    }
    
    msg!("Transfer hook passed!");
    Ok(())
}
\`\`\`

### Step 2: Configure Mint with Hook

\`\`\`typescript
const transaction = new Transaction().add(
  createInitializeTransferHookInstruction(
    mint.publicKey,
    hookProgramId,
    authority.publicKey,
    TOKEN_2022_PROGRAM_ID
  ),
  // ... other initializations
);
\`\`\`

### Step 3: Required Accounts

When calling transfer with a hook, extra accounts may be needed:

\`\`\`typescript
import { addExtraAccountMetasForExecute, TransferHookAccount } from "@solana/spl-token";

// Get extra accounts required by hook
const extraAccounts: TransferHookAccount[] = [
  { pubkey: kycRegistry, isSigner: false, isWritable: false },
  { pubkey: complianceOracle, isSigner: false, isWritable: false },
];

// Build transfer with extra accounts
const transferInstruction = createTransferCheckedInstruction(
  source,
  mint,
  destination,
  owner,
  amount,
  decimals,
  undefined, // multiSigners
  TOKEN_2022_PROGRAM_ID
);

// Add extra accounts for transfer hook
addExtraAccountMetasForExecute(
  transferInstruction,
  hookProgramId,
  source,
  mint,
  destination,
  owner,
  amount,
  extraAccounts
);
\`\`\`

## Performance Considerations

- Transfer hooks add compute unit overhead
- Keep validation logic simple
- Cache compliance checks where possible
- Consider lazy validation for high-frequency transfers`,
          },
          {
            id: "les-17",
            title: "Confidential Transfers",
            description: "Privacy-preserving token transfers with zero-knowledge proofs",
            type: "content",
            order: 3,
            xpReward: 100,
            durationMinutes: 30,
            content: `# Confidential Transfers

**Confidential Transfers** enable private token transactions on Solana using zero-knowledge proofs. This extension hides transfer amounts while maintaining verifiability.

## Cryptographic Primitives

### Pedersen Commitments
Balances and amounts are stored as **Pedersen commitments**:
- \( C = g^m \cdot h^r \mod p \)
- \( m \) = amount, \( r \) = blinding factor
- Homomorphic: \( C_1 \cdot C_2 \) commits to \( m_1 + m_2 \)

### Range Proofs
Prove an amount is in range [0, 2^64) without revealing it:
- Uses Bulletproofs (concise, no trusted setup)
- ~1KB proof size
- ~100ms generation time

## Account Structure

With confidential transfers enabled, token accounts store:
- **Pending balance**: Encrypted incoming amount
- **Available balance**: Decrypted, spendable amount
- **Decryptable available**: Encryption of available balance
- **Allow confidential**: Toggle for account

\`\`\`
Available Balance (cleartext):     1000 tokens
Pending Balance (encrypted):       Commitment to 500
Decryptable Available:             Encryption of 1000
\`\`\`

## Transfer Flow

1. **Deposit**: Convert regular tokens to confidential balance
2. **Apply**: Decrypt pending balance to available
3. **Transfer**: Send confidentially to recipient
4. **Withdraw**: Convert back to regular tokens

## Implementation Example

\`\`\`typescript
import {
  deposit,
  applyPendingBalance,
  transfer,
  withdraw,
} from "@solana/spl-token";

// 1. Deposit tokens into confidential balance
await deposit(
  connection,
  payer,
  mint,
  tokenAccount,
  owner,
  amount,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

// 2. Apply pending balance (decrypt)
await applyPendingBalance(
  connection,
  payer,
  tokenAccount,
  owner,
  expectedBalance,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

// 3. Confidential transfer (requires ZK proof)
const proofData = await createTransferProof(
  elgamalPrivateKey,
  availableBalance,
  transferAmount,
  recipientPublicKey
);

await transfer(
  connection,
  payer,
  source,
  mint,
  destination,
  owner,
  proofData,
  undefined,
  TOKEN_2022_PROGRAM_ID
);
\`\`\`

## Compliance & Auditing

Confidential transfers support **auditor keys**:
- Designated auditors can decrypt amounts
- Required for regulatory compliance
- Configured at mint creation

\`\`\`
Auditor Pubkey: [configured in mint]
Can decrypt: All transfer amounts and balances
Cannot: Spend tokens or bypass consensus
\`\`\``,
          },
          {
            id: "les-18",
            title: "Implement Transfer Fee",
            description: "Create a token with transfer fees using Token-2022",
            type: "challenge",
            order: 4,
            xpReward: 250,
            durationMinutes: 60,
            content: `# Implement Transfer Fee Challenge

Create a Token-2022 mint with transfer fees that are automatically deducted on every transfer.

## Requirements

Implement \`createFeeBearingToken\` that:
1. Creates a Token-2022 mint
2. Configures a 2% transfer fee (200 basis points)
3. Sets maximum fee to 10,000 tokens (10,000 * 10^6 for 6 decimals)
4. Returns the mint public key
`,
            challenge: {
              language: "typescript",
              instructions: "Create a Token-2022 mint with transfer fee extension. Set the fee to 2% (200 basis points) with a maximum fee of 10,000 tokens (in base units).",
              starterCode: `import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, createInitializeMintInstruction, getMintLen, ExtensionType } from "@solana/spl-token";

async function createFeeBearingToken(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey
): Promise<PublicKey> {
  const mint = Keypair.generate();
  
  // TODO: Calculate mint length with TransferFeeConfig extension
  
  // TODO: Get rent exemption for the calculated length
  
  // TODO: Create the mint account
  
  // TODO: Initialize TransferFeeConfig extension (200 basis points = 2%, max fee = 10,000 * 10^6)
  
  // TODO: Initialize the mint with 6 decimals
  
  return mint.publicKey;
}`,
              solutionCode: `import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_2022_PROGRAM_ID, 
  createInitializeMintInstruction, 
  createInitializeTransferFeeConfigInstruction,
  getMintLen, 
  ExtensionType 
} from "@solana/spl-token";

async function createFeeBearingToken(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey
): Promise<PublicKey> {
  const mint = Keypair.generate();
  
  // Calculate mint length with TransferFeeConfig extension
  const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
  
  // Get rent exemption
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
  
  // Create the mint account with space for extension
  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });
  
  // Initialize transfer fee extension (200 basis points = 2%)
  const initTransferFeeIx = createInitializeTransferFeeConfigInstruction(
    mint.publicKey,
    mintAuthority, // Transfer fee config authority
    mintAuthority, // Withdraw withheld authority
    200, // 2% fee (200 basis points)
    BigInt(10000000000), // Max fee: 10,000 * 10^6 (for 6 decimals)
    TOKEN_2022_PROGRAM_ID
  );
  
  // Initialize the mint with 6 decimals
  const initMintIx = createInitializeMintInstruction(
    mint.publicKey,
    6, // Decimals
    mintAuthority,
    null, // No freeze authority
    TOKEN_2022_PROGRAM_ID
  );
  
  // Send transaction
  const transaction = new Transaction().add(
    createAccountIx,
    initTransferFeeIx,
    initMintIx
  );
  
  await connection.sendTransaction(transaction, [payer, mint]);
  
  return mint.publicKey;
}`,
              testCases: [
                { id: "t1", name: "Creates mint with correct address", input: "[]", expectedOutput: "PublicKey", hidden: true },
                { id: "t2", name: "Uses Token-2022 program", input: "[]", expectedOutput: "PublicKey", hidden: true },
                { id: "t3", name: "Fee configuration set", input: "[]", expectedOutput: "PublicKey", hidden: true },
              ],
              hints: ["Use getMintLen([ExtensionType.TransferFeeConfig]) to calculate space", "200 basis points = 2%", "10,000 tokens with 6 decimals = 10,000,000,000 base units"],
              timeoutMs: 5000,
            },
          },
        ],
      },
      {
        id: "mod-ted-2",
        title: "DeFi Primitives",
        description: "Build decentralized finance applications on Solana",
        order: 2,
        lessons: [
          {
            id: "les-19",
            title: "AMM Design Principles",
            description: "How Automated Market Makers work on Solana",
            type: "content",
            order: 1,
            xpReward: 100,
            durationMinutes: 30,
            content: `# AMM Design Principles

**Automated Market Makers (AMMs)** are the backbone of decentralized exchanges. Solana's high throughput enables efficient, capital-efficient AMM designs.

## Constant Product Formula

The classic Uniswap V2 model:
\[ x \cdot y = k \]

Where:
- \( x \) = reserve of token A
- \( y \) = reserve of token B
- \( k \) = constant (invariant)

### Price Calculation

Given reserves, the spot price is:
\[ P = \frac{y}{x} \]

### Swap Calculation

For input \( \Delta x \), output \( \Delta y \):
\[ (x + \Delta x) \cdot (y - \Delta y) = k \]
\[ \Delta y = y - \frac{k}{x + \Delta x} \]

With 0.3% fee:
\[ \Delta x_{effective} = \Delta x \cdot 0.997 \]

## Concentrated Liquidity

Uniswap V3-style concentrated liquidity allows LPs to provide liquidity in specific price ranges:

- **Ticks**: Discrete price points (0.01% apart)
- **Positions**: Liquidity allocated between two ticks
- **Virtual Reserves**: Effective reserves within the active range

\[ P(i) = 1.0001^i \]

Where \( i \) is the tick index.

## Solana AMM Advantages

### 1. Parallel Execution
Different pools trade in parallel—no global lock.

### 2. Cheap Updates
Frequent oracle updates and rebalancing are economical.

### 3. Composability
Flash loans and atomic multi-hop swaps:
\[ A \rightarrow B \rightarrow C \rightarrow D \text{ (single transaction)} \]

## CLMM (Concentrated Liquidity Market Maker)

Orca and Raydium use concentrated liquidity:
- Higher capital efficiency (20-100x)
- Custom fee tiers (0.01%, 0.05%, 0.30%, 1.00%)
- Tick-array data structure for gas efficiency

## Key Equations for Implementation

### Liquidity \( L \)
\[ L = \sqrt{x \cdot y} \]

### Amounts from Liquidity
\[ \Delta x = \Delta \frac{1}{\sqrt{P}} \cdot L \]
\[ \Delta y = \Delta \sqrt{P} \cdot L \]

### Swap with Slippage Protection
\`\`\`typescript
const minOutput = expectedOutput.muln(9975).divn(10000); // 0.25% slippage
\`\`\`

## MEV Protection

- **Jito bundles**: Private transaction submission
- **Cronos**: Sequencer-level protection
- **Dynamic fees**: Adjust based on volatility`,
          },
          {
            id: "les-20",
            title: "Oracle Integration",
            description: "Using Pyth and Switchboard for price data",
            type: "content",
            order: 2,
            xpReward: 100,
            durationMinutes: 30,
            content: `# Oracle Integration

**Oracles** bridge on-chain and off-chain data, enabling DeFi applications to react to real-world events and market prices.

## Pyth Network

Pyth is the dominant price oracle on Solana, providing high-frequency, low-latency price updates from institutional data providers.

### Architecture

1. **Publishers**: First-party data providers (Jane Street, CMT Digital, etc.)
2. **Price Aggregator**: Combines publisher prices on-chain
3. **Price Feeds**: Consumable price data for each asset

### Price Account Structure

\`\`\`
PriceAccount {
  id: Pubkey,
  price: i64,           // Current price (with exponent)
  conf: u64,           // Confidence interval
  status: PriceStatus, // Trading, Halted, etc.
  publish_time: i64,   // Last update timestamp
  ema_price: i64,      // Exponential moving average
  ema_conf: u64,
}
\`\`\`

### Consuming Pyth Prices

\`\`\`rust
use pyth_sdk_solana::load_price_feed_from_account_info;

pub fn get_price(ctx: Context<GetPrice>) -> Result<i64> {
  let price_feed = load_price_feed_from_account_info(&ctx.accounts.price_account)?;
  let current_price = price_feed.get_price_unchecked();
  
  // Validate price freshness
  let clock = Clock::get()?;
  let max_age = 300; // 5 minutes
  require!(
    clock.unix_timestamp - current_price.publish_time < max_age,
    ErrorCode::StalePrice
  );
  
  // Check confidence
  require!(
    current_price.conf < current_price.price / 100, // 1% confidence
    ErrorCode::LowConfidence
  );
  
  Ok(current_price.price)
}
\`\`\`

## Switchboard

Switchboard provides customizable, community-curated oracles:
- **Oracle Queue**: Decentralized oracle network
- **Aggregator**: Multi-source data feeds
- **Job Definitions**: Custom data sources (APIs, WebSocket, on-chain)

### Switchboard V2

Permissionless oracle creation:
\`\`\`typescript
const aggregator = new AggregatorAccount(switchboardProgram, aggregatorPubkey);
const result = await aggregator.fetchLatestValue();
const price = result.toNumber();
\`\`\`

## Oracle Security

### Price Manipulation Protection

1. **TWAP (Time-Weighted Average Price)**: Smooth out short-term manipulation
2. **Confidence intervals**: Reject uncertain prices
3. **Multi-source validation**: Use multiple oracles
4. **Circuit breakers**: Halt on extreme deviations

### TWAP Implementation

\`\`\`rust
pub fn get_twap(prices: &[PriceSample]) -> u128 {
  let weighted_sum: u128 = prices
    .iter()
    .map(|p| p.price as u128 * p.period as u128)
    .sum();
  let total_period: u128 = prices.iter().map(|p| p.period as u128).sum();
  weighted_sum / total_period
}
\`\`\`

## Best Practices

- Always check confidence intervals
- Validate price freshness (publish_time)
- Use multiple oracles for critical operations
- Implement circuit breakers
- Consider MEV when using oracles for liquidations`,
          },
          {
            id: "les-21",
            title: "Jupiter Swap Integration",
            description: "Build a token swap interface using Jupiter",
            type: "challenge",
            order: 3,
            xpReward: 300,
            durationMinutes: 90,
            content: `# Jupiter Swap Integration Challenge

Integrate Jupiter Aggregator to build a token swap interface that finds the best prices across all Solana DEXs.

## Requirements

Implement \`getSwapQuote\` and \`executeSwap\` functions that:
1. Fetch swap routes from Jupiter API v6
2. Find the best route for a given input/output token pair
3. Execute the swap transaction
4. Handle slippage protection

## Jupiter API Overview

Jupiter aggregates liquidity from:
- Orca (Whirlpools)
- Raydium (Concentrated + Standard)
- Meteora (Dynamic AMM)
- Lifinity (Proactive MM)
- Phoenix (Central Limit Orderbook)

\`\`\`typescript
// Jupiter Quote API
GET https://quote-api.jup.ag/v6/quote?
  inputMint={inputToken}&
  outputMint={outputToken}&
  amount={amount}&
  slippageBps={slippage}
\`\`\``,
            challenge: {
              language: "typescript",
              instructions: "Complete the Jupiter swap integration. Implement getSwapQuote to fetch the best route from Jupiter API, and executeSwap to build and send the transaction.",
              starterCode: `import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";

interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: null | object;
  priceImpactPct: string;
  routePlan: RouteStep[];
  contextSlot: number;
  timeTaken: number;
}

interface RouteStep {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

async function getSwapQuote(
  inputMint: PublicKey,
  outputMint: PublicKey,
  amount: number,
  slippageBps: number = 50
): Promise<SwapQuote> {
  // TODO: Fetch quote from Jupiter API v6
  throw new Error("Not implemented");
}

async function executeSwap(
  connection: Connection,
  wallet: Wallet,
  quote: SwapQuote
): Promise<string> {
  // TODO: Get swap transaction from Jupiter
  // TODO: Deserialize and sign transaction
  // TODO: Send and return signature
  throw new Error("Not implemented");
}`,
              solutionCode: `import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";

interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: null | object;
  priceImpactPct: string;
  routePlan: RouteStep[];
  contextSlot: number;
  timeTaken: number;
}

interface RouteStep {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

async function getSwapQuote(
  inputMint: PublicKey,
  outputMint: PublicKey,
  amount: number,
  slippageBps: number = 50
): Promise<SwapQuote> {
  const params = new URLSearchParams({
    inputMint: inputMint.toBase58(),
    outputMint: outputMint.toBase58(),
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
    onlyDirectRoutes: 'false',
    asLegacyTransaction: 'false',
  });

  const response = await fetch(
    \`https://quote-api.jup.ag/v6/quote?\${params.toString()}\`
  );

  if (!response.ok) {
    throw new Error(\`Failed to fetch quote: \${response.statusText}\`);
  }

  return response.json();
}

async function executeSwap(
  connection: Connection,
  wallet: Wallet,
  quote: SwapQuote
): Promise<string> {
  // Get swap transaction from Jupiter
  const swapRequest = {
    quoteResponse: quote,
    userPublicKey: wallet.publicKey.toBase58(),
    wrapAndUnwrapSol: true,
    prioritizationFeeLamports: 'auto',
  };

  const response = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(swapRequest),
  });

  if (!response.ok) {
    throw new Error(\`Failed to get swap transaction: \${response.statusText}\`);
  }

  const { swapTransaction } = await response.json();

  // Deserialize transaction
  const transactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(transactionBuf);

  // Sign transaction
  transaction.sign([wallet.payer]);

  // Send transaction
  const signature = await connection.sendTransaction(transaction, {
    maxRetries: 3,
    skipPreflight: false,
  });

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}`,
              testCases: [
                { id: "t1", name: "Fetches quote from Jupiter API", input: "[]", expectedOutput: "SwapQuote", hidden: true },
                { id: "t2", name: "Quote contains route plan", input: "[]", expectedOutput: "SwapQuote", hidden: true },
                { id: "t3", name: "Executes swap transaction", input: "[]", expectedOutput: "signature", hidden: true },
              ],
              hints: ["Use fetch() to call Jupiter's /v6/quote endpoint", "Remember to pass the quoteResponse to /v6/swap", "Use VersionedTransaction.deserialize() for the swap transaction"],
              timeoutMs: 5000,
            },
          },
        ],
      },
    ],
  },
  // ============================================================================
  // COURSE 4: Security & Auditing
  // ============================================================================
  {
    id: "course-sa",
    slug: "security-auditing",
    title: "Security & Auditing",
    description: "Learn to identify and prevent common vulnerabilities in Solana programs. Master security best practices, audit techniques, and secure coding patterns for production deployments.",
    thumbnail: "/images/courses/security.jpg",
    difficulty: "advanced",
    durationMinutes: 480,
    totalXP: 3500,
    trackId: "track-security",
    tags: ["security", "auditing", "advanced", "rust"],
    instructorName: "Sec3 Team",
    instructorAvatar: "/images/instructors/security.jpg",
    enrolledCount: 800,
    publishedAt: "2024-04-01T00:00:00Z",
    modules: [
      {
        id: "mod-sa-1",
        title: "Common Vulnerabilities",
        description: "Understanding and preventing security issues",
        order: 1,
        lessons: [
          {
            id: "les-22",
            title: "Missing Owner Checks",
            description: "Account ownership validation vulnerabilities",
            type: "content",
            order: 1,
            xpReward: 150,
            durationMinutes: 30,
            content: `# Missing Owner Checks

Failing to verify account ownership is one of the most common and severe vulnerabilities in Solana programs. It allows attackers to pass malicious accounts that impersonate legitimate ones.

## The Vulnerability

In Solana, any account can be passed to any instruction. If your program doesn't verify:
1. Who owns the account (the \`owner\` field)
2. That the owner is the expected program

Then attackers can create fake accounts with the same structure but controlled by them.

## Attack Scenario

\`\`\`rust
// VULNERABLE: No owner check
pub fn update_user(ctx: Context<UpdateUser>, new_name: String) -> Result<()> {
    ctx.accounts.user_profile.name = new_name; // Could be attacker's fake account!
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    pub user_profile: Account<'info, UserProfile>, // Any account, no validation!
    pub authority: Signer<'info>,
}
\`\`\`

**Attack:**
1. Attacker creates an account with UserProfile structure
2. Attacker owns this account (not your program)
3. Attacker passes it to update_user
4. Your program modifies attacker's account (no harm) OR worse—logic assumes it's a valid user

## The Fix

Always verify account ownership:

\`\`\`rust
#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        has_one = authority,           // Verify authority field matches
        constraint = user_profile.owner == program_id // Owner check
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}
\`\`\`

Better with Anchor's built-in owner check:

\`\`\`rust
#[account(mut)] // Anchor verifies owner == program_id automatically
pub user_profile: Account<'info, UserProfile>,
\`\`\`

## Common Patterns to Verify

### Token Accounts
\`\`\`rust
#[account(
    constraint = token_account.owner == program_id, // Program owns it
    constraint = token_account.mint == expected_mint, // Correct mint
)]
pub token_account: Account<'info, TokenAccount>,
\`\`\`

### Program Accounts
\`\`\`rust
#[account(executable)] // Verifies it's a program
pub token_program: AccountInfo<'info>, // Or use Program<'info, Token>
\`\`\`

### PDA Verification
\`\`\`rust
#[account(
    seeds = [b"user", user.key().as_ref()],
    bump,
)]
pub user_pda: Account<'info, UserData>, // Anchor verifies PDA derivation
\`\`\`

## Automated Detection

Use static analysis tools:
- **Sec3 Pro**: Detects missing owner checks
- **Neodyme Break**: Finds account validation issues
- **Certora**: Formal verification

## Real-World Impact

Multiple hacks have exploited missing owner checks:
- Wormhole (2022): $320M - fake signature verification
- Cashio (2022): $28M - fake collateral accounts
- Mango Markets (2022): $100M - oracle price manipulation`,
          },
          {
            id: "les-23",
            title: "Signer Authorization",
            description: "Properly validating transaction signers",
            type: "content",
            order: 2,
            xpReward: 150,
            durationMinutes: 30,
            content: `# Signer Authorization

Missing or incorrect signer validation allows unauthorized actions on behalf of users or protocols.

## The Vulnerability

\`\`\`rust
// VULNERABLE: No signer check
pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    ctx.accounts.user_account.balance -= amount;
    // Anyone can call this - no signature required!
    Ok(())
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub authority: AccountInfo<'info>, // Not marked as Signer!
}
\`\`\`

## Types of Signer Bugs

### 1. Missing Signer Check
Account passed but didn't sign the transaction:

\`\`\`rust
// VULNERABLE
pub authority: AccountInfo<'info>,

// SECURE
pub authority: Signer<'info>, // Must have signed
\`\`\`

### 2. Wrong Signer
Checking the wrong account signed:

\`\`\`rust
// VULNERABLE
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    pub to: Account<'info, TokenAccount>,
    pub random_signer: Signer<'info>, // Anyone can sign!
}

// SECURE
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, has_one = owner)]
    pub from: Account<'info, TokenAccount>,
    pub to: Account<'info, TokenAccount>,
    pub owner: Signer<'info>, // Must be from account's owner
}
\`\`\`

### 3. PDA Signing Without Seeds
PDAs can sign for your program, but you must validate the seeds:

\`\`\`rust
// VULNERABLE
pub fn close_account(ctx: Context<CloseAccount>) -> Result<()> {
    invoke_signed(
        &system_instruction::close_account(...),
        accounts,
        &[&[b"vault", &[bump]]], // Hardcoded bump!
    )?;
}

// SECURE
#[account(
    seeds = [b"vault", user.key().as_ref()],
    bump,
)]
pub vault: AccountInfo<'info>, // Validated PDA
\`\`\`

## Multi-Signature Patterns

For operations requiring multiple parties:

\`\`\`rust
#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(
        constraint = proposal.signers.contains(&signer1.key())),
    )]
    pub proposal: Account<'info, Proposal>,
    pub signer1: Signer<'info>,
    pub signer2: Signer<'info>,
    pub signer3: Signer<'info>,
}
\`\`\`

## Delegate Validation

When using token delegates:

\`\`\`rust
#[derive(Accounts)]
pub struct TransferWithDelegate<'info> {
    #[account(
        constraint = token_account.delegate == Some(delegate.key()),
        constraint = token_account.delegated_amount >= amount,
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub delegate: Signer<'info>,
}
\`\`\``,
          },
          {
            id: "les-24",
            title: "Arithmetic Overflow",
            description: "Integer overflow and underflow protection",
            type: "content",
            order: 3,
            xpReward: 150,
            durationMinutes: 25,
            content: `# Arithmetic Overflow

Integer overflow and underflow can lead to catastrophic financial losses. While Rust protects against overflow in debug mode, Solana programs run in release mode where overflow wraps around.

## The Vulnerability

\`\`\`rust
// VULNERABLE: Can overflow in release mode
pub fn add_reward(ctx: Context<AddReward>, amount: u64) -> Result<()> {
    ctx.accounts.user.reward += amount; // Wraps to 0 on overflow!
    Ok(())
}

// Attack: amount = u64::MAX - current_reward + 1
// Result: reward becomes 0 (wrapped around)
\`\`\`

## Rust and Overflow

- **Debug mode**: Panics on overflow (local testing)
- **Release mode** (Solana mainnet): Wraps around (2's complement)

\`\`\`rust
// In release mode:
let x: u64 = u64::MAX;
let y = x + 1; // y = 0, no panic!
\`\`\`

## Safe Arithmetic

### checked_add / checked_sub
Returns None on overflow:

\`\`\`rust
pub fn add_reward(ctx: Context<AddReward>, amount: u64) -> Result<()> {
    ctx.accounts.user.reward = ctx.accounts.user.reward
        .checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;
    Ok(())
}
\`\`\`

### checked_mul / checked_div

\`\`\`rust
pub fn calculate_interest(principal: u64, rate: u64) -> Result<u64> {
    let interest = principal
        .checked_mul(rate)
        .ok_or(ErrorCode::Overflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::DivideByZero)?;
    Ok(interest)
}
\`\`\`

### saturating operations
Caps at max/min instead of overflowing:

\`\`\`rust
let a = u64::MAX;
let b = a.saturating_add(1); // b = u64::MAX (no overflow)
\`\`\`

## Common Scenarios

### Price Calculations
\`\`\`rust
// VULNERABLE: Can overflow
let value = price * amount * leverage / 10000;

// SECURE: Check at each step
let value = price
    .checked_mul(amount)?
    .checked_mul(leverage)?
    .checked_div(10000)?;
\`\`\`

### Token Amounts
\`\`\`rust
// VULNERABLE
let new_balance = old_balance + deposit_amount;

// SECURE
let new_balance = old_balance.checked_add(deposit_amount)?;
\`\`\`

## Anchor's InitSpace

Use \`InitSpace\` derive to prevent account data overflow:

\`\`\`rust
#[account]
#[derive(InitSpace)]
pub struct User {
    pub balance: u64,
    #[max_len(32)]
    pub name: String, // Bounded size
}
\`\`\`

## Audit Checklist

- [ ] All arithmetic uses checked_* operations
- [ ] Account data sizes are bounded
- [ ] No division by zero possible
- [ ] Token calculations handle decimals correctly
- [ ] No precision loss in critical calculations`,
          },
          {
            id: "les-25",
            title: "Spot the Bug Challenge",
            description: "Identify vulnerabilities in code snippets",
            type: "challenge",
            order: 4,
            xpReward: 400,
            durationMinutes: 120,
            content: `# Spot the Bug Challenge

Given a vulnerable lending program, identify and fix all security issues.

## Vulnerable Program

\`\`\`rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fake111111111111111111111111111111111111111");

#[program]
pub mod lending {
    use super::*;
    
    pub fn deposit_collateral(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        ctx.accounts.user_account.collateral += amount;
        Ok(())
    }
    
    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        let collateral_value = ctx.accounts.user_account.collateral * 100 / 10000;
        require!(collateral_value >= amount, ErrorCode::InsufficientCollateral);
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user_token.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        ctx.accounts.user_account.borrowed += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Borrow<'info> {
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct UserAccount {
    pub collateral: u64,
    pub borrowed: u64,
}

#[error_code]
pub enum ErrorCode {
    InsufficientCollateral,
}
\`\`\``,
            challenge: {
              language: "typescript",
              instructions: "List all the security vulnerabilities in the provided lending program. For each vulnerability: 1) Name the issue, 2) Explain why it's vulnerable, 3) Provide the fix.",
              starterCode: `// Identify all vulnerabilities in the lending program.
// Format your answer as an array of objects with name, explanation, and fix.

const vulnerabilities = [
  // TODO: Add each vulnerability you find
  {
    name: "Example Issue",
    explanation: "This is just an example format",
    fix: "Remove this and add real issues"
  }
];

export default vulnerabilities;`,
              solutionCode: `const vulnerabilities = [
  {
    name: "Missing owner checks on token accounts",
    explanation: "user_token and vault are not verified to be owned by the Token Program. An attacker could pass fake accounts.",
    fix: "Add owner constraints: #[account(owner = token::ID)] or use Account<'info, TokenAccount> which auto-validates"
  },
  {
    name: "No PDA signing for vault transfers",
    explanation: "The vault transfer in borrow() tries to sign with the vault account itself, but there's no PDA validation or seeds.",
    fix: "Make vault a PDA and use invoke_signed with proper seeds in the CPI"
  },
  {
    name: "Arithmetic overflow in collateral calculation",
    explanation: "collateral * 100 can overflow u64, wrapping to a small value and allowing infinite borrowing.",
    fix: "Use checked_mul: ctx.accounts.user_account.collateral.checked_mul(100).ok_or(ErrorCode::Overflow)?"
  },
  {
    name: "No initialization check on user_account",
    explanation: "user_account could be uninitialized or owned by a different program, allowing account takeover.",
    fix: "Add init constraint: #[account(init_if_needed, payer = user, space = 8 + UserAccount::SIZE)]"
  },
  {
    name: "No price oracle - using hardcoded 100:1 ratio",
    explanation: "The collateral calculation uses hardcoded 100 instead of actual token prices, making the lending protocol economically exploitable.",
    fix: "Integrate a price oracle (Pyth or Switchboard) to get real-time collateral prices"
  },
  {
    name: "Missing has_one constraint for user verification",
    explanation: "user_account is not linked to the signer, allowing manipulation of other users' accounts.",
    fix: "Add #[account(has_one = user)] to verify user_account.user == user.key()"
  },
  {
    name: "No reentrancy protection",
    explanation: "The state update happens after CPI calls, which could allow reentrancy attacks.",
    fix: "Update state before CPI: update user_account.borrowed BEFORE calling token::transfer"
  }
];

export default vulnerabilities;`,
              testCases: [
                { id: "t1", name: "Identifies missing owner checks", input: "[]", expectedOutput: "array", hidden: true },
                { id: "t2", name: "Identifies PDA signing issue", input: "[]", expectedOutput: "array", hidden: true },
                { id: "t3", name: "Identifies arithmetic overflow", input: "[]", expectedOutput: "array", hidden: true },
                { id: "t4", name: "Identifies oracle issue", input: "[]", expectedOutput: "array", hidden: true },
                { id: "t5", name: "Provides valid fixes", input: "[]", expectedOutput: "array", hidden: true },
              ],
              hints: ["Check all account validations - are owners verified?", "Look at the arithmetic - can it overflow?", "Check the CPI signing - is it a proper PDA?", "Where do prices come from?"],
              timeoutMs: 5000,
            },
          },
        ],
      },
    ],
  },
];

// ============================================================================
// Export function
// ============================================================================

export function getLessonContext(
  courseSlug: string,
  lessonId: string
): LessonContext | null {
  const course = COURSES.find((c) => c.slug === courseSlug);
  if (!course) return null;

  const allLessons: { lesson: Lesson; moduleId: string }[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      allLessons.push({ lesson, moduleId: mod.id });
    }
  }

  const lessonIndex = allLessons.findIndex((l) => l.lesson.id === lessonId);
  if (lessonIndex === -1) return null;

  const current = allLessons[lessonIndex];
  const prev = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const next = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  return {
    lesson: current.lesson,
    course,
    moduleId: current.moduleId,
    prevLessonId: prev?.lesson.id ?? null,
    nextLessonId: next?.lesson.id ?? null,
  };
}
