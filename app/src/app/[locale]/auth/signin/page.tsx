"use client";

import { useState, useCallback, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { Zap, Loader2, AlertCircle, Wallet } from "lucide-react";
import bs58 from "bs58";
import type { ClientSafeProvider } from "next-auth/react";
import { toast } from "sonner";
import { createWalletSignInMessage } from "@/lib/auth/wallet-message";

export default function SignInPage() {
  const t = useTranslations("auth");
  const { publicKey, signMessage, connected, connecting } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<
    Record<string, ClientSafeProvider> | null
  >(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const availableProviders = await getProviders();
      setProviders(availableProviders);
    };
    void fetchProviders();
  }, []);

  const handleOAuthSignIn = useCallback((provider: string) => {
    trackEvent("sign_in", "auth", provider);
    void signIn(provider, { callbackUrl: "/dashboard" });
  }, []);

  const handleWalletSignIn = useCallback(async () => {
    if (!connected || !publicKey) {
      setWalletModalVisible(true);
      return;
    }

    if (!signMessage) {
      const message = "This wallet does not support message signing.";
      setError(message);
      toast.error("Wallet sign-in unavailable", { description: message });
      return;
    }

    setIsSigningIn(true);
    setError(null);

    try {
      const address = publicKey.toBase58();

      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!nonceResponse.ok) {
        throw new Error("Failed to get authentication nonce");
      }

      const nonceData = (await nonceResponse.json()) as { nonce: string };

      const messageToSign = createWalletSignInMessage(nonceData.nonce);
      const messageBytes = new TextEncoder().encode(messageToSign);
      const signature = await signMessage(messageBytes);
      const signatureB58 = bs58.encode(signature);

      trackEvent("sign_in", "auth", "solana-wallet");

      const result = await signIn("solana-wallet", {
        address,
        signature: signatureB58,
        nonce: nonceData.nonce,
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
      toast.error("Wallet sign-in failed", { description: message });
    } finally {
      setIsSigningIn(false);
    }
  }, [connected, publicKey, signMessage, setWalletModalVisible]);

  const hasGitHub = providers?.github !== undefined;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-solana">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("signInSubtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {connected ? (
            <Button
              variant="solana"
              className="h-11 w-full gap-2"
              onClick={handleWalletSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {isSigningIn ? t("signing") : t("signWithWallet")}
            </Button>
          ) : (
            <Button
              variant="solana"
              className="h-11 w-full gap-2"
              onClick={() => setWalletModalVisible(true)}
              disabled={connecting}
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {t("connectWallet")}
            </Button>
          )}

          {connected && publicKey && (
            <p className="text-center text-xs text-muted-foreground">
              Connected: {publicKey.toBase58().slice(0, 6)}...
              {publicKey.toBase58().slice(-4)}
            </p>
          )}

          {hasGitHub && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-11 w-full gap-2"
                onClick={() => handleOAuthSignIn("github")}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("continueWithGitHub")}
              </Button>
            </>
          )}

          <p className="pt-4 text-center text-xs text-muted-foreground">
            {t("termsPrefix")}{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              {t("termsOfService")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
