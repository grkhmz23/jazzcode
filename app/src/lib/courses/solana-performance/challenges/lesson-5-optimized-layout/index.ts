import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(optimizeAccountLayout(input));
}

function optimizeAccountLayout(input) {
  // Optimize account data layout by:
  // - Using smallest possible types for each field
  // - Packing fields efficiently (no padding waste)
  // - Reordering fields to minimize total size
  // Return the optimized layout with field order and total bytes saved
  return {
    originalSize: input.currentSize,
    optimizedSize: input.currentSize,
    bytesSaved: 0,
    fieldOrder: [],
    recommendations: [],
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  return JSON.stringify(optimizeAccountLayout(input));
}

function optimizeAccountLayout(input) {
  const fields = input.fields;
  
  // Sort fields by size descending to minimize padding (largest first)
  const optimizedOrder = [...fields].sort((a, b) => b.size - a.size);
  
  // Calculate optimized size (sum of field sizes with 1-byte alignment)
  const optimizedSize = optimizedOrder.reduce((sum, f) => sum + f.size, 0);
  
  const bytesSaved = input.currentSize - optimizedSize;
  
  // Generate recommendations
  const recommendations = [];
  
  // Check for u64 that could be u32
  fields.forEach(f => {
    if (f.type === "u64" && f.maxValue !== undefined && f.maxValue <= 4294967295) {
      recommendations.push(\`Consider changing \${f.name} from u64 to u32 (max: \${f.maxValue})\`);
    }
  });
  
  // Check for bool stored as u8
  fields.forEach(f => {
    if (f.type === "u8" && f.isBoolean) {
      recommendations.push(\`Pack \${f.name} as bit flag to save space\`);
    }
  });

  return {
    originalSize: input.currentSize,
    optimizedSize,
    bytesSaved,
    fieldOrder: optimizedOrder.map(f => f.name),
    recommendations,
  };
}
`;

export const lesson5Hints: string[] = [
  "Sort fields by size (largest first) to minimize padding gaps.",
  "Consider if u64 fields can be reduced to u32 based on maxValue.",
  "Boolean flags can be packed into a single byte as bit flags.",
  "Calculate bytes saved as originalSize - optimizedSize.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "optimizes user account layout",
    input: JSON.stringify({
      currentSize: 128,
      fields: [
        { name: "isActive", type: "u8", size: 1, isBoolean: true },
        { name: "balance", type: "u64", size: 8, maxValue: 1000000 },
        { name: "id", type: "u32", size: 4 },
        { name: "name", type: "string", size: 32 },
        { name: "createdAt", type: "u64", size: 8 },
      ],
    }),
    expectedOutput:
      '{"originalSize":128,"optimizedSize":53,"bytesSaved":75,"fieldOrder":["name","balance","createdAt","id","isActive"],"recommendations":["Consider changing balance from u64 to u32 (max: 1000000)","Pack isActive as bit flag to save space"]}',
  },
  {
    name: "optimizes token account with packing suggestions",
    input: JSON.stringify({
      currentSize: 200,
      fields: [
        { name: "amount", type: "u64", size: 8 },
        { name: "frozen", type: "u8", size: 1, isBoolean: true },
        { name: "delegate", type: "pubkey", size: 32 },
        { name: "mint", type: "pubkey", size: 32 },
        { name: "closeAuthority", type: "u8", size: 1, isBoolean: true },
      ],
    }),
    expectedOutput:
      '{"originalSize":200,"optimizedSize":74,"bytesSaved":126,"fieldOrder":["delegate","mint","amount","frozen","closeAuthority"],"recommendations":["Pack frozen as bit flag to save space","Pack closeAuthority as bit flag to save space"]}',
  },
];
