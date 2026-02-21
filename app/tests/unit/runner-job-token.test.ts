import { describe, expect, it } from "vitest";
import {
  createRunnerJobAccessToken,
  verifyRunnerJobAccessToken,
} from "@/lib/runner/job-token";

describe("runner job access token", () => {
  it("verifies token for the same actor", () => {
    process.env.RUNNER_SHARED_SECRET = "runner-secret-for-tests";

    const token = createRunnerJobAccessToken("job-123", "user:abc");
    const verification = verifyRunnerJobAccessToken(token, "user:abc");

    expect(verification.valid).toBe(true);
    expect(verification.jobId).toBe("job-123");
  });

  it("rejects token for a different actor", () => {
    process.env.RUNNER_SHARED_SECRET = "runner-secret-for-tests";

    const token = createRunnerJobAccessToken("job-123", "user:abc");
    const verification = verifyRunnerJobAccessToken(token, "user:def");

    expect(verification.valid).toBe(false);
  });

  it("rejects expired token", async () => {
    process.env.RUNNER_SHARED_SECRET = "runner-secret-for-tests";

    const token = createRunnerJobAccessToken("job-123", "user:abc", 1);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const verification = verifyRunnerJobAccessToken(token, "user:abc");

    expect(verification.valid).toBe(false);
  });
});
