export interface TokenAccountView {
  mint: string;
  ata: string;
  amountRaw: string;
  decimals: number;
  amountUi: string;
  programId: string;
}

export interface InstructionKeyPlan {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
}

export interface InstructionPlan {
  programId: string;
  keys: InstructionKeyPlan[];
  dataBase64: string;
}

export interface TransactionPlan {
  feePayer: string;
  recentBlockhash: string;
  instructions: InstructionPlan[];
}

export interface SolTransferBuilderInput {
  from: string;
  to: string;
  amountSol: number;
  recentBlockhash: string;
  feePayer?: string;
}

export interface SplTransferBuilderInput {
  sourceAta: string;
  destinationAta: string;
  owner: string;
  mint: string;
  amountRaw: string;
  decimals: number;
  expectedDecimals?: number;
  recentBlockhash: string;
  feePayer?: string;
}

export interface DashboardCheckpoint {
  owner: string;
  tokenAccounts: TokenAccountView[];
  solTransferPlan: TransactionPlan;
  splTransferPlan: TransactionPlan;
}
