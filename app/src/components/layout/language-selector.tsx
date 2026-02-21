"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { localeOptions } from "@/lib/i18n/locales";
import type { Locale } from "@/lib/i18n/routing";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSelector({ 
  variant = "default",
  align = "right" 
}: { 
  variant?: "default" | "minimal" | "mobile";
  align?: "left" | "right";
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (nextLocale: Locale) => {
    setIsOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  const currentLocale = localeOptions.find((opt) => opt.code === locale);

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2 rounded-md border px-2 py-1">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <select
          aria-label={t("language")}
          className="w-full bg-transparent text-sm outline-none"
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        >
          {localeOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.flag} {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-1 rounded-md border px-2 py-1">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          aria-label={t("language")}
          className="bg-transparent text-xs outline-none"
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        >
          {localeOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.flag} {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm",
          "transition-colors hover:bg-accent hover:text-accent-foreground",
          isOpen && "bg-accent"
        )}
        aria-label={t("language")}
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline">{currentLocale?.flag}</span>
        <span className="max-w-[100px] truncate hidden md:inline">{currentLocale?.label}</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            {t("selectLanguage")}
          </div>
          {localeOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => handleLocaleChange(option.code)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                "transition-colors hover:bg-accent",
                locale === option.code && "bg-accent font-medium"
              )}
              dir={option.dir}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{option.flag}</span>
                <span>{option.label}</span>
              </span>
              {locale === option.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
