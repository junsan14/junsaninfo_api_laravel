import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ja"],

  defaultLocale: "ja",

  localeDetection: false,

  // ja は /ja を付けない
  // en は /en を付ける
  localePrefix: "as-needed",
});