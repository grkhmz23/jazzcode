import { describe, expect, it } from "vitest";
import {
  applyFilePatches,
  createWorkspaceTree,
  diffWorkspaceTrees,
  listFiles,
  readFile,
} from "@/lib/workspace";

describe("workspace tree", () => {
  it("creates files from flat map", () => {
    const tree = createWorkspaceTree({
      "src/main.ts": "console.log('a')",
      "src/lib/util.ts": "export const x = 1",
    });

    expect(readFile(tree, "src/main.ts")).toContain("console.log");
    expect(readFile(tree, "src/lib/util.ts")).toContain("export const x");
  });

  it("applies file patches immutably", () => {
    const initial = createWorkspaceTree({ "src/main.ts": "a" });
    const updated = applyFilePatches(initial, [{ path: "src/main.ts", content: "b" }]);

    expect(readFile(initial, "src/main.ts")).toBe("a");
    expect(readFile(updated, "src/main.ts")).toBe("b");
  });

  it("creates new nested files during patch", () => {
    const initial = createWorkspaceTree({});
    const updated = applyFilePatches(initial, [
      { path: "programs/my_program/src/lib.rs", content: "pub fn init() {}" },
    ]);

    expect(readFile(updated, "programs/my_program/src/lib.rs")).toContain("pub fn init");
  });

  it("lists files recursively", () => {
    const tree = createWorkspaceTree({
      "a.ts": "1",
      "src/main.ts": "2",
      "src/other.ts": "3",
    });

    const files = listFiles(tree).sort();
    expect(files).toEqual(["a.ts", "src/main.ts", "src/other.ts"]);
  });

  it("diffs modified and added files", () => {
    const before = createWorkspaceTree({ "src/main.ts": "a" });
    const after = applyFilePatches(before, [
      { path: "src/main.ts", content: "b" },
      { path: "README.md", content: "intro" },
    ]);

    const diff = diffWorkspaceTrees(before, after);
    expect(diff).toEqual([
      { path: "README.md", before: null, after: "intro" },
      { path: "src/main.ts", before: "a", after: "b" },
    ]);
  });
});
