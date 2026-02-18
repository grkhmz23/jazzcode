import { describe, expect, it } from "vitest";
import { buildWorkspaceScope } from "@/lib/playground/identity";

describe("playground identity scope", () => {
  it("uses user scope when authenticated user id is present", () => {
    expect(buildWorkspaceScope("user-123")).toBe("user:user-123");
  });

  it("uses guest scope when user is not authenticated", () => {
    const scope = buildWorkspaceScope(null);
    expect(scope.startsWith("guest:")).toBe(true);
  });
});
