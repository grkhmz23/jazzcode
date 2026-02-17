import { TaskQuest } from "@/lib/playground/tasks/types";

export const solanaFundamentalsQuest: TaskQuest = {
  id: "solana-fundamentals-cli-wallet-manager",
  title: "Solana Fundamentals -> CLI Wallet Manager",
  description: "Learn config, keypair workflow, airdrops, balances, and transfer simulation with verifiable checkpoints.",
  tasks: [
    {
      id: "task-help",
      title: "Inspect command catalog",
      description: "Run terminal help to see supported Solana and Anchor commands.",
      assertions: [{ type: "command_succeeded", command: "help" }],
      hints: ["Use `help` from the terminal."],
    },
    {
      id: "task-config",
      title: "Set devnet RPC",
      description: "Configure Solana CLI URL to devnet and verify config.",
      prerequisites: ["task-help"],
      assertions: [
        { type: "command_succeeded", command: "solana config set --url devnet" },
        { type: "command_succeeded", command: "solana config get" },
        { type: "state", key: "config_devnet" },
      ],
      hints: ["Run `solana config set --url devnet`, then `solana config get`."],
    },
    {
      id: "task-keygen",
      title: "Create a keypair",
      description: "Generate a new keypair JSON into keys/devnet.json and inspect pubkey.",
      prerequisites: ["task-config"],
      assertions: [
        { type: "command_succeeded", command: "solana-keygen new" },
        { type: "command_succeeded", command: "solana-keygen pubkey" },
        { type: "state", key: "wallet_created" },
        { type: "file_regex", path: "keys/devnet.json", regex: "\\[" },
      ],
      hints: ["Use `solana-keygen new --outfile keys/devnet.json`."],
      checkpointId: "checkpoint-keypair",
    },
    {
      id: "task-address",
      title: "Read wallet address",
      description: "Use Solana CLI to print active address.",
      prerequisites: ["task-keygen"],
      assertions: [{ type: "command_succeeded", command: "solana address" }],
      hints: ["Run `solana address`."],
    },
    {
      id: "task-airdrop",
      title: "Fund wallet",
      description: "Airdrop devnet SOL and ensure state reflects funding.",
      prerequisites: ["task-address"],
      assertions: [
        { type: "command_succeeded", command: "solana airdrop" },
        { type: "state", key: "airdrop_done" },
      ],
      hints: ["Run `solana airdrop 1`."],
      checkpointId: "checkpoint-funded",
    },
    {
      id: "task-balance",
      title: "Check balance",
      description: "Read wallet balance after funding.",
      prerequisites: ["task-airdrop"],
      assertions: [
        { type: "command_succeeded", command: "solana balance" },
        { type: "state", key: "balance_checked" },
      ],
      hints: ["Run `solana balance`."],
    },
    {
      id: "task-transfer",
      title: "Transfer SOL",
      description: "Transfer a small amount to another address (simulated or real with confirmation).",
      prerequisites: ["task-balance"],
      assertions: [
        { type: "command_succeeded", command: "solana transfer" },
        { type: "state", key: "transfer_done" },
      ],
      hints: ["Try `solana transfer <address> 0.1`. Add `--real` then `confirm` for real send."],
      checkpointId: "checkpoint-transfer",
    },
    {
      id: "task-script",
      title: "Create wallet report script",
      description: "Create a TS/JS file that logs wallet and balance.",
      prerequisites: ["task-transfer"],
      assertions: [
        { type: "file_regex", path: "src/wallet-report.ts", regex: "console\\.log" },
        { type: "file_regex", path: "src/wallet-report.ts", regex: "balance" },
        { type: "state", key: "script_created" },
      ],
      hints: ["Create `src/wallet-report.ts` and log wallet + balance values."],
      checkpointId: "checkpoint-finish",
    },
  ],
};
