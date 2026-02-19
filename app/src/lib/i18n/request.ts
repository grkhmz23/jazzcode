import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { locales, defaultLocale, type Locale } from "./routing";

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale;

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch {
    messages = (await import("@/messages/en.json")).default as AbstractIntlMessages;
  }

  return {
    locale,
    messages,
  };
});

export { locales, defaultLocale, type Locale };
