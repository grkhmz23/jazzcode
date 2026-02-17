/**
 * Component Hub Schema Validation Tests
 */

import { describe, it, expect } from "vitest";
import {
  validateBundle,
  isValidPath,
  sanitizeFilename,
  componentBundleSchema,
} from "@/lib/component-hub/schema";

describe("Component Hub Schema Validation", () => {
  describe("isValidPath", () => {
    it("should accept valid relative paths", () => {
      expect(isValidPath("src/components/Button.tsx")).toBe(true);
      expect(isValidPath("Button.tsx")).toBe(true);
      expect(isValidPath("lib/utils/helpers.ts")).toBe(true);
      expect(isValidPath("file-name_123.js")).toBe(true);
    });

    it("should reject paths with ..", () => {
      expect(isValidPath("../secret.txt")).toBe(false);
      expect(isValidPath("src/../../../etc/passwd")).toBe(false);
      expect(isValidPath("./../something")).toBe(false);
    });

    it("should reject absolute paths", () => {
      expect(isValidPath("/etc/passwd")).toBe(false);
      expect(isValidPath("/absolute/path")).toBe(false);
    });

    it("should reject empty paths", () => {
      expect(isValidPath("")).toBe(false);
    });

    it("should reject paths with control characters", () => {
      expect(isValidPath("file\0.txt")).toBe(false);
      expect(isValidPath("file\n.txt")).toBe(false);
    });

    it("should reject Windows-style absolute paths", () => {
      expect(isValidPath("C:\\Windows\\file.txt")).toBe(false);
      expect(isValidPath("\\\\server\\share")).toBe(false);
    });
  });

  describe("sanitizeFilename", () => {
    it("should sanitize special characters", () => {
      expect(sanitizeFilename("file@name#123")).toBe("file_name_123");
      // Note: sanitizeFilename replaces dots too, so my-file.ts becomes my-file_ts
      expect(sanitizeFilename("my-file.ts")).toBe("my-file_ts");
    });

    it("should limit length", () => {
      const longName = "a".repeat(200);
      expect(sanitizeFilename(longName).length).toBe(100);
    });

    it("should collapse multiple underscores", () => {
      expect(sanitizeFilename("file@@@name")).toBe("file_name");
    });
  });

  describe("validateBundle", () => {
    const validBundle = {
      id: "test-component",
      title: "Test Component",
      description: "A test component",
      files: [
        {
          path: "Button.tsx",
          content: "export function Button() {}",
          language: "typescript" as const,
        },
      ],
      dependencies: [],
      props: [],
      permissions: [],
      defaultProps: {},
    };

    it("should validate a correct bundle", () => {
      const result = validateBundle(validBundle);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("test-component");
        expect(result.data.files).toHaveLength(1);
      }
    });

    it("should reject invalid IDs", () => {
      const invalid = { ...validBundle, id: "Invalid ID With Spaces!" };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("ID");
      }
    });

    it("should reject paths with ..", () => {
      const invalid = {
        ...validBundle,
        files: [
          {
            path: "../secret.txt",
            content: "malicious",
            language: "typescript" as const,
          },
        ],
      };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("path");
      }
    });

    it("should reject oversized content", () => {
      const largeContent = "x".repeat(60 * 1024); // 60KB > 50KB limit
      const invalid = {
        ...validBundle,
        files: [
          {
            path: "large.txt",
            content: largeContent,
            language: "typescript" as const,
          },
        ],
      };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("exceeds");
      }
    });

    it("should reject too many files", () => {
      const files = Array(60)
        .fill(null)
        .map((_, i) => ({
          path: `file${i}.ts`,
          content: "export {}",
          language: "typescript" as const,
        }));
      const invalid = { ...validBundle, files };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("files");
      }
    });

    it("should reject total size over 200KB", () => {
      // Create many small files that total over 200KB (but each under 50KB)
      const files = Array(5).fill(null).map((_, i) => ({
        path: `file${i}.ts`,
        content: "x".repeat(45 * 1024), // 45KB each
        language: "typescript" as const,
      }));
      const invalid = { ...validBundle, files };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("200KB");
      }
    });

    it("should reject empty files array", () => {
      const invalid = { ...validBundle, files: [] };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const invalid = { ...validBundle, title: "" };
      const result = validateBundle(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("componentBundleSchema strictness", () => {
    it("should strip extra properties when parsing", () => {
      const bundleWithExtra = {
        id: "test",
        title: "Test",
        description: "Desc",
        files: [{ path: "test.ts", content: "", language: "typescript" }],
        extraField: "should be stripped",
        anotherExtra: 123,
      };

      const result = componentBundleSchema.safeParse(bundleWithExtra);
      expect(result.success).toBe(true);
      if (result.success) {
        expect("extraField" in result.data).toBe(false);
        expect("anotherExtra" in result.data).toBe(false);
      }
    });
  });
});
