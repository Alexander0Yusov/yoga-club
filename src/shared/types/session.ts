import type { Role } from "@/entities/permissions/model/types";

export interface AuthSessionUser {
  id?: string;
  email: string;
  name?: string;
  role: Role;
  telephone?: string;
  isSubscribed?: boolean;
}

export interface AuthSession {
  user: AuthSessionUser;
  accessToken?: string;
  expiresAt?: string;
}
