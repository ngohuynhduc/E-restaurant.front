import { create } from "zustand";

export const useCategoriesStore = create((set) => ({
  categories: null,
  setCategories: (categoriesInfo) => set({ categories: categoriesInfo }),
}));
