import { describe, expect, it } from "vitest";
import {
  checkWorkspaceLimits,
  checkZipImportLimits,
  checkGitHubImportLimits,
  checkExportLimits,
  checkShareLimits,
  sanitizePath,
  isMetadataPath,
  DEFAULT_LIMITS,
} from "@/lib/playground/security/limits";

describe("security/limits", () => {
  describe("checkWorkspaceLimits", () => {
    it("allows files within limits", () => {
      const files: Record<string, { content: string }> = {
        "file1.ts": { content: "console.log('hello')" },
      };
      const result = checkWorkspaceLimits(files, "file2.ts", "const x = 1;", DEFAULT_LIMITS);
      expect(result).toEqual({ allowed: true });
    });

    it("rejects when file count exceeded", () => {
      const files: Record<string, { content: string }> = {};
      for (let i = 0; i < DEFAULT_LIMITS.maxFileCount; i++) {
        files[`file${i}.ts`] = { content: "x" };
      }
      const result = checkWorkspaceLimits(files, "newfile.ts", "x", DEFAULT_LIMITS);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("file limit reached");
      }
    });

    it("rejects when single file too large", () => {
      const files: Record<string, { content: string }> = {};
      const largeContent = "x".repeat(DEFAULT_LIMITS.maxSingleFileBytes + 1);
      const result = checkWorkspaceLimits(files, "large.ts", largeContent, DEFAULT_LIMITS);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("File too large");
      }
    });

    it("rejects when total workspace size exceeded", () => {
      const files: Record<string, { content: string }> = {
        "existing.ts": { content: "x".repeat(DEFAULT_LIMITS.maxTotalWorkspaceBytes - 100) },
      };
      const result = checkWorkspaceLimits(files, "new.ts", "x".repeat(200), DEFAULT_LIMITS);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("size limit");
      }
    });
  });

  describe("checkZipImportLimits", () => {
    it("allows ZIP within limits", () => {
      const result = checkZipImportLimits(1024, 2048, 10, DEFAULT_LIMITS);
      expect(result).toEqual({ allowed: true });
    });

    it("rejects when compressed size exceeded", () => {
      const result = checkZipImportLimits(
        DEFAULT_LIMITS.zipMaxCompressedBytes + 1,
        1024,
        10,
        DEFAULT_LIMITS
      );
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too large");
      }
    });

    it("rejects when uncompressed size exceeded", () => {
      const result = checkZipImportLimits(
        1024,
        DEFAULT_LIMITS.zipMaxUncompressedBytes + 1,
        10,
        DEFAULT_LIMITS
      );
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("uncompressed");
      }
    });

    it("rejects when file count exceeded", () => {
      const result = checkZipImportLimits(
        1024,
        2048,
        DEFAULT_LIMITS.zipMaxFiles + 1,
        DEFAULT_LIMITS
      );
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too many files");
      }
    });
  });

  describe("checkGitHubImportLimits", () => {
    it("allows repos within limits", () => {
      const result = checkGitHubImportLimits(100, 1024 * 1024, DEFAULT_LIMITS);
      expect(result).toEqual({ allowed: true });
    });

    it("rejects when file count exceeded", () => {
      const result = checkGitHubImportLimits(
        DEFAULT_LIMITS.githubMaxFiles + 1,
        1024,
        DEFAULT_LIMITS
      );
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too many files");
      }
    });

    it("rejects when total size exceeded", () => {
      const result = checkGitHubImportLimits(
        10,
        DEFAULT_LIMITS.githubMaxTotalBytes + 1,
        DEFAULT_LIMITS
      );
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too large");
      }
    });
  });

  describe("checkExportLimits", () => {
    it("allows exports within limits", () => {
      const result = checkExportLimits(1024, DEFAULT_LIMITS);
      expect(result).toEqual({ allowed: true });
    });

    it("rejects when export size exceeded", () => {
      const result = checkExportLimits(DEFAULT_LIMITS.exportMaxBytes + 1, DEFAULT_LIMITS);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too large");
      }
    });
  });

  describe("checkShareLimits", () => {
    it("allows shares within limits", () => {
      const result = checkShareLimits(1024, DEFAULT_LIMITS);
      expect(result).toEqual({ allowed: true });
    });

    it("rejects when payload too large", () => {
      const result = checkShareLimits(DEFAULT_LIMITS.shareMaxPayloadBytes + 1, DEFAULT_LIMITS);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too large");
      }
    });
  });

  describe("sanitizePath", () => {
    it("accepts valid relative paths", () => {
      expect(sanitizePath("src/main.ts")).toBe("src/main.ts");
      expect(sanitizePath("README.md")).toBe("README.md");
      expect(sanitizePath("a/b/c/d.json")).toBe("a/b/c/d.json");
    });

    it("rejects empty paths", () => {
      expect(sanitizePath("")).toBeNull();
    });

    it("rejects null bytes", () => {
      expect(sanitizePath("foo\0bar.ts")).toBeNull();
    });

    it("rejects absolute paths", () => {
      expect(sanitizePath("/etc/passwd")).toBeNull();
      expect(sanitizePath("\\Windows\\system.ini")).toBeNull();
    });

    it("rejects path traversal", () => {
      expect(sanitizePath("../secret")).toBeNull();
      expect(sanitizePath("foo/../../etc/passwd")).toBeNull();
    });

    it("rejects Windows drive letters", () => {
      expect(sanitizePath("C:\\Windows\\file.txt")).toBeNull();
      expect(sanitizePath("D:file.txt")).toBeNull();
    });

    it("rejects double slashes", () => {
      expect(sanitizePath("foo//bar")).toBeNull();
    });

    it("normalizes backslashes", () => {
      expect(sanitizePath("src\\lib\\main.ts")).toBe("src/lib/main.ts");
    });
  });

  describe("isMetadataPath", () => {
    it("identifies macOS metadata", () => {
      expect(isMetadataPath(".DS_Store")).toBe(true);
      expect(isMetadataPath("__MACOSX/._file")).toBe(true);
      expect(isMetadataPath("__MACOSX/something")).toBe(true);
    });

    it("identifies Windows metadata", () => {
      expect(isMetadataPath("Thumbs.db")).toBe(true);
      expect(isMetadataPath("desktop.ini")).toBe(true);
    });

    it("identifies IDE config", () => {
      expect(isMetadataPath(".vscode/settings.json")).toBe(true);
      expect(isMetadataPath(".idea/workspace.xml")).toBe(true);
      expect(isMetadataPath(".vs/solution.sln")).toBe(true);
    });

    it("identifies temp files", () => {
      expect(isMetadataPath("file.tmp")).toBe(true);
      expect(isMetadataPath("file.temp")).toBe(true);
      expect(isMetadataPath("~$document.docx")).toBe(true);
    });

    it("identifies VCS directories", () => {
      expect(isMetadataPath(".svn/entries")).toBe(true);
      expect(isMetadataPath(".hg/store")).toBe(true);
    });

    it("allows regular files", () => {
      expect(isMetadataPath("src/main.ts")).toBe(false);
      expect(isMetadataPath("README.md")).toBe(false);
      expect(isMetadataPath("package.json")).toBe(false);
    });

    it("is case-insensitive", () => {
      expect(isMetadataPath(".ds_store")).toBe(true);
      expect(isMetadataPath("THUMBS.DB")).toBe(true);
      expect(isMetadataPath("__macosx/file")).toBe(true);
    });
  });
});
