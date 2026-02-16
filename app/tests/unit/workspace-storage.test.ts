import { describe, expect, it } from "vitest";
import {
  applyPatch,
  createSnapshot,
  loadWorkspace,
  readFile,
  resetToSnapshot,
} from "@/lib/workspace";

describe("workspace storage api", () => {
  it("loads default workspace and persists patches", async () => {
    const userId = "u-storage-1";
    const courseId = "course-storage-1";

    const initial = await loadWorkspace(userId, courseId);
    expect(readFile(initial.root, "src/main.ts")).toContain("hello solana");

    const updated = await applyPatch(userId, courseId, [
      { path: "src/main.ts", content: "console.log('updated');" },
    ]);
    expect(readFile(updated.root, "src/main.ts")).toContain("updated");

    const reloaded = await loadWorkspace(userId, courseId);
    expect(readFile(reloaded.root, "src/main.ts")).toContain("updated");
  });

  it("creates and restores snapshots", async () => {
    const userId = "u-storage-2";
    const courseId = "course-storage-2";

    await loadWorkspace(userId, courseId);
    await applyPatch(userId, courseId, [{ path: "src/main.ts", content: "v1" }]);
    await createSnapshot(userId, courseId, "cp-1");
    await applyPatch(userId, courseId, [{ path: "src/main.ts", content: "v2" }]);

    const restored = await resetToSnapshot(userId, courseId, "cp-1");
    expect(readFile(restored.root, "src/main.ts")).toBe("v1");
  });
});
