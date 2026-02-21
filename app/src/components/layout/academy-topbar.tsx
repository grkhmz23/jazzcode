"use client";

import { useMemo } from "react";
import { Flame, Sparkles, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/lib/i18n/navigation";
import { useStreak } from "@/lib/hooks/use-streak";
import { useXP } from "@/lib/hooks/use-xp";

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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#05070D]/85 px-5 backdrop-blur-2xl md:px-8">
      <h2 className="text-xl font-semibold capitalize tracking-wide text-white md:text-2xl">
        {title}
      </h2>

      <div className="hidden items-center gap-4 md:flex">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0F1322] px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>
              {streak.currentStreak} {tc("days")}
            </span>
          </div>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>
              {tc("level")} {level}
            </span>
          </div>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-200"
        >
          <Wallet className="h-4 w-4" />
          {wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : tc("connectWallet")}
        </Link>
      </div>
    </header>
  );
}
