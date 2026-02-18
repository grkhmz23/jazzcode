import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = generateAndVerifyProof(input.tree, input.leafIndex);
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

function generateAndVerifyProof(tree, leafIndex) {
  // TODO: 
  // 1. Generate proof (collect sibling hashes at each level)
  // 2. Verify by recomputing the root from leaf + proof
  // Return { proof: string[], recomputedRoot: string, valid: boolean }
  
  return {
    proof: [],
    recomputedRoot: tree.root,
    valid: false
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = generateAndVerifyProof(input.tree, input.leafIndex);
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

function generateAndVerifyProof(tree, leafIndex) {
  if (leafIndex < 0 || leafIndex >= tree.leafCount) {
    throw new Error("Leaf index out of bounds");
  }
  
  const levels = tree.levels;
  const proof = [];
  
  // Generate proof: collect sibling hashes at each level
  let currentIndex = leafIndex;
  for (let level = 0; level < levels.length - 1; level++) {
    const levelNodes = levels[level];
    const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
    
    let siblingHash;
    if (siblingIndex < levelNodes.length) {
      siblingHash = levelNodes[siblingIndex];
    } else {
      // If no sibling, use the current node itself (odd number of nodes)
      siblingHash = levelNodes[currentIndex];
    }
    
    proof.push(siblingHash);
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  // Verify: recompute root from leaf + proof
  let currentHash = levels[0][leafIndex];
  for (let i = 0; i < proof.length; i++) {
    const siblingHash = proof[i];
    const isLeft = leafIndex % Math.pow(2, i + 1) < Math.pow(2, i);
    
    let combined;
    if (isLeft) {
      combined = currentHash + siblingHash.slice(2);
    } else {
      combined = siblingHash + currentHash.slice(2);
    }
    
    currentHash = keccak256Hash(combined);
  }
  
  const valid = currentHash === tree.root;
  
  return {
    proof: proof,
    recomputedRoot: currentHash,
    valid: valid
  };
}
`;

export const lesson5Hints: string[] = [
  "To generate a proof, collect the sibling hash at each level from leaf to root.",
  "The sibling is at index+1 if current is left, index-1 if current is right.",
  "To verify, start with the leaf hash and combine with each proof element.",
  "Use the same ordering (left || right) when combining hashes.",
  "The proof is valid if the recomputed root matches the stored root.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "generates and verifies proof for leaf at index 0",
    input: JSON.stringify({
      tree: {
        root: "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
        leafCount: 4,
        levels: [
          [
            "0x1111111111111111111111111111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222222222222222222222222222",
            "0x3333333333333333333333333333333333333333333333333333333333333333",
            "0x4444444444444444444444444444444444444444444444444444444444444444"
          ],
          [
            "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
            "0x94d70cb36f763d2b6a8a0a2b9f1c3d5e"
          ],
          ["0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef"]
        ]
      },
      leafIndex: 0
    }),
    expectedOutput: JSON.stringify({
      proof: [
        "0x2222222222222222222222222222222222222222222222222222222222222222",
        "0x94d70cb36f763d2b6a8a0a2b9f1c3d5e"
      ],
      recomputedRoot: "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
      valid: true
    }),
  },
  {
    name: "generates and verifies proof for leaf at index 2",
    input: JSON.stringify({
      tree: {
        root: "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
        leafCount: 4,
        levels: [
          [
            "0x1111111111111111111111111111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222222222222222222222222222",
            "0x3333333333333333333333333333333333333333333333333333333333333333",
            "0x4444444444444444444444444444444444444444444444444444444444444444"
          ],
          [
            "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
            "0x94d70cb36f763d2b6a8a0a2b9f1c3d5e"
          ],
          ["0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef"]
        ]
      },
      leafIndex: 2
    }),
    expectedOutput: JSON.stringify({
      proof: [
        "0x4444444444444444444444444444444444444444444444444444444444444444",
        "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef"
      ],
      recomputedRoot: "0x54bc0f1c2a9e05ec89a7d06c4d8f0a2ef",
      valid: true
    }),
  },
  {
    name: "rejects out of bounds index",
    input: JSON.stringify({
      tree: {
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
        leafCount: 2,
        levels: [["0x1111111111111111111111111111111111111111111111111111111111111111"], []]
      },
      leafIndex: 5
    }),
    expectedOutput: "Error: Leaf index out of bounds",
  },
];
