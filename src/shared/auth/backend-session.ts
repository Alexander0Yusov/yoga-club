import type { UserRole } from "@/entities/user/model/types";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAccessTokenCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
} from "./access-token-cookie";

const backendBaseURL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:5005/api";
const supportedBackendLocales = ["uk", "ru", "en", "de"] as const;

type BackendLocale = (typeof supportedBackendLocales)[number];

function normalizeBackendLocale(locale?: string): BackendLocale {
  const value = (locale || "en").trim().toLowerCase();

  if (value === "ua") {
    return "uk";
  }

  if ((supportedBackendLocales as readonly string[]).includes(value)) {
    return value as BackendLocale;
  }

  return "en";
}

export interface BackendMeResponse {
  userId: string;
  email: string;
  name: string;
  imgUrl: string;
  telephone: string;
  isSubscribed: boolean;
  lang: string;
  role: UserRole;
  linkedIdentities?: Array<{
    provider: string;
    providerAvatarUrl?: string;
    providerName?: string;
  }>;
}

export interface FrontendSessionUser {
  email: string;
  name: string;
  nickname: string;
  image: string;
  portrait: string;
  phone: string;
  isSubscribed: boolean;
  isAdmin: boolean;
  isInBlacklist: boolean;
  createdAt: string;
  role: UserRole;
  originalRole: UserRole;
  viewMode: UserRole;
  lang: string;
  platformName?: string;
  platformImgUrl?: string;
  linkedIdentities?: Array<{
    provider: string;
    providerAvatarUrl?: string;
    providerName?: string;
  }>;
}

export class SessionExpiredError extends Error {
  code = "SESSION_EXPIRED" as const;

  constructor(message = "Session expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

function buildHeaders(locale?: string, accessToken?: string): Headers {
  const headers = new Headers();
  const normalizedLocale = normalizeBackendLocale(locale);

  headers.set("Accept-Language", normalizedLocale);
  headers.set("x-client-lang", normalizedLocale);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    const errorMessage = text || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function mapBackendMeToFrontendSessionUser(
  backendUser: BackendMeResponse,
  requestedLang?: string,
): FrontendSessionUser {
  const lang = requestedLang || backendUser.lang || "en";
  const role = backendUser.role || "USER";
  const providerAvatar =
    backendUser.linkedIdentities?.find((identity) => identity.providerAvatarUrl)
      ?.providerAvatarUrl || "";
  const avatarUrl = backendUser.imgUrl || providerAvatar;
  const platformName =
    backendUser.linkedIdentities?.find((identity) => identity.providerName)
      ?.providerName || backendUser.linkedIdentities?.[0]?.provider || "";

  return {
    email: backendUser.email,
    name: backendUser.name || backendUser.email,
    nickname: backendUser.name || backendUser.email,
    phone: backendUser.telephone || "",
    image: avatarUrl,
    portrait: avatarUrl,
    isSubscribed: Boolean(backendUser.isSubscribed),
    isAdmin: role === "ADMIN" || role === "SUPERADMIN",
    isInBlacklist: false,
    createdAt: new Date().toISOString(),
    role,
    originalRole: role,
    viewMode: role,
    lang,
    platformName: platformName || undefined,
    platformImgUrl: providerAvatar || undefined,
    linkedIdentities: backendUser.linkedIdentities,
  };
}

export async function fetchBackendMe({
  accessToken,
  locale,
}: {
  accessToken: string;
  locale?: string;
}): Promise<BackendMeResponse> {
  const response = await fetch(`${backendBaseURL}/auth/me`, {
    method: "GET",
    headers: buildHeaders(locale, accessToken),
  });

  return readJson<BackendMeResponse>(response);
}

export async function refreshBackendSession({
  locale,
}: {
  locale?: string;
} = {}): Promise<{ accessToken: string }> {
  const response = await fetch(`${backendBaseURL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: buildHeaders(locale),
  });

  return readJson<{ accessToken: string }>(response);
}

export async function fetchSessionUserWithAutoRefresh({
  locale,
}: {
  locale?: string;
} = {}): Promise<FrontendSessionUser | null> {
  const accessToken = getAccessTokenCookie();

  if (!accessToken) {
    return null;
  }

  const requestedLang = locale || "en";

  const loadUser = async (token: string) => {
    const backendUser = await fetchBackendMe({
      accessToken: token,
      locale: requestedLang,
    });

    return mapBackendMeToFrontendSessionUser(backendUser, requestedLang);
  };

  try {
    return await loadUser(accessToken);
  } catch (error) {
    const status = (error as { status?: number }).status;

    if (status !== 401 && status !== 403) {
      throw error;
    }

    try {
      const refreshed = await refreshBackendSession({ locale: requestedLang });
      setAccessTokenCookie(refreshed.accessToken);
      return await loadUser(refreshed.accessToken);
    } catch {
      clearAccessTokenCookie();
      throw new SessionExpiredError(
        "Your session expired. Please sign in again.",
      );
    }
  }
}

export function getAccessTokenCookieName() {
  return ACCESS_TOKEN_COOKIE_NAME;
}
