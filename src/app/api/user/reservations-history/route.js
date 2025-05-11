import { NextResponse } from "next/server";
import _ from "lodash";
import { ReservationsService } from "@/services/reservationsService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const queryObject = {
      page,
      limit,
    };

    const query = new URLSearchParams(queryObject).toString();
    const restaurantsService = new ReservationsService();
    const response = await restaurantsService.getReservationsHistory(query);
    return NextResponse.json(response?.data);
  } catch (error) {
    throw new Error(500);
  }
}
