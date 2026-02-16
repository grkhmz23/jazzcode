import type { Course, Module, Lesson, Challenge } from '@/types/content';

const createdAt = '2024-02-01T00:00:00Z';
const updatedAt = '2024-02-01T00:00:00Z';

const lesson1: Lesson = {
  id: 'lesson-1-what-is-anchor',
  title: 'What is Anchor?',
  slug: 'what-is-anchor',
  type: 'content',
  content: `# What is Anchor?

**Anchor** is a framework for building Solana programs that dramatically simplifies development. If Solana programming is like writing web applications in pure JavaScript, Anchor is like using Ruby on Rails or Django—it provides structure, abstractions, and tooling that let you focus on your application logic instead of boilerplate.

Created by Armani Ferrante and maintained by Coral, Anchor has become the de facto standard for Solana program development. Over 90% of new programs on Solana are built with Anchor.

## The #[program] Macro

At the heart of Anchor is the \`#[program]\` macro. You define your program's instructions as Rust functions inside a module marked with this attribute, and Anchor generates all the necessary boilerplate for you:

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("YourProgramId111111111111111111111111111111");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account = &mut ctx.accounts.my_account;
        account.data = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyAccount {
    pub data: u64,
}
\`\`\`

This minimal program demonstrates Anchor's core concepts:
- \`#[program]\` marks the instruction handlers
- \`#[derive(Accounts)]\` structs define account validation
- \`#[account]\` structs define your program's state

## The IDL (Interface Description Language)

When you build an Anchor program, it automatically generates an IDL file—a JSON description of your program's interface. This IDL contains:
- All instruction names and their parameter types
- Account structures and their fields
- Error codes and their messages

The IDL enables type-safe client generation. TypeScript clients can be generated automatically, ensuring your frontend code matches your program's interface exactly.

## Anchor CLI

The Anchor CLI provides essential commands:

\`\`\`bash
anchor init my-project    # Create new project
anchor build              # Compile the program
anchor test               # Run tests (local validator)
anchor deploy             # Deploy to devnet/mainnet
anchor upgrade            # Upgrade existing program
\`\`\`

## Project Structure

An Anchor project follows a standard layout:

\`\`\`
my-project/
├── programs/
│   └── my_program/       # Rust program code
│       ├── src/
│       │   └── lib.rs
│       └── Cargo.toml
├── tests/
│   └── my_program.ts     # TypeScript tests
├── migrations/
│   └── deploy.ts         # Deployment scripts
├── Anchor.toml           # Project configuration
├── Cargo.toml            # Workspace configuration
└── target/
    └── idl/              # Generated IDL files
\`\`\`

Anchor handles serialization, account validation, and error handling automatically—letting you write secure programs with significantly less code than raw Solana programming.
`,
  xpReward: 25,
  order: 1,
  moduleId: 'module-1-anchor-basics',
};

const lesson2: Lesson = {
  id: 'lesson-2-account-constraints',
  title: 'Account Constraints & Macros',
  slug: 'account-constraints-and-macros',
  type: 'content',
  content: `# Account Constraints & Macros

One of Anchor's most powerful features is **account constraints**—declarative security rules that validate accounts before your instruction runs. Instead of manually checking account ownership and data, you declare requirements and Anchor enforces them automatically.

## The #[account] Attribute

When applied to a struct, \`#[account]\` derives essential traits:
- **Serialize/Deserialize**: Borsh encoding/decoding
- **Owner**: Sets the owner to your program ID
- **Discriminator**: 8-byte unique identifier for account types

\`\`\`rust
#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub name: String,
    pub score: u64,
}
\`\`\`

## Common Constraints

### init
Creates a new account with space allocation:

\`\`\`rust
#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 4 + 20 + 8  // discriminator + pubkey + string prefix + name + score
    )]
    pub user: Account<'info, UserProfile>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`

Space calculation breakdown:
- 8 bytes: Account discriminator (auto-added by Anchor)
- 32 bytes: Pubkey
- 4 + 20 bytes: String (4-byte length prefix + content)
- 8 bytes: u64

### mut
Marks an account as mutable (required for any state changes):

\`\`\`rust
#[account(mut)]
pub user: Account<'info, UserProfile>,
\`\`\`

### seeds + bump (PDA Accounts)
Creates or validates Program Derived Addresses:

\`\`\`rust
#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`

### has_one
Verifies that an account field matches a passed account:

\`\`\`rust
#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = owner)]  // Verifies profile.owner == owner.key()
    pub profile: Account<'info, UserProfile>,
    pub owner: Signer<'info>,
}
\`\`\`

### close
Closes an account and returns rent to a specified recipient:

\`\`\`rust
#[account(mut, close = recipient)]
pub account_to_close: Account<'info, MyAccount>,
\`\`\`

### constraint
Custom validation with arbitrary expressions:

\`\`\`rust
#[account(
    mut,
    constraint = account.value > 0 @ ErrorCode::InvalidValue
)]
pub account: Account<'info, MyAccount>,
\`\`\`

## Complete Example

Here's a vault program with comprehensive constraints:

\`\`\`rust
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        init_if_needed,  // Creates if doesn't exist, validates if does
        payer = user,
        space = 8 + 8,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
\`\`\`

These constraints execute in order, and if any fail, the transaction reverts before your instruction logic runs—providing security by default.
`,
  xpReward: 30,
  order: 2,
  moduleId: 'module-1-anchor-basics',
};

const lesson3: Lesson = {
  id: 'lesson-3-error-handling',
  title: 'Error Handling',
  slug: 'error-handling',
  type: 'content',
  content: `# Error Handling

Robust error handling is essential for production Solana programs. Anchor provides a type-safe, expressive error system that integrates with the IDL for excellent client-side error reporting.

## Defining Error Codes

Define custom errors using the \`#[error_code]\` attribute:

\`\`\`rust
#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount provided")]
    InvalidAmount,
    #[msg("Insufficient funds in account")]
    InsufficientFunds,
    #[msg("User is not authorized")]
    Unauthorized,
    #[msg("Account is already initialized")]
    AlreadyInitialized,
    #[msg("Invalid account owner")]
    InvalidOwner,
}
\`\`\`

The \`#[msg]\` attribute provides human-readable error messages that appear in the IDL and client-side error objects.

## Using Errors in Instructions

Use \`require!\` for inline checks and \`err!\` to return errors:

\`\`\`rust
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    // Check amount is valid
    require!(amount > 0, ErrorCode::InvalidAmount);
    
    let vault = &mut ctx.accounts.vault;
    let user_balance = ctx.accounts.user_token_account.amount;
    
    // Check sufficient balance
    require!(
        user_balance >= amount,
        ErrorCode::InsufficientFunds
    );
    
    // Check authorization
    require!(
        vault.owner == ctx.accounts.user.key(),
        ErrorCode::Unauthorized
    );
    
    vault.balance = vault.balance.checked_add(amount)
        .ok_or(ErrorCode::InvalidAmount)?;
    
    Ok(())
}
\`\`\`

## Error Propagation with ?

Use the \`?\` operator to propagate errors from fallible operations:

\`\`\`rust
// Anchor's checked math returns Option, convert to Result
let new_balance = old_balance
    .checked_add(amount)
    .ok_or(ErrorCode::Overflow)?;

// CPI calls return Result, propagate with ?
token::transfer(cpi_ctx, amount)?;
\`\`\`

## AnchorError on the Client

When a transaction fails, Anchor clients receive an \`AnchorError\` with structured information:

\`\`\`typescript
import { AnchorError } from "@coral-xyz/anchor";

try {
  await program.methods
    .deposit(new BN(1000))
    .accounts({ vault, user, ... })
    .rpc();
} catch (err) {
  if (err instanceof AnchorError) {
    console.log("Error code:", err.error.errorCode.code);
    console.log("Message:", err.error.errorMessage);
    console.log("Program:", err.program);
  }
}
\`\`\`

## Common Error Patterns

**Input Validation:**
\`\`\`rust
require!(amount > 0 && amount <= MAX_AMOUNT, ErrorCode::InvalidAmount);
require!(name.len() <= MAX_NAME_LEN, ErrorCode::NameTooLong);
\`\`\`

**Authorization Checks:**
\`\`\`rust
require!(
    ctx.accounts.authority.key() == expected_authority,
    ErrorCode::Unauthorized
);
\`\`\`

**State Validation:**
\`\`\`rust
require!(!account.is_initialized, ErrorCode::AlreadyInitialized);
require!(account.status == Status::Active, ErrorCode::AccountInactive);
\`\`\`

Good error handling makes programs easier to debug and provides clear feedback when transactions fail—essential for production applications.
`,
  xpReward: 25,
  order: 3,
  moduleId: 'module-1-anchor-basics',
};


const lesson4: Lesson = {
  id: 'lesson-4-state-management',
  title: 'State Management',
  slug: 'state-management',
  type: 'content',
  content: `# State Management

Managing state effectively is crucial for building scalable Solana programs. Unlike traditional databases, Solana stores state in accounts, and understanding how to organize and access these accounts is fundamental to Anchor development.

## PDA-Based State Accounts

Program Derived Addresses are the primary pattern for program state. Each PDA represents a distinct piece of state and can be derived deterministically from seeds.

## Space Calculation

Always calculate space precisely to avoid wasting rent or hitting size limits:

\`\`\`rust
// Account struct
#[account]
pub struct UserVault {
    pub owner: Pubkey,        // 32 bytes
    pub balance: u64,         // 8 bytes
    pub bump: u8,             // 1 byte (store bump for CPI signing)
}

// Space calculation: 8 (discriminator) + 32 + 8 + 1 = 49 bytes
#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserVault::SIZE,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, UserVault>,
    // ... other accounts
}

impl UserVault {
    pub const SIZE: usize = 32 + 8 + 1; // 41 bytes
}
\`\`\`

## Common State Patterns

### Global Config PDA

Single configuration account for the entire program:

\`\`\`rust
#[account]
pub struct ProgramConfig {
    pub admin: Pubkey,
    pub fee_percentage: u64,
    pub paused: bool,
}

// Seeds: ["config"] - always the same address
#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 1,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, ProgramConfig>,
    // ...
}
\`\`\`

### User-Specific PDA

One account per user, derived from their pubkey:

\`\`\`rust
#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub username: String,
    pub reputation: u64,
}

// Seeds: ["profile", user_pubkey] - unique per user
#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + 20 + 8,
        seeds = [b"profile", owner.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub owner: Signer<'info>,
    // ...
}
\`\`\`

### Collection Pattern

When you need a list of items but accounts have size limits, use a counter PDA plus indexed PDAs:

\`\`\`rust
#[account]
pub struct ProposalRegistry {
    pub proposal_count: u64,
}

#[account]
pub struct Proposal {
    pub id: u64,
    pub proposer: Pubkey,
    pub description: String,
    pub votes_for: u64,
    pub votes_against: u64,
}

// Create new proposal
#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(mut, seeds = [b"registry"], bump)]
    pub registry: Account<'info, ProposalRegistry>,
    
    #[account(
        init,
        payer = proposer,
        space = 8 + 8 + 32 + 4 + 100 + 8 + 8,
        seeds = [b"proposal", registry.proposal_count.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    // ...
}
\`\`\`

## Zero-Copy Accounts

For very large state that exceeds account size limits (10MB max), use zero-copy deserialization with \`#[account(zero_copy)]\`:

\`\`\`rust
use anchor_lang::zero_copy;

#[zero_copy]
pub struct MarketData {
    pub prices: [u64; 1000],  // 8KB of price data
}
\`\`\`

## Account Reallocation

Anchor supports resizing accounts after creation:

\`\`\`rust
#[derive(Accounts)]
pub struct AddData<'info> {
    #[account(
        mut,
        realloc = 8 + new_data.len(),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`

## Complete Vault Example

\`\`\`rust
#[program]
pub mod vault_program {
    use super::*;

    pub fn initialize_global(ctx: Context<InitializeGlobal>) -> Result<()> {
        let global = &mut ctx.accounts.global_state;
        global.total_deposits = 0;
        global.admin = ctx.accounts.admin.key();
        Ok(())
    }

    pub fn initialize_user_vault(ctx: Context<InitializeUserVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.user.key();
        vault.balance = 0;
        vault.bump = ctx.bumps.vault;
        Ok(())
    }
}

#[account]
pub struct GlobalState {
    pub admin: Pubkey,
    pub total_deposits: u64,
}

#[account]
pub struct UserVault {
    pub owner: Pubkey,
    pub balance: u64,
    pub bump: u8,
}
\`\`\`

Effective state management requires careful planning of account structure, seed derivation, and space allocation.
`,
  xpReward: 30,
  order: 1,
  moduleId: 'module-2-building-programs',
};

const lesson5: Lesson = {
  id: 'lesson-5-cross-program-invocations',
  title: 'Cross-Program Invocations',
  slug: 'cross-program-invocations',
  type: 'content',
  content: `# Cross-Program Invocations

**Cross-Program Invocations (CPIs)** allow your program to call other programs on Solana. This composability is what enables DeFi—your program can interact with tokens, oracles, DEXs, and any other program on the network.

## Basic CPI with CpiContext

Anchor wraps CPIs in a type-safe interface using \`CpiContext\`:

\`\`\`rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.sender_token_account.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::transfer(cpi_ctx, amount)?;
    
    Ok(())
}
\`\`\`

## CPI with PDA Signing

When your program needs to sign for a PDA during a CPI, use \`CpiContext::new_with_signer\`:

\`\`\`rust
pub fn withdraw_from_vault(ctx: Context<WithdrawFromVault>, amount: u64) -> Result<()> {
    let vault = &ctx.accounts.vault;
    
    // Prepare CPI accounts
    let cpi_accounts = Transfer {
        from: ctx.accounts.vault_token_account.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.vault_authority.to_account_info(),
    };
    
    // Create signer seeds for the PDA
    let vault_key = vault.key();
    let seeds = &[
        b"vault_authority",
        vault_key.as_ref(),
        &[ctx.bumps.vault_authority],
    ];
    let signer = &[&seeds[..]];
    
    // Create CPI context with signer
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer,
    );
    
    token::transfer(cpi_ctx, amount)?;
    
    Ok(())
}
\`\`\`

## Common CPI Operations

### Transfer SOL (System Program)

\`\`\`rust
use anchor_lang::system_program::{self, Transfer as SolTransfer};

pub fn transfer_sol(ctx: Context<TransferSol>, amount: u64) -> Result<()> {
    let cpi_accounts = SolTransfer {
        from: ctx.accounts.sender.to_account_info(),
        to: ctx.accounts.recipient.to_account_info(),
    };
    
    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
        amount,
    )?;
    
    Ok(())
}
\`\`\`

### Mint Tokens

\`\`\`rust
use anchor_spl::token::{self, Mint, MintTo, TokenAccount};

pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
    );
    
    token::mint_to(cpi_ctx, amount)?;
    Ok(())
}
\`\`\`

## CPI Constraints

- **Depth limit**: Maximum 4 CPIs deep (your program → program A → program B → program C → program D)
- **Compute budget**: Each CPI consumes compute units; complex call chains may hit the 1.4M limit
- **Signer propagation**: Signers don't automatically propagate through CPIs unless explicitly passed

## anchor_spl Integration

The \`anchor_spl\` crate provides convenient CPI helpers for SPL programs:

\`\`\`toml
[dependencies]
anchor-spl = "0.29.0"
\`\`\`

\`\`\`rust
use anchor_spl::token::{Token, TokenAccount, Mint, transfer, Transfer};
use anchor_spl::associated_token::AssociatedToken;
\`\`\`

Mastering CPIs is essential for building composable DeFi protocols that leverage Solana's ecosystem of battle-tested programs.
`,
  xpReward: 30,
  order: 2,
  moduleId: 'module-2-building-programs',
};

const lesson6: Challenge = {
  id: 'lesson-6-counter-program',
  title: 'Build a Counter Program',
  slug: 'build-a-counter-program',
  type: 'challenge',
  content: `# Build a Counter Program

In this challenge, you will build a complete Anchor counter program. This program allows users to create a counter account, increment it, and decrement it with proper underflow protection.

## Challenge

Complete the counter program below. The Counter account struct is already defined, and the initialize instruction is partially complete. You need to:

1. Complete the initialize instruction to set the initial count to 0
2. Implement the increment instruction to increase count by 1
3. Implement the decrement instruction to decrease count by 1, with underflow protection

The Counter account uses a PDA with seeds \`[b"counter", user.key()]\` so each user has their own counter.
`,
  xpReward: 100,
  order: 3,
  moduleId: 'module-2-building-programs',
  starterCode: `use anchor_lang::prelude::*;

declare_id!("CounterProgram111111111111111111111111111");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // TODO: Set count to 0
        
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        // TODO: Increment counter by 1
        
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        // TODO: Decrement counter by 1
        // Add underflow protection using require!()
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8,  // discriminator + u64
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        has_one = user,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub user: Pubkey,
    pub count: u64,
    pub bump: u8,
}`,
  language: 'rust',
  testCases: [
    {
      name: 'Initialize sets count to 0',
      input: 'initialize()',
      expectedOutput: 'counter.count == 0',
    },
    {
      name: 'Increment increases count by 1',
      input: 'increment()',
      expectedOutput: 'counter.count == 1',
    },
    {
      name: 'Decrement decreases count by 1',
      input: 'decrement() after increment()',
      expectedOutput: 'counter.count == 0',
    },
  ],
  hints: [
    'In initialize, set counter.count = 0 and counter.bump = ctx.bumps.counter',
    'In increment, use counter.count = counter.count.checked_add(1).unwrap() or just += 1',
    'In decrement, check counter.count > 0 with require!() before decrementing',
    'Remember to set counter.user = user.key() in initialize',
  ],
  solution: `use anchor_lang::prelude::*;

declare_id!("CounterProgram111111111111111111111111111");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.user = ctx.accounts.user.key();
        counter.count = 0;
        counter.bump = ctx.bumps.counter;
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        require!(counter.count > 0, ErrorCode::Underflow);
        counter.count = counter.count.checked_sub(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 1,  // discriminator + u64 + bump
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        has_one = user,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub user: Pubkey,
    pub count: u64,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter cannot go below zero")]
    Underflow,
}`,
};


const module1: Module = {
  id: 'module-1-anchor-basics',
  title: 'Anchor Basics',
  order: 1,
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-2-building-programs',
  title: 'Building Programs',
  order: 2,
  lessons: [lesson4, lesson5, lesson6],
};

export const anchorDevelopmentCourse: Course = {
  id: 'course-anchor-development',
  title: 'Anchor Development',
  slug: 'anchor-development',
  description:
    'Build production-ready Solana programs with the Anchor framework. Learn account constraints, state management, cross-program invocations, and testing.',
  difficulty: 'intermediate',
  duration: '10 hours',
  totalXP: 240,
  thumbnailUrl: '/images/courses/anchor-development.jpg',
  instructor: {
    name: 'Superteam Academy',
    avatarUrl: '/images/instructors/default.svg',
    bio: 'Official Superteam Brazil education content',
  },
  modules: [module1, module2],
  tags: ['anchor', 'rust', 'solana', 'programs'],
  language: 'en',
  createdAt,
  updatedAt,
};
