"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { AcademyTopBar } from "@/components/layout/academy-topbar";
import { LanguageSelector } from "@/components/layout/language-selector";
import {
  BookOpen,
  Code2,
  Compass,
  LayoutDashboard,
  Medal,
  Settings,
  UserCog,
  BrainCircuit,
  User,
} from "lucide-react";

export function AppSidebarShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home"), icon: <Compass className="h-5 w-5 flex-shrink-0 text-muted-foreground" /> },
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/courses",
      label: t("courses"),
      icon: <BookOpen className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/playground",
      label: t("playground"),
      icon: <Code2 className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/devlab",
      label: t("devlab"),
      icon: <BrainCircuit className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/leaderboard",
      label: t("leaderboard"),
      icon: <Medal className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/profile",
      label: t("profile"),
      icon: <User className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
    {
      href: "/settings",
      label: tc("settings"),
      icon: <Settings className="h-5 w-5 flex-shrink-0 text-muted-foreground" />,
    },
  ];

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 right-0 top-0 h-[400px] bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute -left-[15%] bottom-[-30%] h-[50%] w-[50%] rounded-full bg-indigo-500/10 blur-[150px] dark:bg-indigo-900/20" />
        <div className="absolute -right-[10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-amber-500/10 blur-[150px] dark:bg-amber-900/10" />
      </div>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="z-20 justify-between gap-10 border-r border-border bg-card/80 backdrop-blur-2xl">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Link href="/" className="flex items-center gap-2 py-1">
              <Image
                src="/jazzcode-logo.png"
                alt={tc("appName")}
                width={132}
                height={24}
                className="h-6 w-auto flex-shrink-0"
              />
            </Link>
            <div className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  link={item}
                  className={cn(
                    "rounded-xl px-3 py-2",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl border border-border bg-muted/50 px-3 py-2">
              <LanguageSelector variant="minimal" />
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-transparent p-4">
              <SidebarLink
                link={{
                  label: session?.user?.name ?? tc("signIn"),
                  href: session?.user ? "/profile" : "/auth/signin",
                  icon: session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                      alt={session.user.name ?? "User"}
                    />
                  ) : (
                    <UserCog className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  ),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <AcademyTopBar />
        <div className="academy-scrollbar min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-0">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 p-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 6).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] uppercase tracking-widest",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
