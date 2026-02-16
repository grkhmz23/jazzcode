import type { Course, Module, Lesson, Challenge } from '@/types/content';

const lesson1: Lesson = {
  id: 'spl-token-deep-dive',
  slug: 'spl-token-deep-dive',
  title: 'SPL Token Deep Dive',
  type: 'content',
  xpReward: 125,
  duration: '40 min',
  content: `# SPL Token Deep Dive

SPL Token is the canonical fungible token program on Solana, and Token-2022 is its extensible successor. Both follow the same core account model: mint accounts define supply metadata, token accounts hold balances, and authorities control minting, freezing, and configuration changes. Understanding authority design is critical because authority misconfiguration is one of the most common production failures.

A mint account stores decimals, supply, and authority keys. \
\`mintAuthority\` can create new tokens. \
\`freezeAuthority\` can freeze token accounts, a powerful control often needed for compliance or emergency response but dangerous if centralized. Many projects remove freeze authority after launch to reduce governance risk.

Decimals determine display precision, not economic value. If decimals are 9, then one display token equals 1,000,000,000 base units. Frontends and accounting systems must consistently convert between display amounts and base units to avoid severe UX or accounting bugs.

Supply management patterns:

- Fixed supply: mint once, then revoke mint authority.
- Governed inflation: mint authority controlled by multisig/DAO.
- Programmatic issuance: protocol mints as part of incentive logic.

Example mint flow in TypeScript:

\`\`\`typescript
import { createMint, setAuthority, AuthorityType } from '@solana/spl-token';

const mint = await createMint(connection, payer, mintAuth, freezeAuth, 9);
// Optional: revoke mint authority for capped supply
await setAuthority(
  connection,
  payer,
  mint,
  mintAuth,
  AuthorityType.MintTokens,
  null
);
\`\`\`

Token accounts are separate accounts owned by the token program. Associated Token Accounts (ATAs) provide deterministic account addresses per (owner, mint) pair and are preferred for wallets and dApps. If ATAs are missing, your app should create them as part of user flows.

When auditing token integrations, validate program IDs, mints, token account owners, and authorities at every instruction boundary. Never assume an arbitrary account is a valid token account. Always parse and verify against the token program.

SPL Token fundamentals directly impact treasury safety, user balances, and protocol solvency. Build your token workflows with strict authority policy and explicit account validation from day one.`
};

const lesson2: Lesson = {
  id: 'token-extensions',
  slug: 'token-extensions',
  title: 'Token-2022 Extensions',
  type: 'content',
  xpReward: 125,
  duration: '40 min',
  content: `# Token-2022 Extensions

Token-2022 extends SPL Token with optional features that enable richer token behavior without custom token programs. Instead of rewriting core transfer logic, teams can enable audited extensions such as transfer fees, interest-bearing balances, non-transferable tokens, confidential transfers, and permanent delegates.

Extension design principles:

- Opt-in per mint/account to avoid forcing overhead on all tokens.
- Backward-compatible instruction patterns where practical.
- Explicit extension account sizing requirements before initialization.

**Transfer Fee Extension** allows mint creators to collect protocol fees on transfers. This is useful for creator royalties, protocol revenue, or anti-spam economics. Integrators must understand withheld-fee harvesting and fee authorities.

**Interest-Bearing Tokens** encode yield directly at token-account level via rate parameters. This can simplify UX for rebasing-like designs while preserving SPL compatibility.

**Non-Transferable Tokens** are useful for credentials, attestations, and proof-of-membership assets where ownership should not be tradeable.

**Confidential Transfers** enable encrypted amounts and privacy-preserving semantics with additional cryptographic verification requirements.

**Permanent Delegate** grants a delegate role that cannot be revoked by token holders, appropriate for regulated controls but high risk if governance is weak.

Operational considerations:

- Extension initialization must happen in correct order.
- Mint/account sizes must include extension storage bytes.
- Wallet support varies; unsupported extensions can break UX.
- Audits should verify authority separation for each extension.

Example concept flow for transfer-fee mint setup:

\`\`\`typescript
// Pseudocode outline
// 1) allocate mint account with extension space
// 2) initialize transfer fee config extension
// 3) initialize mint account
// 4) set fee authority and withdraw authority policies
\`\`\`

When to use extensions vs custom program:

- Use Token-2022 extension if requirement matches built-in behavior and interoperability matters.
- Use custom programs when token logic is protocol-specific and cannot be represented safely by existing extensions.

For most production teams, Token-2022 offers a strong balance of flexibility, ecosystem compatibility, and reduced audit surface area compared with writing bespoke token primitives.`
};

const lesson3: Challenge = {
  id: 'create-token-extension',
  slug: 'create-token-extension',
  title: 'Create a Token-2022 Transfer Fee Mint',
  type: 'challenge',
  xpReward: 250,
  duration: '55 min',
  language: 'typescript',
  content: `# Create a Token-2022 Transfer Fee Mint

Implement a utility that returns a deterministic transfer-fee config object for mint initialization. This challenge focuses on correctness of basis-point math and authority assignment strategy.

Return format must be a single string:

\`<feeBps>|<maxFee>|<feeAuthority>|<withdrawAuthority>\`

Use the exact order above.`,
  starterCode: `interface TransferFeeConfigInput {
  feeBps: number;
  maxFee: number;
  feeAuthority: string;
  withdrawAuthority: string;
}

export function buildTransferFeeConfig(input: TransferFeeConfigInput): string {
  // TODO: validate and return "feeBps|maxFee|feeAuthority|withdrawAuthority"
  // feeBps must be between 0 and 10000
  return "";
}

buildTransferFeeConfig({
  feeBps: 25,
  maxFee: 1_000_000,
  feeAuthority: "Gov111",
  withdrawAuthority: "Treasury111",
});`,
  testCases: [
    {
      name: 'Formats canonical config string',
      input: '{"feeBps":25,"maxFee":1000000,"feeAuthority":"Gov111","withdrawAuthority":"Treasury111"}',
      expectedOutput: '25|1000000|Gov111|Treasury111'
    },
    {
      name: 'Supports zero fee config',
      input: '{"feeBps":0,"maxFee":0,"feeAuthority":"GovA","withdrawAuthority":"TreasuryA"}',
      expectedOutput: '0|0|GovA|TreasuryA'
    },
    {
      name: 'Rejects out-of-range bps by throwing',
      input: '{"feeBps":20000,"maxFee":0,"feeAuthority":"Gov","withdrawAuthority":"Treasury"}',
      expectedOutput: 'Error: feeBps must be between 0 and 10000'
    }
  ],
  hints: [
    'Create a guard clause for feeBps range validation first.',
    'Return a pipe-separated string with exactly 4 fields.',
    'Throw an Error with the exact expected message for invalid feeBps.'
  ],
  solution: `interface TransferFeeConfigInput {
  feeBps: number;
  maxFee: number;
  feeAuthority: string;
  withdrawAuthority: string;
}

export function buildTransferFeeConfig(input: TransferFeeConfigInput): string {
  if (input.feeBps < 0 || input.feeBps > 10000) {
    throw new Error("feeBps must be between 0 and 10000");
  }

  return [
    input.feeBps,
    input.maxFee,
    input.feeAuthority,
    input.withdrawAuthority,
  ].join("|");
}

buildTransferFeeConfig({
  feeBps: 25,
  maxFee: 1_000_000,
  feeAuthority: "Gov111",
  withdrawAuthority: "Treasury111",
});`
};

const lesson4: Lesson = {
  id: 'metaplex-basics',
  slug: 'metaplex-basics',
  title: 'Metaplex Basics',
  type: 'content',
  xpReward: 125,
  duration: '40 min',
  content: `# Metaplex Basics

Metaplex defines NFT standards and tooling on Solana, primarily through the Token Metadata program. A standard NFT stack includes:

- Mint account (token supply metadata)
- Token account (owner balance)
- Metadata PDA (name, symbol, URI, creators, seller fee)
- Optional Master Edition PDA for editioned NFTs
- Optional Collection metadata and verification records

The metadata account is a PDA derived from the mint and program seeds. It stores off-chain URI pointers and creator/royalty fields. Production metadata design should consider immutability policy, update authority governance, and URI hosting durability.

Collection verification is central for trust. Without verification, anyone can claim membership in a collection by writing matching metadata fields. A verified collection proves that the designated collection authority signed inclusion, enabling marketplaces and indexers to rely on collection identity.

Creator arrays and \
\`seller_fee_basis_points\` support royalty signaling. Although royalty enforcement depends on marketplace behavior, metadata-level royalties remain important for creator economics and ecosystem compatibility.

Programmable NFTs (pNFTs) add rule-based transfer/use semantics, enabling richer game assets, access badges, and policy-driven interactions. With pNFTs, developers define transfer constraints and use delegates more granularly than legacy metadata flows.

Operational best practices:

- Keep update authority in multisig or governance.
- Pin metadata JSON and media assets to reliable storage (Arweave/IPFS/CDN with persistence guarantees).
- Validate creator shares sum to 100.
- Verify collections immediately in mint flow.

Example conceptual flow:

\`\`\`typescript
// 1) create mint (supply 1)
// 2) create metadata PDA with name/symbol/uri/creators
// 3) create master edition (optional)
// 4) verify into collection via authority signature
\`\`\`

For Solana product teams, Metaplex is less about “JPEG minting” and more about robust digital asset identity. Correct metadata architecture improves indexing, discoverability, trust, and composability across wallets, marketplaces, and protocol integrations.`
};

const lesson5: Lesson = {
  id: 'compressed-nfts',
  slug: 'compressed-nfts',
  title: 'Compressed NFTs',
  type: 'content',
  xpReward: 125,
  duration: '40 min',
  content: `# Compressed NFTs

Compressed NFTs (cNFTs) drastically reduce mint costs by storing ownership and metadata commitments in Merkle trees rather than creating full on-chain accounts per asset. On Solana, this is implemented via Metaplex Bubblegum and account compression primitives.

Traditional NFT minting writes one token account, metadata account, and often master edition account per asset. At scale, this becomes expensive. cNFTs instead append leaves to a concurrent Merkle tree, where each leaf represents asset state. Proofs are used to verify ownership and updates.

Core components:

- **Concurrent Merkle Tree** account: shared state root.
- **Bubblegum program**: mint/transfer/decompress logic.
- **Indexer / DAS API**: query layer for asset discovery and proof retrieval.

Because compressed state is proof-based, indexing infrastructure is essential. Wallets and dApps rely on DAS APIs to list assets, fetch ownership, and resolve metadata. This shifts some complexity from L1 storage into indexing and proof services.

Cost profile comparison (high-level):

- Standard NFT: high per-asset on-chain rent and instruction footprint.
- cNFT: low marginal mint cost; tree creation cost amortized across many assets.

Common use cases include loyalty badges, game items, social collectibles, and large credential systems where minting hundreds of thousands of assets must remain economical.

Security and product considerations:

- Choose tree depth/buffer parameters based on expected throughput.
- Operate or trust reliable indexers for consistent UX.
- Consider decompression pathways if future interoperability requires standard NFT form.

Conceptual mint sequence:

\`\`\`typescript
// 1) create merkle tree with capacity
// 2) call bubblegum mint instruction with owner + metadata args
// 3) indexer ingests leaf updates
// 4) clients query DAS for asset list and proofs
\`\`\`

cNFTs are not “less real” than regular NFTs; they are a different storage strategy optimized for scale. For systems with high mint volumes, they unlock economically viable designs that would be impractical with full-account NFTs.`
};

const lesson6: Challenge = {
  id: 'mint-cnft-collection',
  slug: 'mint-cnft-collection',
  title: 'Mint a cNFT Collection',
  type: 'challenge',
  xpReward: 250,
  duration: '55 min',
  language: 'typescript',
  content: `# Mint a cNFT Collection

Implement a helper that builds a deterministic mint request payload for Bubblegum cNFT minting. The function should produce a stable identifier string from collection + owner + metadata URI.

Output format:

\`collection:owner:uri\`

Use this exact order and delimiter.`,
  starterCode: `interface CNFTMintInput {
  collection: string;
  owner: string;
  uri: string;
}

export function buildCNFTMintRequest(input: CNFTMintInput): string {
  // TODO: validate non-empty fields and return "collection:owner:uri"
  return "";
}

buildCNFTMintRequest({ collection: "COLL1", owner: "Owner1", uri: "https://example.com/meta.json" });`,
  testCases: [
    {
      name: 'Builds request key',
      input: '{"collection":"COLL1","owner":"Owner1","uri":"https://example.com/meta.json"}',
      expectedOutput: 'COLL1:Owner1:https://example.com/meta.json'
    },
    {
      name: 'Supports compact URI',
      input: '{"collection":"A","owner":"B","uri":"ipfs://abc"}',
      expectedOutput: 'A:B:ipfs://abc'
    },
    {
      name: 'Rejects empty owner',
      input: '{"collection":"A","owner":"","uri":"ipfs://abc"}',
      expectedOutput: 'Error: collection, owner, and uri are required'
    }
  ],
  hints: [
    'Validate all three fields before constructing output.',
    'Use a single return statement with template literals or join.',
    'Throw the exact error string expected by tests on missing data.'
  ],
  solution: `interface CNFTMintInput {
  collection: string;
  owner: string;
  uri: string;
}

export function buildCNFTMintRequest(input: CNFTMintInput): string {
  if (!input.collection || !input.owner || !input.uri) {
    throw new Error("collection, owner, and uri are required");
  }

  return input.collection + ':' + input.owner + ':' + input.uri;
}

buildCNFTMintRequest({
  collection: "COLL1",
  owner: "Owner1",
  uri: "https://example.com/meta.json",
});`
};

const module1: Module = {
  id: 'module-token-standards',
  title: 'Token Standards',
  description: 'SPL Token and Token-2022 engineering patterns.',
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-nfts-and-compressed-nfts',
  title: 'NFTs & Compressed NFTs',
  description: 'Metaplex and Bubblegum for large-scale asset systems.',
  lessons: [lesson4, lesson5, lesson6],
};

export const tokenEngineeringCourse: Course = {
  id: 'course-token-engineering',
  slug: 'token-engineering',
  title: 'Token Engineering on Solana',
  description:
    'Design production-grade fungible and non-fungible token systems with Token-2022, Metaplex, and compressed NFT architectures.',
  difficulty: 'intermediate',
  duration: '8 hours',
  totalXP: 1600,
  tags: ['tokens', 'token-2022', 'nft', 'metaplex'],
  imageUrl: '/images/courses/token-engineering.jpg',
  modules: [module1, module2],
};
