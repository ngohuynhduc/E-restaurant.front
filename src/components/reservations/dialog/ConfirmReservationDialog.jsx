import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonInteract } from "@/components/ui/interactButton";
import { CircleCheckBig, CircleX, Loader2, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export const ConfirmReservationDialog = ({
  isOpen,
  setIsOpen,
  onSubmit,
  isSubmitting,
  reservationComplete,
  reservationError,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = () => {
    if (reservationComplete) {
      router.push("/profile");
      return;
    }
    onSubmit?.();
  };

  const onCloseDialog = () => {
    if (reservationComplete) {
      router.push("/");
    }
    setIsOpen(!isOpen);
  };

  const renderContent = useMemo(() => {
    console.log("🚀 ~ renderContent ~ reservationError:", reservationError);

    if (isSubmitting)
      return (
        <div className="text-xl font-semibold flex flex-col items-center gap-4">
          Đang xử lý...
          {isSubmitting && <Loader2 size={32} className="animate-spin" />}
        </div>
      );
    if (reservationComplete)
      return (
        <>
          <CircleCheckBig size={128} color="green" />
          <p className="text-xl font-semibold">Đặt bàn thành công!</p>
        </>
      );
    if (reservationError) {
      return (
        <>
          <CircleX size={128} color="red" />
          <p className="text-xl font-semibold">Đặt bàn thất bại!</p>
          <p className="text-[16px] font-normal">
            Nhà hàng đã hết chỗ cho khoảng thời gian này, vui lòng chọn một khung giờ khác nhé.
          </p>
        </>
      );
    }
    return <p className="text-xl font-semibold">Đặt bàn với thông tin đã nhập?</p>;
  }, [isSubmitting, reservationError, reservationComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onCloseDialog} className="min-h-[400px]">
      <DialogContent className="min-h-[300px]">
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle>Xác nhận đặt bàn</DialogTitle>
          <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <XIcon />
          </span>
        </DialogHeader>
        <DialogDescription className="mt-2 flex flex-col gap-4 items-center">
          {renderContent}
          <div className="flex flex-row gap-4 mt-auto">
            {!reservationComplete && !reservationError ? (
              <ButtonInteract
                disabled={isSubmitting}
                className="mt-4 bg-gray-500 min-w-[100px]"
                onClick={() => setIsOpen(!isOpen)}
              >
                Huỷ bỏ
              </ButtonInteract>
            ) : null}
            <ButtonInteract
              disabled={isSubmitting}
              className="mt-4 min-w-[100px] flex items-center gap-2"
              onClick={handleSubmit}
            >
              {reservationComplete ? "Theo dõi đơn đặt bàn" : "Xác nhận"}
            </ButtonInteract>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
