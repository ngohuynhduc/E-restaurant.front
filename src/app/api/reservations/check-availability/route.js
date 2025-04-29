import { ReservationsService } from "@/services/reservationsService";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const restaurant_id = searchParams.get("restaurant_id");
    const date = searchParams.get("date");
    const arrival_time = searchParams.get("arrival_time");
    const guest_count = searchParams.get("guest_count");

    if (!restaurant_id || !date || !arrival_time || !guest_count) {
      return NextResponse.json({ message: "Thiếu thông tin đặt bàn" }, { status: 400 });
    }

    const reservationService = new ReservationsService();
    const query = new URLSearchParams({
      restaurant_id,
      date,
      arrival_time,
      guest_count,
    }).toString();
    console.log("🚀 ~ GET ~ query:", query);
    const response = await reservationService.checkAvailability(query);
    return NextResponse.json(response);
  } catch (error) {
    throw new Error(500);
  }
}
