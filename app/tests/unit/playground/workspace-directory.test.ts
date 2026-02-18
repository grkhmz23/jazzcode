import { describe, expect, it } from "vitest";
import {
  buildFileSystemTree,
  getPathsInDirectory,
  directoryExists,
  isDirectory,
  listDirectoryContents,
  createDirectory,
  removeDirectory,
  movePath,
  copyPath,
} from "@/lib/playground/workspace/directory";
import { Workspace } from "@/lib/playground/types";

function makeWorkspace(files: Record<string, string>): Workspace {
  const now = Date.now();
  return {
    templateId: "test",
    files: Object.fromEntries(
      Object.entries(files).map(([path, content]) => [
        path,
        {
          path,
          content,
          language: "typescript" as const,
          updatedAt: now,
          readOnly: false,
        },
      ])
    ),
    openFiles: Object.keys(files).slice(0, 1),
    activeFile: Object.keys(files)[0] ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

describe("workspace/directory", () => {
  describe("buildFileSystemTree", () => {
    it("builds tree from flat files", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils/helper.ts": "helper",
        "README.md": "readme",
      });

      const tree = buildFileSystemTree(workspace.files);
      expect(tree.type).toBe("directory");
      expect(tree.children.size).toBe(2); // src, README.md
      expect(tree.children.get("README.md")?.type).toBe("file");
      expect(tree.children.get("src")?.type).toBe("directory");
    });

    it("handles deeply nested paths", () => {
      const workspace = makeWorkspace({
        "a/b/c/d/e/file.ts": "deep",
      });

      const tree = buildFileSystemTree(workspace.files);
      let current = tree;
      for (const name of ["a", "b", "c", "d", "e"]) {
        const child = current.children.get(name);
        expect(child?.type).toBe("directory");
        if (child?.type === "directory") {
          current = child;
        }
      }
      expect(current.children.get("file.ts")?.type).toBe("file");
    });
  });

  describe("getPathsInDirectory", () => {
    it("gets all paths in a directory", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils/helper.ts": "helper",
        "src/utils/index.ts": "index",
        "README.md": "readme",
      });

      const paths = getPathsInDirectory(workspace.files, "src");
      expect(paths).toHaveLength(3);
      expect(paths).toContain("src/main.ts");
      expect(paths).toContain("src/utils/helper.ts");
      expect(paths).not.toContain("README.md");
    });

    it("handles root directory", () => {
      const workspace = makeWorkspace({
        "file1.ts": "1",
        "file2.ts": "2",
      });

      const paths = getPathsInDirectory(workspace.files, "/");
      expect(paths).toHaveLength(2);
    });

    it("returns empty for non-existent directory", () => {
      const workspace = makeWorkspace({ "file.ts": "content" });
      const paths = getPathsInDirectory(workspace.files, "nonexistent");
      expect(paths).toHaveLength(0);
    });
  });

  describe("directoryExists", () => {
    it("returns true for existing directory", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
      });
      expect(directoryExists(workspace.files, "src")).toBe(true);
    });

    it("returns false for non-existent directory", () => {
      const workspace = makeWorkspace({ "file.ts": "content" });
      expect(directoryExists(workspace.files, "nonexistent")).toBe(false);
    });

    it("returns false for file paths", () => {
      const workspace = makeWorkspace({ "file.ts": "content" });
      expect(directoryExists(workspace.files, "file.ts")).toBe(false);
    });
  });

  describe("isDirectory", () => {
    it("returns true for directory with children", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils.ts": "utils",
      });
      expect(isDirectory(workspace.files, "src")).toBe(true);
    });

    it("returns false for leaf file", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
      });
      expect(isDirectory(workspace.files, "src/main.ts")).toBe(false);
    });

    it("returns false for non-existent path", () => {
      const workspace = makeWorkspace({ "file.ts": "content" });
      expect(isDirectory(workspace.files, "nonexistent")).toBe(false);
    });
  });

  describe("listDirectoryContents", () => {
    it("lists immediate children only", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils/helper.ts": "helper",
        "README.md": "readme",
      });

      const children = listDirectoryContents(workspace.files, "/");
      expect(children).toHaveLength(2);
      expect(children.map((c) => c.name)).toContain("src");
      expect(children.map((c) => c.name)).toContain("README.md");
    });

    it("distinguishes files from directories", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "README.md": "readme",
      });

      const children = listDirectoryContents(workspace.files, "/");
      expect(children.find((c) => c.name === "src")?.type).toBe("directory");
      expect(children.find((c) => c.name === "README.md")?.type).toBe("file");
    });

    it("sorts directories first", () => {
      const workspace = makeWorkspace({
        "z-file.ts": "z",
        "a-file.ts": "a",
        "b-dir/nested.ts": "nested",
        "a-dir/nested.ts": "nested",
      });

      const children = listDirectoryContents(workspace.files, "/");
      expect(children[0].type).toBe("directory");
      expect(children[1].type).toBe("directory");
      expect(children[0].name).toBe("a-dir");
      expect(children[1].name).toBe("b-dir");
    });
  });

  describe("createDirectory", () => {
    it("creates directory with placeholder file", () => {
      const workspace = makeWorkspace({});
      const result = createDirectory(workspace, "newdir", true);
      expect(result.created).toBe(true);
      expect(result.placeholderPath).toBe("newdir/.gitkeep");
      expect(result.workspace.files["newdir/.gitkeep"]).toBeDefined();
    });

    it("does not recreate existing directory", () => {
      const workspace = makeWorkspace({
        "existing/file.ts": "content",
      });
      const result = createDirectory(workspace, "existing", true);
      expect(result.created).toBe(false);
    });

    it("does nothing without placeholder option", () => {
      const workspace = makeWorkspace({});
      const result = createDirectory(workspace, "newdir", false);
      expect(result.created).toBe(false);
      expect(Object.keys(result.workspace.files)).toHaveLength(0);
    });
  });

  describe("removeDirectory", () => {
    it("removes directory and all contents", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils/helper.ts": "helper",
        "README.md": "readme",
      });

      const result = removeDirectory(workspace, "src");
      expect(Object.keys(result.files)).toHaveLength(1);
      expect(result.files["README.md"]).toBeDefined();
    });

    it("throws for non-existent directory", () => {
      const workspace = makeWorkspace({ "file.ts": "content" });
      expect(() => removeDirectory(workspace, "nonexistent")).toThrow("does not exist");
    });

    it("throws when deleting last file", () => {
      const workspace = makeWorkspace({
        "src/file.ts": "content",
      });
      expect(() => removeDirectory(workspace, "src")).toThrow("last file");
    });

    it("updates open files", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "README.md": "readme",
      });
      workspace.openFiles = ["src/main.ts", "README.md"];
      workspace.activeFile = "src/main.ts";

      const result = removeDirectory(workspace, "src");
      expect(result.openFiles).not.toContain("src/main.ts");
      expect(result.activeFile).toBe("README.md");
    });
  });

  describe("movePath", () => {
    it("renames a single file", () => {
      const workspace = makeWorkspace({
        "old.ts": "content",
        "other.ts": "other",
      });

      const result = movePath(workspace, "old.ts", "new.ts");
      expect(result.files["new.ts"]).toBeDefined();
      expect(result.files["old.ts"]).toBeUndefined();
    });

    it("moves a directory with contents", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils.ts": "utils",
        "README.md": "readme",
      });

      const result = movePath(workspace, "src", "source");
      expect(result.files["source/main.ts"]).toBeDefined();
      expect(result.files["source/utils.ts"]).toBeDefined();
      expect(result.files["src/main.ts"]).toBeUndefined();
    });

    it("throws when destination exists", () => {
      const workspace = makeWorkspace({
        "a/file.ts": "a",
        "b/file.ts": "b",
      });
      expect(() => movePath(workspace, "a", "b")).toThrow("already exists");
    });
  });

  describe("copyPath", () => {
    it("copies a single file", () => {
      const workspace = makeWorkspace({
        "source.ts": "content",
      });

      const result = copyPath(workspace, "source.ts", "dest.ts");
      expect(result.files["source.ts"]).toBeDefined();
      expect(result.files["dest.ts"]).toBeDefined();
      expect(result.files["dest.ts"].content).toBe("content");
    });

    it("handles duplicate names when copying", () => {
      const workspace = makeWorkspace({
        "source.ts": "source",
        "dest.ts": "existing",
      });

      const result = copyPath(workspace, "source.ts", "dest.ts");
      expect(result.files["dest.ts"]).toBeDefined();
      expect(result.files["dest (1).ts"]).toBeDefined();
    });

    it("copies a directory recursively", () => {
      const workspace = makeWorkspace({
        "src/main.ts": "main",
        "src/utils/helper.ts": "helper",
      });

      const result = copyPath(workspace, "src", "backup");
      expect(result.files["backup/main.ts"]).toBeDefined();
      expect(result.files["backup/utils/helper.ts"]).toBeDefined();
      expect(result.files["src/main.ts"]).toBeDefined(); // Original preserved
    });
  });
});
