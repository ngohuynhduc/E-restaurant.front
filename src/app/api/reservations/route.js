import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { ReservationsService } from "@/services/reservationsService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const requestData = await req.json();
    const { reservation_id, phone, note } = requestData;

    // Validate input
    if (!phone || !reservation_id) {
      return NextResponse.json({ message: "Thiếu thông tin đặt bàn" }, { status: 400 });
    }

    const reservationService = new ReservationsService();
    const response = await reservationService.reservationsConfirm({
      reservation_id,
      phone,
      note,
    });
    console.log("🚀 ~ POST ~ response:", response);

    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Đặt bàn thất bại!", status: 400 });
    }

    return NextResponse.json({ message: "Đặt bàn thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt bàn:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
