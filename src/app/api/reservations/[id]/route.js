import { ReservationsService } from "@/services/reservationsService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const isHolding = searchParams.get("isHolding") || false;

    const { id } = await params;
    const reservationsService = new ReservationsService();
    const response = await reservationsService.getReservationById(id, isHolding);

    return NextResponse.json(response?.data);
  } catch (error) {
    throw new Error(error);
  }
}
