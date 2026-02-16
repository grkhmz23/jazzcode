import { describe, expect, it } from "vitest";
import {
  RUNNER_JOB_ALLOWLIST,
  collectFilesFromDirectory,
  enforceRunnerRateLimit,
  parseGitHubRepoRef,
  redactRunnerLogs,
  runRunnerJob,
} from "@/lib/runner";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("runner allowlist", () => {
  it("contains only predefined job types", () => {
    expect(RUNNER_JOB_ALLOWLIST).toContain("anchor_build");
    expect(RUNNER_JOB_ALLOWLIST).not.toContain("bash");
  });

  it("rejects invalid job types", async () => {
    await expect(
      runRunnerJob({
        userId: "u",
        courseId: "c",
        jobType: "bash -c whoami",
        files: {},
        args: {},
      })
    ).rejects.toThrow();
  });
});

describe("runner rate limit", () => {
  it("enforces runner rate limit threshold", async () => {
    const key = `runner-test-${Date.now()}`;
    for (let i = 0; i < 30; i += 1) {
      await enforceRunnerRateLimit(key);
    }
    await expect(enforceRunnerRateLimit(key)).rejects.toThrow(/rate limit/i);
  });
});

describe("runner log redaction", () => {
  it("redacts secret-like content", () => {
    const input = 'private key: abc123\\n"mnemonic":"foo bar baz"\\n[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]';
    const output = redactRunnerLogs(input);
    expect(output).not.toContain("abc123");
    expect(output).toContain("[REDACTED]");
  });
});

describe("github import helpers", () => {
  it("parses github urls", () => {
    const parsed = parseGitHubRepoRef("https://github.com/example/repo/tree/main");
    expect(parsed).toEqual({ owner: "example", repo: "repo", ref: "main" });
  });

  it("collects workspace files correctly", async () => {
    const root = await mkdtemp(join(tmpdir(), "runner-import-test-"));
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "src", "main.ts"), "console.log('ok')", "utf8");
    await writeFile(join(root, "README.md"), "# Hello", "utf8");

    const { files } = await collectFilesFromDirectory(root);
    expect(files["src/main.ts"]).toContain("console.log");
    expect(files["README.md"]).toContain("# Hello");
  });
});
