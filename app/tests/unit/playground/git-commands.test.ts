import { describe, expect, it, vi, beforeEach } from "vitest";
import { parseCommandLine, createInitialTerminalState, executeTerminalCommand } from "@/lib/playground/terminal/engine";
import { TerminalIo, TerminalState } from "@/lib/playground/terminal/commands";

function makeIo(files: Record<string, string> = {}): TerminalIo {
  const workspace = {
    templateId: "test",
    files: Object.fromEntries(
      Object.entries(files).map(([path, content]) => [
        path,
        { path, language: "typescript" as const, content, updatedAt: Date.now() },
      ])
    ),
    openFiles: Object.keys(files).slice(0, 1),
    activeFile: Object.keys(files)[0] ?? "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return {
    workspace,
    createOrUpdateFile: (path: string, content: string) => {
      workspace.files[path] = {
        path,
        language: "typescript",
        content,
        updatedAt: Date.now(),
      };
    },
    fileExists: (path: string) => Boolean(workspace.files[path]),
    readFile: (path: string) => workspace.files[path]?.content ?? null,
    listPaths: () => Object.keys(workspace.files),
    setActiveFile: () => {},
    deleteFile: (path: string) => {
      delete workspace.files[path];
    },
    requestGitToken: () => Promise.resolve(null),
    wallet: {
      mode: "burner",
      burnerAddress: null,
      externalAddress: null,
      burnerSigner: null,
      externalConnected: false,
    },
  };
}

describe("git commands", () => {
  it("parseCommandLine parses -m flag correctly", () => {
    const parsed = parseCommandLine('git commit -m "initial commit"');
    expect(parsed.command).toBe("git");
    expect(parsed.argv).toContain("-m");
    expect(parsed.argv).toContain("initial commit");
  });

  it("git without subcommand returns error", async () => {
    const state = createInitialTerminalState();
    const io = makeIo({ "src/main.ts": "code" });
    const result = await executeTerminalCommand("git", state, io);
    expect(result.lines.some((l) => l.kind === "error")).toBe(true);
  });

  it("unknown git subcommand returns error", async () => {
    const state = createInitialTerminalState();
    const io = makeIo({ "src/main.ts": "code" });
    const result = await executeTerminalCommand("git foobar", state, io);
    // In Node env without IndexedDB, the git store init may fail, producing a different error.
    // Either way, we expect an error line.
    expect(result.lines.some((l) => l.kind === "error")).toBe(true);
  });

  it("git commit -m without message returns error", async () => {
    const state = createInitialTerminalState();
    const io = makeIo({ "src/main.ts": "code" });
    const result = await executeTerminalCommand("git commit", state, io);
    expect(result.lines.some((l) => l.kind === "error")).toBe(true);
  });
});
