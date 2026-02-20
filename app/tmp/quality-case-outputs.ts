import { runChallengeInSandbox } from "../src/lib/challenge-runner/sandbox";
import { lesson4SolutionCode as frontendSol } from "../src/lib/courses/solana-frontend/challenges/lesson-4-core-reducer";
import { lesson5SolutionCode as tokenSol } from "../src/lib/courses/token-engineering/challenges/lesson-5-build-init-plan";
import { lesson5SolutionCode as routerSol } from "../src/lib/courses/defi-on-solana/challenges/lesson-5-router-best";
import { lesson7SolutionCode as bannerSol } from "../src/lib/courses/mempool-ux-defense/challenges/lesson-7-safety-banner";
import { lesson4SolutionCode as anchorSol } from "../src/lib/courses/anchor-development/challenges/lesson-4-counter-init";

async function one(label: string, code: string, inputObj: unknown) {
  const r = await runChallengeInSandbox(code, [{ name: label, input: JSON.stringify(inputObj), expectedOutput: "" }], 2000);
  console.log("===", label);
  console.log(r.testResults[0]?.actualOutput);
}

async function main() {
  await one(
    "frontend unknown event",
    frontendSol,
    { events: [{ type: "Unknown", id: "u1", ts: 10 }] }
  );

  await one(
    "token minimal",
    tokenSol,
    {
      mint: "MintLite222",
      config: {
        decimals: 9,
        mintAuthority: "AUTH_B",
        freezeAuthority: "FREEZE_B",
        extensions: {},
      },
    }
  );

  await one(
    "router no routes",
    routerSol,
    {
      universe: { pools: [{ id: "x", tokenA: "SOL", tokenB: "USDC", reserveA: "1", reserveB: "1", feeBps: 30 }] },
      inMint: "BONK",
      outMint: "JUP",
      inAmount: "10",
      mode: "bestOut",
    }
  );

  await one("banner medium", bannerSol, { grade: "medium" });
  await one("banner fallback", bannerSol, { grade: "low" });

  await one(
    "anchor default payer",
    anchorSol,
    {
      programId: "Prog9999999999999999999999999999999999999",
      authorityPubkey: "Auth9999999999999999999999999999999999999",
    }
  );
}

void main();
