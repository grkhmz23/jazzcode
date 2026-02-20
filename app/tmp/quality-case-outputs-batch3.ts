import { runChallengeInSandbox } from "../src/lib/challenge-runner/sandbox";
import { lesson8SolutionCode as anchorCheckpoint } from "../src/lib/courses/anchor-development/challenges/lesson-8-checkpoint";
import { lesson8SolutionCode as defiCheckpoint } from "../src/lib/courses/defi-on-solana/challenges/lesson-8-checkpoint";
import { lesson7SolutionCode as bundleComposer } from "../src/lib/courses/bundles-atomicity/challenges/lesson-7-bundle-composer";

async function one(label: string, code: string, input: unknown) {
  const result = await runChallengeInSandbox(code, [{ name: label, input: JSON.stringify(input), expectedOutput: "" }], 2000);
  console.log("===", label);
  console.log(result.testResults[0]?.actualOutput);
}

async function main() {
  await one("anchor checkpoint alt", anchorCheckpoint, {
    programId: "Prog9999999999999999999999999999999999999",
    authority: "Auth9999999999999999999999999999999999999",
  });

  await one("bundle composer empty", bundleComposer, { flow: { steps: [] } });

  await one("defi checkpoint single hop", defiCheckpoint, {
    inMint: "SOL_MINT",
    outMint: "USDC_MINT",
    inSymbol: "SOL",
    inAmount: "500000000",
    route: {
      hops: [
        { poolId: "pool-sol-usdc", inMint: "SOL_MINT", outMint: "USDC_MINT", outSymbol: "USDC" },
      ],
    },
    quote: {
      outAmount: "114950000",
      minOut: "114375250",
      feeBreakdown: [{ poolId: "pool-sol-usdc", feeAmount: "1000000" }],
      totalFeeAmount: "1000000",
      impactBps: 45,
    },
    fixtureHash: "singlehop456",
  });
}

void main();
