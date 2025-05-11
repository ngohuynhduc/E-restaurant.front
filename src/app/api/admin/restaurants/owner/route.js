import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";
import _ from "lodash";
import { AdminServices } from "@/services/adminService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("userId") || "";

    const adminServices = new AdminServices();
    const response = await adminServices.getListRestaurantByOwner(id);
    console.log("🚀 ~ GET ~ response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    throw new Error(500);
  }
}
