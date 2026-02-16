import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "pt-BR", "es"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
