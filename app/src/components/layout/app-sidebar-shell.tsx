"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  BookOpen,
  Code2,
  Compass,
  LayoutDashboard,
  Medal,
  Settings,
  UserCog,
} from "lucide-react";

export function AppSidebarShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home"), icon: <Compass className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { href: "/dashboard", label: t("dashboard"), icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { href: "/courses", label: t("courses"), icon: <BookOpen className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { href: "/playground", label: t("playground"), icon: <Code2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { href: "/leaderboard", label: t("leaderboard"), icon: <Medal className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { href: "/settings", label: tc("settings"), icon: <Settings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  ];

  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
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
                    "rounded-md px-2",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-neutral-200 dark:bg-neutral-700"
                      : "hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70"
                  )}
                />
              ))}
            </div>
          </div>
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
                <UserCog className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
