import * as courseData from "../src/lib/data/courses/index.ts";
import * as sandboxData from "../src/lib/challenge-runner/sandbox";

async function main() {
  const targetIds = new Set([
    "frontend-v2-core-reducer",
    "indexing-v2-decode-token-account",
    "payments-v2-payment-intent",
    "swap-v2-state-machine",
    "perps-v2-risk-console-report",
    "rpmcs-v2-parse-attributes",
  ]);
  const courses = ((courseData as any).default?.courses ?? (courseData as any).courses ?? (courseData as any)["module.exports"]?.courses) as any[];
  const runChallengeInSandbox = ((sandboxData as any).default?.runChallengeInSandbox ?? (sandboxData as any).runChallengeInSandbox ?? (sandboxData as any)["module.exports"]?.runChallengeInSandbox) as any;

  for (const c of courses) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        if (l.type !== "challenge" || !targetIds.has(l.id)) continue;
        const result = await runChallengeInSandbox(l.solution, l.testCases, 2000);
        console.log("===", c.slug, l.id, "allPassed", result.allPassed);
        result.testResults.forEach((tr: any, i: number) => {
          console.log(`#${i+1}`, tr.passed ? "PASS" : "FAIL", tr.name);
          if (!tr.passed) {
            console.log("EXPECTED", tr.expectedOutput);
            console.log("ACTUAL", tr.actualOutput);
          }
        });
      }
    }
  }
}

void main();
