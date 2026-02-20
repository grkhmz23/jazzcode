import { runChallengeInSandbox } from "../src/lib/challenge-runner/sandbox";
import { lesson5SolutionCode, lesson5TestCases } from "../src/lib/courses/solana-frontend/challenges/lesson-5-stream-replay";

async function main() {
  const r = await runChallengeInSandbox(lesson5SolutionCode, lesson5TestCases, 2000);
  console.log(JSON.stringify(r, null, 2));
}
void main();
