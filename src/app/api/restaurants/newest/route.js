import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";

export async function GET(req) {
  try {
    const restaurantsService = new RestaurantService();
    const response = await restaurantsService.getNewestRestaurant();
    return NextResponse.json(response);
  } catch (error) {
    throw new Error(500);
  }
}
