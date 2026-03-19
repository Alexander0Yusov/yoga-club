import { Config } from "next-i18n-router/dist/types";

export const i18nConfig: Config = {
  defaultLocale: "uk",
  locales: ["uk", "ru", "en", "de"],
};

export type LocaleT = (typeof i18nConfig)["locales"][number];
