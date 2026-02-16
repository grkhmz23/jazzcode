export type SimToken = {
  mint: string;
  decimals: number;
  supply: bigint;
  authority: string;
};

export type SimTokenAccount = {
  address: string;
  owner: string;
  mint: string;
  balance: bigint;
};

export type TerminalSimState = {
  configUrl: "devnet" | "testnet" | "mainnet-beta" | "localhost";
  keypairs: Record<string, string>;
  defaultKeypairPath: string;
  balances: Record<string, bigint>;
  tokens: Record<string, SimToken>;
  tokenAccounts: Record<string, SimTokenAccount>;
  txCounter: number;
  nonce: number;
};

export type TerminalSimResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  state: TerminalSimState;
};
