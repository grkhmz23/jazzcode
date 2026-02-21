export type VFSNode = {
  type: "file" | "directory";
  name: string;
  content?: string;
  children?: Record<string, VFSNode>;
  modified?: boolean;
};

export type SolanaConfig = {
  rpcUrl: string;
  websocketUrl: string;
  keypairPath: string;
  commitment: "processed" | "confirmed" | "finalized";
};

export type ChainState = {
  config: SolanaConfig;
  wallets: Record<string, { pubkey: string; balance: number; keypairPath?: string }>;
  defaultWallet: string | null;
  tokens: Record<string, { mint: string; decimals: number; supply: number; authority: string }>;
  tokenAccounts: Record<string, { owner: string; mint: string; balance: number }>;
  programs: Record<string, { programId: string; deployedAt: number; authority: string }>;
  transactions: { signature: string; description: string; timestamp: number }[];
  currentDir: string;
  lastBuildSucceeded: boolean;
};

export type SideEffect =
  | { type: "create_file"; path: string; content: string }
  | { type: "update_file"; path: string; content: string }
  | { type: "delete_file"; path: string }
  | { type: "update_balance"; address: string; amount: number }
  | { type: "create_token"; mint: string }
  | { type: "deploy_program"; programId: string }
  | { type: "set_config"; key: string; value: string }
  | { type: "create_keypair"; pubkey: string; path: string }
  | { type: "record_tx"; signature: string; description: string };

export type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  sideEffects?: SideEffect[];
  clear?: boolean;
  nextDir?: string;
};

export type ObjectiveValidation =
  | {
      type: "command_match";
      pattern: string;
    }
  | {
      type: "file_contains";
      path: string;
      pattern: string;
    }
  | {
      type: "state_predicate";
      check: string;
    };

export type Objective = {
  id: string;
  text: string;
  type: "command" | "edit" | "state_check";
  validation: ObjectiveValidation;
  completed: boolean;
};

export type ChaosVariant = {
  trigger: string;
  condition: string;
  errorOutput: string;
  hint: string;
};

export type Mission = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  xpReward: number;
  objectives: Objective[];
  hints: string[];
  chaosVariants?: ChaosVariant[];
  requiredFiles?: Record<string, string>;
  successMessage: string;
};

export type Quest = {
  id: string;
  track: "foundation" | "builder" | "token" | "ops" | "security" | "pda" | "client";
  title: string;
  description: string;
  missions: Mission[];
};

export type MissionStats = {
  startedAt: number;
  commandsUsed: number;
  hintsUsed: number;
  errorsEncountered: number;
};

export type MissionScore = {
  timeSeconds: number;
  commandsUsed: number;
  hintsUsed: number;
  errorsEncountered: number;
  cleanRun: boolean;
  xpAwarded: number;
  bonusXP: number;
};
