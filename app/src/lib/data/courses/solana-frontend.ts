import type { Course, Module, Lesson, Challenge } from '@/types/content';

const lesson1: Lesson = {
  id: 'wallet-adapter-setup',
  title: 'Wallet Adapter Setup',
  slug: 'wallet-adapter-setup',
  type: 'content',
  content: `# Wallet Adapter Setup

The **Solana Wallet Adapter** is the standard way to connect wallets to Solana dApps. It provides a unified interface that works with Phantom, Solflare, Backpack, Torus, and 20+ other wallets, letting you write wallet-agnostic code while giving users their choice of wallet.

## The Adapter Ecosystem

The wallet adapter consists of multiple packages:

- **@solana/wallet-adapter-react**: React hooks and context providers
- **@solana/wallet-adapter-react-ui**: Pre-built wallet selection modal and connect button
- **@solana/wallet-adapter-base**: Core types and interfaces
- **@solana/wallet-adapter-wallets**: Individual wallet adapters (Phantom, Solflare, etc.)

## Provider Setup

Your React app needs three nested providers to enable wallet functionality:

\`\`\`tsx
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles

function App() {
  // Network endpoint
  const endpoint = clusterApiUrl('devnet');
  // Or for mainnet: const endpoint = clusterApiUrl('mainnet-beta');
  // Or use your own RPC: const endpoint = 'https://api.mainnet-beta.solana.com';

  // Supported wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    // Add more wallets as needed
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <YourApp />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
\`\`\`

## Provider Breakdown

**ConnectionProvider**: Manages the RPC connection to the Solana network. Provides the \`Connection\` instance to all child components via the \`useConnection()\` hook.

**WalletProvider**: Manages wallet state and the list of supported wallets. The \`autoConnect\` prop automatically reconnects to the last used wallet on page refresh (if the user previously approved).

**WalletModalProvider**: Provides the wallet selection modal UI. When users click "Select Wallet", this modal appears with all configured wallets.

## Network Selection

Always make network selection explicit and visible to users:

\`\`\`tsx
const networks = {
  'mainnet-beta': clusterApiUrl('mainnet-beta'),
  devnet: clusterApiUrl('devnet'),
  testnet: clusterApiUrl('testnet'),
};

function NetworkSelector() {
  const { connection } = useConnection();
  const [network, setNetwork] = useState<keyof typeof networks>('devnet');

  return (
    <select value={network} onChange={(e) => setNetwork(e.target.value as keyof typeof networks)}>
      <option value="devnet">Devnet</option>
      <option value="mainnet-beta">Mainnet</option>
      <option value="testnet">Testnet</option>
    </select>
  );
}
\`\`\`

## Wallet Button Components

The UI package provides ready-to-use components:

\`\`\`tsx
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

function WalletSection() {
  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}
\`\`\`

\`WalletMultiButton\` shows "Select Wallet" when disconnected, then the wallet name and truncated address when connected. \`WalletDisconnectButton\` appears only when connected.

This provider setup is the foundation—all other wallet functionality builds on these contexts.
`,
  xpReward: 25,
  duration: '30 min',
};

const lesson2: Lesson = {
  id: 'connecting-signing',
  title: 'Connecting & Signing',
  slug: 'connecting-and-signing',
  type: 'content',
  content: `# Connecting & Signing

Once providers are set up, you interact with wallets through hooks. The wallet adapter provides a clean API for connecting, disconnecting, signing transactions, and signing arbitrary messages.

## The useWallet Hook

The primary hook for wallet interaction:

\`\`\`tsx
import { useWallet } from '@solana/wallet-adapter-react';

function WalletInfo() {
  const {
    publicKey,        // PublicKey | null
    connected,        // boolean
    connecting,       // boolean - connection in progress
    disconnecting,    // boolean - disconnection in progress
    wallet,           // Wallet | null - adapter instance
    wallets,          // Wallet[] - all configured wallets
    select,           // (walletName: string) => void
    connect,          // () => Promise<void>
    disconnect,       // () => Promise<void>
    signTransaction,  // (tx: Transaction) => Promise<Transaction>
    signAllTransactions, // (txs: Transaction[]) => Promise<Transaction[]>
    signMessage,      // (message: Uint8Array) => Promise<Uint8Array>
  } = useWallet();

  if (connecting) return <p>Connecting...</p>;
  if (!connected) return <button onClick={connect}>Connect Wallet</button>;

  return (
    <div>
      <p>Connected: {publicKey?.toBase58()}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
\`\`\`

## The useConnection Hook

For RPC operations, use the connection hook:

\`\`\`tsx
import { useConnection } from '@solana/wallet-adapter-react';

function BalanceDisplay() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    const fetchBalance = async () => {
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9); // Convert lamports to SOL
    };

    fetchBalance();

    // Subscribe to balance changes
    const subscription = connection.onAccountChange(publicKey, (account) => {
      setBalance(account.lamports / 1e9);
    });

    return () => {
      connection.removeAccountChangeListener(subscription);
    };
  }, [connection, publicKey]);

  return <p>Balance: {balance?.toFixed(4)} SOL</p>;
}
\`\`\`

## Sign In With Solana (SIWS)

Message signing for authentication:

\`\`\`tsx
async function signInWithSolana() {
  const { publicKey, signMessage } = useWallet();
  
  if (!publicKey || !signMessage) {
    throw new Error('Wallet not connected or does not support message signing');
  }

  const message = new TextEncoder().encode(
    'Sign this message to authenticate with Superteam Academy'
  );

  try {
    const signature = await signMessage(message);
    // Send signature and publicKey to backend for verification
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: publicKey.toBase58(),
        message: Buffer.from(message).toString('base64'),
        signature: Buffer.from(signature).toString('base64'),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Sign in failed:', error);
    return false;
  }
}
\`\`\`

## Wallet Selection Modal

For custom wallet selection UI:

\`\`\`tsx
import { useWallet } from '@solana/wallet-adapter-react';

function WalletSelector() {
  const { wallets, select, wallet, connected, connect } = useWallet();

  const handleSelect = async (walletName: string) => {
    select(walletName);
    // Auto-connect after selection
    setTimeout(() => connect(), 100);
  };

  return (
    <div className="wallet-selector">
      {wallets.map((w) => (
        <button
          key={w.adapter.name}
          onClick={() => handleSelect(w.adapter.name)}
          disabled={w.readyState === 'NotDetected'}
        >
          <img src={w.adapter.icon} alt={w.adapter.name} />
          {w.adapter.name}
          {w.readyState === 'NotDetected' && ' (Not Installed)'}
        </button>
      ))}
    </div>
  );
}
\`\`\`

## Graceful Disconnection

Always handle disconnection cleanup:

\`\`\`tsx
function useWalletCleanup() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (!connected && publicKey) {
      // Wallet was disconnected, clear any sensitive state
      localStorage.removeItem('authToken');
      // Reset app state
    }
  }, [connected, publicKey]);
}
\`\`\`

Understanding these hooks is essential for building responsive, wallet-aware dApp UIs.
`,
  xpReward: 25,
  duration: '30 min',
};

const lesson3: Lesson = {
  id: 'transaction-ux',
  title: 'Transaction UX Patterns',
  slug: 'transaction-ux-patterns',
  type: 'content',
  content: `# Transaction UX Patterns

A great Solana dApp doesn't just send transactions—it guides users through the entire transaction lifecycle with clear feedback, loading states, and error handling.

## Transaction Lifecycle

Transactions go through distinct phases:

1. **Building**: Creating the Transaction object
2. **Signing**: User approves in wallet
3. **Sending**: Submitting to RPC
4. **Confirming**: Waiting for block inclusion
5. **Confirmed/Failed**: Final state

\`\`\`tsx
type TransactionStatus = 
  | 'building'
  | 'signing' 
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'failed';

interface TransactionState {
  status: TransactionStatus;
  signature: string | null;
  error: Error | null;
  confirmations: number;
}
\`\`\`

## Complete Send Component

\`\`\`tsx
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

function SendTransaction() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [state, setState] = useState<TransactionState>({
    status: 'building',
    signature: null,
    error: null,
    confirmations: 0,
  });

  const sendSOL = async (recipient: string, amount: number) => {
    if (!publicKey || !signTransaction) return;

    setState({ status: 'building', signature: null, error: null, confirmations: 0 });

    try {
      // Build transaction
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign
      setState(s => ({ ...s, status: 'signing' }));
      const signed = await signTransaction(transaction);

      // Send
      setState(s => ({ ...s, status: 'sending' }));
      const signature = await connection.sendRawTransaction(signed.serialize());
      setState(s => ({ ...s, signature, status: 'confirming' }));

      // Confirm with timeout and retry
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + confirmation.value.err.toString());
      }

      setState(s => ({ ...s, status: 'confirmed' }));
    } catch (error) {
      setState(s => ({ 
        ...s, 
        status: 'failed', 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
    }
  };

  return (
    <div>
      <button onClick={() => sendSOL('recipient...', 0.1)}>
        Send 0.1 SOL
      </button>
      
      {state.status === 'signing' && <p>Please approve in your wallet...</p>}
      {state.status === 'sending' && <p>Sending transaction...</p>}
      {state.status === 'confirming' && <p>Confirming on Solana...</p>}
      {state.status === 'confirmed' && (
        <p>
          ✓ Confirmed! 
          <a href={\`https://explorer.solana.com/tx/\${state.signature}?cluster=devnet\`}>
            View on Explorer
          </a>
        </p>
      )}
      {state.status === 'failed' && (
        <p>✗ Failed: {state.error?.message}</p>
      )}
    </div>
  );
}
\`\`\`

## Error Mapping

Map Solana errors to user-friendly messages:

\`\`\`tsx
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();
  
  if (message.includes('0x1')) {
    return 'Insufficient funds for this transaction';
  }
  if (message.includes('blockhash not found')) {
    return 'Transaction expired. Please try again.';
  }
  if (message.includes('user rejected')) {
    return 'Transaction was rejected in wallet';
  }
  if (message.includes('too large')) {
    return 'Transaction size exceeds limit';
  }
  return 'Transaction failed. Please try again.';
}
\`\`\`

## Optimistic Updates

Update UI immediately before confirmation:

\`\`\`tsx
function OptimisticTransfer({ onTransfer }: { onTransfer: (amount: number) => void }) {
  const [pendingAmount, setPendingAmount] = useState(0);

  const handleTransfer = async (amount: number) => {
    // Optimistically update
    setPendingAmount(amount);
    onTransfer(amount);

    try {
      await sendTransaction(amount);
    } catch (error) {
      // Rollback on failure
      setPendingAmount(0);
      onTransfer(-amount);
      throw error;
    }
  };

  return (
    <div>
      <p>Balance: {balance - pendingAmount} SOL</p>
      <button onClick={() => handleTransfer(1)}>Send 1 SOL</button>
      {pendingAmount > 0 && <span> (pending...)</span>}
    </div>
  );
}
\`\`\`

Great transaction UX builds user trust through transparency and graceful handling of the blockchain's asynchronous nature.
`,
  xpReward: 25,
  duration: '30 min',
};


const lesson4: Lesson = {
  id: 'rpc-methods',
  title: 'RPC Methods',
  slug: 'rpc-methods',
  type: 'content',
  content: `# RPC Methods

Reading on-chain data is fundamental to dApp development. The Solana Web3.js \`Connection\` class provides a rich set of RPC methods for querying accounts, balances, transaction history, and program state.

## Connection Class

Create a connection to an RPC endpoint:

\`\`\`typescript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Public RPC endpoints
const devnetConnection = new Connection(clusterApiUrl('devnet'));
const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'));

// Custom/private RPC (recommended for production)
const heliusConnection = new Connection('https://mainnet.helius-rpc.com/?api-key=YOUR_KEY');

// Commitment level options
const connection = new Connection(endpoint, 'confirmed');
\`\`\`

## Account Information

Fetch basic account data:

\`\`\`typescript
import { Connection, PublicKey } from '@solana/web3.js';

async function getAccountInfo(connection: Connection, address: string) {
  const publicKey = new PublicKey(address);
  
  // Get raw account info
  const accountInfo = await connection.getAccountInfo(publicKey);
  
  if (!accountInfo) {
    console.log('Account does not exist');
    return null;
  }

  return {
    lamports: accountInfo.lamports,
    owner: accountInfo.owner.toBase58(),
    executable: accountInfo.executable,
    rentEpoch: accountInfo.rentEpoch,
    dataSize: accountInfo.data.length,
    data: accountInfo.data, // Raw Buffer
  };
}
\`\`\`

## Program Accounts

Fetch all accounts owned by a program with filters:

\`\`\`typescript
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

async function getTokenAccounts(connection: Connection, owner: PublicKey) {
  // Get all token accounts for a specific owner
  const accounts = await connection.getTokenAccountsByOwner(
    owner,
    { programId: TOKEN_PROGRAM_ID }
  );

  return accounts.value.map(({ pubkey, account }) => ({
    address: pubkey.toBase58(),
    lamports: account.lamports,
    data: account.data,
  }));
}

// Advanced: GetProgramAccounts with memcmp filters
async function findSpecificAccounts(connection: Connection) {
  const accounts = await connection.getProgramAccounts(
    MY_PROGRAM_ID,
    {
      filters: [
        // Filter by data size (e.g., only our specific account type)
        { dataSize: 100 },
        // Filter by bytes at offset
        {
          memcmp: {
            offset: 0, // Start of account data
            bytes: 'YourDiscriminatorBase58', // Account discriminator
          },
        },
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: 'SpecificOwnerPublicKey',
          },
        },
      ],
    }
  );

  return accounts;
}
\`\`\`

## Batch Requests

Optimize by fetching multiple accounts at once:

\`\`\`typescript
async function getMultipleAccounts(
  connection: Connection,
  addresses: string[]
) {
  const publicKeys = addresses.map(addr => new PublicKey(addr));
  
  const accounts = await connection.getMultipleAccountsInfo(publicKeys);
  
  return accounts.map((account, index) => ({
    address: addresses[index],
    exists: account !== null,
    lamports: account?.lamports ?? 0,
    owner: account?.owner.toBase58(),
  }));
}

// Usage: Fetch 100 accounts in a single RPC call
const accounts = await getMultipleAccounts(connection, addressList);
\`\`\`

## Commitment Levels

Solana provides three commitment levels:

- **processed**: Latest processed block (fastest, lowest confirmation)
- **confirmed**: Block confirmed by cluster (~400ms, recommended for most apps)
- **finalized**: Block finalized (~12 seconds, highest security)

\`\`\`typescript
// Default for connection
const connection = new Connection(endpoint, 'confirmed');

// Override for specific calls
const account = await connection.getAccountInfo(pubkey, 'finalized');
\`\`\`

## Subscription Methods

Real-time updates via WebSocket:

\`\`\`typescript
// Subscribe to account changes
const subscriptionId = connection.onAccountChange(
  publicKey,
  (accountInfo) => {
    console.log('Account updated:', accountInfo.lamports);
  },
  'confirmed'
);

// Subscribe to program account changes
const programSub = connection.onProgramAccountChange(
  programId,
  (keyedAccountInfo) => {
    console.log('Program account changed:', keyedAccountInfo.accountId.toBase58());
  }
);

// Cleanup
connection.removeAccountChangeListener(subscriptionId);
\`\`\`

Efficient data reading requires understanding these RPC methods and when to use batching vs subscriptions.
`,
  xpReward: 25,
  duration: '30 min',
};

const lesson5: Lesson = {
  id: 'account-deserialization',
  title: 'Account Deserialization',
  slug: 'account-deserialization',
  type: 'content',
  content: `# Account Deserialization

Raw account data is just a byte buffer. To use it in your app, you must deserialize it according to the account's schema. Different programs use different serialization formats.

## Anchor Account Deserialization

Anchor uses Borsh serialization. The easiest way to deserialize is using Anchor's IDL:

\`\`\`typescript
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from './idl/my_program.json'; // Generated by anchor build

const program = new Program(idl, provider);

// Fetch and deserialize an account
const account = await program.account.myAccount.fetch(accountAddress);
console.log(account.someField); // Typed and deserialized

// Fetch multiple accounts
const accounts = await program.account.myAccount.all();
accounts.forEach(({ publicKey, account }) => {
  console.log(publicKey.toBase58(), account);
});

// Fetch with filter (uses memcmp internally)
const filtered = await program.account.myAccount.all([
  {
    memcmp: {
      offset: 8, // After discriminator
      bytes: ownerPublicKey.toBase58(),
    },
  },
]);
\`\`\`

## Manual Borsh Deserialization

For non-Anchor accounts, use @coral-xyz/borsh:

\`\`\`typescript
import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js';

// Define schema matching your Rust struct
class MyAccount {
  owner: PublicKey;
  amount: bigint;
  isActive: boolean;

  constructor(fields: { owner: Uint8Array; amount: bigint; isActive: boolean }) {
    this.owner = new PublicKey(fields.owner);
    this.amount = fields.amount;
    this.isActive = fields.isActive;
  }
}

const schema = borsh.struct([
  borsh.publicKey('owner'),
  borsh.u64('amount'),
  borsh.bool('isActive'),
]);

function deserializeAccount(data: Buffer): MyAccount {
  // Skip 8-byte discriminator if Anchor account
  const accountData = data.slice(8);
  return schema.decode(accountData);
}
\`\`\`

## SPL Token Account Layout

Token accounts have a fixed layout:

\`\`\`typescript
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';

async function parseTokenAccount(connection: Connection, address: string) {
  const accountInfo = await connection.getAccountInfo(new PublicKey(address));
  
  if (!accountInfo || !accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
    throw new Error('Not a token account');
  }

  const decoded = AccountLayout.decode(accountInfo.data);

  return {
    mint: new PublicKey(decoded.mint).toBase58(),
    owner: new PublicKey(decoded.owner).toBase58(),
    amount: decoded.amount.toString(), // u64 as string (BigInt)
    delegate: decoded.delegateOption === 1 
      ? new PublicKey(decoded.delegate).toBase58() 
      : null,
    state: decoded.state, // 0=uninitialized, 1=initialized, 2=frozen
    isNative: decoded.isNativeOption === 1 ? decoded.isNative.toString() : null,
    delegatedAmount: decoded.delegatedAmount.toString(),
    closeAuthority: decoded.closeAuthorityOption === 1
      ? new PublicKey(decoded.closeAuthority).toBase58()
      : null,
  };
}
\`\`\`

## Handling Discriminators

Anchor accounts start with an 8-byte discriminator:

\`\`\`typescript
import { sha256 } from '@noble/hashes/sha256';

// Calculate discriminator for "account:MyAccount"
function getDiscriminator(accountName: string): Buffer {
  const hash = sha256(Buffer.from(\`account:\${accountName}\`));
  return Buffer.from(hash.slice(0, 8));
}

// Verify account type
function verifyAccountType(data: Buffer, expectedDiscriminator: Buffer): boolean {
  const discriminator = data.slice(0, 8);
  return discriminator.equals(expectedDiscriminator);
}
\`\`\`

## Buffer Layout Helpers

\`\`\`typescript
import { struct, u8, u32, u64, publicKey, bool, str } from '@project-serum/borsh';

// Variable-length string handling
const accountSchema = struct([
  publicKey('owner'),
  u64('createdAt'),
  str('name'), // Variable length
  bool('isActive'),
  u8('category'),
]);
\`\`\`

Proper deserialization transforms raw blockchain data into usable TypeScript objects that your UI components can render directly.
`,
  xpReward: 25,
  duration: '30 min',
};

const lesson6: Challenge = {
  id: 'token-dashboard',
  title: 'Build a Token Dashboard',
  slug: 'build-a-token-dashboard',
  type: 'challenge',
  content: `# Build a Token Dashboard

In this challenge, you will build a complete token dashboard that displays all SPL tokens owned by the connected wallet. This combines wallet adapter integration with RPC data fetching and deserialization.

## Challenge

Complete the TokenDashboard component below. The wallet connection setup is done. You need to:

1. Fetch all SPL token accounts for the connected wallet using getTokenAccountsByOwner
2. Parse each token account to extract mint address, balance, and decimals
3. Display tokens in a list with proper formatting

## Token Account Info

Token accounts contain:
- \`mint\`: The token's mint address
- \`owner\`: The wallet that owns these tokens
- \`amount\`: Raw token amount (needs to be divided by 10^decimals)
- The mint account (separate call) contains \`decimals\`

For this challenge, you can display raw amounts and just show the mint address alongside.
`,
  xpReward: 100,
  duration: '30 min',
  starterCode: `import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getAccount, getMint } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

interface TokenInfo {
  mint: string;
  balance: string;
  decimals: number;
}

export function TokenDashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) {
      setTokens([]);
      return;
    }

    const fetchTokens = async () => {
      setLoading(true);
      
      try {
        // TODO: Fetch all token accounts owned by publicKey
        // Use connection.getTokenAccountsByOwner with TOKEN_PROGRAM_ID
        
        // TODO: For each token account, parse the account data
        // Use getAccount(connection, tokenAccountAddress) from @solana/spl-token
        
        // TODO: Get mint info to fetch decimals
        // Use getMint(connection, mintAddress) from @solana/spl-token
        
        // TODO: Build TokenInfo array with mint, balance (formatted with decimals), and decimals
        
        // HINT: const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
        
        setTokens([]); // Replace with actual token data
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [connection, publicKey, connected]);

  if (!connected) {
    return <p>Connect your wallet to view tokens</p>;
  }

  return (
    <div>
      <h2>Your Tokens</h2>
      {loading && <p>Loading...</p>}
      
      {!loading && tokens.length === 0 && (
        <p>No tokens found</p>
      )}
      
      {!loading && tokens.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Mint Address</th>
              <th>Balance</th>
              <th>Decimals</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.mint}>
                <td>{token.mint}</td>
                <td>{token.balance}</td>
                <td>{token.decimals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`,
  language: 'typescript',
  testCases: [
    {
      name: 'Fetches token accounts for connected wallet',
      input: 'wallet with 3 token accounts',
      expectedOutput: '3 tokens displayed',
    },
    {
      name: 'Displays correct balance with decimals',
      input: 'token with 1000000 amount and 6 decimals',
      expectedOutput: 'balance shows 1.000000',
    },
    {
      name: 'Handles empty wallet',
      input: 'wallet with no tokens',
      expectedOutput: 'shows "No tokens found" message',
    },
  ],
  hints: [
    'Use connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }) to get all token accounts',
    'Import getAccount from @solana/spl-token to parse token account data',
    'Use getMint(connection, mintAddress) to get decimal information for each token',
    'Format balance by dividing amount by 10^decimals: (Number(amount) / 10^decimals).toFixed(decimals)',
    'Remember to handle the case where the user has no token accounts',
  ],
  solution: `import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getAccount, getMint } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

interface TokenInfo {
  mint: string;
  balance: string;
  decimals: number;
}

export function TokenDashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) {
      setTokens([]);
      return;
    }

    const fetchTokens = async () => {
      setLoading(true);
      
      try {
        // Fetch all token accounts owned by the wallet
        const tokenAccounts = await connection.getTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        // Parse each token account
        const tokenInfoPromises = tokenAccounts.value.map(async ({ pubkey }) => {
          // Get parsed token account info
          const account = await getAccount(connection, pubkey);
          
          // Get mint info for decimals
          const mint = await getMint(connection, account.mint);
          
          // Format balance
          const amount = Number(account.amount);
          const balance = (amount / Math.pow(10, mint.decimals)).toFixed(mint.decimals);

          return {
            mint: account.mint.toBase58(),
            balance,
            decimals: mint.decimals,
          };
        });

        const tokenInfo = await Promise.all(tokenInfoPromises);
        setTokens(tokenInfo);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [connection, publicKey, connected]);

  if (!connected) {
    return <p>Connect your wallet to view tokens</p>;
  }

  return (
    <div>
      <h2>Your Tokens</h2>
      {loading && <p>Loading...</p>}
      
      {!loading && tokens.length === 0 && (
        <p>No tokens found</p>
      )}
      
      {!loading && tokens.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Mint Address</th>
              <th>Balance</th>
              <th>Decimals</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.mint}>
                <td>{token.mint}</td>
                <td>{token.balance}</td>
                <td>{token.decimals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`,
};


const module1: Module = {
  id: 'module-1-wallet-integration',
  title: 'Wallet Integration',
  description: '',
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-2-reading-on-chain-data',
  title: 'Reading On-Chain Data',
  description: '',
  lessons: [lesson4, lesson5, lesson6],
};

export const solanaFrontendCourse: Course = {
  id: 'course-solana-frontend',
  title: 'Solana Frontend Development',
  slug: 'solana-frontend',
  description:
    'Build production frontend applications for Solana. Master wallet integration, transaction handling, on-chain data reading, and real-time subscriptions.',
  difficulty: 'intermediate',
  duration: '8 hours',
  totalXP: 225,
  imageUrl: '/images/courses/solana-frontend.jpg',
  modules: [module1, module2],
  tags: ['frontend', 'react', 'wallet', 'dapp'],
};
