import { RestaurantService } from "@/services/restaurantsService";
import { UserService } from "@/services/userService";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const restaurantService = new RestaurantService();
    const response = await restaurantService.getReviewsByRestaurantId(restaurantId);
    return NextResponse.json(response?.data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
