import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(validateAndExecuteTreasuryProposal(input));
}

function validateAndExecuteTreasuryProposal(input) {
  // Validate timelock, apply state changes, generate execution trace
  return {
    proposalId: input.proposalId,
    valid: false,
    canExecute: false,
    stateChanges: [],
    executionTrace: [],
    error: "not implemented",
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  return JSON.stringify(validateAndExecuteTreasuryProposal(input));
}

function validateAndExecuteTreasuryProposal(input) {
  const proposal = input.proposal;
  const currentTimestamp = input.currentTimestamp;
  const treasuryBalance = BigInt(input.treasuryBalance);

  const executionTrace = [];
  const stateChanges = [];

  // Step 1: Validate proposal status
  if (proposal.status !== "approved") {
    executionTrace.push({
      step: "validate_status",
      passed: false,
      detail: "proposal not approved, status: " + proposal.status,
    });
    return {
      proposalId: proposal.id,
      valid: false,
      canExecute: false,
      stateChanges: [],
      executionTrace,
      error: "proposal not approved",
    };
  }
  executionTrace.push({ step: "validate_status", passed: true });

  // Step 2: Validate timelock
  const timeElapsed = currentTimestamp - proposal.approvedAt;
  const timelockRemaining = proposal.timelockDuration - timeElapsed;
  
  if (timeElapsed < proposal.timelockDuration) {
    executionTrace.push({
      step: "validate_timelock",
      passed: false,
      detail: "timelock not expired, " + timelockRemaining + "s remaining",
    });
    return {
      proposalId: proposal.id,
      valid: true,
      canExecute: false,
      timelockRemaining,
      stateChanges: [],
      executionTrace,
      error: "timelock not expired",
    };
  }
  executionTrace.push({ step: "validate_timelock", passed: true, detail: "timelock expired" });

  // Step 3: Validate treasury has sufficient funds
  let totalRequired = 0n;
  for (const transfer of proposal.transfers) {
    totalRequired += BigInt(transfer.amount);
  }

  if (totalRequired > treasuryBalance) {
    executionTrace.push({
      step: "validate_balance",
      passed: false,
      detail: "insufficient balance: need " + totalRequired.toString() + ", have " + treasuryBalance.toString(),
    });
    return {
      proposalId: proposal.id,
      valid: true,
      canExecute: false,
      stateChanges: [],
      executionTrace,
      error: "insufficient treasury balance",
    };
  }
  executionTrace.push({
    step: "validate_balance",
    passed: true,
    detail: "sufficient balance: " + treasuryBalance.toString(),
  });

  // Step 4: Apply state changes
  let remainingBalance = treasuryBalance;
  for (let i = 0; i < proposal.transfers.length; i++) {
    const transfer = proposal.transfers[i];
    const amount = BigInt(transfer.amount);
    remainingBalance -= amount;

    stateChanges.push({
      type: "transfer",
      index: i,
      recipient: transfer.recipient,
      amount: transfer.amount,
      token: transfer.token,
    });

    executionTrace.push({
      step: "execute_transfer",
      index: i,
      recipient: transfer.recipient,
      amount: transfer.amount,
      token: transfer.token,
      remainingBalance: remainingBalance.toString(),
    });
  }

  stateChanges.push({
    type: "update_proposal_status",
    from: "approved",
    to: "executed",
  });
  executionTrace.push({ step: "update_status", from: "approved", to: "executed" });

  return {
    proposalId: proposal.id,
    valid: true,
    canExecute: true,
    stateChanges,
    executionTrace,
    finalBalance: remainingBalance.toString(),
    totalTransferred: totalRequired.toString(),
  };
}
`;

export const lesson8Hints: string[] = [
  "First validate the proposal status is 'approved'.",
  "Check if currentTimestamp - approvedAt >= timelockDuration for timelock validation.",
  "Sum all transfer amounts and compare against treasury balance.",
  "Return canExecute: false with appropriate error if any validation fails.",
  "Generate state changes and execution trace entries for each successful step.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "successful execution after timelock",
    input: JSON.stringify({
      proposalId: "treasury-001",
      currentTimestamp: 1700000100,
      treasuryBalance: "1000000",
      proposal: {
        id: "treasury-001",
        status: "approved",
        approvedAt: 1700000000,
        timelockDuration: 60,
        transfers: [
          { recipient: "recipient1", amount: "100000", token: "SOL" },
          { recipient: "recipient2", amount: "200000", token: "SOL" },
        ],
      },
    }),
    expectedOutput:
      '{"proposalId":"treasury-001","valid":true,"canExecute":true,"stateChanges":[{"type":"transfer","index":0,"recipient":"recipient1","amount":"100000","token":"SOL"},{"type":"transfer","index":1,"recipient":"recipient2","amount":"200000","token":"SOL"},{"type":"update_proposal_status","from":"approved","to":"executed"}],"executionTrace":[{"step":"validate_status","passed":true},{"step":"validate_timelock","passed":true,"detail":"timelock expired"},{"step":"validate_balance","passed":true,"detail":"sufficient balance: 1000000"},{"step":"execute_transfer","index":0,"recipient":"recipient1","amount":"100000","token":"SOL","remainingBalance":"900000"},{"step":"execute_transfer","index":1,"recipient":"recipient2","amount":"200000","token":"SOL","remainingBalance":"700000"},{"step":"update_status","from":"approved","to":"executed"}],"finalBalance":"700000","totalTransferred":"300000"}',
  },
  {
    name: "fails when timelock not expired",
    input: JSON.stringify({
      proposalId: "treasury-002",
      currentTimestamp: 1700000030,
      treasuryBalance: "1000000",
      proposal: {
        id: "treasury-002",
        status: "approved",
        approvedAt: 1700000000,
        timelockDuration: 100,
        transfers: [
          { recipient: "recipient1", amount: "50000", token: "SOL" },
        ],
      },
    }),
    expectedOutput:
      '{"proposalId":"treasury-002","valid":true,"canExecute":false,"timelockRemaining":70,"stateChanges":[],"executionTrace":[{"step":"validate_status","passed":true},{"step":"validate_timelock","passed":false,"detail":"timelock not expired, 70s remaining"}],"error":"timelock not expired"}',
  },
  {
    name: "fails when proposal not approved",
    input: JSON.stringify({
      proposalId: "treasury-003",
      currentTimestamp: 1700000100,
      treasuryBalance: "1000000",
      proposal: {
        id: "treasury-003",
        status: "pending",
        approvedAt: 0,
        timelockDuration: 60,
        transfers: [
          { recipient: "recipient1", amount: "50000", token: "SOL" },
        ],
      },
    }),
    expectedOutput:
      '{"proposalId":"treasury-003","valid":false,"canExecute":false,"stateChanges":[],"executionTrace":[{"step":"validate_status","passed":false,"detail":"proposal not approved, status: pending"}],"error":"proposal not approved"}',
  },
  {
    name: "fails when insufficient treasury balance",
    input: JSON.stringify({
      proposalId: "treasury-004",
      currentTimestamp: 1700000100,
      treasuryBalance: "100000",
      proposal: {
        id: "treasury-004",
        status: "approved",
        approvedAt: 1700000000,
        timelockDuration: 60,
        transfers: [
          { recipient: "recipient1", amount: "50000", token: "SOL" },
          { recipient: "recipient2", amount: "100000", token: "SOL" },
        ],
      },
    }),
    expectedOutput:
      '{"proposalId":"treasury-004","valid":true,"canExecute":false,"stateChanges":[],"executionTrace":[{"step":"validate_status","passed":true},{"step":"validate_timelock","passed":true,"detail":"timelock expired"},{"step":"validate_balance","passed":false,"detail":"insufficient balance: need 150000, have 100000"}],"error":"insufficient treasury balance"}',
  },
  {
    name: "handles empty transfers",
    input: JSON.stringify({
      proposalId: "treasury-005",
      currentTimestamp: 1700000100,
      treasuryBalance: "1000000",
      proposal: {
        id: "treasury-005",
        status: "approved",
        approvedAt: 1700000000,
        timelockDuration: 60,
        transfers: [],
      },
    }),
    expectedOutput:
      '{"proposalId":"treasury-005","valid":true,"canExecute":true,"stateChanges":[{"type":"update_proposal_status","from":"approved","to":"executed"}],"executionTrace":[{"step":"validate_status","passed":true},{"step":"validate_timelock","passed":true,"detail":"timelock expired"},{"step":"validate_balance","passed":true,"detail":"sufficient balance: 1000000"},{"step":"update_status","from":"approved","to":"executed"}],"finalBalance":"1000000","totalTransferred":"0"}',
  },
];
