import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const bytes = borshEncode(input.value);
  const decoded = borshDecode(bytes);
  return JSON.stringify({ bytes, decoded });
}

function borshEncode(value) {
  if (typeof value.name !== "string") throw new Error("name must be string");
  const utf8 = Array.from(new TextEncoder().encode(value.name));
  const len = utf8.length;
  return [len & 255, (len >>> 8) & 255, (len >>> 16) & 255, (len >>> 24) & 255].concat(utf8).concat([value.level & 255]);
}

function borshDecode(bytes) {
  const len = bytes[0] + (bytes[1] << 8) + (bytes[2] << 16) + (bytes[3] << 24);
  const nameBytes = bytes.slice(4, 4 + len);
  const level = bytes[4 + len];
  return { name: new TextDecoder().decode(new Uint8Array(nameBytes)), level };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints = [
  "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
  "Keep encode/decode symmetric for deterministic tests.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "encodes and decodes profile",
    input: JSON.stringify({ value: { name: "sol", level: 7 } }),
    expectedOutput: '{"bytes":[3,0,0,0,115,111,108,7],"decoded":{"name":"sol","level":7}}',
  },
];
