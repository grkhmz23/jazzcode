import type { TestCase } from "@/types/content";

export const lesson3StarterCode = `function run(input) {
  const result = insertLeafIntoMerkleTree(input.tree, input.leafIndex, input.leafHash);
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

function insertLeafIntoMerkleTree(tree, leafIndex, leafHash) {
  // TODO: Insert leaf at the given index and update parent hashes up to root
  // Return { newRoot: string, updatedNodes: string[] }
  
  return {
    newRoot: tree.root,
    updatedNodes: []
  };
}
`;

export const lesson3SolutionCode = `function run(input) {
  const result = insertLeafIntoMerkleTree(input.tree, input.leafIndex, input.leafHash);
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

function insertLeafIntoMerkleTree(tree, leafIndex, leafHash) {
  const updatedNodes = [];
  const levels = tree.levels;
  
  if (leafIndex < 0 || leafIndex >= tree.leafCount) {
    throw new Error("Leaf index out of bounds");
  }
  
  // Update the leaf
  let currentHash = leafHash;
  let currentIndex = leafIndex;
  
  // Traverse up the tree, updating parent hashes
  for (let level = 0; level < levels.length - 1; level++) {
    const levelNodes = levels[level];
    const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
    
    let siblingHash;
    if (siblingIndex < levelNodes.length) {
      siblingHash = levelNodes[siblingIndex];
    } else {
      // Use current hash as sibling if odd number of nodes
      siblingHash = currentHash;
    }
    
    // Record updated node at this level
    updatedNodes.push(currentHash);
    
    // Compute parent hash (deterministic ordering)
    let combined;
    if (currentIndex % 2 === 0) {
      combined = currentHash + siblingHash.slice(2);
    } else {
      combined = siblingHash + currentHash.slice(2);
    }
    
    currentHash = keccak256Hash(combined);
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  // Add the new root
  updatedNodes.push(currentHash);
  
  return {
    newRoot: currentHash,
    updatedNodes: updatedNodes
  };
}
`;

export const lesson3Hints: string[] = [
  "Start by validating the leaf index is within bounds.",
  "At each level, find the sibling node (left or right of current).",
  "Hash the current node with its sibling to get the parent hash.",
  "Traverse up to the root, collecting all updated node hashes.",
  "Use deterministic ordering: left hash comes before right hash.",
];

export const lesson3TestCases: TestCase[] = [
  {
    name: "inserts leaf at index 0 and updates root",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [
          ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
          ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
          ["0x0000000000000000000000000000000000000000000000000000000000000000"]
        ]
      },
      leafIndex: 0,
      leafHash: "0x1111111111111111111111111111111111111111111111111111111111111111"
    }),
    expectedOutput: JSON.stringify({
      newRoot: "0x000000000000000000000000000000000000000000000000000000001f807026",
      updatedNodes: [
        "0x1111111111111111111111111111111111111111111111111111111111111111",
        "0x000000000000000000000000000000000000000000000000000000004e0d8a48",
        "0x000000000000000000000000000000000000000000000000000000001f807026"
      ]
    }),
  },
  {
    name: "inserts leaf at index 1 with sibling",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [
          ["0x1111111111111111111111111111111111111111111111111111111111111111", "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
          ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"],
          ["0x0000000000000000000000000000000000000000000000000000000000000000"]
        ]
      },
      leafIndex: 1,
      leafHash: "0x2222222222222222222222222222222222222222222222222222222222222222"
    }),
    expectedOutput: JSON.stringify({
      newRoot: "0x0000000000000000000000000000000000000000000000000000000020c9c8d3",
      updatedNodes: [
        "0x2222222222222222222222222222222222222222222222222222222222222222",
        "0x00000000000000000000000000000000000000000000000000000000755e9248",
        "0x0000000000000000000000000000000000000000000000000000000020c9c8d3"
      ]
    }),
  },
  {
    name: "rejects out of bounds index",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 4,
        levels: [[], [], []]
      },
      leafIndex: 5,
      leafHash: "0x1111111111111111111111111111111111111111111111111111111111111111"
    }),
    expectedOutput: "Error: Leaf index out of bounds",
  },
];
