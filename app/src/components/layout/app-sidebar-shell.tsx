"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { AcademyTopBar } from "@/components/layout/academy-topbar";
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
    { href: "/", label: t("home"), icon: <Compass className="h-5 w-5 flex-shrink-0 text-slate-500" /> },
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/courses",
      label: t("courses"),
      icon: <BookOpen className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/playground",
      label: t("playground"),
      icon: <Code2 className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/devlab",
      label: t("devlab"),
      icon: <BrainCircuit className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/leaderboard",
      label: t("leaderboard"),
      icon: <Medal className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/profile",
      label: t("profile"),
      icon: <User className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      href: "/settings",
      label: tc("settings"),
      icon: <Settings className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
  ];

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#05070D] text-slate-300">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 right-0 top-0 h-[400px] bg-gradient-to-b from-purple-900/10 to-transparent" />
        <div className="absolute -left-[15%] bottom-[-30%] h-[50%] w-[50%] rounded-full bg-indigo-900/20 blur-[150px]" />
        <div className="absolute -right-[10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-amber-900/10 blur-[150px]" />
      </div>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="z-20 justify-between gap-10 border-r border-white/10 bg-[#0A0D18]/80 backdrop-blur-2xl">
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
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
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
                  <UserCog className="h-5 w-5 flex-shrink-0 text-slate-300" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <AcademyTopBar />
        <div className="academy-scrollbar min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-0">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#05070D]/90 p-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 6).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] uppercase tracking-widest",
                  active ? "text-amber-400" : "text-slate-500"
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
