import type { AboutMeContract } from "@/modules/about-me/contracts/about-me.contract";
import type { FeedbackContract } from "@/modules/feedback/contracts/feedback.contract";
import type { EventContract } from "@/modules/events/contracts/event.contract";
import type { SectionContract } from "@/modules/sections/contracts/section.contract";
import { getAccessTokenCookie } from "@/shared/auth/access-token-cookie";

const remoteContentBaseURL = "https://yoga-club-back.vercel.app/api";
const localContentBaseURL =
  process.env.NEXT_PUBLIC_CONTENT_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api"
    : remoteContentBaseURL);
const baseURL = localContentBaseURL;
const authBaseURL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:5005/api";
const defaultLocale = "en";
const supportedBackendLocales = ["uk", "ru", "en", "de"] as const;

type BackendLocale = (typeof supportedBackendLocales)[number];

function normalizeBackendLocale(locale?: string): BackendLocale {
  const value = (locale || defaultLocale).trim().toLowerCase();

  if (value === "ua") {
    return "uk";
  }

  if ((supportedBackendLocales as readonly string[]).includes(value)) {
    return value as BackendLocale;
  }

  return defaultLocale;
}

function withLangQuery(path: string, locale?: string): string {
  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);

  params.set("lang", normalizeBackendLocale(locale));

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  path: string;
  locale?: string;
  body?: unknown;
}

function buildHeaders(headers: HeadersInit | undefined, locale: string): Headers {
  const nextHeaders = new Headers(headers);
  const normalizedLocale = normalizeBackendLocale(locale);

  nextHeaders.set("Accept-Language", normalizedLocale);
  nextHeaders.set("x-client-lang", normalizedLocale);

  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
}

async function request<T>({
  path,
  locale = defaultLocale,
  headers,
  body,
  ...init
}: ApiClientOptions): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, {
    ...init,
    headers: buildHeaders(headers, locale),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as {
        error?: { message?: string };
      };

      if (errorBody?.error?.message) {
        errorMessage = errorBody.error.message;
      }
    } catch {
      // Ответ может быть пустым или не-JSON.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiClient<T>(options: ApiClientOptions): Promise<T> {
  return request<T>(options);
}

interface LocalApiClientOptions extends Omit<RequestInit, "body"> {
  path: string;
  locale?: string;
  body?: unknown;
}

interface SiteApiClientOptions extends Omit<RequestInit, "body"> {
  siteUrl: string;
  path: string;
  locale?: string;
  body?: unknown;
}

interface ContentApiClientOptions extends Omit<RequestInit, "body"> {
  path: string;
  locale?: string;
  body?: unknown;
  useAccessTokenCookie?: boolean;
}

interface AuthApiClientOptions extends Omit<RequestInit, "body"> {
  path: string;
  locale?: string;
  body?: unknown;
  useAccessTokenCookie?: boolean;
}

function buildLocalHeaders(
  headers: HeadersInit | undefined,
  locale: string,
  body: unknown
): Headers {
  const nextHeaders = new Headers(headers);
  const normalizedLocale = normalizeBackendLocale(locale);

  nextHeaders.set("Accept-Language", normalizedLocale);
  nextHeaders.set("x-client-lang", normalizedLocale);

  if (!(body instanceof FormData) && body !== undefined && !(nextHeaders.get("Content-Type") || "").length) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
}

async function readLocalJson<T>(
  response: Response,
  errorLabel: string
): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = `${errorLabel} failed with status ${response.status}`;

    if (errorText) {
      try {
        const errorBody = JSON.parse(errorText) as {
          error?: { message?: string };
          message?: string;
        };

        errorMessage =
          errorBody?.error?.message || errorBody?.message || errorText;
      } catch {
        errorMessage = errorText;
      }
    }

    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${errorLabel} returned invalid JSON`);
  }
}

async function localRequest<T>({
  path,
  locale = defaultLocale,
  headers,
  body,
  ...init
}: LocalApiClientOptions): Promise<T> {
  const hasBody = body !== undefined;
  const finalHeaders = buildLocalHeaders(headers, locale, body);
  const requestBody =
    body instanceof FormData
      ? body
      : hasBody
        ? JSON.stringify(body)
        : undefined;

  const response = await fetch(path, {
    ...init,
    headers: finalHeaders,
    body: requestBody,
  });

  return readLocalJson<T>(response, `Local API request to ${path}`);
}

async function siteRequest<T>({
  siteUrl,
  path,
  locale = defaultLocale,
  headers,
  body,
  ...init
}: SiteApiClientOptions): Promise<T> {
  const hasBody = body !== undefined;
  const finalHeaders = buildLocalHeaders(headers, locale, body);
  const requestBody =
    body instanceof FormData
      ? body
      : hasBody
        ? JSON.stringify(body)
        : undefined;

  const response = await fetch(new URL(withLangQuery(path, locale), siteUrl), {
    ...init,
    headers: finalHeaders,
    body: requestBody,
  });

  return readLocalJson<T>(response, `Site API request to ${path}`);
}

function buildContentHeaders(
  headers: HeadersInit | undefined,
  locale: string,
  body: unknown,
  useAccessTokenCookie: boolean
): Headers {
  const nextHeaders = buildLocalHeaders(headers, locale, body);

  if (useAccessTokenCookie) {
    const accessToken = getAccessTokenCookie();

    if (accessToken) {
      nextHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return nextHeaders;
}

async function contentRequest<T>({
  path,
  locale = defaultLocale,
  headers,
  body,
  useAccessTokenCookie = true,
  ...init
}: ContentApiClientOptions): Promise<T> {
  const hasBody = body !== undefined;
  const finalHeaders = buildContentHeaders(
    headers,
    locale,
    body,
    useAccessTokenCookie
  );
  const requestBody =
    body instanceof FormData
      ? body
      : hasBody
        ? JSON.stringify(body)
        : undefined;

  const response = await fetch(`${baseURL}${withLangQuery(path, locale)}`, {
    ...init,
    headers: finalHeaders,
    body: requestBody,
  });

  return readLocalJson<T>(response, `Content API request to ${path}`);
}

async function authRequest<T>({
  path,
  locale = defaultLocale,
  headers,
  body,
  useAccessTokenCookie = false,
  ...init
}: AuthApiClientOptions): Promise<T> {
  const hasBody = body !== undefined;
  const finalHeaders = buildLocalHeaders(headers, locale, body);
  const requestBody =
    body instanceof FormData
      ? body
      : hasBody
        ? JSON.stringify(body)
        : undefined;

  if (useAccessTokenCookie) {
    const accessToken = getAccessTokenCookie();

    if (accessToken) {
      finalHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${authBaseURL}${path}`, {
    ...init,
    credentials: "include",
    headers: finalHeaders,
    body: requestBody,
  });

  return readLocalJson<T>(response, `Auth API request to ${path}`);
}

export interface UpdateSectionInput {
  id: string;
  data: Record<string, unknown>;
  locale?: string;
}

export interface UpdateAboutPairInput {
  slug: string;
  data: Record<string, unknown>;
  locale?: string;
}

export interface UpdateEventInput {
  id: string;
  data: Record<string, unknown>;
  locale?: string;
}

export interface UpdateUserViewModeInput {
  id?: string;
  userEmail?: string;
  viewMode: "USER" | "ADMIN" | "SUPERADMIN";
  locale?: string;
}

export interface UpdateUserBlacklistInput {
  userEmail: string;
  isInBlacklist: boolean;
}

export interface FeedbackMutationInput {
  id: string;
  locale?: string;
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN";
}

export interface ToggleFeedbackVisibilityInput extends FeedbackMutationInput {
  isActive: boolean;
}

export interface SoftDeleteFeedbackInput extends FeedbackMutationInput {
  deletedAt?: string;
}

export interface RestoreFeedbackInput extends FeedbackMutationInput {}

export interface HardDeleteFeedbackInput extends FeedbackMutationInput {}

export interface EventMutationInput {
  id: string;
  locale?: string;
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN";
}

export interface ToggleEventVisibilityInput extends EventMutationInput {
  isActive: boolean;
}

export interface SoftDeleteEventInput extends EventMutationInput {
  deletedAt?: string;
}

export interface RestoreEventInput extends EventMutationInput {}

export interface HardDeleteEventInput extends EventMutationInput {}

export function updateSection<T = SectionContract>({
  id,
  data,
  locale,
}: UpdateSectionInput): Promise<T> {
  return contentRequest<T>({
    path: `/sections/${id}`,
    method: "PUT",
    locale,
    body: data,
  });
}

export function updateAboutPair<T = AboutMeContract>({
  slug,
  data,
  locale,
}: UpdateAboutPairInput): Promise<T> {
  return request<T>({
    path: `/about-me/${slug}`,
    method: "PATCH",
    locale,
    body: data,
  });
}

export function updateEvent<T = EventContract>({
  id,
  data,
  locale,
}: UpdateEventInput): Promise<T> {
  return request<T>({
    path: `/events/${id}`,
    method: "PATCH",
    locale,
    body: data,
  });
}

export function updateUserViewMode<T = unknown>({
  id,
  userEmail,
  viewMode,
  locale: _locale,
}: UpdateUserViewModeInput): Promise<T> {
  const payload: { userId?: string; userEmail?: string; viewMode: "USER" | "ADMIN" | "SUPERADMIN" } =
    { viewMode };

  if (id) {
    payload.userId = id;
  }

  if (userEmail) {
    payload.userEmail = userEmail;
  }

  return fetch("/api/usersAll", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Role update failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  });
}

export function updateUserBlacklist<T = unknown>({
  userEmail,
  isInBlacklist,
}: UpdateUserBlacklistInput): Promise<T> {
  return fetch("/api/usersAll", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail,
      isInBlacklist,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Blacklist update failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  });
}

export interface UpdateUserProfileInput {
  formData: FormData;
}

export interface BackendProfileUpdateResponse {
  name: string;
  imgUrl: string;
  telephone: string;
  isSubscribed: boolean;
}

export function updateUserProfile<T = unknown>({
  formData,
}: UpdateUserProfileInput): Promise<T> {
  return authRequest<T>({
    path: "/users/me",
    method: "PATCH",
    body: formData,
    useAccessTokenCookie: true,
  });
}

export interface UpdateUserLanguageInput {
  lang: string;
  locale?: string;
}

export function updateUserLanguagePreference<T = unknown>({
  lang,
  locale,
}: UpdateUserLanguageInput): Promise<T> {
  return authRequest<T>({
    path: "/users/me",
    method: "PATCH",
    locale,
    body: { lang },
    useAccessTokenCookie: true,
  });
}

export interface CreateUserAccountInput {
  email: string;
  password: string;
}

export function createUserAccount<T = unknown>({
  email,
  password,
}: CreateUserAccountInput): Promise<T> {
  return authRequest<T>({
    path: "/auth/register",
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export interface SignInAccountInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function signInAccount<T = unknown>({
  email,
  password,
  rememberMe = false,
}: SignInAccountInput): Promise<T> {
  return authRequest<T>({
    path: "/auth/login",
    method: "POST",
    body: {
      email,
      password,
      rememberMe,
    },
  });
}

export function signOutAccount<T = unknown>(): Promise<T> {
  return authRequest<T>({
    path: "/auth/logout",
    method: "POST",
  });
}

export interface GoogleLoginInput {
  idToken: string;
}

export function googleLogin<T = unknown>({
  idToken,
}: GoogleLoginInput): Promise<T> {
  return authRequest<T>({
    path: "/auth/google-login",
    method: "POST",
    body: {
      idToken,
    },
  });
}

export interface ConfirmRegistrationInput {
  code: string;
  locale?: string;
}

export function confirmRegistration<T = void>({
  code,
  locale,
}: ConfirmRegistrationInput): Promise<T> {
  return authRequest<T>({
    path: "/auth/registration-confirmation",
    method: "POST",
    locale,
    body: { code },
  });
}

export interface ApplyNewPasswordInput {
  recoveryCode: string;
  newPassword: string;
  locale?: string;
}

export function applyNewPassword<T = void>({
  recoveryCode,
  newPassword,
  locale,
}: ApplyNewPasswordInput): Promise<T> {
  return authRequest<T>({
    path: "/auth/new-password",
    method: "POST",
    locale,
    body: { recoveryCode, newPassword },
  });
}

export function softDelete<T = unknown>({
  path,
  locale,
}: {
  path: string;
  locale?: string;
}): Promise<T> {
  return request<T>({
    path,
    method: "PATCH",
    locale,
    body: {
      deletedAt: new Date().toISOString(),
    },
  });
}

export function softDeleteSection<T = unknown>(
  id: string,
  locale?: string
): Promise<T> {
  return softDelete<T>({ path: `/sections/${id}`, locale });
}

export function softDeleteAboutPair<T = unknown>(
  slug: string,
  locale?: string
): Promise<T> {
  return softDelete<T>({ path: `/about-me/${slug}`, locale });
}

export function softDeleteEvent<T = unknown>(
  id: string,
  locale?: string
): Promise<T> {
  return softDelete<T>({ path: `/events/${id}`, locale });
}

function buildFeedbackPath(
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN",
  showTrash?: boolean
): string {
  const params = new URLSearchParams();

  if (viewMode) {
    params.set("viewMode", viewMode);
  }

  if (showTrash) {
    params.set("showTrash", "1");
  }

  const query = params.toString();

  return query ? `/api/feedbacks?${query}` : "/api/feedbacks";
}

async function mutateLocalFeedback<T>({
  path,
  body,
}: {
  path: string;
  body: Record<string, unknown>;
}): Promise<T> {
  return fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Feedback update failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  });
}

export async function toggleFeedbackVisibility<T = FeedbackContract>({
  id,
  isActive,
  viewMode,
}: ToggleFeedbackVisibilityInput): Promise<T> {
  return mutateLocalFeedback<T>({
    path: buildFeedbackPath(viewMode),
    body: {
      action: "toggleVisibility",
      _id: id,
      isActive,
    },
  });
}

export async function softDeleteFeedback<T = FeedbackContract>({
  id,
  deletedAt,
  viewMode,
}: SoftDeleteFeedbackInput): Promise<T> {
  return mutateLocalFeedback<T>({
    path: buildFeedbackPath(viewMode),
    body: {
      action: "softDelete",
      _id: id,
      deletedAt,
    },
  });
}

export async function restoreFeedback<T = FeedbackContract>({
  id,
  viewMode,
}: RestoreFeedbackInput): Promise<T> {
  return mutateLocalFeedback<T>({
    path: buildFeedbackPath(viewMode),
    body: {
      action: "restore",
      _id: id,
    },
  });
}

export async function hardDeleteFeedback<T = FeedbackContract>({
  id,
  viewMode,
}: HardDeleteFeedbackInput): Promise<T> {
  return mutateLocalFeedback<T>({
    path: buildFeedbackPath(viewMode),
    body: {
      action: "hardDelete",
      _id: id,
    },
  });
}

export async function getFeedbacks<T = FeedbackContract[]>({
  viewMode,
  showTrash = false,
  locale,
}: {
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN";
  showTrash?: boolean;
  locale?: string;
} = {}): Promise<T> {
  return localRequest<T>({
    path: buildFeedbackPath(viewMode, showTrash),
    method: "GET",
    locale,
  });
}

export async function getPublicFeedbacks<T = FeedbackContract[]>({
  siteUrl,
  locale,
}: {
  siteUrl: string;
  locale?: string;
}): Promise<T> {
  return siteRequest<T>({
    siteUrl,
    path: "/api/feedbacks",
    method: "GET",
    locale,
  });
}

function buildEventsPath(
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN",
  showTrash?: boolean
): string {
  const params = new URLSearchParams();

  if (viewMode) {
    params.set("viewMode", viewMode);
  }

  if (showTrash) {
    params.set("showTrash", "true");
  }

  const query = params.toString();

  return query ? `/api/events?${query}` : "/api/events";
}

async function mutateLocalEvent<T>({
  path,
  body,
}: {
  path: string;
  body: Record<string, unknown>;
}): Promise<T> {
  return fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Event update failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  });
}

export async function toggleEventVisibility<T = EventContract>({
  id,
  isActive,
  viewMode,
}: ToggleEventVisibilityInput): Promise<T> {
  return mutateLocalEvent<T>({
    path: buildEventsPath(viewMode),
    body: {
      action: "toggleVisibility",
      _id: id,
      isActive,
    },
  });
}

export async function softDeleteEventLifecycle<T = EventContract>({
  id,
  deletedAt,
  viewMode,
}: SoftDeleteEventInput): Promise<T> {
  return mutateLocalEvent<T>({
    path: buildEventsPath(viewMode),
    body: {
      action: "softDelete",
      _id: id,
      deletedAt,
    },
  });
}

export async function restoreEventLifecycle<T = EventContract>({
  id,
  viewMode,
}: RestoreEventInput): Promise<T> {
  return mutateLocalEvent<T>({
    path: buildEventsPath(viewMode),
    body: {
      action: "restore",
      _id: id,
    },
  });
}

export async function hardDeleteEventLifecycle<T = EventContract>({
  id,
  viewMode,
}: HardDeleteEventInput): Promise<T> {
  return mutateLocalEvent<T>({
    path: buildEventsPath(viewMode),
    body: {
      action: "hardDelete",
      _id: id,
    },
  });
}

export interface SaveFeedbackInput {
  id?: string;
  comment: string;
  rating: number;
}

export async function saveFeedback<T = FeedbackContract>({
  id,
  comment,
  rating,
}: SaveFeedbackInput): Promise<T> {
  return localRequest<T>({
    path: id ? "/api/myfeedbacks" : "/api/feedbacks",
    method: id ? "PATCH" : "POST",
    body: {
      _id: id || "",
      comment,
      text: comment,
      rating,
    },
  });
}

export async function getMyFeedbacks<T = FeedbackContract[]>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return localRequest<T>({
    path: "/api/myfeedbacks",
    method: "GET",
    locale,
  });
}

export interface SaveEventInput {
  id?: string;
  title: string;
  timeTarget: string;
  endTimeTarget: string;
  description: string;
  picsArray: { value: string; alt?: string }[];
  defaultImg: number;
  instagramUrl?: string;
}

export async function saveEvent<T = EventContract>({
  id,
  title,
  timeTarget,
  endTimeTarget,
  description,
  picsArray,
  defaultImg,
  instagramUrl,
}: SaveEventInput): Promise<T> {
  return localRequest<T>({
    path: "/api/events",
    method: id ? "PATCH" : "POST",
    body: {
      id,
      title,
      timeTarget,
      endTimeTarget,
      description,
      picsArray,
      defaultImg,
      instagramUrl,
    },
  });
}

export async function deleteEvent<T = unknown>({
  id,
}: {
  id: string;
}): Promise<T> {
  return localRequest<T>({
    path: "/api/events",
    method: "DELETE",
    body: { id },
  });
}

export async function getEvents<T = EventContract[]>({
  viewMode,
  showTrash = false,
  locale,
}: {
  viewMode?: "USER" | "ADMIN" | "SUPERADMIN";
  showTrash?: boolean;
  locale?: string;
} = {}): Promise<T> {
  return localRequest<T>({
    path: buildEventsPath(viewMode, showTrash),
    method: "GET",
    locale,
  });
}

export async function getPublicEvents<T = EventContract[]>({
  siteUrl,
  locale,
}: {
  siteUrl: string;
  locale?: string;
}): Promise<T> {
  return siteRequest<T>({
    siteUrl,
    path: "/api/events?viewMode=USER",
    method: "GET",
    locale,
  });
}

export type LocalizedTextPayload = {
  ru?: string;
  en?: string;
  de?: string;
  uk?: string;
};

export type LocalizedTextValue = string | LocalizedTextPayload;

export interface HeroIntroRecord {
  id?: string;
  _id?: string;
  title: LocalizedTextValue;
  text1: LocalizedTextValue;
  text2: LocalizedTextValue;
  image?: {
    url: string;
    alt?: LocalizedTextValue;
    publicId?: string;
  };
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PracticeBenefitRecord {
  id?: string;
  _id?: string;
  text_1: LocalizedTextValue;
  text_2?: LocalizedTextValue;
  text_3?: LocalizedTextValue;
  text_4?: LocalizedTextValue;
  text_5?: LocalizedTextValue;
  text_6?: LocalizedTextValue;
  text_7?: LocalizedTextValue;
  text_8?: LocalizedTextValue;
  text_9?: LocalizedTextValue;
  text_10?: LocalizedTextValue;
  image?: {
    url: string;
    alt?: LocalizedTextValue;
    publicId?: string;
  };
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionRecord {
  id?: string;
  _id?: string;
  title: LocalizedTextValue;
  subtitle_1?: LocalizedTextValue;
  subtitle_2?: LocalizedTextValue;
  for: string;
  orderIndex: number;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function getHeroIntros<T = HeroIntroRecord[]>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return contentRequest<T>({
    path: "/hero-intro",
    method: "GET",
    locale,
    useAccessTokenCookie: false,
    cache: "no-store",
  });
}

export async function getPracticeBenefits<T = PracticeBenefitRecord[]>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return contentRequest<T>({
    path: "/practice-benefits",
    method: "GET",
    locale,
    useAccessTokenCookie: false,
    cache: "no-store",
  });
}

export async function getSections<T = SectionRecord[]>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return contentRequest<T>({
    path: "/sections",
    method: "GET",
    locale,
    useAccessTokenCookie: false,
    cache: "no-store",
  });
}

export interface SaveHeroIntroInput {
  id?: string;
  locale?: string;
  isActive: boolean;
  title: Record<string, string>;
  text1: Record<string, string>;
  text2: Record<string, string>;
  image?: File | null;
}

export async function saveHeroIntro<T = HeroIntroRecord>({
  id,
  locale,
  isActive,
  title,
  text1,
  text2,
  image,
}: SaveHeroIntroInput): Promise<T> {
  if (image) {
    const formData = new FormData();

    formData.append("title", JSON.stringify(title));
    formData.append("text1", JSON.stringify(text1));
    formData.append("text2", JSON.stringify(text2));
    formData.append("isActive", JSON.stringify(isActive));
    formData.append("image", image);

    return localRequest<T>({
      path: id ? `/api/hero-intro/${id}` : "/api/hero-intro",
      method: id ? "PUT" : "POST",
      locale,
      body: formData,
    });
  }

  return localRequest<T>({
    path: id ? `/api/hero-intro/${id}` : "/api/hero-intro",
    method: id ? "PUT" : "POST",
    locale,
    body: {
      title,
      text1,
      text2,
      isActive,
    },
  });
}

export interface SavePracticeBenefitInput {
  id?: string;
  locale?: string;
  isActive: boolean;
  text_1: LocalizedTextPayload;
  text_2?: LocalizedTextPayload;
  text_3?: LocalizedTextPayload;
  text_4?: LocalizedTextPayload;
  text_5?: LocalizedTextPayload;
  text_6?: LocalizedTextPayload;
  text_7?: LocalizedTextPayload;
  text_8?: LocalizedTextPayload;
  text_9?: LocalizedTextPayload;
  text_10?: LocalizedTextPayload;
  image?: File | null;
}

export async function savePracticeBenefit<T = PracticeBenefitRecord>({
  id,
  locale,
  isActive,
  text_1,
  text_2,
  text_3,
  text_4,
  text_5,
  text_6,
  text_7,
  text_8,
  text_9,
  text_10,
  image,
}: SavePracticeBenefitInput): Promise<T> {
  const formData = new FormData();

  formData.append("text_1", JSON.stringify(text_1));
  formData.append("isActive", JSON.stringify(isActive));

  if (text_2) {
    formData.append("text_2", JSON.stringify(text_2));
  }

  if (text_3) {
    formData.append("text_3", JSON.stringify(text_3));
  }

  if (text_4) {
    formData.append("text_4", JSON.stringify(text_4));
  }

  if (text_5) {
    formData.append("text_5", JSON.stringify(text_5));
  }

  if (text_6) {
    formData.append("text_6", JSON.stringify(text_6));
  }

  if (text_7) {
    formData.append("text_7", JSON.stringify(text_7));
  }

  if (text_8) {
    formData.append("text_8", JSON.stringify(text_8));
  }

  if (text_9) {
    formData.append("text_9", JSON.stringify(text_9));
  }

  if (text_10) {
    formData.append("text_10", JSON.stringify(text_10));
  }

  if (image) {
    formData.append("image", image);
  }

  return contentRequest<T>({
    path: id ? `/practice-benefits/${id}` : "/practice-benefits",
    method: id ? "PUT" : "POST",
    locale,
    body: formData,
  });
}

export async function softDeletePracticeBenefit<T = unknown>({
  id,
  locale,
}: {
  id: string;
  locale?: string;
}): Promise<T> {
  return contentRequest<T>({
    path: `/practice-benefits/${id}`,
    method: "DELETE",
    locale,
  });
}

export async function softDeleteHeroIntro<T = unknown>({
  id,
  locale,
}: {
  id: string;
  locale?: string;
}): Promise<T> {
  return localRequest<T>({
    path: `/api/hero-intro/${id}`,
    method: "DELETE",
    locale,
  });
}

export interface SaveSectionInput {
  id?: string;
  locale?: string;
  title: Record<string, string>;
  subtitle_1?: Record<string, string>;
  subtitle_2?: Record<string, string>;
  for: string;
  orderIndex: number;
  isActive: boolean;
}

export async function saveSection<T = SectionRecord>({
  id,
  locale,
  title,
  subtitle_1,
  subtitle_2,
  for: sectionFor,
  orderIndex,
  isActive,
}: SaveSectionInput): Promise<T> {
  const payload: Record<string, unknown> = {
    title,
    for: sectionFor,
    orderIndex,
    isActive,
  };

  if (subtitle_1) {
    payload.subtitle_1 = subtitle_1;
  }

  if (subtitle_2) {
    payload.subtitle_2 = subtitle_2;
  }

  return localRequest<T>({
    path: id ? `/api/sections/${id}` : "/api/sections",
    method: id ? "PUT" : "POST",
    locale,
    body: payload,
  });
}

export async function sendTelegramContactForm<T = unknown>({
  payload,
  locale,
}: {
  payload: Record<string, unknown>;
  locale?: string;
}): Promise<T> {
  return localRequest<T>({
    path: "/api/telegram",
    method: "POST",
    locale,
    body: payload,
  });
}

export async function seedMockFeedbacks<T = FeedbackContract[]>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return request<T>({
    path: "/feedbacks/seed",
    method: "POST",
    locale,
  });
}

export async function getUsers<T = unknown>({
  locale,
  includeDeleted = false,
}: {
  locale?: string;
  includeDeleted?: boolean;
} = {}): Promise<T> {
  return localRequest<T>({
    path: includeDeleted ? "/api/usersAll" : "/api/usersAll?deletedAt=null",
    method: "GET",
    locale,
  });
}

export async function getCurrentUser<T = unknown>({
  locale,
}: {
  locale?: string;
} = {}): Promise<T> {
  return localRequest<T>({
    path: "/api/userCurrent",
    method: "GET",
    locale,
  });
}

export { baseURL };
