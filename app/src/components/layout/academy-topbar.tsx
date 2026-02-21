"use client";

import { useMemo } from "react";
import { Flame, Sparkles, Wallet, Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/lib/i18n/navigation";
import { useStreak } from "@/lib/hooks/use-streak";
import { useXP } from "@/lib/hooks/use-xp";
import { LanguageSelector } from "./language-selector";

function pageLabel(pathname: string, t: ReturnType<typeof useTranslations>): string {
  if (pathname.includes("/courses")) return t("courses");
  if (pathname.includes("/playground")) return t("playground");
  if (pathname.includes("/devlab")) return t("devlab");
  if (pathname.includes("/leaderboard")) return t("leaderboard");
  if (pathname.includes("/settings")) return t("settings");
  if (pathname.includes("/profile")) return t("profile");
  if (pathname.includes("/dashboard")) return t("dashboard");
  if (pathname.includes("/components")) return t("components");
  return t("home");
}

export function AcademyTopBar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const { data: session } = useSession();
  const { streak } = useStreak();
  const { level } = useXP();

  const title = useMemo(() => pageLabel(pathname, t), [pathname, t]);
  const wallet = session?.user?.walletAddress;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-2xl md:px-8">
      <h2 className="text-xl font-semibold capitalize tracking-wide text-foreground md:text-2xl">
        {title}
      </h2>

      <div className="hidden items-center gap-3 md:flex">
        <LanguageSelector />
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>
              {streak.currentStreak} {tc("days")}
            </span>
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-solana-purple" />
            <span>
              {tc("level")} {level}
            </span>
          </div>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Wallet className="h-4 w-4" />
          {wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : tc("connectWallet")}
        </Link>
      </div>
    </header>
  );
}
