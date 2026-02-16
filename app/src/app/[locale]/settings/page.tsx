"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Wallet,
  Globe,
  Sun,
  Moon,
  Monitor,
  Download,
  Link2,
  Check,
  Loader2,
  AlertCircle,
  Shield,
} from "lucide-react";
import bs58 from "bs58";

interface SettingsData {
  username: string;
  displayName: string;
  bio: string;
  linkedProviders: string[];
  linkedWallets: Array<{ address: string; isPrimary: boolean }>;
  preferredLocale: string;
  theme: string;
  isPublic: boolean;
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const { publicKey, signMessage, connected } = useWallet();
  const { theme: currentTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLinkingWallet, setIsLinkingWallet] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = (await response.json()) as SettingsData;
          setSettings(data);
          setUsername(data.username ?? "");
          setDisplayName(data.displayName ?? "");
          setBio(data.bio ?? "");
          setIsPublic(data.isPublic ?? true);
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    void fetchSettings();
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, bio, isPublic }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }

      setSaveMessage(t("saved"));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [username, displayName, bio, isPublic, t]);

  const handleLinkWallet = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) return;

    setIsLinkingWallet(true);
    setError(null);

    try {
      // 1. Get nonce
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });

      if (!nonceResponse.ok) throw new Error("Failed to get nonce");
      const nonceData = (await nonceResponse.json()) as { nonce: string; message: string };

      // 2. Sign message
      const messageBytes = new TextEncoder().encode(nonceData.message);
      const signature = await signMessage(messageBytes);
      const signatureB58 = bs58.encode(signature);

      // 3. Link wallet
      const linkResponse = await fetch("/api/auth/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          signature: signatureB58,
          nonce: nonceData.nonce,
        }),
      });

      if (!linkResponse.ok) {
        const data = (await linkResponse.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to link wallet");
      }

      // Refresh settings
      const refreshResponse = await fetch("/api/profile");
      if (refreshResponse.ok) {
        const data = (await refreshResponse.json()) as SettingsData;
        setSettings(data);
      }

      setSaveMessage(t("saved"));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link wallet");
    } finally {
      setIsLinkingWallet(false);
    }
  }, [connected, publicKey, signMessage, t]);

  const handleExportData = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/export");
      if (!response.ok) throw new Error("Export failed");
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "superteam-academy-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  }, []);

  const switchLocale = useCallback(
    (locale: "en" | "pt-BR" | "es") => {
      router.replace(pathname, { locale });
    },
    [pathname, router]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>

      {/* Status Messages */}
      {saveMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-solana-green/30 bg-solana-green/10 p-3">
          <Check className="h-4 w-4 text-solana-green" />
          <span className="text-sm text-solana-green">{saveMessage}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              {t("profileSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">{t("username")}</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("displayName")}</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("bio")}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Tell us about yourself..."
                maxLength={280}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} variant="solana">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {tc("save")}
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4" />
              {t("connectedAccounts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border">G</div>
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-muted-foreground">
                    {settings?.linkedProviders.includes("google") ? t("linked") : t("notLinked")}
                  </p>
                </div>
              </div>
              {settings?.linkedProviders.includes("google") ? (
                <Badge variant="success">{t("linked")}</Badge>
              ) : (
                <Button variant="outline" size="sm">{t("linkGoogle")}</Button>
              )}
            </div>

            <Separator />

            {/* GitHub */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border">GH</div>
                <div>
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-xs text-muted-foreground">
                    {settings?.linkedProviders.includes("github") ? t("linked") : t("notLinked")}
                  </p>
                </div>
              </div>
              {settings?.linkedProviders.includes("github") ? (
                <Badge variant="success">{t("linked")}</Badge>
              ) : (
                <Button variant="outline" size="sm">{t("linkGitHub")}</Button>
              )}
            </div>

            <Separator />

            {/* Wallets */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Solana Wallet</p>
                    <p className="text-xs text-muted-foreground">{t("walletLinkDesc")}</p>
                  </div>
                </div>
                {connected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLinkWallet}
                    disabled={isLinkingWallet}
                  >
                    {isLinkingWallet ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                    {t("linkWallet")}
                  </Button>
                )}
              </div>
              {settings?.linkedWallets && settings.linkedWallets.length > 0 && (
                <div className="mt-3 space-y-2 pl-12">
                  {settings.linkedWallets.map((w) => (
                    <div key={w.address} className="flex items-center gap-2 text-sm">
                      <code className="rounded bg-muted px-2 py-0.5 text-xs">
                        {w.address.slice(0, 6)}...{w.address.slice(-4)}
                      </code>
                      {w.isPrimary && <Badge variant="outline" className="text-[10px]">{t("primary")}</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              {t("preferencesSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium">{t("language")}</label>
              <div className="flex gap-2">
                {[
                  { code: "en" as const, label: "English", flag: "🇺🇸" },
                  { code: "pt-BR" as const, label: "Português", flag: "🇧🇷" },
                  { code: "es" as const, label: "Español", flag: "🇪🇸" },
                ].map((loc) => (
                  <Button
                    key={loc.code}
                    variant="outline"
                    size="sm"
                    onClick={() => switchLocale(loc.code)}
                    className="gap-1"
                  >
                    {loc.flag} {loc.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Theme */}
            <div>
              <label className="mb-2 block text-sm font-medium">{t("theme")}</label>
              <div className="flex gap-2">
                {[
                  { value: "dark", label: t("themeDark"), icon: Moon },
                  { value: "light", label: t("themeLight"), icon: Sun },
                  { value: "system", label: t("themeSystem"), icon: Monitor },
                ].map((th) => (
                  <Button
                    key={th.value}
                    variant={currentTheme === th.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(th.value)}
                    className="gap-1"
                  >
                    <th.icon className="h-3.5 w-3.5" />
                    {th.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              {t("privacySection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("profileVisibility")}</p>
                <p className="text-xs text-muted-foreground">
                  {isPublic ? t("publicDesc") : t("privateDesc")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPublic(!isPublic)}
              >
                {isPublic ? t("publicProfile") : t("privateProfile")}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("exportData")}</p>
                <p className="text-xs text-muted-foreground">{t("exportDesc")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData} className="gap-1">
                <Download className="h-3.5 w-3.5" />
                {t("exportData")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
