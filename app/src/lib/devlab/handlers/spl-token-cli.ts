import { generateAddress, generateSignature } from "@/lib/devlab/chain-state";
import { ChainState, CommandResult } from "@/lib/devlab/types";

type SplTokenParams = {
  args: string[];
  chainState: ChainState;
};

function ok(stdout: string): CommandResult {
  return { stdout, stderr: "", exitCode: 0, sideEffects: [] };
}

function fail(stderr: string): CommandResult {
  return { stdout: "", stderr, exitCode: 1 };
}

export function handleSplTokenCli({ args, chainState }: SplTokenParams): CommandResult {
  const sub = args[0] ?? "";

  if (sub === "create-token") {
    const decimals = args.includes("--decimals") ? Number(args[args.indexOf("--decimals") + 1]) : 9;
    if (Number.isNaN(decimals) || decimals < 0 || decimals > 9) return fail("Invalid decimals");
    const mint = generateAddress(Date.now() + decimals);
    const sig = generateSignature(Date.now() + decimals + 1);
    const authority = chainState.defaultWallet ?? "unknown";
    chainState.tokens[mint] = { mint, decimals, supply: 0, authority };
    return ok(`Creating token ${mint}\nSignature: ${sig}\nAddress: ${mint}\nDecimals: ${decimals}`);
  }

  if (sub === "create-account") {
    const mint = args[1];
    if (!mint || !chainState.tokens[mint]) return fail("Mint not found");
    const owner = chainState.defaultWallet ?? generateAddress(Date.now() + 7);
    const account = generateAddress(Date.now() + owner.length + mint.length);
    chainState.tokenAccounts[account] = { owner, mint, balance: 0 };
    return ok(`Creating account ${account}\nOwner: ${owner}\nMint: ${mint}`);
  }

  if (sub === "mint") {
    const mint = args[1];
    const amount = Number(args[2]);
    if (!mint || Number.isNaN(amount) || amount <= 0) return fail("Usage: spl-token mint <mint> <amount>");
    const token = chainState.tokens[mint];
    if (!token) return fail("Mint not found");
    token.supply += amount;
    const recipient = args[3];
    if (recipient && chainState.tokenAccounts[recipient]) {
      chainState.tokenAccounts[recipient].balance += amount;
    }
    return ok(`Minted ${amount} tokens\nMint: ${mint}\nSignature: ${generateSignature(Date.now() + 9)}`);
  }

  if (sub === "transfer") {
    const mint = args[1];
    const amount = Number(args[2]);
    const recipient = args[3];
    if (!mint || Number.isNaN(amount) || !recipient) return fail("Usage: spl-token transfer <mint> <amount> <recipient>");
    const token = chainState.tokens[mint];
    if (!token) return fail("Mint not found");
    const senderAccount = Object.values(chainState.tokenAccounts).find(
      (account) => account.mint === mint && account.owner === chainState.defaultWallet
    );
    if (!senderAccount || senderAccount.balance < amount) return fail("Error: insufficient token balance");
    senderAccount.balance -= amount;
    if (!chainState.tokenAccounts[recipient]) {
      chainState.tokenAccounts[recipient] = { owner: recipient, mint, balance: 0 };
    }
    chainState.tokenAccounts[recipient].balance += amount;
    return ok(`Transfer ${amount}\nSignature: ${generateSignature(Date.now() + 10)}`);
  }

  if (sub === "balance") {
    const mint = args[1];
    if (!mint) return fail("Usage: spl-token balance <mint>");
    const balance = Object.values(chainState.tokenAccounts)
      .filter((account) => account.mint === mint && account.owner === chainState.defaultWallet)
      .reduce((acc, account) => acc + account.balance, 0);
    return ok(`${balance}`);
  }

  if (sub === "supply") {
    const mint = args[1];
    if (!mint || !chainState.tokens[mint]) return fail("Mint not found");
    return ok(`${chainState.tokens[mint].supply}`);
  }

  if (sub === "authorize") {
    return ok("Updated token authority");
  }

  if (sub === "close") {
    return ok("Closed token account and reclaimed rent");
  }

  return fail(`spl-token: unknown command '${args.join(" ")}'`);
}
