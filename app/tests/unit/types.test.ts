import { describe, it, expect } from "vitest";
import { deriveLevel, xpForNextLevel, xpProgressInLevel, NotImplementedError, OnChainReadError } from "@/types";

describe("deriveLevel", () => {
  it("returns 0 for 0 XP", () => {
    expect(deriveLevel(0)).toBe(0);
  });

  it("returns 0 for 99 XP (below threshold)", () => {
    expect(deriveLevel(99)).toBe(0);
  });

  it("returns 1 for 100 XP", () => {
    expect(deriveLevel(100)).toBe(1);
  });

  it("returns 3 for 900 XP", () => {
    expect(deriveLevel(900)).toBe(3);
  });

  it("returns 10 for 10000 XP", () => {
    expect(deriveLevel(10000)).toBe(10);
  });

  it("handles large XP values", () => {
    expect(deriveLevel(1000000)).toBe(100);
  });

  it("formula is floor(sqrt(xp / 100))", () => {
    for (const xp of [0, 50, 100, 200, 400, 500, 900, 1600, 2500, 10000]) {
      expect(deriveLevel(xp)).toBe(Math.floor(Math.sqrt(xp / 100)));
    }
  });
});

describe("xpForNextLevel", () => {
  it("level 0 -> 1 requires 100 XP", () => {
    expect(xpForNextLevel(0)).toBe(100);
  });

  it("level 1 -> 2 requires 400 XP", () => {
    expect(xpForNextLevel(1)).toBe(400);
  });

  it("level 9 -> 10 requires 10000 XP", () => {
    expect(xpForNextLevel(9)).toBe(10000);
  });
});

describe("xpProgressInLevel", () => {
  it("returns correct progress at 0 XP", () => {
    const progress = xpProgressInLevel(0);
    expect(progress.current).toBe(0);
    expect(progress.required).toBe(100);
    expect(progress.percent).toBe(0);
  });

  it("returns correct progress at 50 XP (50% to level 1)", () => {
    const progress = xpProgressInLevel(50);
    expect(progress.current).toBe(50);
    expect(progress.required).toBe(100);
    expect(progress.percent).toBe(50);
  });

  it("returns 0% progress at exact level boundary", () => {
    const progress = xpProgressInLevel(100);
    expect(progress.current).toBe(0);
    expect(progress.required).toBe(300); // 400 - 100
    expect(progress.percent).toBeCloseTo(0, 1);
  });

  it("handles mid-level progress correctly", () => {
    // At 250 XP: level 1 (starts at 100, next at 400)
    const progress = xpProgressInLevel(250);
    expect(progress.current).toBe(150);
    expect(progress.required).toBe(300);
    expect(progress.percent).toBeCloseTo(50, 1);
  });
});

describe("NotImplementedError", () => {
  it("has correct name and message", () => {
    const error = new NotImplementedError("testMethod");
    expect(error.name).toBe("NotImplementedError");
    expect(error.message).toContain("testMethod");
    expect(error.message).toContain("not yet implemented");
  });

  it("is an instance of Error", () => {
    const error = new NotImplementedError("test");
    expect(error).toBeInstanceOf(Error);
  });
});

describe("OnChainReadError", () => {
  it("stores cause", () => {
    const cause = new Error("network failure");
    const error = new OnChainReadError("Failed to read", cause);
    expect(error.name).toBe("OnChainReadError");
    expect(error.message).toBe("Failed to read");
    expect(error.cause).toBe(cause);
  });
});
