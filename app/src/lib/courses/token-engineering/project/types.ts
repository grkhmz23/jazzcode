export interface TokenConfigExtensionMetadataPointer {
  authority: string;
  metadataAddress: string;
}

export interface TokenConfigExtensionTransferFee {
  authority: string;
  feeBps: number;
  maxFee: string;
}

export interface TokenConfigExtensionDefaultAccountState {
  state: "initialized" | "frozen";
}

export interface TokenConfigExtensionPermanentDelegate {
  delegate: string;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  mintAuthority: string;
  freezeAuthority?: string | null;
  updateAuthority?: string | null;
  initialSupply: string;
  extensions: {
    metadataPointer?: TokenConfigExtensionMetadataPointer;
    transferFee?: TokenConfigExtensionTransferFee;
    defaultAccountState?: TokenConfigExtensionDefaultAccountState;
    permanentDelegate?: TokenConfigExtensionPermanentDelegate;
  };
  recipients?: Array<{ owner: string; amount: string }>;
}

export interface InstructionPlanItem {
  programId: string;
  keys: Array<{ pubkey: string; isSigner: boolean; isWritable: boolean }>;
  dataBase64: string;
  label: string;
}

export interface LaunchPack {
  mint: string;
  ataDerivations: Array<{ owner: string; ata: string }>;
  initPlan: InstructionPlanItem[];
  distributionPlan: InstructionPlanItem[];
  invariants: string[];
}

export interface LaunchPackSummary {
  mint: string;
  token: { name: string; symbol: string; decimals: number };
  authorities: {
    mintAuthority: string;
    freezeAuthority: string | null;
    updateAuthority: string | null;
  };
  extensions: {
    metadataPointer: TokenConfigExtensionMetadataPointer | null;
    transferFee: TokenConfigExtensionTransferFee | null;
    defaultAccountState: TokenConfigExtensionDefaultAccountState | null;
    permanentDelegate: TokenConfigExtensionPermanentDelegate | null;
  };
  supply: {
    initialSupply: string;
    recipientsTotal: string;
    remaining: string;
  };
  feeModel?: {
    feeBps: number;
    maxFee: string;
    examples: Array<{ amount: string; fee: string }>;
  };
  plan: {
    initSteps: number;
    distributionSteps: number;
    labels: string[];
  };
  invariants: string[];
  determinism: {
    fixturesHash: string;
    encodingVersion: string;
  };
}

export interface ValidatedTokenConfigResult {
  config: TokenConfig;
  recipientsTotal: string;
  remaining: string;
  invariants: string[];
}
