import { WorkspaceTemplate } from "@/lib/playground/types";

export const playgroundTemplatesV2: WorkspaceTemplate[] = [
  {
    id: "solana-fundamentals-cli",
    title: "Solana Fundamentals (CLI)",
    description: "CLI-first template focused on keypairs, airdrops, and balance checks.",
    files: [
      {
        path: "src/main.ts",
        content: [
          'import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";',
          "",
          "async function main(): Promise<void> {",
          "  const connection = new Connection(clusterApiUrl(\"devnet\"), \"confirmed\");",
          "  const wallet = new PublicKey(\"11111111111111111111111111111111\");",
          "  const balance = await connection.getBalance(wallet);",
          "  console.log({ wallet: wallet.toBase58(), balance });",
          "}",
          "",
          "void main();",
        ].join("\n"),
      },
      {
        path: "src/wallet-report.ts",
        content: [
          "export function printWalletReport(address: string, balance: number): void {",
          "  void address;",
          "  void balance;",
          "}",
        ].join("\n"),
      },
      {
        path: "README.md",
        language: "typescript",
        content: "# Solana Fundamentals CLI\n\nUse terminal commands to complete the guided quest.\n",
      },
    ],
  },
  {
    id: "anchor-counter-dapp",
    title: "Anchor Counter dApp",
    description: "Starter files for an Anchor counter program and test.",
    files: [
      {
        path: "anchor-counter/Anchor.toml",
        content: "[provider]\ncluster=\"devnet\"\nwallet=\"~/.config/solana/id.json\"\n",
      },
      {
        path: "anchor-counter/programs/anchor-counter/src/lib.rs",
        language: "rust",
        content: [
          "use anchor_lang::prelude::*;",
          "",
          "declare_id!(\"Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h\");",
          "",
          "#[program]",
          "pub mod anchor_counter {",
          "    use super::*;",
          "    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {",
          "        Ok(())",
          "    }",
          "}",
          "",
          "#[derive(Accounts)]",
          "pub struct Initialize {}",
        ].join("\n"),
      },
      {
        path: "anchor-counter/tests/anchor-counter.ts",
        content: "describe('anchor-counter', () => { it('initializes', async () => {}); });\n",
      },
    ],
  },
  {
    id: "spl-token-script",
    title: "SPL Token Script",
    description: "Utility script scaffold for SPL token create/mint/transfer workflow.",
    files: [
      {
        path: "scripts/spl-flow.ts",
        content: [
          'import { Connection, clusterApiUrl } from "@solana/web3.js";',
          "",
          "async function run(): Promise<void> {",
          "  const connection = new Connection(clusterApiUrl(\"devnet\"));",
          "  console.log(\"ready\", connection.rpcEndpoint);",
          "}",
          "",
          "void run();",
        ].join("\n"),
      },
      {
        path: "README.md",
        language: "typescript",
        content: "# SPL Script Template\n\nUse spl-token terminal commands to simulate mint lifecycle.\n",
      },
    ],
  },
];

export function getTemplateByIdV2(id: string): WorkspaceTemplate | null {
  return playgroundTemplatesV2.find((item) => item.id === id) ?? null;
}
