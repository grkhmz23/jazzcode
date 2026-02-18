import test from "node:test";
import assert from "node:assert/strict";
import {
  DEVNET_RPC_URL,
  redactSecrets,
  sanitizeArchivePath,
  validateDevnetOnly,
  validateRunnerJobPayload,
  type RunnerJobPayload,
} from "../src/policy.ts";

function makePayload(overrides: Partial<RunnerJobPayload> = {}): RunnerJobPayload {
  return {
    jobType: "anchor_build",
    workspaceId: "ws-1",
    workspaceTarGzBase64: Buffer.from("fake").toString("base64"),
    args: {
      cluster: "devnet",
      rpcUrl: DEVNET_RPC_URL,
    },
    env: {},
    clientMeta: {},
    ...overrides,
  };
}

test("validateRunnerJobPayload accepts devnet payload", () => {
  const payload = validateRunnerJobPayload(makePayload());
  assert.equal(payload.jobType, "anchor_build");
});

test("validateRunnerJobPayload rejects non-devnet cluster", () => {
  assert.throws(() =>
    validateRunnerJobPayload(
      makePayload({
        args: {
          cluster: "mainnet-beta",
          rpcUrl: "https://api.mainnet-beta.solana.com",
        },
      })
    )
  );
});

test("validateDevnetOnly rejects custom RPC host", () => {
  assert.throws(() =>
    validateDevnetOnly(
      makePayload({
        args: {
          cluster: "devnet",
          rpcUrl: "https://example.com",
        },
      })
    )
  );
});

test("validateDevnetOnly rejects credential-bearing URLs", () => {
  assert.throws(() =>
    validateDevnetOnly(
      makePayload({
        args: {
          cluster: "devnet",
          rpcUrl: "https://user:pass@api.devnet.solana.com",
        },
      })
    )
  );
});

test("validateDevnetOnly rejects /proc or env dump style args", () => {
  assert.throws(() =>
    validateDevnetOnly(
      makePayload({
        args: {
          cluster: "devnet",
          rpcUrl: DEVNET_RPC_URL,
          debug: "cat /proc/self/environ",
        },
      })
    )
  );
});

test("sanitizeArchivePath blocks traversal", () => {
  assert.throws(() => sanitizeArchivePath("../../etc/passwd"));
  assert.throws(() => sanitizeArchivePath("/absolute/path"));
  assert.equal(sanitizeArchivePath("safe/project/file.ts"), "safe/project/file.ts");
});

test("redactSecrets redacts keypair arrays and id.json paths", () => {
  const input = `private key: secret\n[${Array.from({ length: 90 }, (_, i) => i).join(",")}]\n/home/runner/.config/solana/id.json`;
  const output = redactSecrets(input);
  assert.equal(output.includes("private key: secret"), false);
  assert.equal(output.includes("/home/runner/.config/solana/id.json"), false);
  assert.equal(output.includes("[REDACTED]"), true);
});
