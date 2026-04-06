import { StateCreator } from "zustand";

import { ROLE_HIERARCHY, type Role } from "@/entities/permissions/model/types";
import {
  SessionExpiredError,
  fetchSessionUserWithAutoRefresh,
} from "@/shared/auth/backend-session";

type UserRole = Role;
const VIEW_MODE_KEY = "yoga_club_view_mode";

type User = {
  name: string;
  nickname: string;
  email: string;
  image: string;
  portrait: string;
  platformName?: string;
  platformImgUrl?: string;
  linkedIdentities?: Array<{
    provider: string;
    providerAvatarUrl?: string;
    providerName?: string;
  }>;
  phone: string;
  isSubscribed: boolean;
  isAdmin: boolean;
  isInBlacklist: boolean;
  createdAt: string;
  role: UserRole;
  originalRole: UserRole;
  viewMode: UserRole;
};

const initialUser: User = {
  name: "",
  nickname: "",
  email: "",
  image: "",
  portrait: "",
  phone: "",
  isSubscribed: false,
  isAdmin: false,
  isInBlacklist: false,
  createdAt: "",
  role: "USER",
  originalRole: "USER",
  viewMode: "USER",
};

export interface UserSlice {
  // state
  userStatusLoading: boolean;
  userStatusError: string | null;
  // data
  user: User;
  setUser: (newUser: Partial<User>) => void;
  setViewMode: (viewMode: UserRole) => void;
  resetUser: () => void;
  // async
  getCurrentUser: () => Promise<void>;
}

const getSavedViewMode = (): UserRole | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(VIEW_MODE_KEY);
  if (value === "USER" || value === "ADMIN" || value === "SUPERADMIN") {
    return value;
  }

  return null;
};

const canUseViewMode = (user: Partial<User>, viewMode: UserRole): boolean => {
  const role = user.role || user.originalRole || "USER";

  return ROLE_HIERARCHY[role].includes(viewMode);
};

const isSuperAdminAuthority = (user: Partial<User>): boolean =>
  user?.role === "SUPERADMIN" || user?.originalRole === "SUPERADMIN";

const normalizeUser = (user: Partial<User>): User => {
  const normalizedRole: UserRole = user.role || (user.isAdmin ? "ADMIN" : "USER");
  const normalizedOriginalRole: UserRole = user.originalRole || normalizedRole;
  const savedViewMode = getSavedViewMode();
  const requestedViewMode = savedViewMode || user.viewMode || normalizedRole;
  const normalizedViewMode: UserRole = canUseViewMode({
    ...user,
    role: normalizedRole,
    originalRole: normalizedOriginalRole,
  }, requestedViewMode)
    ? requestedViewMode
    : normalizedRole;
  const isSuperAdmin = isSuperAdminAuthority({
    ...user,
    originalRole: normalizedOriginalRole,
  });

  return {
    ...initialUser,
    ...user,
    role: isSuperAdmin ? "SUPERADMIN" : normalizedRole,
    originalRole: isSuperAdmin ? "SUPERADMIN" : normalizedOriginalRole,
    viewMode: normalizedViewMode,
  };
};

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  // state
  userStatusLoading: false,
  userStatusError: null,
  // data
  user: { ...initialUser },
  setUser: (newUser: Partial<User>) =>
    set((state) => ({ user: normalizeUser({ ...state.user, ...newUser }) })),
  setViewMode: (viewMode: UserRole) =>
    set((state) => {
      const effectiveViewMode = canUseViewMode(state.user, viewMode)
        ? viewMode
        : state.user.role || "USER";

      if (typeof window !== "undefined") {
        window.localStorage.setItem(VIEW_MODE_KEY, effectiveViewMode);
      }

      return {
        user: {
          ...state.user,
          viewMode: effectiveViewMode,
        },
      };
    }),
  resetUser: () => set({ user: { ...initialUser } }),
  // async
  getCurrentUser: async () => {
    set({ userStatusLoading: true, userStatusError: null });
    try {
      const locale =
        typeof document !== "undefined"
          ? document.documentElement.lang || "en"
          : "en";
      const user = await fetchSessionUserWithAutoRefresh({ locale });

      if (!user) {
        set({ user: { ...initialUser } });
        return;
      }

      set({
        user: normalizeUser({
          ...user,
          viewMode: user.viewMode || getSavedViewMode() || user.role,
        }),
      });
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        set({
          user: { ...initialUser },
          userStatusError: error.code,
        });
      } else {
        console.error("Error fetching current user:", error);
        set({ userStatusError: "Error fetching current user" });
      }
    } finally {
      set({ userStatusLoading: false });
    }
  },
});
