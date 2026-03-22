import type { AboutMeContract } from "@/modules/about-me/contracts/about-me.contract";
import type { FeedbackContract } from "@/modules/feedback/contracts/feedback.contract";
import type { EventContract } from "@/modules/events/contracts/event.contract";
import type { SectionContract } from "@/modules/sections/contracts/section.contract";

const baseURL = "https://yoga-club-back.vercel.app/api";
const defaultLocale = "en";

export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  path: string;
  locale?: string;
  body?: unknown;
}

function buildHeaders(headers: HeadersInit | undefined, locale: string): Headers {
  const nextHeaders = new Headers(headers);

  nextHeaders.set("Accept-Language", locale);

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

function buildLocalHeaders(
  headers: HeadersInit | undefined,
  locale: string,
  body: unknown
): Headers {
  const nextHeaders = new Headers(headers);

  nextHeaders.set("Accept-Language", locale);

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

  const response = await fetch(new URL(path, siteUrl), {
    ...init,
    headers: finalHeaders,
    body: requestBody,
  });

  return readLocalJson<T>(response, `Site API request to ${path}`);
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
  return request<T>({
    path: `/sections/${id}`,
    method: "PATCH",
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

export function updateUserProfile<T = unknown>({
  formData,
}: UpdateUserProfileInput): Promise<T> {
  return localRequest<T>({
    path: "/api/user",
    method: "PATCH",
    body: formData,
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
  return localRequest<T>({
    path: "/api/user",
    method: "POST",
    body: {
      email,
      password,
    },
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
  description: string;
  picsArray: { value: string }[];
  defaultImg: number;
}

export async function saveEvent<T = EventContract>({
  id,
  title,
  timeTarget,
  description,
  picsArray,
  defaultImg,
}: SaveEventInput): Promise<T> {
  return localRequest<T>({
    path: "/api/events",
    method: id ? "PATCH" : "POST",
    body: {
      id,
      title,
      timeTarget,
      description,
      picsArray,
      defaultImg,
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
