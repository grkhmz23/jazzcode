"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { localeOptions } from "@/lib/i18n/locales";
import type { Locale } from "@/lib/i18n/routing";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlassCard, LuxuryBadge } from "@/components/luxury/primitives";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
import { toast } from "sonner";

interface SettingsData {
  username: string;
  displayName: string;
  bio: string;
  linkedProviders: string[];
  linkedWallets: string[];
  preferredLocale: string;
  theme: string;
  isPublic: boolean;
}

function SettingsContent() {
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
      toast.success(t("saved"));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save";
      setError(message);
      toast.error("Failed to save settings", { description: message });
    } finally {
      setIsSaving(false);
    }
  }, [username, displayName, bio, isPublic, t]);

  const handleLinkWallet = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) return;
    if (!session?.user?.id) {
      setError("Not authenticated");
      return;
    }

    setIsLinkingWallet(true);
    setError(null);

    try {
      const walletAddress = publicKey.toBase58();
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });
      if (!nonceResponse.ok) {
        throw new Error("Failed to get wallet link nonce");
      }
      const noncePayload = (await nonceResponse.json()) as { nonce: string };

      // Construct the message for linking
      const message = `Link wallet to Superteam Academy: ${session.user.id}:${noncePayload.nonce}`;

      // Sign the message
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);
      const signatureB58 = bs58.encode(signature);

      // Link wallet via the new endpoint
      const linkResponse = await fetch("/api/auth/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          signature: signatureB58,
          message: message,
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
      toast.success(t("saved"));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to link wallet";
      setError(message);
      toast.error("Failed to link wallet", { description: message });
    } finally {
      setIsLinkingWallet(false);
    }
  }, [connected, publicKey, session?.user?.id, signMessage, t]);

  const handleUnlinkWallet = useCallback(async () => {
    setIsLinkingWallet(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/link-wallet", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to unlink wallet");
      }

      // Refresh settings
      const refreshResponse = await fetch("/api/profile");
      if (refreshResponse.ok) {
        const data = (await refreshResponse.json()) as SettingsData;
        setSettings(data);
      }

      setSaveMessage(t("saved"));
      toast.success(t("saved"));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unlink wallet";
      setError(message);
      toast.error("Failed to unlink wallet", { description: message });
    } finally {
      setIsLinkingWallet(false);
    }
  }, [t]);

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
      const message = err instanceof Error ? err.message : "Export failed";
      setError(message);
      toast.error("Failed to export data", { description: message });
    }
  }, []);

  const switchLocale = useCallback(
    (locale: Locale) => {
      // Track language switch
      trackEvent("language_switch", "i18n", locale);
      router.replace(pathname, { locale });
    },
    [pathname, router]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="academy-fade-up container max-w-4xl py-8 md:py-10">
      <GlassCard className="mb-8 p-6 md:p-8" glowColor="purple">
        <LuxuryBadge color="purple">{t("title")}</LuxuryBadge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{t("title")}</h1>
      </GlassCard>

      {/* Status Messages */}
      {saveMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <Check className="h-4 w-4 text-emerald-300" />
          <span className="text-sm text-emerald-200">{saveMessage}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-300" />
          <span className="text-sm text-red-200">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              {t("profileSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("username")}</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("usernamePlaceholder")} className="border-white/10 bg-[#05070D]/70 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("displayName")}</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t("displayNamePlaceholder")} className="border-white/10 bg-[#05070D]/70 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("bio")}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-[#05070D]/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
                placeholder={t("bioPlaceholder")}
                maxLength={280}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} variant="ghost" className="border border-purple-500/30 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {tc("save")}
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10">G</div>
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-slate-500">
                    {settings?.linkedProviders.includes("google") ? t("linked") : t("notLinked")}
                  </p>
                </div>
              </div>
              {settings?.linkedProviders.includes("google") ? (
                <Badge variant="success">{t("linked")}</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="border border-white/10 text-slate-300 hover:bg-white/5">{t("linkGoogle")}</Button>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* GitHub */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10">GH</div>
                <div>
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-xs text-slate-500">
                    {settings?.linkedProviders.includes("github") ? t("linked") : t("notLinked")}
                  </p>
                </div>
              </div>
              {settings?.linkedProviders.includes("github") ? (
                <Badge variant="success">{t("linked")}</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="border border-white/10 text-slate-300 hover:bg-white/5">{t("linkGitHub")}</Button>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Wallets */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("solanaWallet")}</p>
                    <p className="text-xs text-slate-500">
                      {settings?.linkedWallets && settings.linkedWallets.length > 0
                        ? `${settings.linkedWallets[0].slice(0, 6)}...${settings.linkedWallets[0].slice(-4)}`
                        : t("walletLinkDesc")}
                    </p>
                  </div>
                </div>
                {settings?.linkedWallets && settings.linkedWallets.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUnlinkWallet}
                    disabled={isLinkingWallet}
                    className="border border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    {isLinkingWallet ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                    {t("unlink")}
                  </Button>
                ) : connected ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLinkWallet}
                    disabled={isLinkingWallet}
                    className="border border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    {isLinkingWallet ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                    {t("linkWallet")}
                  </Button>
                ) : (
                  <Badge variant="secondary" className="bg-slate-500/20 text-slate-300">{t("notLinked")}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              {t("preferencesSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">{t("language")}</label>
              <div className="flex flex-wrap gap-2">
                {localeOptions.map((loc) => (
                  <Button
                    key={loc.code}
                    variant="ghost"
                    size="sm"
                    onClick={() => switchLocale(loc.code)}
                    className="gap-1 border border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    {loc.flag} {loc.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Theme */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">{t("theme")}</label>
              <div className="flex gap-2">
                {[
                  { value: "dark", label: t("themeDark"), icon: Moon },
                  { value: "light", label: t("themeLight"), icon: Sun },
                  { value: "system", label: t("themeSystem"), icon: Monitor },
                ].map((th) => (
                  <Button
                    key={th.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(th.value)}
                    className={
                      currentTheme === th.value
                        ? "gap-1 border border-purple-500/40 bg-purple-500/20 text-purple-200"
                        : "gap-1 border border-white/10 text-slate-300 hover:bg-white/5"
                    }
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
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
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
                <p className="text-xs text-slate-500">
                  {isPublic ? t("publicDesc") : t("privateDesc")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPublic(!isPublic)}
                className="border border-white/10 text-slate-300 hover:bg-white/5"
              >
                {isPublic ? t("publicProfile") : t("privateProfile")}
              </Button>
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("exportData")}</p>
                <p className="text-xs text-slate-500">{t("exportDesc")}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleExportData} className="gap-1 border border-white/10 text-slate-300 hover:bg-white/5">
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

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
