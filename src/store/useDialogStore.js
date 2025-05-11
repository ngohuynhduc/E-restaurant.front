import { create } from "zustand";

export const useDialogStore = create((set) => ({
  isOpen: false,
  message: "Thành công",
  type: "success",
  onOk: (ok) => {
    set({ isOpen: false, message: "Thành công" });
    if (ok) {
      ok();
    }
  },
  onCancel: (cancel) => {
    set({ isOpen: false, message: "Thành công" });
    if (cancel) {
      cancel();
    }
  },
  showDialog: ({ message, type = "success", onOk = null, onCancel = null }) =>
    set({ isOpen: true, message, type, onOk, onCancel }),
  closeDialog: () =>
    set({
      isOpen: false,
      message: "Thành công",
      onOk: null,
      onCancel: null,
    }),
}));
