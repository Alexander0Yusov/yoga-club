export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type RoleHierarchy = Record<Role, readonly Role[]>;

export interface RbacContext {
  role: Role;
  isAuthenticated: boolean;
}

export const ROLE_HIERARCHY: RoleHierarchy = {
  USER: ["USER"],
  ADMIN: ["USER", "ADMIN"],
  SUPERADMIN: ["USER", "ADMIN", "SUPERADMIN"],
} as const;
