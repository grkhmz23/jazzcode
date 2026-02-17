import { WorkspaceTemplate } from "@/lib/playground/types";

export const solanaFundamentalsTemplate: WorkspaceTemplate = {
  id: "solana-fundamentals-cli",
  title: "Solana Fundamentals",
  description: "CLI-driven Solana template for wallet and transfer workflows.",
  files: [
    {
      path: "src/main.ts",
      content: [
        'import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";',
        "",
        "async function run(): Promise<void> {",
        "  const connection = new Connection(clusterApiUrl(\"devnet\"), \"confirmed\");",
        "  const wallet = new PublicKey(\"11111111111111111111111111111111\");",
        "  const lamports = await connection.getBalance(wallet);",
        "  console.log({ wallet: wallet.toBase58(), lamports });",
        "}",
        "",
        "void run();",
      ].join("\n"),
    },
    {
      path: "src/wallet-report.ts",
      content: [
        "export function walletReport(address: string, balance: number): void {",
        "  void address;",
        "  void balance;",
        "}",
      ].join("\n"),
    },
    {
      path: "README.md",
      language: "typescript",
      content: "# Solana Fundamentals Playground\n\nComplete the CLI wallet manager journey from the task panel.\n",
    },
  ],
};
