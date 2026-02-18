import { describe, expect, it } from "vitest";
import {
  encodeWorkspaceShare,
  decodeWorkspaceShare,
  getShareableLink,
} from "@/lib/playground/share/codec";
import { Workspace } from "@/lib/playground/types";

function makeWorkspace(overrides?: Partial<Workspace>): Workspace {
  const now = Date.now();
  return {
    templateId: "test-template",
    files: {
      "main.ts": {
        path: "main.ts",
        content: "console.log('hello');",
        language: "typescript",
        updatedAt: now,
        readOnly: false,
      },
    },
    openFiles: ["main.ts"],
    activeFile: "main.ts",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("share/codec", () => {
  describe("encodeWorkspaceShare", () => {
    it("encodes a simple workspace", async () => {
      const workspace = makeWorkspace();
      const result = await encodeWorkspaceShare(workspace);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toMatch(/^#share=/);
        expect(result.payloadSize).toBeGreaterThan(0);
      }
    });

    it("includes terminal seed when provided", async () => {
      const workspace = makeWorkspace();
      const result = await encodeWorkspaceShare(workspace, "my-seed-123");
      expect(result.success).toBe(true);
    });

    it("rejects workspaces that are too large", async () => {
      // Use checkShareLimits directly to test the limit behavior
      // since compression can make large content smaller
      const { checkShareLimits } = await import("@/lib/playground/security/limits");

      // 200KB payload should be rejected
      const result = checkShareLimits(200 * 1024);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toContain("too large");
      }
    });

    it("encodes multiple files", async () => {
      const workspace = makeWorkspace({
        files: {
          "src/main.ts": {
            path: "src/main.ts",
            content: "export const main = () => {};",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
          "src/utils.ts": {
            path: "src/utils.ts",
            content: "export const helper = () => {};",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
          "README.md": {
            path: "README.md",
            content: "# Project",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
        },
        openFiles: ["src/main.ts", "src/utils.ts"],
        activeFile: "src/main.ts",
      });

      const result = await encodeWorkspaceShare(workspace);
      expect(result.success).toBe(true);
    });
  });

  describe("decodeWorkspaceShare", () => {
    it("decodes encoded workspace", async () => {
      const workspace = makeWorkspace({
        files: {
          "main.ts": {
            path: "main.ts",
            content: "const x = 42;",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
        },
        templateId: "custom-template",
      });

      const encoded = await encodeWorkspaceShare(workspace, "test-seed");
      expect(encoded.success).toBe(true);

      if (encoded.success) {
        const decoded = await decodeWorkspaceShare(encoded.url);
        expect(decoded).not.toBeNull();
        if (decoded) {
          expect(decoded.workspace.templateId).toBe("custom-template");
          expect(decoded.workspace.files["main.ts"].content).toBe("const x = 42;");
          expect(decoded.terminalSeed).toBe("test-seed");
        }
      }
    });

    it("returns null for invalid hash", async () => {
      const decoded = await decodeWorkspaceShare("#invalid");
      expect(decoded).toBeNull();
    });

    it("returns null for malformed share", async () => {
      const decoded = await decodeWorkspaceShare("#share=invalid.data");
      expect(decoded).toBeNull();
    });

    it("handles missing share param", async () => {
      const decoded = await decodeWorkspaceShare("#other=value");
      expect(decoded).toBeNull();
    });

    it("preserves open files and active file", async () => {
      const workspace = makeWorkspace({
        files: {
          "a.ts": {
            path: "a.ts",
            content: "a",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
          "b.ts": {
            path: "b.ts",
            content: "b",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
        },
        openFiles: ["a.ts", "b.ts"],
        activeFile: "b.ts",
      });

      const encoded = await encodeWorkspaceShare(workspace);
      if (encoded.success) {
        const decoded = await decodeWorkspaceShare(encoded.url);
        expect(decoded?.workspace.openFiles).toEqual(["a.ts", "b.ts"]);
        expect(decoded?.workspace.activeFile).toBe("b.ts");
      }
    });
  });

  describe("getShareableLink", () => {
    it("includes base URL when provided", async () => {
      const workspace = makeWorkspace();
      const result = await getShareableLink(workspace, undefined, "https://example.com/playground");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.url).toMatch(/^https:\/\/example\.com\/playground#share=/);
      }
    });

    it("includes terminal seed in link", async () => {
      const workspace = makeWorkspace();
      const result = await getShareableLink(workspace, "my-seed");
      expect(result.success).toBe(true);
    });
  });

  describe("round-trip encoding", () => {
    it("preserves all file content exactly", async () => {
      const complexContent = `
import { something } from "somewhere";

// This is a comment with special chars: àáâãäåæçèéêë
const data = {
  nested: {
    array: [1, 2, 3],
    string: "Hello\\nWorld\\t!",
  },
};

export default data;
`;
      const workspace = makeWorkspace({
        files: {
          "complex.ts": {
            path: "complex.ts",
            content: complexContent,
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
        },
      });

      const encoded = await encodeWorkspaceShare(workspace);
      if (encoded.success) {
        const decoded = await decodeWorkspaceShare(encoded.url);
        expect(decoded?.workspace.files["complex.ts"].content).toBe(complexContent);
      }
    });

    it("handles empty workspace gracefully", async () => {
      const workspace = makeWorkspace({
        files: {
          "placeholder.txt": {
            path: "placeholder.txt",
            content: "",
            language: "typescript",
            updatedAt: Date.now(),
            readOnly: false,
          },
        },
      });

      const encoded = await encodeWorkspaceShare(workspace);
      expect(encoded.success).toBe(true);
    });
  });
});
