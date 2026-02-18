import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson3Hints,
  lesson3SolutionCode,
  lesson3StarterCode,
  lesson3TestCases,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-3-merkle-insert";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-5-proof-verification";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-8-compression-checkpoint";

const lesson1: Lesson = {
  id: "cnft-v2-merkle-trees",
  slug: "cnft-v2-merkle-trees",
  title: "Merkle trees for state compression",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Merkle trees for state compression

Compressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential for working with compressed NFTs and building compression-aware applications.

A Merkle tree is a binary hash tree where each leaf node contains a hash of data, and each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure and all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.

Tree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves and hash their concatenation to create parents, and repeat until a single root remains. For odd numbers of nodes, the last node is typically promoted to the next level or paired with a zero hash depending on the implementation.

Solana's cNFT implementation uses concurrent Merkle trees with 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small account containing just the root hash and metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.

Key properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, and the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.

## Checklist
- Understand binary hash tree construction
- Know how leaf changes propagate to the root
- Calculate proof size: log2(n) hashes for n leaves
- Recognize depth limits (16-bit = 65,536 max leaves)
- Understand on-chain vs off-chain data split

## Red flags
- Treating Merkle roots as data storage (they're commitments)
- Ignoring depth limits when planning collections
- Storing sensitive data assuming it's "hidden" in the tree
- Not validating proofs against the current root
`,
  blocks: [
    {
      type: "quiz",
      id: "cnft-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "cnft-v2-l1-q1",
          prompt: "What does a Merkle root commit to?",
          options: [
            "The entire tree structure and all leaf data",
            "Only the first and last leaf",
            "The tree depth only",
          ],
          answerIndex: 0,
          explanation: "The root is a cryptographic commitment to all leaves and their positions in the tree.",
        },
        {
          id: "cnft-v2-l1-q2",
          prompt: "How many hash siblings are needed to prove inclusion in a tree with 65,536 leaves?",
          options: ["16", "256", "65536"],
          answerIndex: 0,
          explanation: "Proof size is log2(65536) = 16, making verification efficient even for large collections.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "cnft-v2-leaf-hashing",
  slug: "cnft-v2-leaf-hashing",
  title: "Leaf hashing conventions and metadata",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Leaf hashing conventions and metadata

Leaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility with compression standards and proper proof generation.

Leaf structure for cNFTs includes: asset ID (derived from tree address and leaf index), owner public key, delegate (optional), nonce for uniqueness, and metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization for consistent hashing.

Hashing algorithm uses Keccak-256 for Ethereum compatibility, with domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision with other hash usages. Multiple prefix values exist for different operation types (mint, transfer, burn).

Metadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.

Creator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.

## Checklist
- Understand leaf structure components
- Use correct hashing algorithm (Keccak-256)
- Include proper domain separation prefixes
- Store metadata off-chain with hash commitment
- Handle creator signatures separately from tree

## Red flags
- Using wrong hashing algorithm
- Missing domain separation in leaf hashes
- Storing full metadata on-chain in compressed NFTs
- Ignoring creator verification requirements
`,
  blocks: [
    {
      type: "explorer",
      id: "cnft-v2-l2-leaf-structure",
      title: "Leaf Structure",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "cNFT Leaf Node",
            address: "LeafHash1111111111111111111111111111111111",
            lamports: 0,
            owner: "OffChainData1111111111111111111111111111111",
            executable: false,
            dataLen: 32,
          },
        ],
      },
    },
  ],
};

const lesson3: Challenge = {
  id: "cnft-v2-merkle-insert",
  slug: "cnft-v2-merkle-insert",
  title: "Challenge: Implement Merkle tree insert + root updates",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Implement Merkle tree insert + root updates

Build a Merkle tree implementation with insertions:

- Insert leaves and compute new root
- Update parent hashes up the tree
- Handle tree growth and depth limits
- Return deterministic root updates

Test cases will verify correct root evolution after multiple insertions.`,
  starterCode: lesson3StarterCode,
  testCases: lesson3TestCases,
  hints: lesson3Hints,
  solution: lesson3SolutionCode,
};

const lesson4: Lesson = {
  id: "cnft-v2-proof-generation",
  slug: "cnft-v2-proof-generation",
  title: "Proof generation and path computation",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Proof generation and path computation

Merkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential for working with compressed NFTs and building verification systems.

A Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), and the leaf index (determining the path). The verifier recomputes the root by hashing the leaf with siblings in the correct order, comparing against the expected root.

Proof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. For index i at level n, the position is determined by the nth bit of i.

Proof verification recomputes the root: start with the leaf hash, for each sibling in the proof list, concatenate current hash with sibling (order depends on leaf index bit), hash the result, and compare final result with expected root. Equality proves inclusion.

Proof size efficiency: for a tree with n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.

## Checklist
- Collect sibling hashes at each tree level
- Use leaf index bits to determine concatenation order
- Verify proofs by recomputing root hash
- Handle edge cases (empty tree, single leaf)
- Optimize proof size for network transmission

## Red flags
- Incorrect concatenation order in verification
- Using wrong sibling hash at any level
- Not validating proof length matches tree depth
- Trusting proofs without root comparison
`,
  blocks: [
    {
      type: "quiz",
      id: "cnft-v2-l4-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "cnft-v2-l4-q1",
          prompt: "What determines concatenation order during verification?",
          options: [
            "The leaf index bits at each level",
            "The size of the sibling hashes",
            "The tree root hash",
          ],
          answerIndex: 0,
          explanation: "Each bit of the leaf index determines if the current hash goes left or right in the concatenation.",
        },
        {
          id: "cnft-v2-l4-q2",
          prompt: "How many hashes are in a proof for a tree with 1,024 leaves?",
          options: ["10", "32", "1024"],
          answerIndex: 0,
          explanation: "log2(1024) = 10, so proofs contain 10 sibling hashes.",
        },
      ],
    },
  ],
};

const lesson5: Challenge = {
  id: "cnft-v2-proof-verification",
  slug: "cnft-v2-proof-verification",
  title: "Challenge: Implement proof generation + verifier",
  type: "challenge",
  xpReward: 65,
  duration: "55 min",
  language: "typescript",
  content: `# Challenge: Implement proof generation + verifier

Build a complete proof system:

- Generate proofs from a Merkle tree and leaf index
- Verify proofs against a root hash
- Handle invalid proofs (wrong siblings, wrong index)
- Return deterministic boolean results

Tests will verify both successful proofs and rejection of invalid attempts.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "cnft-v2-collection-minting",
  slug: "cnft-v2-collection-minting",
  title: "Collection mints and metadata simulation",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Collection mints and metadata simulation

Compressed NFT collections use a collection mint as the parent NFT, enabling grouping and verification of related assets. Understanding this hierarchy is essential for building collection-aware applications.

Collection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, and the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.

Metadata simulation for testing allows development without actual on-chain transactions. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array with shares, and collection reference. This data structure matches on-chain format for seamless migration.

Royalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution with verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.

Attacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), and collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, and collection mint verification.

## Checklist
- Understand collection mint hierarchy
- Simulate metadata for testing
- Implement royalty calculations
- Verify collection membership
- Handle metadata hash verification

## Red flags
- Accepting NFTs without collection verification
- Ignoring royalty settings in transfers
- Trusting off-chain metadata without hash validation
- Not validating proofs for ownership claims
`,
  blocks: [
    {
      type: "terminal",
      id: "cnft-v2-l6-collection",
      title: "Collection Structure",
      steps: [
        {
          cmd: "Collection Mint",
          output: "Standard SPL NFT on-chain",
          note: "Parent NFT for the collection",
        },
        {
          cmd: "Merkle Tree",
          output: "Contains cNFT leaf hashes",
          note: "Scalable storage for assets",
        },
        {
          cmd: "Off-chain Metadata",
          output: "IPFS/Arweave JSON files",
          note: "Full metadata with hash commitment",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "cnft-v2-attack-surface",
  slug: "cnft-v2-attack-surface",
  title: "Attack surface: invalid proofs and replay",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Attack surface: invalid proofs and replay

Compressed NFTs introduce unique security considerations. Understanding attack vectors and mitigations is critical for building secure compression-aware applications.

Invalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash and fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain account), and validate proof structure (correct depth, valid hash lengths).

Index manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices and validate index-asset correspondence during verification.

Replay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes and old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.

Metadata attacks substitute fake off-chain data. Since metadata is stored off-chain with only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), and validate creator signatures.

Collection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs with fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, and validate authority signatures.

## Checklist
- Verify proofs against current root
- Validate leaf index matches asset ID
- Implement replay protection for proofs
- Hash-verify off-chain metadata
- Verify collection mint authenticity

## Red flags
- Accepting cached/stale roots for verification
- Ignoring leaf index validation
- Trusting off-chain metadata without verification
- Not checking collection verification status
`,
  blocks: [
    {
      type: "quiz",
      id: "cnft-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "cnft-v2-l7-q1",
          prompt: "Why do old proofs fail after tree updates?",
          options: [
            "The root changes when leaves are added/modified",
            "The proof format changes",
            "The leaf hashes are encrypted",
          ],
          answerIndex: 0,
          explanation: "Adding leaves changes parent hashes up to the root, invalidating previous proofs.",
        },
        {
          id: "cnft-v2-l7-q2",
          prompt: "How can metadata attacks be prevented?",
          options: [
            "Hash verification against leaf commitments",
            "Storing metadata on-chain",
            "Using shorter metadata URIs",
          ],
          answerIndex: 0,
          explanation: "Verifying metadata hashes ensures the off-chain data matches the on-chain commitment.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "cnft-v2-compression-checkpoint",
  slug: "cnft-v2-compression-checkpoint",
  title: "Checkpoint: Simulate mint + verify ownership proof",
  type: "challenge",
  xpReward: 75,
  duration: "60 min",
  language: "typescript",
  content: `# Checkpoint: Simulate mint + verify ownership proof

Complete the compression lab checkpoint:

- Simulate minting a cNFT (insert leaf, update root)
- Generate ownership proof for the minted NFT
- Verify the proof against current root
- Output stable audit trace with sorted keys
- Detect and report invalid proof attempts

This validates your complete Merkle tree implementation for compressed NFTs.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "cnft-v2-merkle-foundations",
  title: "Merkle Foundations",
  description: "Tree construction, leaf hashing, and insertion mechanics.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "cnft-v2-proof-system",
  title: "Proof System & Security",
  description: "Proof generation, verification, collections, and attack mitigations.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaNftCompressionCourse: Course = {
  id: "course-solana-nft-compression",
  slug: "solana-nft-compression",
  title: "NFTs & Compressed NFTs Fundamentals",
  description:
    "Master compressed NFTs through Merkle trees: construction, proofs, collections, and security considerations.",
  difficulty: "advanced",
  duration: "12 hours",
  totalXP: 425,
  tags: ["nfts", "compression", "merkle-trees", "cnfts", "solana"],
  imageUrl: "/images/courses/solana-nft-compression.jpg",
  modules: [module1, module2],
};
