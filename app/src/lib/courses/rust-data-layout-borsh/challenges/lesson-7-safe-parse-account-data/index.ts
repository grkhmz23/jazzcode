import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(safeParseAccountData(input.bytes, input.layout));
}

function safeParseAccountData(bytes, layout) {
  if (bytes.length < layout.totalSize) {
    return { ok: false, error: { code: "OUT_OF_BOUNDS", message: "insufficient bytes" } };
  }
  const parsed = {};
  for (const field of layout.fields) {
    if (field.type === "u8") {
      parsed[field.name] = bytes[field.offset];
    } else if (field.type === "bool") {
      const raw = bytes[field.offset];
      if (raw !== 0 && raw !== 1) {
        return { ok: false, error: { code: "INVALID_BOOL", message: "invalid bool", field: field.name } };
      }
      parsed[field.name] = raw === 1;
    } else {
      return { ok: false, error: { code: "UNSUPPORTED_TYPE", message: "unsupported", field: field.name } };
    }
  }
  return { ok: true, parsed };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints = [
  "Validate byte length before field parsing.",
  "Return structured errors for invalid booleans and unsupported field types.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "parses bool and u8 safely",
    input: JSON.stringify({
      bytes: [1, 9],
      layout: { totalSize: 2, fields: [{ name: "active", type: "bool", offset: 0 }, { name: "level", type: "u8", offset: 1 }] },
    }),
    expectedOutput: '{"ok":true,"parsed":{"active":true,"level":9}}',
  },
];
