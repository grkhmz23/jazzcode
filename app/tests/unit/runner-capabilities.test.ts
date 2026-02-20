import { describe, expect, it, vi } from "vitest";
import { getRemoteRunnerToolchainCapabilities } from "@/lib/runner/capabilities";

describe("runner capabilities", () => {
  it("parses remote toolchain capabilities payload", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          toolchain: {
            anchor: { available: true, version: "anchor-cli 0.30.1" },
            cargo: { available: true, version: "cargo 1.82.0" },
            solana: { available: true, version: "solana-cli 1.18.18" },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const capabilities = await getRemoteRunnerToolchainCapabilities("http://runner.internal");
    expect(capabilities.anchor.available).toBe(true);
    expect(capabilities.cargo.available).toBe(true);
    expect(capabilities.solana.available).toBe(true);
    expect(capabilities.anchor.source).toBe("remote");
  });

  it("returns failure set when remote payload is incomplete", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ toolchain: { anchor: { available: true } } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const capabilities = await getRemoteRunnerToolchainCapabilities("http://runner.internal");
    expect(capabilities.anchor.available).toBe(false);
    expect(capabilities.cargo.available).toBe(false);
    expect(capabilities.solana.available).toBe(false);
    expect(capabilities.anchor.error).toContain("does not expose complete");
  });
});
