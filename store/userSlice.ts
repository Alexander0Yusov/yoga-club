import { StateCreator } from "zustand";

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
};

export interface UserSlice {
  // state
  userStatusLoading: boolean;
  userStatusError: string | null;
  // data
  user: User;
  setUser: (newUser: User) => void;
  resetUser: () => void;
  // async
  getCurrentUser: () => Promise<void>;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  // state
  userStatusLoading: false,
  userStatusError: null,
  // data
  user: { ...initialUser },
  setUser: (newUser: User) => set({ user: newUser }),
  resetUser: () => set({ user: { ...initialUser } }),
  // async
  getCurrentUser: async () => {
    set({ userStatusLoading: true, userStatusError: null });
    try {
      const response = await fetch("/api/userCurrent");
      if (response.ok) {
        const user = await response.json();

        set({ user });
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
