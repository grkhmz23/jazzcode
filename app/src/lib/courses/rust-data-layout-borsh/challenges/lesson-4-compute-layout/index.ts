import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(computeLayout(input.fields));
}

function sizeOf(type) {
  if (type === "u8" || type === "bool") return 1;
  if (type === "u16") return 2;
  if (type === "u32") return 4;
  if (type === "u64") return 8;
  if (type === "pubkey") return 32;
  throw new Error("unsupported type");
}

function computeLayout(fields) {
  if (!Array.isArray(fields) || fields.length === 0) throw new Error("fields must be non-empty");
  let offset = 0;
  let structAlign = 1;
  const out = [];
  for (const field of fields) {
    const align = sizeOf(field.type);
    const size = sizeOf(field.type);
    structAlign = Math.max(structAlign, align);
    const pad = offset % align === 0 ? 0 : align - (offset % align);
    offset += pad;
    out.push({ name: field.name, offset, size, align, paddingBefore: pad });
    offset += size;
  }
  const trailingPadding = offset % structAlign === 0 ? 0 : structAlign - (offset % structAlign);
  return { fields: out, totalSize: offset + trailingPadding, structAlign, trailingPadding };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints = [
  "Use alignment-aware offsets and include padding fields in the result.",
  "Struct total size should be aligned to max field alignment.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "computes aligned layout",
    input: JSON.stringify({ fields: [{ name: "flag", type: "u8" }, { name: "amount", type: "u64" }] }),
    expectedOutput:
      '{"fields":[{"name":"flag","offset":0,"size":1,"align":1,"paddingBefore":0},{"name":"amount","offset":8,"size":8,"align":8,"paddingBefore":7}],"totalSize":16,"structAlign":8,"trailingPadding":0}',
  },
  {
    name: "throws on unsupported field type",
    input: JSON.stringify({ fields: [{ name: "memo", type: "string" }] }),
    expectedOutput: "Error: unsupported type",
  },
];
