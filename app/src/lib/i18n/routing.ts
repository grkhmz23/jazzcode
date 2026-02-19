export const locales = ["en", "es", "pt-BR", "fr", "it", "de", "zh-CN", "ar"] as const;
export const defaultLocale = "en" as const;
export const localePrefix = "as-needed" as const;
export type Locale = (typeof locales)[number];
