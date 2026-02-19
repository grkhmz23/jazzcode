import type { Locale } from "./routing";

export interface LocaleOption {
  code: Locale;
  label: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const localeOptions: LocaleOption[] = [
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "it", label: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "zh-CN", label: "中文 (简体)", flag: "🇨🇳", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  const option = localeOptions.find((entry) => entry.code === locale);
  return option?.dir ?? "ltr";
}
