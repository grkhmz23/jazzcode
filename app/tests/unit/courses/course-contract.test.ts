import { describe, expect, it } from "vitest";
import { courses } from "@/lib/data/courses";
import type { Lesson } from "@/types/content";

type ChallengeLesson = Lesson & {
  starterCode: string;
  solution: string;
  testCases: Array<{ name: string; input: string; expectedOutput: string }>;
  hints?: string[];
};

describe("course contract", () => {
  it("all registered courses satisfy baseline module and lesson contract", () => {
    expect(courses.length).toBe(33);

    for (const course of courses) {
      expect(course.modules.length).toBeGreaterThan(0);
      for (const module of course.modules) {
        expect(module.lessons.length).toBeGreaterThan(0);
      }
    }
  });

  it("challenge lessons provide deterministic runner inputs and hint quality", () => {
    for (const course of courses) {
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          if (lesson.type !== "challenge") {
            continue;
          }

          const challenge = lesson as ChallengeLesson;
          expect(challenge.starterCode.trim().length).toBeGreaterThan(0);
          expect(challenge.solution.trim().length).toBeGreaterThan(0);
          expect(challenge.testCases.length).toBeGreaterThan(0);

          for (const testCase of challenge.testCases) {
            expect(testCase.name.trim().length).toBeGreaterThan(0);
            expect(typeof testCase.input).toBe("string");
            expect(typeof testCase.expectedOutput).toBe("string");
          }

          if (Array.isArray(challenge.hints)) {
            for (const hint of challenge.hints) {
              expect(typeof hint).toBe("string");
              expect(hint.trim().length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });
});
