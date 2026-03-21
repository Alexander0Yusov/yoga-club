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

function buildFeedbackPath(viewMode?: "USER" | "ADMIN" | "SUPERADMIN"): string {
  const params = new URLSearchParams();

  if (viewMode) {
    params.set("viewMode", viewMode);
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
  return request<T>({
    path: includeDeleted ? "/users" : "/users?deletedAt=null",
    method: "GET",
    locale,
  });
}

export { baseURL };
