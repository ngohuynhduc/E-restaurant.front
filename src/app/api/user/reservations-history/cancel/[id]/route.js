import { ReservationsService } from "@/services/reservationsService";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  try {
    const reservationId = params.id;
    const reservationsService = new ReservationsService();
    const response = await reservationsService.cancelReservation(reservationId);

    if (response.status === 200) {
      return NextResponse.json({ message: "Reservation cancelled successfully" });
    } else {
      return NextResponse.json({ error: "Failed to cancel reservation" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
