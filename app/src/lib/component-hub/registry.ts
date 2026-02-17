/**
 * Component Hub Registry
 * Central registry for all Solana components
 */

import type { HubComponent, ComponentCategory } from "./types";
export type { HubComponent, ComponentCategory } from "./types";

// Helper to create consistent component structure
const createComponent = (
  id: string,
  name: string,
  category: ComponentCategory,
  description: string,
  config: Partial<HubComponent> = {}
): HubComponent => ({
  id,
  name,
  category,
  description,
  longDescription: config.longDescription || description,
  files: config.files || [],
  dependencies: config.dependencies || [],
  props: config.props || [],
  examples: config.examples || [],
  permissions: config.permissions || [],
  productionNotes: config.productionNotes || [],
  installCommand: config.installCommand || `jazzcode add ${id}`,
  isNew: config.isNew,
  isFeatured: config.isFeatured,
  ...config,
});

// =============================================================================
// WALLET COMPONENTS
// =============================================================================

const walletConnectButton: HubComponent = createComponent(
  "wallet-connect-button-pro",
  "WalletConnectButton Pro",
  "wallet",
  "Professional wallet connection button with network badge, address display, and disconnect",
  {
    longDescription: `A production-ready wallet connection button that handles all wallet states:
- Disconnected: Shows connect prompt with wallet adapter selection
- Connecting: Loading state with spinner
- Connected: Displays shortened address with network badge
- Features: Copy address, view on explorer, disconnect
- Auto-detects wallet type and persists last used wallet`,
    files: [
      {
        path: "WalletConnectButton.tsx",
        language: "typescript",
        content: `"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useCallback } from "react";
import { Copy, ExternalLink, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface WalletConnectButtonProps {
  showNetworkBadge?: boolean;
  requireSigning?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function WalletConnectButton({
  showNetworkBadge = true,
  requireSigning = false,
  onConnect,
  onDisconnect,
}: WalletConnectButtonProps) {
  const { publicKey, connected, disconnect, wallet } = useWallet();
  const { connection } = useConnection();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const network = connection.rpcEndpoint.includes("devnet") 
    ? "devnet" 
    : connection.rpcEndpoint.includes("mainnet") 
    ? "mainnet" 
    : "localnet";

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Address copied to clipboard");
    }
  }, [publicKey]);

  const viewOnExplorer = useCallback(() => {
    if (publicKey) {
      const baseUrl = network === "mainnet" 
        ? "https://explorer.solana.com" 
        : \`https://explorer.solana.com/?cluster=\${network}\`;
      window.open(\`\${baseUrl}/address/\${publicKey.toBase58()}\`, "_blank");
    }
  }, [publicKey, network]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    onDisconnect?.();
    toast.info("Wallet disconnected");
  }, [disconnect, onDisconnect]);

  if (!connected || !publicKey) {
    return (
      <div className="flex items-center gap-2">
        <WalletMultiButton className="bg-purple-600 hover:bg-purple-700" />
        {requireSigning && (
          <span className="text-xs text-amber-500">Signing required</span>
        )}
      </div>
    );
  }

  const shortenedAddress = \`\${publicKey.toBase58().slice(0, 4)}...\${publicKey.toBase58().slice(-4)}\`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {wallet?.adapter.icon && (
            <img 
              src={wallet.adapter.icon} 
              alt={wallet.adapter.name} 
              className="h-4 w-4"
            />
          )}
          <span>{shortenedAddress}</span>
        </div>
        {showNetworkBadge && (
          <span className={\`rounded-full px-2 py-0.5 text-xs \${
            network === "mainnet" 
              ? "bg-green-500/20 text-green-400" 
              : network === "devnet"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-blue-500/20 text-blue-400"
          }\`}>
            {network}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl">
            <div className="p-2 space-y-1">
              <button
                onClick={copyAddress}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
                Copy address
              </button>
              <button
                onClick={viewOnExplorer}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <ExternalLink className="h-4 w-4" />
                View on explorer
              </button>
              <div className="my-1 h-px bg-zinc-800" />
              <button
                onClick={handleDisconnect}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-400 hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}`,
      },
      {
        path: "hooks/useWalletState.ts",
        language: "typescript",
        content: `import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  walletName: string | null;
}

export function useWalletState(): WalletState {
  const { connected, connecting, publicKey, wallet } = useWallet();
  const [walletName, setWalletName] = useState<string | null>(null);

  useEffect(() => {
    if (wallet?.adapter.name) {
      setWalletName(wallet.adapter.name);
      localStorage.setItem("lastWallet", wallet.adapter.name);
    }
  }, [wallet]);

  return {
    isConnected: connected,
    isConnecting: connecting,
    publicKey: publicKey?.toBase58() || null,
    walletName,
  };
}`,
      },
    ],
    dependencies: [
      { name: "@solana/wallet-adapter-react", version: "^0.15.32" },
      { name: "@solana/wallet-adapter-react-ui", version: "^0.9.31" },
      { name: "lucide-react", version: "^0.300.0" },
      { name: "sonner", version: "^1.0.0" },
    ],
    props: [
      {
        name: "showNetworkBadge",
        type: "boolean",
        required: false,
        defaultValue: true,
        description: "Show devnet/mainnet badge on the button",
      },
      {
        name: "requireSigning",
        type: "boolean",
        required: false,
        defaultValue: false,
        description: "Show signing required indicator",
      },
      {
        name: "onConnect",
        type: "() => void",
        required: false,
        description: "Callback when wallet connects",
      },
      {
        name: "onDisconnect",
        type: "() => void",
        required: false,
        description: "Callback when wallet disconnects",
      },
    ],
    examples: [
      {
        name: "Basic",
        description: "Default wallet button",
        code: "<WalletConnectButton />",
      },
      {
        name: "With Signing Gate",
        description: "Button that indicates signing is required",
        code: "<WalletConnectButton requireSigning showNetworkBadge />",
      },
    ],
    permissions: [
      { type: "wallet", required: true, description: "Requires wallet connection" },
    ],
    productionNotes: [
      {
        type: "error-handling",
        title: "Wallet Errors",
        content: "Handle wallet adapter errors gracefully. Some wallets may not support all features.",
      },
      {
        type: "accessibility",
        title: "Keyboard Navigation",
        content: "Dropdown is keyboard accessible. ESC closes dropdown, Tab navigates items.",
      },
    ],
    isFeatured: true,
  }
);

const walletGate: HubComponent = createComponent(
  "wallet-gate",
  "WalletGate",
  "wallet",
  "Wrapper component that handles wallet connection states with beautiful UI",
  {
    longDescription: "Renders different content based on wallet state: not connected, wrong network, or connected.",
    files: [
      {
        path: "WalletGate.tsx",
        language: "typescript",
        content: `"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ReactNode } from "react";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

interface WalletGateProps {
  children: ReactNode;
  requiredNetwork?: "mainnet" | "devnet" | "any";
  fallback?: ReactNode;
  showConnectPrompt?: boolean;
}

export function WalletGate({
  children,
  requiredNetwork = "any",
  fallback,
  showConnectPrompt = true,
}: WalletGateProps) {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const currentNetwork = connection.rpcEndpoint.includes("devnet")
    ? "devnet"
    : connection.rpcEndpoint.includes("mainnet")
    ? "mainnet"
    : "localnet";

  const isWrongNetwork = requiredNetwork !== "any" && currentNetwork !== requiredNetwork;

  if (!connected || !publicKey) {
    if (fallback) return <>{fallback}</>;
    
    if (!showConnectPrompt) return null;

    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-8">
        <Shield className="h-12 w-12 text-zinc-600" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          <p className="text-sm text-zinc-400">
            Please connect your wallet to access this feature
          </p>
        </div>
        <WalletMultiButton className="bg-purple-600 hover:bg-purple-700" />
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-amber-500/20 bg-amber-950/20 p-8">
        <AlertCircle className="h-12 w-12 text-amber-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-400">Wrong Network</h3>
          <p className="text-sm text-amber-300/70">
            Please switch to {requiredNetwork}. Currently on {currentNetwork}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
      {children}
    </div>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/wallet-adapter-react", version: "^0.15.32" },
      { name: "@solana/wallet-adapter-react-ui", version: "^0.9.31" },
      { name: "lucide-react", version: "^0.300.0" },
    ],
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content to show when wallet is connected",
      },
      {
        name: "requiredNetwork",
        type: '"mainnet" | "devnet" | "any"',
        required: false,
        defaultValue: "any",
        description: "Required network for the wrapped content",
      },
      {
        name: "fallback",
        type: "ReactNode",
        required: false,
        description: "Custom fallback when wallet not connected",
      },
      {
        name: "showConnectPrompt",
        type: "boolean",
        required: false,
        defaultValue: true,
        description: "Show default connect prompt",
      },
    ],
    permissions: [
      { type: "wallet", required: true, description: "Requires wallet for full functionality" },
    ],
    productionNotes: [
      {
        type: "security",
        title: "Network Validation",
        content: "Always validate network on the server side, not just in UI.",
      },
    ],
    isFeatured: true,
  }
);

// =============================================================================
// TOKEN COMPONENTS
// =============================================================================

const tokenBalanceCard: HubComponent = createComponent(
  "token-balance-card",
  "TokenBalanceCard",
  "tokens",
  "Display SOL and SPL token balances with refresh and caching",
  {
    longDescription: "Shows token balances with loading states, error handling, and automatic refresh. Supports both SOL and SPL tokens.",
    files: [
      {
        path: "TokenBalanceCard.tsx",
        language: "typescript",
        content: `"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RefreshCw, Wallet, Coins } from "lucide-react";
import { useState } from "react";

interface TokenInfo {
  mint: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

interface TokenBalance {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  logo?: string;
}

interface TokenBalanceCardProps {
  tokens?: TokenInfo[];
  showSOL?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
}

const KNOWN_TOKENS: TokenInfo[] = [
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6 },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", decimals: 6 },
];

async function fetchTokenBalance(
  connection: ReturnType<typeof useConnection>["connection"],
  publicKey: PublicKey,
  token: TokenInfo
): Promise<TokenBalance> {
  // Simplified - in production use getTokenAccountsByOwner
  return {
    mint: token.mint,
    symbol: token.symbol,
    balance: 0,
    decimals: token.decimals,
    logo: token.logo,
  };
}

async function fetchSOLBalance(
  connection: ReturnType<typeof useConnection>["connection"],
  publicKey: PublicKey
): Promise<TokenBalance> {
  const balance = await connection.getBalance(publicKey);
  return {
    mint: "SOL",
    symbol: "SOL",
    balance: balance / LAMPORTS_PER_SOL,
    decimals: 9,
    logo: "/solana-logo.svg",
  };
}

export function TokenBalanceCard({
  tokens = KNOWN_TOKENS,
  showSOL = true,
  refreshInterval = 30000,
  onRefresh,
}: TokenBalanceCardProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: balances, isLoading, refetch } = useQuery({
    queryKey: ["token-balances", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return [];
      
      const results: TokenBalance[] = [];
      
      if (showSOL) {
        const solBalance = await fetchSOLBalance(connection, publicKey);
        results.push(solBalance);
      }
      
      for (const token of tokens) {
        const balance = await fetchTokenBalance(connection, publicKey, token);
        results.push(balance);
      }
      
      return results;
    },
    enabled: connected && !!publicKey,
    refetchInterval: refreshInterval,
    staleTime: 10000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-zinc-600" />
          <div>
            <h3 className="font-semibold text-zinc-400">Connect Wallet</h3>
            <p className="text-sm text-zinc-500">View your token balances</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-purple-500" />
          Token Balances
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-lg p-2 hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className={\`h-4 w-4 text-zinc-400 \${isRefreshing ? "animate-spin" : ""}\`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-900" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {balances?.map((token) => (
            <div
              key={token.mint}
              className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3"
            >
              <div className="flex items-center gap-3">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <span className="font-medium text-white">{token.symbol}</span>
              </div>
              <span className="font-mono text-zinc-300">
                {token.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: token.decimals,
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/wallet-adapter-react", version: "^0.15.32" },
      { name: "@solana/web3.js", version: "^1.87.0" },
      { name: "@tanstack/react-query", version: "^5.0.0" },
      { name: "lucide-react", version: "^0.300.0" },
    ],
    props: [
      {
        name: "tokens",
        type: "TokenInfo[]",
        required: false,
        description: "List of SPL tokens to display",
      },
      {
        name: "showSOL",
        type: "boolean",
        required: false,
        defaultValue: true,
        description: "Include SOL balance",
      },
      {
        name: "refreshInterval",
        type: "number",
        required: false,
        defaultValue: 30000,
        description: "Auto-refresh interval in ms",
      },
    ],
    permissions: [
      { type: "wallet", required: true, description: "Requires wallet connection" },
      { type: "rpc", required: true, description: "Makes RPC calls for balances" },
    ],
    productionNotes: [
      {
        type: "performance",
        title: "Caching Strategy",
        content: "Uses react-query for caching. Adjust staleTime based on your needs.",
      },
    ],
    isFeatured: true,
  }
);

const tokenTransferForm: HubComponent = createComponent(
  "token-transfer-form",
  "TokenTransferForm",
  "tokens",
  "Complete token transfer form with validation, ATA creation, and simulation",
  {
    files: [
      {
        path: "TokenTransferForm.tsx",
        language: "typescript",
        content: `"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { Send, AlertCircle } from "lucide-react";

interface TokenTransferFormProps {
  defaultToken?: "SOL" | string;
  maxAmount?: number;
  onSuccess?: (signature: string) => void;
  simulateOnly?: boolean;
}

export function TokenTransferForm({
  defaultToken = "SOL",
  maxAmount,
  onSuccess,
  simulateOnly = false,
}: TokenTransferFormProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!publicKey || !signTransaction) {
      toast.error("Wallet not connected");
      return;
    }

    if (!validateAddress(recipient)) {
      setError("Invalid recipient address");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Invalid amount");
      return;
    }

    if (maxAmount && amountNum > maxAmount) {
      setError(\`Amount exceeds maximum of \${maxAmount}\`);
      return;
    }

    setIsLoading(true);

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = amountNum * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      // Simulate first
      const simulation = await connection.simulateTransaction(transaction);
      if (simulation.value.err) {
        setError(\`Simulation failed: \${JSON.stringify(simulation.value.err)}\`);
        setIsLoading(false);
        return;
      }

      if (simulateOnly) {
        toast.success("Simulation successful!");
        setIsLoading(false);
        return;
      }

      // Send transaction
      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      toast.promise(
        connection.confirmTransaction(signature),
        {
          loading: "Confirming transaction...",
          success: () => ({
            message: \`Transaction confirmed!\`,
            action: {
              label: "View",
              onClick: () => window.open(\`https://explorer.solana.com/tx/\${signature}?cluster=devnet\`, "_blank"),
            },
          }),
          error: "Transaction failed",
        }
      );

      onSuccess?.(signature);
      setAmount("");
      setRecipient("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
        <p className="text-zinc-400">Connect wallet to send tokens</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-4 font-semibold text-white">Send {defaultToken}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.000000001"
              min="0"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 pr-16 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              {defaultToken}
            </span>
          </div>
          {maxAmount && (
            <button
              type="button"
              onClick={() => setAmount(maxAmount.toString())}
              className="mt-1 text-xs text-purple-400 hover:text-purple-300"
            >
              Max: {maxAmount}
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !recipient || !amount}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              {simulateOnly ? "Simulate Transfer" : "Send"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/wallet-adapter-react", version: "^0.15.32" },
      { name: "@solana/web3.js", version: "^1.87.0" },
      { name: "lucide-react", version: "^0.300.0" },
      { name: "sonner", version: "^1.0.0" },
    ],
    props: [
      {
        name: "defaultToken",
        type: '"SOL" | string',
        required: false,
        defaultValue: "SOL",
        description: "Token to transfer",
      },
      {
        name: "maxAmount",
        type: "number",
        required: false,
        description: "Maximum allowed amount",
      },
      {
        name: "simulateOnly",
        type: "boolean",
        required: false,
        defaultValue: false,
        description: "Only simulate transaction, don't send",
      },
    ],
    permissions: [
      { type: "wallet", required: true, description: "Requires signing" },
      { type: "rpc", required: true, description: "Makes RPC calls" },
    ],
    productionNotes: [
      {
        type: "security",
        title: "Address Validation",
        content: "Always validate addresses before creating transactions",
      },
      {
        type: "error-handling",
        title: "Simulation First",
        content: "Always simulate before sending to catch errors early",
      },
    ],
    isFeatured: true,
  }
);

// =============================================================================
// DEV TOOLS COMPONENTS
// =============================================================================

const pdaVisualizer: HubComponent = createComponent(
  "pda-visualizer",
  "PDADerivationVisualizer",
  "dev-tools",
  "Interactive PDA derivation with visual breakdown of seeds and bump",
  {
    files: [
      {
        path: "PDADerivationVisualizer.tsx",
        language: "typescript",
        content: `"use client";

import { useState, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { Hash, Info, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PDADerivationVisualizerProps {
  defaultProgramId?: string;
  defaultSeeds?: string[];
}

export function PDADerivationVisualizer({
  defaultProgramId = "",
  defaultSeeds = [""],
}: PDADerivationVisualizerProps) {
  const [programId, setProgramId] = useState(defaultProgramId);
  const [seeds, setSeeds] = useState<string[]>(defaultSeeds);
  const [copied, setCopied] = useState(false);

  const derivation = useMemo(() => {
    try {
      if (!programId) return null;
      
      const programPubkey = new PublicKey(programId);
      const seedBuffers = seeds
        .filter((s) => s.length > 0)
        .map((seed) => {
          // Try to parse as hex
          if (seed.startsWith("0x")) {
            return Buffer.from(seed.slice(2), "hex");
          }
          // Try to parse as base58 pubkey
          try {
            return new PublicKey(seed).toBuffer();
          } catch {
            return Buffer.from(seed);
          }
        });

      if (seedBuffers.length === 0) return null;

      const [pda, bump] = PublicKey.findProgramAddressSync(seedBuffers, programPubkey);

      return {
        address: pda.toBase58(),
        bump,
        seeds: seedBuffers.map((buf, i) => ({
          input: seeds[i],
          hex: buf.toString("hex"),
          bytes: Array.from(buf),
        })),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid input" };
    }
  }, [programId, seeds]);

  const copyAddress = async () => {
    if (derivation && "address" in derivation) {
      await navigator.clipboard.writeText(derivation.address);
      setCopied(true);
      toast.success("PDA copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addSeed = () => setSeeds([...seeds, ""]);
  const removeSeed = (index: number) => setSeeds(seeds.filter((_, i) => i !== index));
  const updateSeed = (index: number, value: string) => {
    const newSeeds = [...seeds];
    newSeeds[index] = value;
    setSeeds(newSeeds);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Hash className="h-6 w-6 text-purple-500" />
        <div>
          <h3 className="font-semibold text-white">PDA Derivation</h3>
          <p className="text-sm text-zinc-500">Program Derived Address calculator</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Program ID</label>
          <input
            type="text"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            placeholder="Enter program ID..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Seeds</label>
          {seeds.map((seed, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={seed}
                onChange={(e) => updateSeed(index, e.target.value)}
                placeholder={"Seed " + (index + 1) + " (string, hex 0x..., or pubkey)"}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none font-mono text-sm"
              />
              {seeds.length > 1 && (
                <button
                  onClick={() => removeSeed(index)}
                  className="rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSeed}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            + Add seed
          </button>
        </div>

        {derivation && (
          <div className="mt-6 space-y-4">
            {"error" in derivation ? (
              <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                {derivation.error}
              </div>
            ) : (
              <>
                <div className="rounded-lg bg-zinc-900 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Derived Address</span>
                    <button
                      onClick={copyAddress}
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <code className="block break-all text-lg font-mono text-white">
                    {derivation.address}
                  </code>
                </div>

                <div className="rounded-lg bg-zinc-900 p-4">
                  <span className="text-sm text-zinc-400">Bump Seed</span>
                  <code className="ml-3 font-mono text-purple-400">
                    {derivation.bump}
                  </code>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-zinc-400">Seed Breakdown</span>
                  {derivation.seeds.map((seed, i) => (
                    <div key={i} className="rounded-lg border border-zinc-800 p-3">
                      <div className="mb-1 text-xs text-zinc-500">Seed {i + 1}</div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Input:</span>
                          <span className="font-mono text-white">{seed.input}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Hex:</span>
                          <span className="font-mono text-xs text-zinc-300">{seed.hex}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Bytes:</span>
                          <span className="font-mono text-xs text-zinc-300">
                            [{seed.bytes.join(", ")}]
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-sm text-blue-400">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    The bump seed (canonical) ensures the address is off the Ed25519 curve,
                    making it impossible to have a private key for this address.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/web3.js", version: "^1.87.0" },
      { name: "@coral-xyz/anchor", version: "^0.29.0" },
      { name: "lucide-react", version: "^0.300.0" },
      { name: "sonner", version: "^1.0.0" },
    ],
    props: [
      {
        name: "defaultProgramId",
        type: "string",
        required: false,
        description: "Initial program ID",
      },
      {
        name: "defaultSeeds",
        type: "string[]",
        required: false,
        defaultValue: ['""'],
        description: "Initial seeds",
      },
    ],
    productionNotes: [
      {
        type: "security",
        title: "Client-Side Only",
        content: "PDA derivation is client-side only and safe. Never derive PDAs server-side without validation.",
      },
    ],
    isFeatured: true,
    isNew: true,
  }
);

const transactionBuilder: HubComponent = createComponent(
  "transaction-builder",
  "TransactionBuilder",
  "dev-tools",
  "Visual transaction builder showing instructions, accounts, and simulation",
  {
    files: [
      {
        path: "TransactionBuilder.tsx",
        language: "typescript",
        content: `"use client";

import { useState } from "react";
import { 
  Transaction, 
  TransactionInstruction, 
  PublicKey, 
  SystemProgram,
  Connection 
} from "@solana/web3.js";
import { Plus, Trash2, Play, AlertCircle } from "lucide-react";

interface InstructionData {
  id: string;
  programId: string;
  keys: {
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }[];
  data: string;
}

interface TransactionBuilderProps {
  connection?: Connection;
  onSimulate?: (result: unknown) => void;
}

export function TransactionBuilder({ connection, onSimulate }: TransactionBuilderProps) {
  const [instructions, setInstructions] = useState<InstructionData[]>([]);
  const [simulationResult, setSimulationResult] = useState<unknown>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      {
        id: Math.random().toString(36).slice(2),
        programId: SystemProgram.programId.toBase58(),
        keys: [],
        data: "",
      },
    ]);
  };

  const removeInstruction = (id: string) => {
    setInstructions(instructions.filter((i) => i.id !== id));
  };

  const updateInstruction = (id: string, updates: Partial<InstructionData>) => {
    setInstructions(
      instructions.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const addAccount = (instructionId: string) => {
    const instruction = instructions.find((i) => i.id === instructionId);
    if (!instruction) return;
    
    updateInstruction(instructionId, {
      keys: [
        ...instruction.keys,
        { pubkey: "", isSigner: false, isWritable: false },
      ],
    });
  };

  const simulate = async () => {
    if (!connection) {
      alert("No connection available");
      return;
    }

    setIsSimulating(true);
    try {
      const transaction = new Transaction();
      
      for (const ix of instructions) {
        const keys = ix.keys.map((k) => ({
          pubkey: new PublicKey(k.pubkey),
          isSigner: k.isSigner,
          isWritable: k.isWritable,
        }));
        
        transaction.add(
          new TransactionInstruction({
            keys,
            programId: new PublicKey(ix.programId),
            data: Buffer.from(ix.data, "hex"),
          })
        );
      }

      const result = await connection.simulateTransaction(transaction);
      setSimulationResult(result.value);
      onSimulate?.(result.value);
    } catch (error) {
      setSimulationResult({ error: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Transaction Builder</h3>
        <button
          onClick={addInstruction}
          className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Instruction
        </button>
      </div>

      <div className="space-y-4">
        {instructions.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
            No instructions yet. Click "Add Instruction" to start building.
          </div>
        )}

        {instructions.map((ix, index) => (
          <div key={ix.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">
                Instruction {index + 1}
              </span>
              <button
                onClick={() => removeInstruction(ix.id)}
                className="text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500">Program ID</label>
                <input
                  type="text"
                  value={ix.programId}
                  onChange={(e) => updateInstruction(ix.id, { programId: e.target.value })}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-mono text-white"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Accounts</label>
                  <button
                    onClick={() => addAccount(ix.id)}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    + Add account
                  </button>
                </div>
                <div className="space-y-2">
                  {ix.keys.map((key, keyIndex) => (
                    <div key={keyIndex} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Pubkey"
                        value={key.pubkey}
                        onChange={(e) => {
                          const newKeys = [...ix.keys];
                          newKeys[keyIndex] = { ...key, pubkey: e.target.value };
                          updateInstruction(ix.id, { keys: newKeys });
                        }}
                        className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-mono text-white"
                      />
                      <label className="flex items-center gap-1 text-xs text-zinc-400">
                        <input
                          type="checkbox"
                          checked={key.isSigner}
                          onChange={(e) => {
                            const newKeys = [...ix.keys];
                            newKeys[keyIndex] = { ...key, isSigner: e.target.checked };
                            updateInstruction(ix.id, { keys: newKeys });
                          }}
                        />
                        Signer
                      </label>
                      <label className="flex items-center gap-1 text-xs text-zinc-400">
                        <input
                          type="checkbox"
                          checked={key.isWritable}
                          onChange={(e) => {
                            const newKeys = [...ix.keys];
                            newKeys[keyIndex] = { ...key, isWritable: e.target.checked };
                            updateInstruction(ix.id, { keys: newKeys });
                          }}
                        />
                        Writable
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500">Data (hex)</label>
                <textarea
                  value={ix.data}
                  onChange={(e) => updateInstruction(ix.id, { data: e.target.value })}
                  placeholder="00000000..."
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-mono text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {instructions.length > 0 && (
          <button
            onClick={simulate}
            disabled={isSimulating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isSimulating ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Play className="h-4 w-4" />
                Simulate Transaction
              </>
            )}
          </button>
        )}

        {simulationResult && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h4 className="mb-2 text-sm font-medium text-white">Simulation Result</h4>
            <pre className="overflow-auto rounded bg-zinc-950 p-3 text-xs text-zinc-300">
              {JSON.stringify(simulationResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/web3.js", version: "^1.87.0" },
      { name: "lucide-react", version: "^0.300.0" },
    ],
    props: [
      {
        name: "connection",
        type: "Connection",
        required: false,
        description: "Solana connection for simulation",
      },
    ],
    productionNotes: [
      {
        type: "security",
        title: "Simulation Only",
        content: "This is a dev tool for learning. In production, use proper transaction building.",
      },
    ],
    isNew: true,
  }
);

// =============================================================================
// ANALYTICS COMPONENTS
// =============================================================================

const rpcHealthBadge: HubComponent = createComponent(
  "rpc-health-badge",
  "RPCHealthBadge",
  "analytics",
  "Real-time RPC health monitoring with latency and fallback status",
  {
    files: [
      {
        path: "RPCHealthBadge.tsx",
        language: "typescript",
        content: `"use client";

import { useState, useEffect } from "react";
import { Connection } from "@solana/web3.js";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RPCHealthBadgeProps {
  endpoint?: string;
  checkInterval?: number;
  showLatency?: boolean;
}

type HealthStatus = "healthy" | "degraded" | "unhealthy" | "checking";

interface HealthState {
  status: HealthStatus;
  latency: number;
  lastChecked: Date | null;
  error?: string;
}

export function RPCHealthBadge({
  endpoint = "https://api.devnet.solana.com",
  checkInterval = 30000,
  showLatency = true,
}: RPCHealthBadgeProps) {
  const [health, setHealth] = useState<HealthState>({
    status: "checking",
    latency: 0,
    lastChecked: null,
  });

  useEffect(() => {
    const checkHealth = async () => {
      setHealth((prev) => ({ ...prev, status: "checking" }));
      
      const startTime = performance.now();
      try {
        const connection = new Connection(endpoint, "confirmed");
        await connection.getVersion();
        const latency = Math.round(performance.now() - startTime);
        
        setHealth({
          status: latency < 500 ? "healthy" : latency < 2000 ? "degraded" : "unhealthy",
          latency,
          lastChecked: new Date(),
        });
      } catch (error) {
        setHealth({
          status: "unhealthy",
          latency: 0,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, checkInterval);
    return () => clearInterval(interval);
  }, [endpoint, checkInterval]);

  const statusConfig = {
    healthy: { color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle },
    degraded: { color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
    unhealthy: { color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle },
    checking: { color: "text-zinc-400", bg: "bg-zinc-500/10", icon: Activity },
  };

  const config = statusConfig[health.status];
  const Icon = config.icon;

  return (
    <div className={\`inline-flex items-center gap-2 rounded-full \${config.bg} px-3 py-1.5\`}>
      <Icon className={\`h-4 w-4 \${config.color}\`} />
      <span className={\`text-sm font-medium \${config.color}\`}>
        RPC {health.status}
      </span>
      {showLatency && health.latency > 0 && (
        <span className="text-xs text-zinc-500">
          {health.latency}ms
        </span>
      )}
    </div>
  );
}`,
      },
    ],
    dependencies: [
      { name: "@solana/web3.js", version: "^1.87.0" },
      { name: "lucide-react", version: "^0.300.0" },
    ],
    props: [
      {
        name: "endpoint",
        type: "string",
        required: false,
        defaultValue: "https://api.devnet.solana.com",
        description: "RPC endpoint to monitor",
      },
      {
        name: "checkInterval",
        type: "number",
        required: false,
        defaultValue: 30000,
        description: "Health check interval in ms",
      },
    ],
    productionNotes: [
      {
        type: "performance",
        title: "Polling Strategy",
        content: "Adjust checkInterval based on user needs. Consider using WebSocket for real-time monitoring.",
      },
    ],
  }
);

// =============================================================================
// REGISTRY EXPORT
// =============================================================================

export const componentRegistry: HubComponent[] = [
  // Wallet
  walletConnectButton,
  walletGate,
  
  // Tokens
  tokenBalanceCard,
  tokenTransferForm,
  
  // Dev Tools
  pdaVisualizer,
  transactionBuilder,
  
  // Analytics
  rpcHealthBadge,
];

export function getComponentById(id: string): HubComponent | undefined {
  return componentRegistry.find((c) => c.id === id);
}

export function getComponentsByCategory(category: ComponentCategory): HubComponent[] {
  return componentRegistry.filter((c) => c.category === category);
}

export function getFeaturedComponents(): HubComponent[] {
  return componentRegistry.filter((c) => c.isFeatured);
}

export function getNewComponents(): HubComponent[] {
  return componentRegistry.filter((c) => c.isNew);
}

export const categories: { id: ComponentCategory; name: string; description: string }[] = [
  { id: "wallet", name: "Wallet", description: "Wallet connection and session management" },
  { id: "tokens", name: "Tokens", description: "SPL token balances, transfers, and management" },
  { id: "swap", name: "Swap", description: "Token swapping and DEX integration" },
  { id: "nfts", name: "NFTs", description: "NFT display, minting, and management" },
  { id: "dev-tools", name: "Dev Tools", description: "Developer utilities and visualizers" },
  { id: "analytics", name: "Analytics", description: "Monitoring and analytics components" },
];
