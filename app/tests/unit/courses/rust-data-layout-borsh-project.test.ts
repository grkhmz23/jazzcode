import { describe, expect, it } from "vitest";
import {
  borshDecode,
  borshEncode,
  computeLayout,
  layoutReport,
  safeParseAccountData,
} from "@/lib/courses/rust-data-layout-borsh/project/layout";
import {
  createDefaultRustDataLayoutBorshLocalState,
  migrateRustDataLayoutBorshLocalState,
} from "@/lib/courses/rust-data-layout-borsh/local-state";

describe("rust data layout borsh project", () => {
  it("computes deterministic layout", () => {
    const layout = computeLayout([{ name: "flag", type: "u8" }, { name: "amount", type: "u64" }]);
    expect(layout.totalSize).toBe(16);
    expect(layout.fields[1].offset).toBe(8);
  });

  it("encodes/decodes borsh struct", () => {
    const schema = { kind: "struct", fields: [{ name: "name", type: { kind: "string" } }, { name: "level", type: "u8" }] } as const;
    const bytes = borshEncode({ name: "sol", level: 7 }, schema);
    expect(Array.from(bytes)).toEqual([3, 0, 0, 0, 115, 111, 108, 7]);
    expect(borshDecode(bytes, schema)).toEqual({ name: "sol", level: 7 });
  });

  it("parses account data safely", () => {
    const layout = computeLayout([{ name: "active", type: "bool" }, { name: "level", type: "u8" }]);
    const parsed = safeParseAccountData(Uint8Array.from([1, 9]), layout);
    expect(parsed).toEqual({ ok: true, parsed: { active: true, level: 9 } });
    expect(layoutReport(layout).markdown).toContain("# Account Layout Report");
  });

  it("returns structured parse error for invalid bool", () => {
    const layout = computeLayout([{ name: "active", type: "bool" }]);
    const parsed = safeParseAccountData(Uint8Array.from([2]), layout);
    expect(parsed.ok).toBe(false);
  });

  it("migrates local state", () => {
    const state = migrateRustDataLayoutBorshLocalState({ completedLessonIds: ["l1", "l1"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["l1"]);
    expect(createDefaultRustDataLayoutBorshLocalState().lastLayoutReportJson).toBeNull();
  });
});
