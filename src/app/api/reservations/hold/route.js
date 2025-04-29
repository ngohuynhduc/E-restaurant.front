import { ReservationsService } from "@/services/reservationsService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const requestData = await req.json();
    const { user_id, phone, email, restaurant_id, guest_count, date, arrival_time, note } =
      requestData;

    // Validate input
    if (!user_id || !phone || !restaurant_id) {
      return NextResponse.json({ message: "Thiếu thông tin đặt bàn" }, { status: 400 });
    }

    const reservationService = new ReservationsService();
    const response = await reservationService.reservationsHold({
      user_id,
      phone,
      email,
      restaurant_id,
      guest_count,
      date,
      arrival_time,
      note,
    });

    if (response.status !== 200) {
      return NextResponse.json(
        { message: "Đặt bàn không thành công" },
        { status: response.status }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt bàn:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau." }, { status: 500 });
  }
}
