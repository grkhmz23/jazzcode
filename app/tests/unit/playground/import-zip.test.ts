import { describe, expect, it } from "vitest";
import { zipSync, strToU8 } from "fflate";
import { sanitizeZipPath, parseZipFile, mergeImportedFiles, ZipImportEntry } from "@/lib/playground/import-zip";
import { WorkspaceFile } from "@/lib/playground/types";

describe("sanitizeZipPath", () => {
  it("accepts valid relative paths", () => {
    expect(sanitizeZipPath("src/main.ts")).toBe("src/main.ts");
    expect(sanitizeZipPath("README.md")).toBe("README.md");
    expect(sanitizeZipPath("a/b/c/d.json")).toBe("a/b/c/d.json");
  });

  it("normalizes backslashes", () => {
    expect(sanitizeZipPath("src\\lib\\main.ts")).toBe("src/lib/main.ts");
  });

  it("rejects absolute paths", () => {
    expect(sanitizeZipPath("/etc/passwd")).toBeNull();
    expect(sanitizeZipPath("\\etc\\passwd")).toBeNull();
  });

  it("rejects path traversal", () => {
    expect(sanitizeZipPath("foo/../../etc/passwd")).toBeNull();
    expect(sanitizeZipPath("../secret")).toBeNull();
    expect(sanitizeZipPath("foo/../bar")).toBeNull();
  });

  it("rejects Windows drive letters", () => {
    expect(sanitizeZipPath("C:\\Windows\\system.ini")).toBeNull();
    expect(sanitizeZipPath("D:file.txt")).toBeNull();
  });

  it("rejects null bytes", () => {
    expect(sanitizeZipPath("foo\0bar.ts")).toBeNull();
  });

  it("rejects empty input", () => {
    expect(sanitizeZipPath("")).toBeNull();
  });
});

function makeTestZip(files: Record<string, string>): ArrayBuffer {
  const data: Record<string, Uint8Array> = {};
  for (const [path, content] of Object.entries(files)) {
    data[path] = strToU8(content);
  }
  const zipped = zipSync(data);
  return zipped.buffer.slice(0) as ArrayBuffer;
}

describe("parseZipFile", () => {
  it("extracts files preserving directory structure", () => {
    const buffer = makeTestZip({
      "src/main.ts": "console.log('hello')",
      "README.md": "# Hello",
    });
    const result = parseZipFile(buffer);
    expect(result.entries).toHaveLength(2);
    expect(result.entries.map((e) => e.path).sort()).toEqual(["README.md", "src/main.ts"]);
  });

  it("skips .git/ files", () => {
    const buffer = makeTestZip({
      ".git/HEAD": "ref: refs/heads/main",
      ".git/objects/ab/cd": "blob data",
      "src/main.ts": "code",
    });
    const result = parseZipFile(buffer);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].path).toBe("src/main.ts");
    expect(result.skipped).toContain(".git/HEAD");
  });

  it("enforces max file count", () => {
    const files: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      files[`file${i}.txt`] = "content";
    }
    const buffer = makeTestZip(files);
    expect(() => parseZipFile(buffer, { maxFiles: 5 })).toThrow("too many files");
  });

  it("enforces max total bytes", () => {
    const buffer = makeTestZip({
      "big.txt": "x".repeat(1000),
    });
    expect(() => parseZipFile(buffer, { maxTotalBytes: 100 })).toThrow("exceed");
  });

  it("skips directory entries", () => {
    const data: Record<string, Uint8Array> = {
      "src/": new Uint8Array(0),
      "src/main.ts": strToU8("code"),
    };
    const zipped = zipSync(data);
    const result = parseZipFile(zipped.buffer.slice(0) as ArrayBuffer);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].path).toBe("src/main.ts");
  });

  it("skips macOS metadata files (__MACOSX, .DS_Store)", () => {
    const buffer = makeTestZip({
      "src/main.ts": "code",
      ".DS_Store": "mac metadata",
      "__MACOSX/._file": "mac resource fork",
      "__MACOSX/src/._main.ts": "mac resource fork",
    });
    const result = parseZipFile(buffer);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].path).toBe("src/main.ts");
    expect(result.skipped).toContain(".DS_Store");
    expect(result.skipped).toContain("__MACOSX/._file");
    expect(result.skipped).toContain("__MACOSX/src/._main.ts");
  });

  it("skips Windows metadata files (Thumbs.db, desktop.ini)", () => {
    const buffer = makeTestZip({
      "src/main.ts": "code",
      "Thumbs.db": "windows thumbs",
      "desktop.ini": "windows config",
      "folder/Desktop.ini": "windows config",
    });
    const result = parseZipFile(buffer);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].path).toBe("src/main.ts");
    expect(result.skipped).toContain("Thumbs.db");
    expect(result.skipped).toContain("desktop.ini");
  });

  it("skips IDE config files (.vscode, .idea)", () => {
    const buffer = makeTestZip({
      "src/main.ts": "code",
      ".vscode/settings.json": "vscode config",
      ".idea/workspace.xml": "intellij config",
    });
    const result = parseZipFile(buffer);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].path).toBe("src/main.ts");
    expect(result.skipped).toContain(".vscode/settings.json");
    expect(result.skipped).toContain(".idea/workspace.xml");
  });

  it("provides helpful error for oversized compressed files", () => {
    // Create a buffer larger than 10MB to trigger compressed size check
    const largeBuffer = new ArrayBuffer(11 * 1024 * 1024);
    expect(() => parseZipFile(largeBuffer)).toThrow("ZIP file size");
    expect(() => parseZipFile(largeBuffer)).toThrow("maximum allowed");
  });
});

describe("mergeImportedFiles", () => {
  const existing: Record<string, WorkspaceFile> = {
    "src/main.ts": {
      path: "src/main.ts",
      language: "typescript",
      content: "original",
      updatedAt: 1000,
    },
  };

  const newEntries: ZipImportEntry[] = [
    { path: "src/main.ts", content: "imported", sizeBytes: 8 },
    { path: "src/utils.ts", content: "new file", sizeBytes: 8 },
  ];

  it("overwrite replaces existing files", () => {
    const result = mergeImportedFiles(existing, newEntries, "overwrite");
    expect(result["src/main.ts"].content).toBe("imported");
    expect(result["src/utils.ts"].content).toBe("new file");
  });

  it("skip keeps existing files", () => {
    const result = mergeImportedFiles(existing, newEntries, "skip");
    expect(result["src/main.ts"].content).toBe("original");
    expect(result["src/utils.ts"].content).toBe("new file");
  });

  it("keep_both renames conflicting files", () => {
    const result = mergeImportedFiles(existing, newEntries, "keep_both");
    expect(result["src/main.ts"].content).toBe("original");
    expect(result["src/main (1).ts"]).toBeDefined();
    expect(result["src/main (1).ts"].content).toBe("imported");
    expect(result["src/utils.ts"].content).toBe("new file");
  });
});
