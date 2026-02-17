export interface VaultProgramSpec {
  name: "vault-program";
  instructions: ["init_vault", "withdraw"];
  stateFields: ["authority", "bump", "balance"];
}

export const VAULT_PROGRAM_SPEC: VaultProgramSpec = {
  name: "vault-program",
  instructions: ["init_vault", "withdraw"],
  stateFields: ["authority", "bump", "balance"],
};
