import { UserService } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const restaurantId = searchParams.get("restaurantId");

    const userService = new UserService();
    const response = await userService.getCanReview(restaurantId);

    return NextResponse.json(response?.data);
  } catch (error) {
    throw new Error(error);
  }
}
