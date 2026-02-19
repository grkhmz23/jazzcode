"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { Wallet, Copy, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import bs58 from "bs58";
import { createWalletSignInMessage } from "@/lib/auth/wallet-message";

export function WalletButton() {
  const tc = useTranslations("common");
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const { status } = useSession();
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const attemptedAddressRef = useRef<string | null>(null);

  const authenticateWallet = useCallback(async () => {
    if (!connected || !publicKey) return;
    const address = publicKey.toBase58();

    if (!signMessage) {
      toast.error("Wallet does not support message signing", {
        description: "Use Phantom, Solflare, or Backpack to continue.",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!nonceResponse.ok) {
        throw new Error("Could not start wallet authentication.");
      }

      const noncePayload = (await nonceResponse.json()) as { nonce: string };
      const message = createWalletSignInMessage(noncePayload.nonce);
      const signature = await signMessage(new TextEncoder().encode(message));

      trackEvent("sign_in", "auth", "solana-wallet");

      const result = await signIn("solana-wallet", {
        address,
        signature: bs58.encode(signature),
        nonce: noncePayload.nonce,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(result?.error ?? "Wallet sign-in failed.");
      }

      window.location.href = result.url ?? "/dashboard";
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Please try again.";
      toast.error("Wallet sign-in failed", { description });
      attemptedAddressRef.current = null;
    } finally {
      setIsSigningIn(false);
    }
  }, [connected, publicKey, signMessage]);

  useEffect(() => {
    if (connected && publicKey && !hasTracked) {
      trackEvent("wallet_connect", "auth");
      setHasTracked(true);
    }
    if (!connected) {
      setHasTracked(false);
      attemptedAddressRef.current = null;
    }
  }, [connected, publicKey, hasTracked]);

  useEffect(() => {
    if (!connected || !publicKey) return;
    if (status !== "unauthenticated") return;
    const address = publicKey.toBase58();
    if (attemptedAddressRef.current === address) return;

    attemptedAddressRef.current = address;
    void authenticateWallet();
  }, [connected, publicKey, status, authenticateWallet]);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowActions(false);
      toast.success("Wallet disconnected");
    } catch {
      toast.error("Failed to disconnect wallet");
    }
  };

  const handleCopyAddress = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied to clipboard");
    } catch {
      toast.error("Could not copy wallet address");
    }
  };

  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected || !publicKey) {
    return (
      <Button variant="outline" size="sm" onClick={handleConnect}>
        <Wallet className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">{tc("connectWallet")}</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    );
  }

  const address = publicKey.toBase58();
  const displayAddress = formatAddress(address);

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
        {status !== "authenticated" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void authenticateWallet()}
            className="text-xs"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Wallet className="mr-1 h-3 w-3" />
            )}
            {isSigningIn ? "Signing..." : "Verify"}
          </Button>
        )}
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

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowActions(true)}
      className="gap-2"
      disabled={isSigningIn}
    >
      {isSigningIn ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      <span className="hidden md:inline">{displayAddress}</span>
      <span className="md:hidden">{displayAddress.slice(0, 4)}...</span>
    </Button>
  );
}
