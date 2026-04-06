import uk from "../../messages/uk.json";
import ru from "../../messages/ru.json";
import en from "../../messages/en.json";
import de from "../../messages/de.json";

const dictionaries = {
  uk,
  ru,
  en,
  de,
} as const;

export type SupportedLocale = keyof typeof dictionaries;
export type LocaleLike = SupportedLocale;
export type MessageKey = keyof (typeof dictionaries)["uk"];
export type MessageFunctions = {
  [Key in MessageKey]: () => string;
};
export const supportedLocales = ["uk", "ru", "en", "de"] as const;

const messageKeys = Object.keys(dictionaries.uk) as MessageKey[];
const cachedMessages = new Map<SupportedLocale, MessageFunctions>();

function normalizeLocale(locale: string | undefined): SupportedLocale {
  if (locale === "en" || locale === "de" || locale === "uk" || locale === "ru") {
    return locale;
  }

  return "uk";
}

export function getMessages(locale: LocaleLike | string | undefined): MessageFunctions {
  const resolvedLocale = normalizeLocale(locale);
  const cached = cachedMessages.get(resolvedLocale);

  if (cached) {
    return cached;
  }

  const dictionary = dictionaries[resolvedLocale];
  const messages = Object.fromEntries(
    messageKeys.map((key) => [key, () => dictionary[key]]),
  ) as MessageFunctions;

  cachedMessages.set(resolvedLocale, messages);
  return messages;
}

export function getMessage(
  locale: LocaleLike | string | undefined,
  key: MessageKey,
): string {
  return getMessages(locale)[key]();
}

export function getLocaleMessageKeys(): MessageKey[] {
  return [...messageKeys];
}

function makeMessageFunction<Key extends MessageKey>(key: Key) {
  return (locale?: LocaleLike | string | undefined) => getMessage(locale, key);
}

export const nav_home = makeMessageFunction("nav_home");
export const nav_about = makeMessageFunction("nav_about");
export const nav_practices = makeMessageFunction("nav_practices");
export const nav_schedule = makeMessageFunction("nav_schedule");
export const nav_contacts = makeMessageFunction("nav_contacts");
export const btn_submit = makeMessageFunction("btn_submit");
export const btn_join = makeMessageFunction("btn_join");
export const btn_read_more = makeMessageFunction("btn_read_more");
export const btn_close = makeMessageFunction("btn_close");
export const btn_cancel = makeMessageFunction("btn_cancel");
export const btn_book_now = makeMessageFunction("btn_book_now");
export const btn_sign_in = makeMessageFunction("btn_sign_in");
export const btn_profile = makeMessageFunction("btn_profile");
export const btn_sign_out = makeMessageFunction("btn_sign_out");
export const form_name = makeMessageFunction("form_name");
export const form_name_placeholder = makeMessageFunction("form_name_placeholder");
export const form_email = makeMessageFunction("form_email");
export const form_email_placeholder = makeMessageFunction("form_email_placeholder");
export const form_phone = makeMessageFunction("form_phone");
export const form_phone_placeholder = makeMessageFunction("form_phone_placeholder");
export const form_comments = makeMessageFunction("form_comments");
export const form_comments_placeholder = makeMessageFunction("form_comments_placeholder");
export const form_agreement = makeMessageFunction("form_agreement");
export const footer_nav_title = makeMessageFunction("footer_nav_title");
export const footer_contacts_title = makeMessageFunction("footer_contacts_title");
export const footer_socials_title = makeMessageFunction("footer_socials_title");
export const footer_rights = makeMessageFunction("footer_rights");
export const error_required = makeMessageFunction("error_required");
export const error_invalid_email = makeMessageFunction("error_invalid_email");
export const error_invalid_phone = makeMessageFunction("error_invalid_phone");
export const error_min_length = makeMessageFunction("error_min_length");
export const error_max_length = makeMessageFunction("error_max_length");
export const error_phone_must_start_plus = makeMessageFunction("error_phone_must_start_plus");
export const error_digits_only = makeMessageFunction("error_digits_only");
