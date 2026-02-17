/**
 * Virtual File System Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { normalizePath } from "@/lib/playground/fs/ops";

describe("Virtual File System", () => {
  describe("normalizePath", () => {
    it("should normalize forward slashes", () => {
      expect(normalizePath("path\\to\\file")).toBe("path/to/file");
    });

    it("should remove leading slashes", () => {
      expect(normalizePath("/path/to/file")).toBe("path/to/file");
    });

    it("should collapse multiple slashes", () => {
      expect(normalizePath("path//to///file")).toBe("path/to/file");
    });

    it("should reject empty paths", () => {
      expect(() => normalizePath("")).toThrow("File path cannot be empty");
      expect(() => normalizePath("   ")).toThrow("File path cannot be empty");
    });

    it("should reject paths with . segments", () => {
      expect(() => normalizePath("path/./file")).toThrow("File path contains invalid segments");
    });

    it("should reject paths with .. segments", () => {
      expect(() => normalizePath("path/../file")).toThrow("File path contains invalid segments");
    });

    it("should normalize paths with double slashes to single slashes", () => {
      // Multiple slashes are normalized to single slashes before segment validation
      expect(normalizePath("path//file")).toBe("path/file");
      expect(normalizePath("path///file")).toBe("path/file");
    });

    it("should handle simple paths", () => {
      expect(normalizePath("file.ts")).toBe("file.ts");
      expect(normalizePath("src/file.ts")).toBe("src/file.ts");
      expect(normalizePath("src/components/file.tsx")).toBe("src/components/file.tsx");
    });

    it("should trim whitespace", () => {
      expect(normalizePath("  path/to/file  ")).toBe("path/to/file");
    });
  });
});
