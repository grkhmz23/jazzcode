import { describe, expect, it, vi } from "vitest";
import { createInitialTerminalState, executeTerminalCommand } from "@/lib/playground/terminal/engine";
import type { TerminalIo } from "@/lib/playground/terminal/commands";

function createIo() {
  const files: Record<string, string> = {
    "Anchor.toml": "[provider]\ncluster=\"devnet\"\n",
    "programs/counter/src/lib.rs": "use anchor_lang::prelude::*;\n#[program]\npub mod counter {}\ndeclare_id!(\"Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h\");\n",
  };

  const runRunnerJob = vi.fn<NonNullable<TerminalIo["runRunnerJob"]>>();
  const runPreflight = vi.fn<NonNullable<TerminalIo["runPreflight"]>>();
  runPreflight.mockResolvedValue({
    ready: true,
    checkedAt: "2026-02-20T00:00:00.000Z",
    mode: "local",
    minimumDeployBalanceSol: 1,
    blockingCodes: [],
    warningCodes: [],
    checks: [],
  });

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
    runPreflight,
    wallet: {
      mode: "burner",
      burnerAddress: null,
      externalAddress: null,
      burnerSigner: null,
      externalConnected: false,
    },
  };

  return { io, files, runRunnerJob, runPreflight };
}

describe("playground terminal runner integration", () => {
  it("routes anchor build to runner and applies build artifacts", async () => {
    const { io, files, runRunnerJob } = createIo();
    runRunnerJob.mockResolvedValue({
      ok: true,
      streamed: false,
      result: {
        exitCode: 0,
        stdout: "Finished release [optimized] target(s)",
        stderr: "",
        outputFiles: {
          "target/idl/counter.json": "{\"name\":\"counter\"}",
        },
      },
    });

    const result = await executeTerminalCommand("anchor build", createInitialTerminalState(), io);

    expect(runRunnerJob).toHaveBeenCalledTimes(1);
    expect(runRunnerJob.mock.calls[0]?.[0].jobType).toBe("anchor_build");
    expect(files["target/idl/counter.json"]).toContain("counter");
    expect(result.metadata?.commandSucceeded).toBe("anchor build");
  });

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

  it("runs preflight diagnostics and renders readiness output", async () => {
    const { io, runPreflight } = createIo();
    runPreflight.mockResolvedValue({
      ready: false,
      checkedAt: "2026-02-20T00:00:00.000Z",
      mode: "local",
      minimumDeployBalanceSol: 1,
      blockingCodes: ["WALLET_CONNECTED"],
      warningCodes: [],
      checks: [
        {
          code: "RUNNER_MODE",
          title: "Runner mode",
          severity: "pass",
          message: "Local runner mode is active.",
        },
        {
          code: "WALLET_CONNECTED",
          title: "Wallet connection",
          severity: "fail",
          message: "No wallet is connected for deploy/IDL operations.",
          action: "Connect an external wallet or create/select a burner wallet.",
        },
      ],
    });

    const result = await executeTerminalCommand("preflight", createInitialTerminalState(), io);

    expect(runPreflight).toHaveBeenCalledTimes(1);
    expect(result.metadata?.commandSucceeded).toBe("preflight");
    expect(result.nextState.commandSuccesses).toContain("preflight");
    expect(result.lines.some((line) => line.text.includes("Preflight status: NOT READY"))).toBe(true);
    expect(result.lines.some((line) => line.text.includes("[FAIL] Wallet connection"))).toBe(true);
  });

  it("blocks deploy when preflight is not ready", async () => {
    const { io, runPreflight, runRunnerJob } = createIo();
    runPreflight.mockResolvedValue({
      ready: false,
      checkedAt: "2026-02-20T00:00:00.000Z",
      mode: "local",
      minimumDeployBalanceSol: 1,
      blockingCodes: ["WALLET_BALANCE_MINIMUM"],
      warningCodes: [],
      checks: [
        {
          code: "WALLET_BALANCE_MINIMUM",
          title: "Wallet deploy balance",
          severity: "fail",
          message: "Wallet balance is below minimum (0.1000 SOL < 1 SOL).",
          action: "Fund this wallet on devnet before deploy/IDL commands.",
        },
      ],
    });

    const result = await executeTerminalCommand("anchor deploy", createInitialTerminalState(), io);

    expect(runPreflight).toHaveBeenCalledTimes(1);
    expect(runRunnerJob).not.toHaveBeenCalled();
    expect(result.lines.some((line) => line.text.includes("Deploy/IDL command aborted"))).toBe(true);
    expect(result.lines.some((line) => line.text.includes("[WALLET_BALANCE_MINIMUM]"))).toBe(true);
    expect(result.metadata?.commandSucceeded).toBeUndefined();
  });
});
