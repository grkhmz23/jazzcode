import { describe, expect, it } from "vitest";
import { buildCsp } from "@/middleware";

describe("middleware CSP routing", () => {
  it("uses strict CSP on non-editor routes", () => {
    const csp = buildCsp("/en/dashboard");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain("worker-src 'self'");
  });

  it("uses relaxed CSP on playground route for Monaco", () => {
    const csp = buildCsp("/en/playground");
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("worker-src 'self' blob:");
  });
});
