import { RestaurantService } from "@/services/restaurantsService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const isAdmin = searchParams.get("isAdmin") || "false";

    const restaurantsService = new RestaurantService();
    const response = await restaurantsService.getRestaurantById(id, isAdmin);

    // const res = await fetch(`${process.env.BACKEND_API}/restaurants/${id}`, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.INTERNAL_TOKEN}`,
    //   },
    // });

    return NextResponse.json(response?.data);
  } catch (error) {
    throw new Error(error);
  }
}
