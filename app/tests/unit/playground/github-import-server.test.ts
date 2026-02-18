import { describe, it, expect } from "vitest";
import { normalizeRepoInput } from "@/lib/playground/github-import-server";

describe("normalizeRepoInput", () => {
  it("converts owner/repo to full URL", () => {
    expect(normalizeRepoInput("solana-labs/solana-program-library")).toBe(
      "https://github.com/solana-labs/solana-program-library"
    );
  });

  it("passes through full HTTPS URLs", () => {
    const url = "https://github.com/solana-labs/solana-program-library";
    expect(normalizeRepoInput(url)).toBe(url);
  });

  it("passes through HTTP URLs", () => {
    const url = "http://github.com/foo/bar";
    expect(normalizeRepoInput(url)).toBe(url);
  });

  it("trims whitespace", () => {
    expect(normalizeRepoInput("  foo/bar  ")).toBe("https://github.com/foo/bar");
  });

  it("handles dotted repo names", () => {
    expect(normalizeRepoInput("owner/my.repo")).toBe("https://github.com/owner/my.repo");
  });

  it("handles hyphenated names", () => {
    expect(normalizeRepoInput("my-org/my-repo")).toBe("https://github.com/my-org/my-repo");
  });

  it("does not convert random strings that are not owner/repo", () => {
    expect(normalizeRepoInput("just-a-string")).toBe("just-a-string");
  });
});
