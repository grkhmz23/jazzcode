export type RuntimeMode = "vulnerable" | "fixed";

export type InstructionName = "init_vault" | "withdraw";

export interface VaultState {
  authority: string;
  bump: number;
  balance: string;
}

export interface LabAccount {
  pubkey: string;
  owner: string;
  lamports: string;
  isSigner: boolean;
  isWritable: boolean;
  rentExempt: boolean;
  data?: VaultState;
}

export interface AccountRefMap {
  authority: string;
  vaultPda: string;
  recipientAccount: string;
  configAccount?: string;
}

export interface InstructionArgs {
  amount?: string;
  bump?: number;
}

export interface ProgramInstruction {
  id: string;
  programId: string;
  name: InstructionName;
  accounts: AccountRefMap;
  args: InstructionArgs;
}

export interface RuntimeSnapshot {
  accounts: Record<string, LabAccount>;
}

export interface CheckResult {
  ok: boolean;
  code?: string;
  message?: string;
}

export interface BalanceChange {
  account: string;
  before: string;
  after: string;
}

export interface TraceInstructionStart {
  type: "InstructionStart";
  instructionId: string;
  name: InstructionName;
}

export interface TraceAccountRead {
  type: "AccountRead";
  account: string;
  owner: string;
  lamports: string;
}

export interface TraceCheck {
  type: "CheckPassed" | "CheckFailed";
  check: string;
  code?: string;
  message?: string;
}

export interface TraceBalanceChange {
  type: "BalanceChange";
  account: string;
  before: string;
  after: string;
}

export interface TraceInstructionEnd {
  type: "InstructionEnd";
  instructionId: string;
  status: "ok" | "error";
  errorCode?: string;
}

export type TraceEvent =
  | TraceInstructionStart
  | TraceAccountRead
  | TraceCheck
  | TraceBalanceChange
  | TraceInstructionEnd;

export interface RuntimeResult {
  ok: boolean;
  code?: string;
  trace: TraceEvent[];
  snapshot: RuntimeSnapshot;
}

export interface ScenarioSpec {
  id: string;
  name: string;
  exploitType: "missing-signer" | "missing-owner" | "pda-spoof";
  amount: string;
  attackerIsSigner: boolean;
  authorityIsSigner: boolean;
  useSpoofedPda: boolean;
  useWrongVaultOwner: boolean;
}

export interface ScenarioOutcome {
  id: string;
  mode: RuntimeMode;
  ok: boolean;
  code?: string;
  beforeVaultBalance: string;
  afterVaultBalance: string;
  beforeRecipientLamports: string;
  afterRecipientLamports: string;
  trace: TraceEvent[];
  snapshot: RuntimeSnapshot;
}

export interface ExploitProof {
  scenarioId: string;
  drainedLamports: string;
  vulnerableTraceHash: string;
  fixedTraceHash: string;
  explanation: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  likelihood: "high" | "medium" | "low";
  description: string;
  recommendation: string;
  evidenceRefs: string[];
}

export interface AuditReport {
  course: "solana-security";
  version: "v2";
  fixturesHash: string;
  findings: Finding[];
  reproduction: {
    scenarios: Array<{
      id: string;
      steps: string[];
      vulnerableTraceHash: string;
      fixedTraceHash: string;
      impact: { drainedLamports?: string; stateCorruption?: string };
      status: "reproduced";
    }>;
  };
  remediation: { summary: string; patchIds: string[] };
  verification: { invariants: string[]; results: Array<{ id: string; ok: boolean }> };
}
