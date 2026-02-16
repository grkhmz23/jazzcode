"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, LogOut } from "lucide-react";
import { useState } from "react";

export function WalletButton() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle connect button click - opens wallet modal
  const handleConnect = () => {
    setVisible(true);
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowActions(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // Copy wallet address to clipboard
  const handleCopyAddress = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  // Format wallet address for display (first 4...last 4)
  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Not connected state
  if (!connected || !publicKey) {
    return (
      <Button variant="outline" size="sm" onClick={handleConnect}>
        <Wallet className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    );
  }

  const address = publicKey.toBase58();
  const displayAddress = formatAddress(address);

  // Show action buttons when connected and toggled
  if (showActions) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyAddress}
          className="text-xs"
        >
          <Copy className="mr-1 h-3 w-3" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-xs text-red-500 hover:text-red-600"
        >
          <LogOut className="mr-1 h-3 w-3" />
          Disconnect
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowActions(false)}
          className="text-xs"
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Connected state - show address button
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowActions(true)}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      <span className="hidden md:inline">{displayAddress}</span>
      <span className="md:hidden">{displayAddress.slice(0, 4)}...</span>
    </Button>
  );
}
