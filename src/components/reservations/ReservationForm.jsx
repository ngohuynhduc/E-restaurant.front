"use client";

import { useState, FormEvent, ChangeEvent, useMemo, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar1,
  Check,
  CircleCheckBig,
  TicketPercent,
  UserRoundPen,
  Utensils,
} from "lucide-react";
import { ButtonInteract } from "../ui/interactButton";
import { useCountdown } from "@/hooks/reservationCountdown";
import { useRouter } from "next/navigation";
import { ConfirmReservationDialog } from "./dialog/ConfirmReservationDialog";
import { ErrorsStatus } from "@/app/shared/errorsStatus";

export const ReservationForm = ({ userData, reservationData }) => {
  console.log("🚀 ~ ReservationForm ~ userData:", reservationData);
  const [submitValue, setSubmitValue] = useState({
    user_id: userData?.id || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    full_name: userData?.full_name || "",
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
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const { minutes, seconds, isExpired } = useCountdown(reservationData.expired_at);
  const router = useRouter();

  useEffect(() => {
    if (
      !reservationData?.restaurant?.promotions ||
      reservationData?.restaurant?.promotions.length === 0
    ) {
      setSelectedPromotion(null);
      return;
    }

    if (!selectedPromotion && reservationData?.restaurant?.promotions.length > 0) {
      setSelectedPromotion(reservationData.restaurant.promotions[0].id);
    }
  }, [reservationData?.restaurant?.promotions]);

  useEffect(() => {
    if (userData) {
      setSubmitValue((prev) => ({
        ...prev,
        user_id: userData.id,
        phone: userData.phone || "",
        email: userData.email || "",
        full_name: userData.full_name || "",
      }));
    }
  }, [userData]);

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
        email: submitValue.email,
        full_name: submitValue.full_name,
        promotion_id: selectedPromotion || null,
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

  const handlePromotionSelect = (promotionId) => {
    if (selectedPromotion === promotionId) {
      setSelectedPromotion(null);
      return;
    }
    setSelectedPromotion(promotionId);
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
                  <Utensils />:<h3 className="font-medium">{reservationData?.restaurant?.name}</h3>
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
                      <Input
                        value={submitValue.full_name}
                        placeholder="Nhập họ và tên"
                        onChange={(e) =>
                          setSubmitValue({ ...submitValue, full_name: e.target.value })
                        }
                        className="w-full"
                        required
                      />
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
                      <Input
                        value={submitValue.email}
                        placeholder="Nhập email"
                        onChange={(e) => setSubmitValue({ ...submitValue, email: e.target.value })}
                        type="email"
                        className="w-full"
                        required
                      />
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

                {/* Promotions Section */}
                {reservationData?.restaurant?.promotions?.length && (
                  <div className="max-w-[50%] mx-auto p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                      Chọn ưu đãi
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                      {reservationData?.restaurant?.promotions?.map((promotion) => {
                        const isSelected = selectedPromotion === promotion.id;

                        return (
                          <div
                            key={promotion.id}
                            onClick={() => handlePromotionSelect(promotion.id)}
                            className={`
                            relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ease-in-out
                            hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
                            ${
                              isSelected
                                ? `border-yellow-200 shadow-xl scale-[1.02] -translate-y-1 ring-4 ring-opacity-20`
                                : `border-gray-200 hover:border-yellow-200`
                            }
                            ${isSelected ? "bg-yellow-50" : "bg-white hover:bg-gray-50"}
                          `}
                          >
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                                <Check size={16} />
                              </div>
                            )}

                            {isSelected && (
                              <div
                                className={`absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-5 rounded-xl`}
                              />
                            )}

                            <div className="relative flex items-start gap-4">
                              <div
                                className={`
                              flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 
                              transform transition-transform duration-300
                              ${isSelected ? "scale-110 rotate-12" : "hover:scale-105"}
                            `}
                              >
                                <TicketPercent size={20} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <h3
                                    className={`
                                  text-xl font-semibold transition-colors duration-300
                                  ${isSelected ? "text-gray-800" : "text-gray-700"}
                                `}
                                  >
                                    {promotion.title}
                                  </h3>
                                  {promotion.discount > 0 && (
                                    <span
                                      className={`
                                  px-3 py-1 rounded-full text-sm font-bold text-white
                                  bg-gradient-to-r from-yellow-500 to-orange-500 transform transition-transform duration-300
                                  ${isSelected ? "scale-110" : ""}
                                `}
                                    >
                                      {promotion.discount}%
                                    </span>
                                  )}
                                </div>

                                <p className="text-gray-600 mb-3 leading-relaxed">
                                  {promotion.description}
                                </p>

                                <div className="flex justify-between items-center text-sm">
                                  {isSelected && (
                                    <span className="text-green-600 font-semibold animate-pulse">
                                      ✓ Đã chọn
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={`
                            absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
                            ${isSelected ? "opacity-20" : "hover:opacity-10"}
                            bg-gradient-to-r from-yellow-500 to-orange-500 pointer-events-none
                          `}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {selectedPromotion && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-green-800 mb-2">
                            🎊 Bạn đã chọn khuyến mãi
                          </h3>
                          <p className="text-green-700">
                            {
                              reservationData?.restaurant?.promotions?.find(
                                (p) => p.id === selectedPromotion
                              )?.description
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <style jsx>{`
                      @keyframes fade-in {
                        from {
                          opacity: 0;
                          transform: translateY(10px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                      .animate-fade-in {
                        animation: fade-in 0.5s ease-out;
                      }
                    `}</style>
                  </div>
                )}
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
