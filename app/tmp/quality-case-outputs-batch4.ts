import { runChallengeInSandbox } from "../src/lib/challenge-runner/sandbox";
import { lesson8SolutionCode as frontendCheckpoint } from "../src/lib/courses/solana-frontend/challenges/lesson-8-checkpoint";
import { lesson8SolutionCode as indexingCheckpoint } from "../src/lib/courses/solana-indexing/challenges/lesson-8-analytics-checkpoint";
import { lesson8SolutionCode as tokenCheckpoint } from "../src/lib/courses/token-engineering/challenges/lesson-8-checkpoint";
import { lesson7SolutionCode as upgradeMarkdown } from "../src/lib/courses/anchor-upgrades-migrations/challenges/lesson-7-report-markdown";
import { lesson6SolutionCode as failureHandling } from "../src/lib/courses/bundles-atomicity/challenges/lesson-6-failure-handling";

async function emit(label: string, code: string, input: unknown) {
  const r = await runChallengeInSandbox(code, [{ name: label, input: JSON.stringify(input), expectedOutput: "" }], 2000);
  console.log("===", label);
  console.log(r.testResults[0]?.actualOutput);
}

async function main() {
  await emit("frontend checkpoint empty rows", frontendCheckpoint, {
    owner: "OWNER2",
    totalValueUsd: "0.000000",
    fixtureHash: "emptyrows456",
    rows: [],
    recent: [{ id: "e9", ts: 9, summary: "noop" }],
  });

  await emit("indexing checkpoint empty events", indexingCheckpoint, {
    timestamp: 1699900100,
    events: [],
  });

  await emit("token checkpoint without fee model", tokenCheckpoint, {
    mint: "MintPseudo222",
    fixture: { id: "fixture-b", version: 2 },
    config: {
      name: "Jazz Basic Token",
      symbol: "JBSC",
      decimals: 9,
      mintAuthority: "AUTH_B",
      freezeAuthority: "AUTH_B",
      updateAuthority: null,
      initialSupply: "1000000",
      extensions: {
        metadataPointer: null,
        transferFee: null,
        defaultAccountState: null,
        permanentDelegate: { delegate: "DELEGATE_B" },
      },
      recipients: [],
    },
  });

  await emit("upgrade markdown zero issues", upgradeMarkdown, {
    releaseTag: "v2.0.0",
    totalBatches: 8,
    issueCount: 0,
  });

  await emit("failure handling no refund", failureHandling, {
    flowId: "flow-2",
    userId: "u-1",
    requiresRefund: false,
  });
}

void main();
