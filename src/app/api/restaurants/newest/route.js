import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";

export async function GET(req) {
  try {
    const restaurantsService = new RestaurantService();
    const response = await restaurantsService.getNewestRestaurant();
    console.log("🚀 ~ GET ~ response:", response);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: "Failed get restaurants" }, { status: 500 });
  }
}
