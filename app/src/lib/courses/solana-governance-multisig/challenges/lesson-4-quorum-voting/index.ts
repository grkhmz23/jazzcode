import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(calculateVoteResult(input));
}

function calculateVoteResult(input) {
  // Calculate vote weights, check if quorum met, determine pass/fail
  return {
    proposalId: input.proposalId,
    totalVotesCast: 0,
    totalVoteWeight: "0",
    forWeight: "0",
    againstWeight: "0",
    abstainWeight: "0",
    quorumThreshold: input.quorumThreshold,
    quorumMet: false,
    passed: false,
    reason: "not implemented",
  };
}
`;

export const lesson4SolutionCode = `function run(input) {
  return JSON.stringify(calculateVoteResult(input));
}

function calculateVoteResult(input) {
  const votes = input.votes || [];
  const tokenSupply = BigInt(input.tokenSupply);
  const quorumThreshold = BigInt(input.quorumThreshold);
  const supportThreshold = input.supportThreshold;

  let forWeight = 0n;
  let againstWeight = 0n;
  let abstainWeight = 0n;

  for (const vote of votes) {
    const weight = BigInt(vote.weight);
    if (vote.choice === "for") {
      forWeight += weight;
    } else if (vote.choice === "against") {
      againstWeight += weight;
    } else if (vote.choice === "abstain") {
      abstainWeight += weight;
    }
  }

  const totalVoteWeight = forWeight + againstWeight + abstainWeight;
  const totalVotesCast = votes.length;
  const quorumMet = totalVoteWeight >= quorumThreshold;

  let passed = false;
  let reason = "";

  if (!quorumMet) {
    reason = "quorum not met";
  } else {
    const totalNonAbstain = forWeight + againstWeight;
    if (totalNonAbstain === 0n) {
      reason = "no non-abstain votes";
    } else {
      const forPercentage = Number(forWeight) / Number(totalNonAbstain);
      if (forPercentage >= supportThreshold) {
        passed = true;
        reason = "proposal passed";
      } else {
        reason = "support threshold not met";
      }
    }
  }

  return {
    proposalId: input.proposalId,
    totalVotesCast,
    totalVoteWeight: totalVoteWeight.toString(),
    forWeight: forWeight.toString(),
    againstWeight: againstWeight.toString(),
    abstainWeight: abstainWeight.toString(),
    quorumThreshold: input.quorumThreshold,
    quorumMet,
    passed,
    reason,
  };
}
`;

export const lesson4Hints: string[] = [
  "Sum up weights for each vote choice (for, against, abstain).",
  "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
  "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
  "Proposal passes only if quorum is met AND support percentage >= supportThreshold.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "proposal passes with quorum and support met",
    input: JSON.stringify({
      proposalId: "prop-001",
      tokenSupply: "1000000",
      quorumThreshold: "100000",
      supportThreshold: 0.5,
      votes: [
        { voter: "voter1", choice: "for", weight: "60000" },
        { voter: "voter2", choice: "for", weight: "50000" },
        { voter: "voter3", choice: "against", weight: "30000" },
        { voter: "voter4", choice: "abstain", weight: "10000" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"prop-001","totalVotesCast":4,"totalVoteWeight":"150000","forWeight":"110000","againstWeight":"30000","abstainWeight":"10000","quorumThreshold":"100000","quorumMet":true,"passed":true,"reason":"proposal passed"}',
  },
  {
    name: "proposal fails when quorum not met",
    input: JSON.stringify({
      proposalId: "prop-002",
      tokenSupply: "1000000",
      quorumThreshold: "200000",
      supportThreshold: 0.5,
      votes: [
        { voter: "voter1", choice: "for", weight: "50000" },
        { voter: "voter2", choice: "against", weight: "30000" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"prop-002","totalVotesCast":2,"totalVoteWeight":"80000","forWeight":"50000","againstWeight":"30000","abstainWeight":"0","quorumThreshold":"200000","quorumMet":false,"passed":false,"reason":"quorum not met"}',
  },
  {
    name: "proposal fails when support threshold not met",
    input: JSON.stringify({
      proposalId: "prop-003",
      tokenSupply: "1000000",
      quorumThreshold: "50000",
      supportThreshold: 0.66,
      votes: [
        { voter: "voter1", choice: "for", weight: "50000" },
        { voter: "voter2", choice: "against", weight: "40000" },
        { voter: "voter3", choice: "abstain", weight: "10000" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"prop-003","totalVotesCast":3,"totalVoteWeight":"100000","forWeight":"50000","againstWeight":"40000","abstainWeight":"10000","quorumThreshold":"50000","quorumMet":true,"passed":false,"reason":"support threshold not met"}',
  },
  {
    name: "proposal fails with only abstain votes",
    input: JSON.stringify({
      proposalId: "prop-004",
      tokenSupply: "1000000",
      quorumThreshold: "10000",
      supportThreshold: 0.5,
      votes: [
        { voter: "voter1", choice: "abstain", weight: "50000" },
        { voter: "voter2", choice: "abstain", weight: "30000" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"prop-004","totalVotesCast":2,"totalVoteWeight":"80000","forWeight":"0","againstWeight":"0","abstainWeight":"80000","quorumThreshold":"10000","quorumMet":true,"passed":false,"reason":"no non-abstain votes"}',
  },
  {
    name: "empty votes result in quorum not met",
    input: JSON.stringify({
      proposalId: "prop-005",
      tokenSupply: "1000000",
      quorumThreshold: "1000",
      supportThreshold: 0.5,
      votes: [],
    }),
    expectedOutput:
      '{"proposalId":"prop-005","totalVotesCast":0,"totalVoteWeight":"0","forWeight":"0","againstWeight":"0","abstainWeight":"0","quorumThreshold":"1000","quorumMet":false,"passed":false,"reason":"quorum not met"}',
  },
];
