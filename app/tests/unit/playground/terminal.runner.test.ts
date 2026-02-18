import { describe, expect, it, vi } from "vitest";
import { createInitialTerminalState, executeTerminalCommand } from "@/lib/playground/terminal/engine";
import type { TerminalIo } from "@/lib/playground/terminal/commands";

function createIo() {
  const files: Record<string, string> = {
    "Anchor.toml": "[provider]\ncluster=\"devnet\"\n",
    "programs/counter/src/lib.rs": "use anchor_lang::prelude::*;\n#[program]\npub mod counter {}\ndeclare_id!(\"Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h\");\n",
  };

  const runRunnerJob = vi.fn<NonNullable<TerminalIo["runRunnerJob"]>>();

  const io: TerminalIo = {
    workspace: {
      templateId: "test",
      files: Object.fromEntries(
        Object.entries(files).map(([path, content]) => [
          path,
          { path, content, language: "typescript", updatedAt: Date.now() },
        ])
      ),
      openFiles: ["Anchor.toml"],
      activeFile: "Anchor.toml",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    createOrUpdateFile: (path, content) => {
      files[path] = content;
    },
    fileExists: (path) => Object.prototype.hasOwnProperty.call(files, path),
    readFile: (path) => files[path] ?? null,
    listPaths: () => Object.keys(files),
    setActiveFile: () => undefined,
    runRunnerJob,
    wallet: {
      mode: "burner",
      burnerAddress: null,
      externalAddress: null,
      burnerSigner: null,
      externalConnected: false,
    },
  };

  return { io, files, runRunnerJob };
}

describe("playground terminal runner integration", () => {
  it("routes anchor deploy to runner and applies returned artifacts", async () => {
    const { io, files, runRunnerJob } = createIo();
    runRunnerJob.mockResolvedValue({
      ok: true,
      streamed: false,
      result: {
        exitCode: 0,
        stdout: "Deploy success",
        stderr: "",
        outputFiles: {
          "target/idl/idl.json": "{\"name\":\"counter\"}",
          "target/deploy/deploy.json": "{\"programId\":\"111\"}",
        },
      },
    });

    const result = await executeTerminalCommand("anchor deploy", createInitialTerminalState(), io);

    expect(runRunnerJob).toHaveBeenCalledTimes(1);
    expect(runRunnerJob.mock.calls[0]?.[0].jobType).toBe("anchor_deploy");
    expect(runRunnerJob.mock.calls[0]?.[0].args.cluster).toBe("devnet");
    expect(files["target/idl/idl.json"]).toContain("counter");
    expect(result.metadata?.commandSucceeded).toBe("anchor deploy");
  });

  it("routes cargo build to runner", async () => {
    const { io, runRunnerJob } = createIo();
    runRunnerJob.mockResolvedValue({
      ok: true,
      streamed: false,
      result: {
        exitCode: 0,
        stdout: "Finished dev [unoptimized]",
        stderr: "",
      },
    });

    const result = await executeTerminalCommand("cargo build", createInitialTerminalState(), io);

    expect(runRunnerJob).toHaveBeenCalledTimes(1);
    expect(runRunnerJob.mock.calls[0]?.[0].jobType).toBe("cargo_build");
    expect(result.metadata?.commandSucceeded).toBe("cargo build");
  });

  it("does not apply artifacts when apply toggle is disabled", async () => {
    const { io, files, runRunnerJob } = createIo();
    io.shouldApplyRunnerArtifacts = () => false;
    runRunnerJob.mockResolvedValue({
      ok: true,
      streamed: false,
      result: {
        exitCode: 0,
        stdout: "Deploy success",
        stderr: "",
        outputFiles: {
          "target/idl/idl.json": "{\"name\":\"counter\"}",
        },
      },
    });

    await executeTerminalCommand("anchor deploy", createInitialTerminalState(), io);

    expect(runRunnerJob).toHaveBeenCalledTimes(1);
    expect(files["target/idl/idl.json"]).toBeUndefined();
  });
});
