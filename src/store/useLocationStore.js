import { create } from "zustand";

export const useLocationStore = create((set) => ({
  location: {
    latitude: null,
    longitude: null,
  },
  setLocation: (location) => set({ location }),
  resetLocation: () =>
    set({
      location: {
        latitude: null,
        longitude: null,
      },
    }),
}));
