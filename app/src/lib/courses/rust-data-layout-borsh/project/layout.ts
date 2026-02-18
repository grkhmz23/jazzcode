export type PrimitiveType = "u8" | "u16" | "u32" | "u64" | "bool" | "pubkey";

export interface ArrayType {
  kind: "array";
  element: PrimitiveType;
  length: number;
}

export interface StringType {
  kind: "string";
}

export interface VecType {
  kind: "vec";
  element: PrimitiveType;
}

export type FieldType = PrimitiveType | ArrayType | StringType | VecType;

export interface LayoutField {
  name: string;
  type: FieldType;
}

export interface LayoutEntry {
  name: string;
  offset: number;
  size: number;
  align: number;
  paddingBefore: number;
  type: FieldType;
}

export interface LayoutComputation {
  fields: LayoutEntry[];
  totalSize: number;
  structAlign: number;
  trailingPadding: number;
}

export type BorshType = PrimitiveType | StringType | VecType | BorshStructType | BorshEnumType;

export interface BorshStructType {
  kind: "struct";
  fields: ReadonlyArray<{ name: string; type: BorshType }>;
}

export interface BorshEnumType {
  kind: "enum";
  variants: ReadonlyArray<{ name: string; type?: BorshType }>;
}

export interface ParseSuccess {
  ok: true;
  parsed: Record<string, string | number | boolean | number[]>;
}

export interface ParseFailure {
  ok: false;
  error: {
    code: "OUT_OF_BOUNDS" | "UNSUPPORTED_TYPE" | "INVALID_BOOL";
    message: string;
    field?: string;
  };
}

export type ParseAccountResult = ParseSuccess | ParseFailure;

export interface LayoutReport {
  json: string;
  markdown: string;
}

function primitiveSize(type: PrimitiveType): number {
  switch (type) {
    case "u8":
    case "bool":
      return 1;
    case "u16":
      return 2;
    case "u32":
      return 4;
    case "u64":
      return 8;
    case "pubkey":
      return 32;
  }
}

function primitiveAlign(type: PrimitiveType): number {
  return primitiveSize(type);
}

function fixedLayoutSize(type: FieldType): { size: number; align: number } {
  if (typeof type === "string") {
    return { size: primitiveSize(type), align: primitiveAlign(type) };
  }

  if (type.kind === "array") {
    if (type.length < 0) {
      throw new Error("array length must be >= 0");
    }
    const itemSize = primitiveSize(type.element);
    return { size: itemSize * type.length, align: primitiveAlign(type.element) };
  }

  throw new Error("dynamic borsh types are not fixed layout compatible");
}

export function computeLayout(fields: LayoutField[]): LayoutComputation {
  if (fields.length === 0) {
    throw new Error("fields must be non-empty");
  }

  const names = new Set<string>();
  const entries: LayoutEntry[] = [];
  let offset = 0;
  let structAlign = 1;

  for (const field of fields) {
    if (!field.name || field.name.trim().length === 0) {
      throw new Error("field name is required");
    }
    if (names.has(field.name)) {
      throw new Error(`duplicate field: ${field.name}`);
    }
    names.add(field.name);

    const { size, align } = fixedLayoutSize(field.type);
    structAlign = Math.max(structAlign, align);
    const misalignment = offset % align;
    const paddingBefore = misalignment === 0 ? 0 : align - misalignment;
    offset += paddingBefore;

    entries.push({
      name: field.name,
      offset,
      size,
      align,
      paddingBefore,
      type: field.type,
    });

    offset += size;
  }

  const trailingPadding = offset % structAlign === 0 ? 0 : structAlign - (offset % structAlign);
  return {
    fields: entries,
    totalSize: offset + trailingPadding,
    structAlign,
    trailingPadding,
  };
}

function pushU32(value: number, out: number[]): void {
  const v = value >>> 0;
  out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
}

function encodePrimitive(value: unknown, type: PrimitiveType, out: number[]): void {
  switch (type) {
    case "u8": {
      if (typeof value !== "number" || value < 0 || value > 255) {
        throw new Error("invalid u8 value");
      }
      out.push(value & 0xff);
      return;
    }
    case "u16": {
      if (typeof value !== "number" || value < 0 || value > 65535) {
        throw new Error("invalid u16 value");
      }
      out.push(value & 0xff, (value >>> 8) & 0xff);
      return;
    }
    case "u32": {
      if (typeof value !== "number" || value < 0 || value > 0xffffffff) {
        throw new Error("invalid u32 value");
      }
      pushU32(value, out);
      return;
    }
    case "u64": {
      const big = typeof value === "bigint" ? value : BigInt(value as number);
      if (big < BigInt(0) || big > BigInt("18446744073709551615")) {
        throw new Error("invalid u64 value");
      }
      for (let i = BigInt(0); i < BigInt(8); i += BigInt(1)) {
        out.push(Number((big >> (BigInt(8) * i)) & BigInt(255)));
      }
      return;
    }
    case "bool": {
      if (typeof value !== "boolean") {
        throw new Error("invalid bool value");
      }
      out.push(value ? 1 : 0);
      return;
    }
    case "pubkey": {
      if (!(value instanceof Uint8Array) || value.length !== 32) {
        throw new Error("pubkey must be 32-byte Uint8Array");
      }
      out.push(...value);
      return;
    }
  }
}

export function borshEncode(value: unknown, schema: BorshType): Uint8Array {
  const out: number[] = [];

  function encode(v: unknown, t: BorshType): void {
    if (typeof t === "string") {
      encodePrimitive(v, t, out);
      return;
    }
    if (t.kind === "string") {
      if (typeof v !== "string") {
        throw new Error("string value expected");
      }
      const encoded = new TextEncoder().encode(v);
      pushU32(encoded.length, out);
      out.push(...encoded);
      return;
    }
    if (t.kind === "vec") {
      if (!Array.isArray(v)) {
        throw new Error("array value expected for vec");
      }
      pushU32(v.length, out);
      for (const item of v) {
        encodePrimitive(item, t.element, out);
      }
      return;
    }
    if (t.kind === "struct") {
      if (!v || typeof v !== "object") {
        throw new Error("object value expected for struct");
      }
      const record = v as Record<string, unknown>;
      for (const field of t.fields) {
        encode(record[field.name], field.type);
      }
      return;
    }

    if (!v || typeof v !== "object") {
      throw new Error("enum value expected");
    }
    const record = v as Record<string, unknown>;
    if (typeof record.variant !== "string") {
      throw new Error("enum variant string expected");
    }
    const variantIndex = t.variants.findIndex((variant) => variant.name === record.variant);
    if (variantIndex < 0) {
      throw new Error("unknown enum variant");
    }
    out.push(variantIndex);
    const variant = t.variants[variantIndex];
    if (variant.type) {
      encode(record.value, variant.type);
    }
  }

  encode(value, schema);
  return Uint8Array.from(out);
}

function readU32LE(bytes: Uint8Array, offset: number): number {
  if (offset + 4 > bytes.length) {
    throw new Error("read u32 out of bounds");
  }
  return bytes[offset] + (bytes[offset + 1] << 8) + (bytes[offset + 2] << 16) + bytes[offset + 3] * 16777216;
}

function decodePrimitive(
  bytes: Uint8Array,
  offset: number,
  type: PrimitiveType,
): { value: unknown; nextOffset: number } {
  if (offset + primitiveSize(type) > bytes.length) {
    throw new Error("primitive decode out of bounds");
  }

  switch (type) {
    case "u8":
      return { value: bytes[offset], nextOffset: offset + 1 };
    case "u16":
      return { value: bytes[offset] + (bytes[offset + 1] << 8), nextOffset: offset + 2 };
    case "u32":
      return { value: readU32LE(bytes, offset), nextOffset: offset + 4 };
    case "u64": {
      let value = BigInt(0);
      for (let i = BigInt(0); i < BigInt(8); i += BigInt(1)) {
        value |= BigInt(bytes[offset + Number(i)]) << (BigInt(8) * i);
      }
      return { value: value.toString(), nextOffset: offset + 8 };
    }
    case "bool": {
      const raw = bytes[offset];
      if (raw !== 0 && raw !== 1) {
        throw new Error("invalid bool byte");
      }
      return { value: raw === 1, nextOffset: offset + 1 };
    }
    case "pubkey":
      return { value: Array.from(bytes.slice(offset, offset + 32)), nextOffset: offset + 32 };
  }
}

export function borshDecode(bytes: Uint8Array, schema: BorshType): unknown {
  function decode(offset: number, t: BorshType): { value: unknown; nextOffset: number } {
    if (typeof t === "string") {
      return decodePrimitive(bytes, offset, t);
    }
    if (t.kind === "string") {
      const len = readU32LE(bytes, offset);
      const start = offset + 4;
      const end = start + len;
      if (end > bytes.length) {
        throw new Error("string decode out of bounds");
      }
      return {
        value: new TextDecoder().decode(bytes.slice(start, end)),
        nextOffset: end,
      };
    }
    if (t.kind === "vec") {
      const len = readU32LE(bytes, offset);
      let cursor = offset + 4;
      const items: unknown[] = [];
      for (let i = 0; i < len; i += 1) {
        const decoded = decodePrimitive(bytes, cursor, t.element);
        items.push(decoded.value);
        cursor = decoded.nextOffset;
      }
      return { value: items, nextOffset: cursor };
    }
    if (t.kind === "struct") {
      const record: Record<string, unknown> = {};
      let cursor = offset;
      for (const field of t.fields) {
        const decoded = decode(cursor, field.type);
        record[field.name] = decoded.value;
        cursor = decoded.nextOffset;
      }
      return { value: record, nextOffset: cursor };
    }

    if (offset >= bytes.length) {
      throw new Error("enum decode out of bounds");
    }
    const variantIndex = bytes[offset];
    const variant = t.variants[variantIndex];
    if (!variant) {
      throw new Error("unknown enum variant index");
    }
    if (!variant.type) {
      return { value: { variant: variant.name }, nextOffset: offset + 1 };
    }
    const decoded = decode(offset + 1, variant.type);
    return { value: { variant: variant.name, value: decoded.value }, nextOffset: decoded.nextOffset };
  }

  return decode(0, schema).value;
}

function parseFixedField(bytes: Uint8Array, entry: LayoutEntry): ParseAccountResult {
  const end = entry.offset + entry.size;
  if (end > bytes.length) {
    return {
      ok: false,
      error: {
        code: "OUT_OF_BOUNDS",
        message: `field ${entry.name} exceeds byte length`,
        field: entry.name,
      },
    };
  }

  const slice = bytes.slice(entry.offset, end);
  if (typeof entry.type === "string") {
    if (entry.type === "bool") {
      const raw = slice[0];
      if (raw !== 0 && raw !== 1) {
        return {
          ok: false,
          error: {
            code: "INVALID_BOOL",
            message: `invalid bool byte for ${entry.name}`,
            field: entry.name,
          },
        };
      }
      return { ok: true, parsed: { [entry.name]: raw === 1 } };
    }
    if (entry.type === "u64") {
      let value = BigInt(0);
      for (let i = BigInt(0); i < BigInt(8); i += BigInt(1)) {
        value |= BigInt(slice[Number(i)]) << (BigInt(8) * i);
      }
      return { ok: true, parsed: { [entry.name]: value.toString() } };
    }

    const numeric =
      entry.type === "u8"
        ? slice[0]
        : entry.type === "u16"
          ? slice[0] + (slice[1] << 8)
          : entry.type === "u32"
            ? readU32LE(slice, 0)
            : Number.NaN;

    if (entry.type === "pubkey") {
      return { ok: true, parsed: { [entry.name]: Array.from(slice) } };
    }
    return { ok: true, parsed: { [entry.name]: numeric } };
  }

  if (entry.type.kind === "array") {
    const itemSize = primitiveSize(entry.type.element);
    const values: number[] = [];
    for (let i = 0; i < entry.type.length; i += 1) {
      const start = i * itemSize;
      const itemSlice = slice.slice(start, start + itemSize);
      if (entry.type.element !== "u8") {
        return {
          ok: false,
          error: {
            code: "UNSUPPORTED_TYPE",
            message: "safeParseAccountData only supports u8 arrays",
            field: entry.name,
          },
        };
      }
      values.push(itemSlice[0]);
    }
    return { ok: true, parsed: { [entry.name]: values } };
  }

  return {
    ok: false,
    error: {
      code: "UNSUPPORTED_TYPE",
      message: "dynamic layout fields are unsupported in safeParseAccountData",
      field: entry.name,
    },
  };
}

export function safeParseAccountData(bytes: Uint8Array, layout: LayoutComputation): ParseAccountResult {
  if (bytes.length < layout.totalSize) {
    return {
      ok: false,
      error: {
        code: "OUT_OF_BOUNDS",
        message: `expected at least ${layout.totalSize} bytes, got ${bytes.length}`,
      },
    };
  }

  const parsed: Record<string, string | number | boolean | number[]> = {};
  for (const entry of layout.fields) {
    const parsedField = parseFixedField(bytes, entry);
    if (!parsedField.ok) {
      return parsedField;
    }
    Object.assign(parsed, parsedField.parsed);
  }

  return { ok: true, parsed };
}

function stableOrder(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableOrder(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = stableOrder(record[key]);
        return acc;
      }, {});
  }
  return value;
}

export function layoutReport(layout: LayoutComputation): LayoutReport {
  const payload = {
    fields: layout.fields.map((field) => ({
      align: field.align,
      name: field.name,
      offset: field.offset,
      paddingBefore: field.paddingBefore,
      size: field.size,
      type: field.type,
    })),
    structAlign: layout.structAlign,
    totalSize: layout.totalSize,
    trailingPadding: layout.trailingPadding,
  };

  const json = JSON.stringify(stableOrder(payload));
  const markdown = [
    "# Account Layout Report",
    "",
    `- Total size: ${layout.totalSize}`,
    `- Struct align: ${layout.structAlign}`,
    `- Trailing padding: ${layout.trailingPadding}`,
    ...layout.fields.map(
      (field) =>
        `- ${field.name}: offset=${field.offset}, size=${field.size}, align=${field.align}, pad=${field.paddingBefore}`,
    ),
  ].join("\n");

  return { json, markdown };
}
