import { create } from "zustand";

export const useCategoriesStore = create((set) => ({
  categories: null,
  setCategories: (categoriesInfo) => set({ categories: categoriesInfo }),
}));

export const useReservationsStore = create((set) => ({
  reservationsData: {},
  setReservationsData: (reservations) => set({ reservationsData: reservations }),
  clearReservationsData: () => set({ setReservationsData: {} }),
}));
