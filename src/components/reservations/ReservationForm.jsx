"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar1, UserRoundPen, Utensils } from "lucide-react";
import { format } from "date-fns";
import { ButtonInteract } from "../ui/interactButton";

export const ReservationForm = ({ userData, reservationData }) => {
  const [submitValue, setSubmitValue] = useState({
    user_id: userData?.id || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    restaurant_id: reservationData?.restaurantId || "",
    guest_count: reservationData?.customerCount || "",
    date: reservationData?.date || "",
    arrival_time: reservationData?.time || "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9+]+$/.test(value)) {
      setSubmitValue({ ...submitValue, phone: value });
    }
  };

  const handleNoteChange = (e) => {
    setSubmitValue({ ...submitValue, note: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submitValue.phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate =
        submitValue.date instanceof Date
          ? format(submitValue.date, "yyyy-MM-dd")
          : typeof reservationData?.date === "object" && reservationData?.date instanceof Date
          ? format(reservationData.date, "yyyy-MM-dd")
          : submitValue.date;

      const submissionData = {
        ...submitValue,
        date: formattedDate,
      };

      console.log("Thông tin đặt bàn:", submissionData);
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (!res.ok) {
        console.error("Lỗi khi đặt bàn:", data);
        return;
      }
      alert("Đặt bàn thành công!");
    } catch (error) {
      console.error("Lỗi khi đặt bàn:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 py-8 px-4 rounded-lg max-w-6xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h1 className="text-xl font-bold text-center">
          ĐẶT CHỖ ĐẾN "{reservationData?.restaurantName}"
        </h1>
        <div className="mt-2 text-center">{reservationData?.restaurantAddress}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
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
              <Utensils />:<h3 className="font-medium">{reservationData?.restaurantName}</h3>
            </div>

            <div className="flex items-center gap-2">
              <UserRoundPen />:<p>{reservationData?.customerCount} người</p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar1 />:
              <p>
                {reservationData?.date instanceof Date
                  ? `${new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(
                      reservationData.date
                    )}, ngày ${reservationData.date.toLocaleDateString("vi-VN")} ${
                      reservationData?.time
                    }`
                  : "Chưa chọn ngày giờ"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <ButtonInteract
          disabled={isSubmitting}
          className="bg-[#FC8842] text-white px-16 py-3 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-medium"
        >
          {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
        </ButtonInteract>
      </div>
    </form>
  );
};
