import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (userInfo) => set({ user: userInfo }),
}));
