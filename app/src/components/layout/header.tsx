"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code2, Menu, X, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { WalletButton } from "@/components/auth/WalletButton";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const navItems = [
    { href: "/courses", label: t("courses") },
    { href: "/components", label: "Components" },
    { href: "/playground", label: "Playground" },
    { href: "/leaderboard", label: t("leaderboard") },
  ];

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-solana-purple" />
            <span className="font-bold">{tc("appName")}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <WalletButton />
            {isAuthenticated && session?.user ? (
              <div className="relative">
                {showUserMenu ? (
                  <div className="flex items-center gap-1">
                    <Link href="/profile">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <User className="h-4 w-4" />
                        {t("profile")}
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Settings className="h-4 w-4" />
                        {tc("settings")}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-red-500 hover:text-red-600"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      {tc("signOut")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowUserMenu(true)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name ?? "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                  </Button>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  {tc("signIn")}
                </Button>
              </Link>
            )}
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <WalletButton />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={session?.user?.image ?? undefined}
                      alt={session?.user?.name ?? "User"}
                    />
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {session?.user?.name}
                </Link>
                <Link
                  href="/settings"
                  className="block py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tc("settings")}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-500"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {tc("signOut")}
                </Button>
              </>
            ) : (
              <Link href="/auth/signin" className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  {tc("signIn")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
