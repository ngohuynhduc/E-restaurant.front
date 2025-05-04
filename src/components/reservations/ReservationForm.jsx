"use client";

import { useState, FormEvent, ChangeEvent, useMemo } from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar1, CircleCheckBig, UserRoundPen, Utensils } from "lucide-react";
import { format } from "date-fns";
import { ButtonInteract } from "../ui/interactButton";
import { useCountdown } from "@/hooks/reservationCountdown";
import { useRouter } from "next/navigation";
import { ConfirmReservationDialog } from "./dialog/ConfirmReservationDialog";
import { ErrorsStatus } from "@/app/shared/errorsStatus";

export const ReservationForm = ({ userData, reservationData }) => {
  const [submitValue, setSubmitValue] = useState({
    user_id: userData?.id || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    restaurant_id: reservationData?.restaurant_id || "",
    guest_count: reservationData?.guest_count || "",
    date: reservationData?.date || "",
    arrival_time: reservationData?.arrival_time || "",
    note: reservationData?.note || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenDialogConfirm, setIsOpenDialogConfirm] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [reservationError, setReservationError] = useState(false);
  const { minutes, seconds, isExpired } = useCountdown(reservationData.expired_at);
  const router = useRouter();

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9+]+$/.test(value)) {
      setSubmitValue({ ...submitValue, phone: value });
    }
  };

  const handleNoteChange = (e) => {
    setSubmitValue({ ...submitValue, note: e.target.value });
  };

  const handleSubmit = async () => {
    if (!submitValue.phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        reservation_id: reservationData?.reservation_id,
        phone: submitValue.phone,
        note: submitValue.note,
      };
      console.log("🚀 ~ handleSubmit ~ submissionData:", submissionData);

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (data?.status === ErrorsStatus.OK) {
        setReservationComplete(true);
        return;
      }
      setReservationError(true);
    } catch (error) {
      console.error("Lỗi khi đặt bàn:", error);
      setReservationError(true);
      setReservationComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateRender = useMemo(() => {
    if (!reservationData?.date) return "Chưa chọn ngày giờ!";
    const date = new Date(reservationData?.date);
    const dateString = `${new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(
      date
    )}, ngày ${date.toLocaleDateString("vi-VN")} - ${reservationData?.arrival_time}`;
    return dateString;
  }, [reservationData]);

  return (
    <>
      {isExpired ? (
        <div className="text-center mt-4 p-4 min-h-[70vh] flex flex-col items-center">
          <img src="/planning.png" className="w-[400px] h-[400px]" />
          <h2 className="text-xl mt-4">Thời hạn đặt bàn đã hết.</h2>
          <ButtonInteract
            className="mt-2"
            onClick={() => router.push(`/restaurants/${reservationData?.restaurant_id}`)}
          >
            Đặt lại!
          </ButtonInteract>
        </div>
      ) : (
        <div className="bg-gray-50 py-8 px-4 rounded-lg max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h1 className="text-xl font-bold text-center">
              ĐẶT CHỖ ĐẾN "{reservationData?.restaurant?.name}"
            </h1>
            <div className="mt-2 text-center">{reservationData?.restaurant?.address}</div>
          </div>

          {reservationComplete ? (
            <div className="text-center mt-4 p-4 min-h-[70vh] flex flex-col items-center">
              <CircleCheckBig size={160} color="green" />
              <h2 className="text-xl mt-4">Bạn đã đặt bàn thành công!</h2>
              <div className="flex flex-row gap-4">
                <ButtonInteract className="mt-2" onClick={() => router.push("/profile")}>
                  Chi tiết đặt bàn
                </ButtonInteract>
                <ButtonInteract className="mt-2" onClick={() => router.push("/")}>
                  Về trang chủ
                </ButtonInteract>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
                  <div className="mt-2">
                    (Vui lòng đặt bàn trong thời gian cho phép:{" "}
                    <span className="font-semibold text-[16px] text-red-600">
                      {`${minutes} phút : ${seconds} giây`}
                    </span>
                    )
                  </div>
                  <h2 className="text-lg font-semibold mb-5">Thông tin người đặt</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium mb-2">
                        Tên liên lạc <span className="text-red-500">*</span>
                      </label>
                      <p className="border border-gray-300 rounded-md p-2">{userData?.full_name}</p>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={submitValue.phone}
                        placeholder="Nhập số điện thoại"
                        onChange={handlePhoneChange}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <p className="border border-gray-300 rounded-md p-2">{userData?.email}</p>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">Ghi chú</label>
                      <Textarea
                        value={submitValue.note}
                        placeholder="Nhập ghi chú của bạn (nếu có)"
                        onChange={handleNoteChange}
                        className="min-h-20 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex-[0.5] h-fit">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Thông tin đặt chỗ</h2>
                    <button
                      type="button"
                      className="text-red-500 text-sm font-medium hover:text-red-600 cursor-pointer"
                      onClick={() => window.history.back()}
                    >
                      Chỉnh sửa
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Utensils />:
                      <h3 className="font-medium">{reservationData?.restaurant?.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserRoundPen />:<p>{reservationData?.guest_count} người</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar1 />:<p>{dateRender}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <ButtonInteract
                  disabled={isSubmitting}
                  className="bg-[#FC8842] text-white px-16 py-3 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-medium"
                  onClick={() => setIsOpenDialogConfirm(true)}
                >
                  {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                </ButtonInteract>
              </div>
            </>
          )}
        </div>
      )}
      <ConfirmReservationDialog
        isOpen={isOpenDialogConfirm}
        setIsOpen={setIsOpenDialogConfirm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        reservationComplete={reservationComplete}
        reservationError={reservationError}
        restaurantId={reservationData?.restaurant_id}
      />
    </>
  );
};
