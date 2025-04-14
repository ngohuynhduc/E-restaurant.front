import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";

export async function GET(req) {
  try {
    const restaurantsService = new RestaurantService();
    const response = await restaurantsService.getCategories();
    return NextResponse.json(response);
  } catch (error) {
    throw new Error(500);
  }
}
