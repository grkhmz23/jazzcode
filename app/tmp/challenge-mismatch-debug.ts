import * as courseData from "../src/lib/data/courses/index.ts";
import * as sandboxData from "../src/lib/challenge-runner/sandbox";

async function main() {
  const courses = ((courseData as any).default?.courses ?? (courseData as any).courses ?? (courseData as any)["module.exports"]?.courses) as any[];
  const runChallengeInSandbox = ((sandboxData as any).default?.runChallengeInSandbox ?? (sandboxData as any).runChallengeInSandbox ?? (sandboxData as any)["module.exports"]?.runChallengeInSandbox) as any;

  for (const c of courses) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        if (l.type !== "challenge" || l.language !== "typescript") continue;
        const r = await runChallengeInSandbox(l.solution, l.testCases, 2000);
        if (r.allPassed) continue;

        const first = r.testResults.find((t: any) => !t.passed);
        console.log(`COURSE\t${c.slug}`);
        console.log(`LESSON\t${l.id}`);
        console.log(`ERR\t${r.error ?? first?.error ?? "mismatch"}`);
        if (first) {
          console.log(`TEST\t${first.name}`);
          console.log(`EXPECTED\t${first.expectedOutput}`);
          console.log(`ACTUAL\t${first.actualOutput}`);
        }
        console.log("---");
      }
    }
  }
}

void main();
