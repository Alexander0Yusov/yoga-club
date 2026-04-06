import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import type { Role } from "@/entities/permissions/model/types";
import { usersMock } from "@/shared/mock/user.mock";

export const AUTH_COOKIE_NAME = "yoga-club-auth-email";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const authCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional().default(false),
});

export const authRegistrationSchema = authCredentialsSchema
  .omit({ rememberMe: true })
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  nickname: z.string().trim().min(2).max(50).optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  isSubscribed: z.union([z.boolean(), z.literal("true"), z.literal("false")]).optional(),
});

export const userViewModeSchema = z.object({
  userId: z.string().trim().optional(),
  userEmail: z.string().trim().email().optional(),
  viewMode: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
});

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  telephone: string;
  isSubscribed: boolean;
  isInBlacklist: boolean;
  role: Role;
  originalRole: Role;
  viewMode: Role;
  image: string;
  portrait: string;
  createdAt: string;
  updatedAt: string;
  lang: string;
  isAdmin: boolean;
  password: string;
}

export type PublicAuthUser = Omit<AuthUser, "password">;

const seedPasswords: Record<string, string> = {
  "anna.petrenko@yogaclub.com": "Password123!",
  "admin@yogaclub.com": "Admin123!",
  "superadmin@yogaclub.com": "Superadmin123!",
};

const authUsers = new Map<string, AuthUser>();

function getInitialName(email: string): string {
  const localPart = email.split("@")[0] || "User";
  return localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function createSeedUser({
  email,
  role,
  telephone,
  isSubscribed = false,
}: {
  email: string;
  role: Role;
  telephone?: string;
  isSubscribed?: boolean;
}): AuthUser {
  const now = new Date().toISOString();

  return {
    id: nanoid(),
    email,
    name: getInitialName(email),
    nickname: getInitialName(email),
    telephone: telephone || "",
    isSubscribed,
    isInBlacklist: false,
    role,
    originalRole: role,
    viewMode: role,
    image: "",
    portrait: "",
    createdAt: now,
    updatedAt: now,
    lang: "en",
    isAdmin: role === "ADMIN" || role === "SUPERADMIN",
    password: seedPasswords[email] || "Password123!",
  };
}

function seedAuthUsers() {
  if (authUsers.size > 0) {
    return;
  }

  usersMock.forEach((user) => {
    authUsers.set(
      user.email,
      createSeedUser({
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        isSubscribed: Boolean(user.isSubscribed),
      }),
    );
  });
}

seedAuthUsers();

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function toPublicAuthUser(user: AuthUser): PublicAuthUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function getAuthUserByEmail(email: string): AuthUser | null {
  return authUsers.get(normalizeEmail(email)) || null;
}

export function getAuthUserById(id: string): AuthUser | null {
  return Array.from(authUsers.values()).find((user) => user.id === id) || null;
}

export function getCurrentAuthUser(): PublicAuthUser | null {
  const email = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!email) {
    return null;
  }

  const user = getAuthUserByEmail(email);

  return user ? toPublicAuthUser(user) : null;
}

export function setAuthCookie(
  response: NextResponse,
  email: string,
  rememberMe = true,
) {
  response.cookies.set(AUTH_COOKIE_NAME, normalizeEmail(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: rememberMe ? AUTH_COOKIE_MAX_AGE : undefined,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function registerMockUser(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): PublicAuthUser {
  const email = normalizeEmail(input.email);
  const existingUser = getAuthUserByEmail(email);

  if (existingUser) {
    const error = new Error("Account already exists") as Error & { status?: number };
    error.status = 409;
    throw error;
  }

  const now = new Date().toISOString();
  const nextUser: AuthUser = {
    id: nanoid(),
    email,
    name: getInitialName(email),
    nickname: getInitialName(email),
    telephone: "",
    isSubscribed: false,
    isInBlacklist: false,
    role: "USER",
    originalRole: "USER",
    viewMode: "USER",
    image: "",
    portrait: "",
    createdAt: now,
    updatedAt: now,
    lang: "en",
    isAdmin: false,
    password: input.password,
  };

  authUsers.set(email, nextUser);

  return toPublicAuthUser(nextUser);
}

export function authenticateMockUser(input: {
  email: string;
  password: string;
}): PublicAuthUser | null {
  const user = getAuthUserByEmail(input.email);

  if (!user || user.password !== input.password) {
    return null;
  }

  return toPublicAuthUser(user);
}

export function updateMockUser(
  email: string,
  patch: Partial<Omit<AuthUser, "id" | "email" | "password" | "createdAt">>,
): PublicAuthUser | null {
  const normalizedEmail = normalizeEmail(email);
  const currentUser = getAuthUserByEmail(normalizedEmail);

  if (!currentUser) {
    return null;
  }

  const nextUser: AuthUser = {
    ...currentUser,
    ...patch,
    email: normalizedEmail,
    updatedAt: new Date().toISOString(),
  };

  authUsers.set(normalizedEmail, nextUser);

  return toPublicAuthUser(nextUser);
}

export function updateMockUserById(
  id: string,
  patch: Partial<Omit<AuthUser, "id" | "email" | "password" | "createdAt">>,
): PublicAuthUser | null {
  const currentUser = getAuthUserById(id);

  if (!currentUser) {
    return null;
  }

  return updateMockUser(currentUser.email, patch);
}

export function getMockUsers(): PublicAuthUser[] {
  return Array.from(authUsers.values()).map(toPublicAuthUser);
}
