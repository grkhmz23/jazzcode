/**
 * Playground Share Store Tests
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import { join, resolve } from "path";

// Must set env before importing the store
const TEST_DATA_DIR = resolve(".data/test-playground-shares");
process.env.PLAYGROUND_SHARE_DIR = TEST_DATA_DIR;

// Import after env is set
import {
  storeBundle,
  retrieveBundle,
  deleteShare,
  cleanupExpired,
} from "@/lib/playground/share-store";
import type { ValidatedComponentBundle } from "@/lib/component-hub/schema";

const mockBundle: ValidatedComponentBundle = {
  id: "test-component",
  title: "Test Component",
  description: "A test component for sharing",
  files: [
    {
      path: "Button.tsx",
      content: "export function Button() { return <button>Click</button>; }",
      language: "typescript",
    },
  ],
  dependencies: [{ name: "react", version: "^18.0.0" }],
  props: [{ name: "label", type: "string", required: false, description: "Button label" }],
  permissions: [{ type: "wallet", required: true, description: "Needs wallet" }],
  defaultProps: { label: "Click me" },
};

describe("Playground Share Store", () => {
  beforeEach(async () => {
    // Clean test directory
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore if doesn't exist
    }
  });

  afterEach(async () => {
    // Cleanup after tests
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  describe("storeBundle", () => {
    it("should store a bundle and return a share ID", async () => {
      const { id, expiresAt } = await storeBundle(mockBundle);

      expect(id).toBeDefined();
      expect(id.length).toBeGreaterThan(0);
      expect(expiresAt).toBeInstanceOf(Date);
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it("should create the data directory if it doesn't exist", async () => {
      await storeBundle(mockBundle);

      const stats = await fs.stat(TEST_DATA_DIR);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe("retrieveBundle", () => {
    it("should retrieve a stored bundle", async () => {
      const { id } = await storeBundle(mockBundle);
      const result = await retrieveBundle(id);

      expect(result).not.toBeNull();
      expect(result?.bundle.id).toBe(mockBundle.id);
      expect(result?.bundle.title).toBe(mockBundle.title);
      expect(result?.bundle.files).toHaveLength(1);
      expect(result?.bundle.files[0].path).toBe("Button.tsx");
    });

    it("should return null for non-existent share", async () => {
      const result = await retrieveBundle("non-existent-id-12345");
      expect(result).toBeNull();
    });

    it("should return null for invalid share ID format", async () => {
      const result = await retrieveBundle("../../etc/passwd");
      expect(result).toBeNull();
    });

    it("should return null for expired shares", async () => {
      const { id } = await storeBundle(mockBundle);

      // Manually modify the file to make it expired
      const filePath = join(TEST_DATA_DIR, `${id}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      const record = JSON.parse(content);
      record.expiresAt = new Date(Date.now() - 1000).toISOString(); // Expired 1 second ago
      await fs.writeFile(filePath, JSON.stringify(record));

      const result = await retrieveBundle(id);
      expect(result).toBeNull();
    });
  });

  describe("deleteShare", () => {
    it("should delete an existing share", async () => {
      const { id } = await storeBundle(mockBundle);
      expect(await retrieveBundle(id)).not.toBeNull();

      const deleted = await deleteShare(id);
      expect(deleted).toBe(true);
      expect(await retrieveBundle(id)).toBeNull();
    });

    it("should return false for non-existent share", async () => {
      const result = await deleteShare("non-existent");
      expect(result).toBe(false);
    });
  });

  describe("cleanupExpired", () => {
    it("should remove expired shares", async () => {
      // Create a share
      const { id } = await storeBundle(mockBundle);

      // Manually expire it
      const filePath = join(TEST_DATA_DIR, `${id}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      const record = JSON.parse(content);
      record.expiresAt = new Date(Date.now() - 1000).toISOString();
      await fs.writeFile(filePath, JSON.stringify(record));

      // Run cleanup
      const cleaned = await cleanupExpired();
      expect(cleaned).toBe(1);

      // Verify it's gone
      expect(await retrieveBundle(id)).toBeNull();
    });

    it("should not remove valid shares", async () => {
      const { id } = await storeBundle(mockBundle);

      const cleaned = await cleanupExpired();
      expect(cleaned).toBe(0);

      const result = await retrieveBundle(id);
      expect(result).not.toBeNull();
    });

    it("should handle empty directory", async () => {
      const cleaned = await cleanupExpired();
      expect(cleaned).toBe(0);
    });
  });

  describe("ID sanitization", () => {
    it("should sanitize malicious share IDs", async () => {
      const maliciousIds = [
        "../../../etc/passwd",
        "..\\\\windows\\\\system32",
        "/absolute/path",
        "file\0null",
      ];

      for (const id of maliciousIds) {
        const result = await retrieveBundle(id);
        expect(result).toBeNull();
      }
    });
  });
});
