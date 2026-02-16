import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/request";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SessionProvider } from "@/components/layout/session-provider";
import { WalletProvider } from "@/components/layout/wallet-provider";
import { AnalyticsProvider } from "@/lib/analytics/provider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: LocaleLayoutProps) {
  const t = await getTranslations({ locale, namespace: "common" });
  const appName = t("appName");
  const description = t("tagline");

  return {
    title: appName,
    description,
    openGraph: {
      title: appName,
      description,
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  if (!locales.includes(locale as Locale)) notFound();

  // Enable static rendering for next-intl
  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <SessionProvider>
            <WalletProvider>
              <NextIntlClientProvider messages={messages}>
                <AnalyticsProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <GoogleAnalytics />
                  <PostHogProvider />
                </AnalyticsProvider>
              </NextIntlClientProvider>
            </WalletProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
