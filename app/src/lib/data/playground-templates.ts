/**
 * Playground Templates - Pre-built code examples for the Solana playground
 */

export interface PlaygroundTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const playgroundTemplates: PlaygroundTemplate[] = [
  {
    id: "sol-transfer",
    name: "SOL Transfer",
    description: "Transfer SOL between wallets using @solana/web3.js",
    code: `// SOL Transfer Example
// This demonstrates a basic SOL transfer on Solana devnet

const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Check balance of a devnet wallet
  const publicKey = new PublicKey('11111111111111111111111111111111');
  const balance = await connection.getBalance(publicKey);

  console.log('Address:', publicKey.toBase58());
  console.log('Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
}

main();`,
  },
  {
    id: "token-balance",
    name: "Token Balance",
    description: "Read SPL token balances for a wallet",
    code: `// SPL Token Balance Reader
// Reads all token accounts for a given wallet

const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const wallet = new PublicKey('11111111111111111111111111111111');

  const tokenAccounts = await connection.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID,
  });

  console.log('Found', tokenAccounts.value.length, 'token accounts');

  for (const account of tokenAccounts.value) {
    console.log('Token Account:', account.pubkey.toBase58());
  }
}

main();`,
  },
  {
    id: "pda-derivation",
    name: "PDA Derivation",
    description: "Derive a Program Derived Address",
    code: `// PDA Derivation Example
// Shows how to derive deterministic addresses on Solana

const { PublicKey } = require('@solana/web3.js');

const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const userWallet = new PublicKey('11111111111111111111111111111111');

// Derive a PDA using seeds
const [pda, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from('user-account'),
    userWallet.toBuffer(),
  ],
  programId
);

console.log('PDA:', pda.toBase58());
console.log('Bump:', bump);
console.log('Seeds: ["user-account", walletPubkey]');`,
  },
  {
    id: "anchor-idl",
    name: "Anchor IDL Parse",
    description: "Parse and explore an Anchor IDL",
    code: `// Anchor IDL Parser
// Shows how to read an Anchor program's interface

const sampleIDL = {
  version: "0.1.0",
  name: "counter",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "counter", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "increment",
      accounts: [
        { name: "counter", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Counter",
      type: {
        kind: "struct",
        fields: [
          { name: "count", type: "u64" },
          { name: "authority", type: "publicKey" },
        ],
      },
    },
  ],
};

console.log('Program:', sampleIDL.name);
console.log('Instructions:', sampleIDL.instructions.map(i => i.name).join(', '));
console.log('Accounts:', sampleIDL.accounts.map(a => a.name).join(', '));

for (const ix of sampleIDL.instructions) {
  console.log('\n' + ix.name + ':');
  console.log('  Accounts:', ix.accounts.map(a => a.name).join(', '));
  console.log('  Args:', ix.args.length ? ix.args.map(a => a.name).join(', ') : 'none');
}`,
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): PlaygroundTemplate | undefined {
  return playgroundTemplates.find((t) => t.id === id);
}

/**
 * Get the default template (first one)
 */
export function getDefaultTemplate(): PlaygroundTemplate {
  return playgroundTemplates[0];
}
