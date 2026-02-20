import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const result = simulateMintAndGenerateAudit(input.tree, input.mintRequest);
  return JSON.stringify(result);
}

function keccak256Hash(data) {
  // Simplified deterministic hash for educational purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "0x" + Math.abs(hash).toString(16).padStart(64, "0");
}

function simulateMintAndGenerateAudit(tree, mintRequest) {
  // TODO:
  // 1. Insert the NFT leaf (simulate mint)
  // 2. Generate ownership proof for the minted NFT
  // 3. Output audit trace with all relevant data
  // Return { success: boolean, newRoot: string, proof: string[], auditTrace: object }
  
  return {
    success: false,
    newRoot: tree.root,
    proof: [],
    auditTrace: {}
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const result = simulateMintAndGenerateAudit(input.tree, input.mintRequest);
  return JSON.stringify(result);
}

function keccak256Hash(data) {
  // Simplified deterministic hash for educational purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "0x" + Math.abs(hash).toString(16).padStart(64, "0");
}

function simulateMintAndGenerateAudit(tree, mintRequest) {
  // Validate mint request
  if (!mintRequest || typeof mintRequest.leafIndex !== "number") {
    throw new Error("Invalid mint request: missing leafIndex");
  }
  if (!mintRequest.nftId || !mintRequest.owner) {
    throw new Error("Invalid mint request: missing nftId or owner");
  }
  
  const leafIndex = mintRequest.leafIndex;
  if (leafIndex < 0 || leafIndex >= tree.leafCount) {
    throw new Error("Leaf index out of bounds");
  }
  
  // Create NFT leaf hash from nftId and owner
  const leafData = mintRequest.nftId + mintRequest.owner;
  const leafHash = keccak256Hash(leafData);
  
  // Insert leaf into tree (update root and collect proof)
  const proof = [];
  const levels = tree.levels;
  let currentHash = leafHash;
  let currentIndex = leafIndex;
  
  // Traverse up the tree
  for (let level = 0; level < levels.length - 1; level++) {
    const levelNodes = levels[level];
    const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
    
    let siblingHash;
    if (siblingIndex < levelNodes.length && levelNodes[siblingIndex]) {
      siblingHash = levelNodes[siblingIndex];
    } else {
      // Use current hash as sibling if no sibling exists
      siblingHash = currentHash;
    }
    
    proof.push(siblingHash);
    
    // Compute parent hash
    let combined;
    if (currentIndex % 2 === 0) {
      combined = currentHash + siblingHash.slice(2);
    } else {
      combined = siblingHash + currentHash.slice(2);
    }
    
    currentHash = keccak256Hash(combined);
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  const newRoot = currentHash;
  
  // Generate audit trace
  const auditTrace = {
    operation: "mint",
    timestamp: Date.now(),
    nftId: mintRequest.nftId,
    owner: mintRequest.owner,
    leafIndex: leafIndex,
    leafHash: leafHash,
    previousRoot: tree.root,
    newRoot: newRoot,
    proofSize: proof.length,
    treeDepth: levels.length - 1,
    verificationSteps: proof.map((siblingHash, idx) => ({
      level: idx,
      siblingHash: siblingHash,
      operation: "hash_combination"
    }))
  };
  
  return {
    success: true,
    newRoot: newRoot,
    proof: proof,
    auditTrace: auditTrace
  };
}
`;

export const lesson8Hints: string[] = [
  "Validate the mint request has all required fields (leafIndex, nftId, owner).",
  "Create a deterministic leaf hash by combining nftId and owner.",
  "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
  "Build an audit trace that documents the operation, inputs, and verification steps.",
  "Include previous and new root hashes in the audit for transparency.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "simulates mint and generates audit trace",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 8,
        levels: [
          Array(8).fill("0x0000000000000000000000000000000000000000000000000000000000000000"),
          Array(4).fill("0x0000000000000000000000000000000000000000000000000000000000000000"),
          Array(2).fill("0x0000000000000000000000000000000000000000000000000000000000000000"),
          ["0x0000000000000000000000000000000000000000000000000000000000000000"]
        ]
      },
      mintRequest: {
        leafIndex: 0,
        nftId: "nft_12345",
        owner: "8xF6j7K2mL4nP9qR5tU1vW3yZ6aB8cD0eF2gH4jK6lM8"
      }
    }),
    expectedOutput: JSON.stringify({
      success: true,
      newRoot: "0x0000000000000000000000000000000000000000000000000000000032bba340",
      proof: [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      auditTrace: {
        operation: "mint",
        timestamp: 1700000000000,
        nftId: "nft_12345",
        owner: "8xF6j7K2mL4nP9qR5tU1vW3yZ6aB8cD0eF2gH4jK6lM8",
        leafIndex: 0,
        leafHash: "0x000000000000000000000000000000000000000000000000000000003e537f0f",
        previousRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        newRoot: "0x0000000000000000000000000000000000000000000000000000000032bba340",
        proofSize: 3,
        treeDepth: 3,
        verificationSteps: [
          { level: 0, siblingHash: "0x0000000000000000000000000000000000000000000000000000000000000000", operation: "hash_combination" },
          { level: 1, siblingHash: "0x0000000000000000000000000000000000000000000000000000000000000000", operation: "hash_combination" },
          { level: 2, siblingHash: "0x0000000000000000000000000000000000000000000000000000000000000000", operation: "hash_combination" }
        ]
      }
    }),
  },
  {
    name: "simulates mint at different leaf index",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [
          Array(4).fill("0x0000000000000000000000000000000000000000000000000000000000000000"),
          Array(2).fill("0x0000000000000000000000000000000000000000000000000000000000000000"),
          ["0x0000000000000000000000000000000000000000000000000000000000000000"]
        ]
      },
      mintRequest: {
        leafIndex: 2,
        nftId: "nft_67890",
        owner: "9yG7k8L3mN5oP0rS6tU2vW4xZ7aC9dE1fG3hI5jK7lM9"
      }
    }),
    expectedOutput: JSON.stringify({
      success: true,
      newRoot: "0x00000000000000000000000000000000000000000000000000000000568a8c6a",
      proof: [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      auditTrace: {
        operation: "mint",
        timestamp: 1700000000000,
        nftId: "nft_67890",
        owner: "9yG7k8L3mN5oP0rS6tU2vW4xZ7aC9dE1fG3hI5jK7lM9",
        leafIndex: 2,
        leafHash: "0x0000000000000000000000000000000000000000000000000000000068a5ff65",
        previousRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        newRoot: "0x00000000000000000000000000000000000000000000000000000000568a8c6a",
        proofSize: 2,
        treeDepth: 2,
        verificationSteps: [
          { level: 0, siblingHash: "0x0000000000000000000000000000000000000000000000000000000000000000", operation: "hash_combination" },
          { level: 1, siblingHash: "0x0000000000000000000000000000000000000000000000000000000000000000", operation: "hash_combination" }
        ]
      }
    }),
  },
  {
    name: "rejects mint with missing nftId",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [[], [], []]
      },
      mintRequest: {
        leafIndex: 0,
        owner: "8xF6j7K2mL4nP9qR5tU1vW3yZ6aB8cD0eF2gH4jK6lM8"
      }
    }),
    expectedOutput: "Error: Invalid mint request: missing nftId or owner",
  },
  {
    name: "rejects mint with out of bounds index",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [[], [], []]
      },
      mintRequest: {
        leafIndex: 10,
        nftId: "nft_12345",
        owner: "8xF6j7K2mL4nP9qR5tU1vW3yZ6aB8cD0eF2gH4jK6lM8"
      }
    }),
    expectedOutput: "Error: Leaf index out of bounds",
  },
];
