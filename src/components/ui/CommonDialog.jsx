"use client";

import { useDialogStore } from "@/store/useDialogStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { CircleCheckBig, XIcon } from "lucide-react";
import { ButtonInteract } from "./interactButton";

export const CommonDialog = () => {
  const { isOpen, message, type, onOk, onCancel, closeDialog } = useDialogStore();
  const handleOk = () => {
    onOk?.();
    closeDialog();
  };

  const handleCancel = () => {
    onCancel?.();
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle>Thông báo</DialogTitle>
          {type !== "success" && (
            <span className="cursor-pointer" onClick={closeDialog}>
              <XIcon />
            </span>
          )}
        </DialogHeader>
        <div className="mt-2 flex flex-col items-center">
          {type === "success" && <CircleCheckBig size={128} color="green" />}
          <p className="text-xl mt-4 font-semibold">{message}</p>
          <div className="flex flex-row gap-4 mt-auto">
            {type === "confirm" && (
              <ButtonInteract className="mt-4 bg-gray-500" onClick={handleCancel}>
                Huỷ bỏ
              </ButtonInteract>
            )}
            <ButtonInteract className="mt-4 flex items-center gap-2" onClick={handleOk}>
              OK
            </ButtonInteract>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
