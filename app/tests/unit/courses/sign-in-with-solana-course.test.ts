import { describe, expect, it } from "vitest";
import { signInWithSolanaCourse } from "@/lib/data/courses/sign-in-with-solana";
describe("sign in with solana course structure", () => {
  it("has correct metadata", () => { expect(signInWithSolanaCourse.id).toBe("course-sign-in-with-solana"); expect(signInWithSolanaCourse.slug).toBe("sign-in-with-solana"); expect(signInWithSolanaCourse.difficulty).toBe("intermediate"); expect(signInWithSolanaCourse.tags).toContain("siws"); });
  it("has 2 modules with 8 lessons", () => { expect(signInWithSolanaCourse.modules).toHaveLength(2); expect(signInWithSolanaCourse.modules.reduce((s,m)=>s+m.lessons.length,0)).toBe(8); });
  it("has correct XP", () => { expect(signInWithSolanaCourse.modules.flatMap(m=>m.lessons).reduce((s,l)=>s+l.xpReward,0)).toBe(signInWithSolanaCourse.totalXP); });
  it("has 3 challenges", () => { const ch = signInWithSolanaCourse.modules.flatMap(m=>m.lessons).filter(l=>l.type==="challenge"); expect(ch).toHaveLength(3); expect(ch.map(c=>c.id)).toEqual(["siws-v2-sign-in-input","siws-v2-verify-sign-in","siws-v2-auth-report"]); });
  it("has content with blocks", () => { const cl = signInWithSolanaCourse.modules.flatMap(m=>m.lessons).filter(l=>l.type==="content"); expect(cl.length).toBe(5); for (const l of cl) { expect(l.content.length).toBeGreaterThan(500); expect(l.blocks!.length).toBeGreaterThan(0); } });
});
