import { StateCreator } from "zustand";

type UserRole = "USER" | "ADMIN" | "SUPERADMIN";
const VIEW_MODE_KEY = "yoga_club_view_mode";

type User = {
  name: string;
  nickname: string;
  email: string;
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

const isSuperAdminAuthority = (user: Partial<User>): boolean =>
  user?.email === "yusovsky2@gmail.com" || user?.originalRole === "SUPERADMIN";

const normalizeUser = (user: Partial<User>): User => {
  const normalizedRole: UserRole = user.role || (user.isAdmin ? "ADMIN" : "USER");
  const normalizedOriginalRole: UserRole = user.originalRole || normalizedRole;
  const savedViewMode = getSavedViewMode();
  const normalizedViewMode: UserRole =
    savedViewMode || user.viewMode || normalizedRole;
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
  setViewMode: (viewMode: UserRole) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_MODE_KEY, viewMode);
    }

    set((state) => ({ user: { ...state.user, viewMode } }));
  },
  resetUser: () => set({ user: { ...initialUser } }),
  // async
  getCurrentUser: async () => {
    set({ userStatusLoading: true, userStatusError: null });
    try {
      const response = await fetch("/api/userCurrent");
      if (response.ok) {
        const user = (await response.json()) as Partial<User>;
        const savedViewMode = getSavedViewMode();

        set({
          user: normalizeUser({
            ...user,
            viewMode: savedViewMode || user.viewMode,
          }),
        });
      } else {
        throw new Error("Failed to fetch current user");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      set({ userStatusError: "Error fetching current user" });
    } finally {
      set({ userStatusLoading: false });
    }
  },
});
