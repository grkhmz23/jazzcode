import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale, localePrefix } from "./routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
});
