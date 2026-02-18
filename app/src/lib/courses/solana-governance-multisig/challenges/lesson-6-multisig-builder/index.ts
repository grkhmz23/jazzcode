import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(processMultisigAction(input));
}

function processMultisigAction(input) {
  // Track approvals, enforce threshold, handle approval/revocation
  return {
    proposalId: input.proposalId,
    threshold: input.threshold,
    totalSigners: input.signers.length,
    approvedCount: 0,
    revokedCount: 0,
    pendingCount: input.signers.length,
    status: "pending",
    approvals: [],
    canExecute: false,
  };
}
`;

export const lesson6SolutionCode = `function run(input) {
  return JSON.stringify(processMultisigAction(input));
}

function processMultisigAction(input) {
  const signers = input.signers || [];
  const threshold = input.threshold;
  const actions = input.actions || [];

  // Initialize approval tracking
  const signerStatuses = new Map();
  for (const signer of signers) {
    signerStatuses.set(signer.address, {
      address: signer.address,
      weight: signer.weight || 1,
      status: "pending",
      actionIndex: -1,
    });
  }

  // Process each action in order
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const signer = signerStatuses.get(action.signer);

    if (!signer) continue;

    if (action.type === "approve") {
      if (signer.status !== "approved") {
        signer.status = "approved";
        signer.actionIndex = i;
      }
    } else if (action.type === "revoke") {
      if (signer.status === "approved") {
        signer.status = "revoked";
        signer.actionIndex = i;
      }
    }
  }

  // Calculate counts and weights
  let approvedWeight = 0;
  let revokedWeight = 0;
  let pendingWeight = 0;
  const approvals = [];

  for (const signer of signers) {
    const status = signerStatuses.get(signer.address);
    approvals.push({
      address: signer.address,
      status: status.status,
      weight: status.weight,
    });

    if (status.status === "approved") {
      approvedWeight += status.weight;
    } else if (status.status === "revoked") {
      revokedWeight += status.weight;
    } else {
      pendingWeight += status.weight;
    }
  }

  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const revokedCount = approvals.filter((a) => a.status === "revoked").length;
  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  // Determine status
  let status = "pending";
  let canExecute = false;

  if (approvedWeight >= threshold) {
    status = "approved";
    canExecute = true;
  } else if (pendingWeight === 0 && approvedWeight < threshold) {
    status = "rejected";
  }

  return {
    proposalId: input.proposalId,
    threshold,
    totalSigners: signers.length,
    approvedCount,
    revokedCount,
    pendingCount,
    status,
    approvals,
    canExecute,
    approvedWeight,
    pendingWeight,
  };
}
`;

export const lesson6Hints: string[] = [
  "Initialize signer statuses as 'pending' for all signers.",
  "Process actions in order - each action updates the signer's status.",
  "Track the cumulative approved weight to compare against threshold.",
  "A proposal is 'approved' when approvedWeight >= threshold.",
  "A proposal is 'rejected' when no pending signers remain but threshold is not met.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "proposal approved when threshold met",
    input: JSON.stringify({
      proposalId: "multisig-001",
      threshold: 3,
      signers: [
        { address: "signer1", weight: 1 },
        { address: "signer2", weight: 1 },
        { address: "signer3", weight: 1 },
        { address: "signer4", weight: 1 },
      ],
      actions: [
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer2" },
        { type: "approve", signer: "signer3" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"multisig-001","threshold":3,"totalSigners":4,"approvedCount":3,"revokedCount":0,"pendingCount":1,"status":"approved","approvals":[{"address":"signer1","status":"approved","weight":1},{"address":"signer2","status":"approved","weight":1},{"address":"signer3","status":"approved","weight":1},{"address":"signer4","status":"pending","weight":1}],"canExecute":true,"approvedWeight":3,"pendingWeight":1}',
  },
  {
    name: "proposal remains pending below threshold",
    input: JSON.stringify({
      proposalId: "multisig-002",
      threshold: 5,
      signers: [
        { address: "signer1", weight: 2 },
        { address: "signer2", weight: 2 },
        { address: "signer3", weight: 1 },
      ],
      actions: [
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer2" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"multisig-002","threshold":5,"totalSigners":3,"approvedCount":2,"revokedCount":0,"pendingCount":1,"status":"pending","approvals":[{"address":"signer1","status":"approved","weight":2},{"address":"signer2","status":"approved","weight":2},{"address":"signer3","status":"pending","weight":1}],"canExecute":false,"approvedWeight":4,"pendingWeight":1}',
  },
  {
    name: "approval can be revoked",
    input: JSON.stringify({
      proposalId: "multisig-003",
      threshold: 3,
      signers: [
        { address: "signer1", weight: 2 },
        { address: "signer2", weight: 2 },
        { address: "signer3", weight: 1 },
      ],
      actions: [
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer2" },
        { type: "revoke", signer: "signer1" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"multisig-003","threshold":3,"totalSigners":3,"approvedCount":1,"revokedCount":1,"pendingCount":1,"status":"pending","approvals":[{"address":"signer1","status":"revoked","weight":2},{"address":"signer2","status":"approved","weight":2},{"address":"signer3","status":"pending","weight":1}],"canExecute":false,"approvedWeight":2,"pendingWeight":1}',
  },
  {
    name: "proposal rejected when all signers acted but threshold not met",
    input: JSON.stringify({
      proposalId: "multisig-004",
      threshold: 5,
      signers: [
        { address: "signer1", weight: 1 },
        { address: "signer2", weight: 1 },
        { address: "signer3", weight: 1 },
      ],
      actions: [
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer2" },
        { type: "revoke", signer: "signer1" },
        { type: "approve", signer: "signer3" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"multisig-004","threshold":5,"totalSigners":3,"approvedCount":2,"revokedCount":1,"pendingCount":0,"status":"rejected","approvals":[{"address":"signer1","status":"revoked","weight":1},{"address":"signer2","status":"approved","weight":1},{"address":"signer3","status":"approved","weight":1}],"canExecute":false,"approvedWeight":2,"pendingWeight":0}',
  },
  {
    name: "double approval only counts once",
    input: JSON.stringify({
      proposalId: "multisig-005",
      threshold: 2,
      signers: [
        { address: "signer1", weight: 1 },
        { address: "signer2", weight: 1 },
      ],
      actions: [
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer1" },
        { type: "approve", signer: "signer2" },
      ],
    }),
    expectedOutput:
      '{"proposalId":"multisig-005","threshold":2,"totalSigners":2,"approvedCount":2,"revokedCount":0,"pendingCount":0,"status":"approved","approvals":[{"address":"signer1","status":"approved","weight":1},{"address":"signer2","status":"approved","weight":1}],"canExecute":true,"approvedWeight":2,"pendingWeight":0}',
  },
];
