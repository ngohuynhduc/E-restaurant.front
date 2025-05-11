import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";
import _ from "lodash";
import { AdminServices } from "@/services/adminService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const keyword = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";

    const filterData = {
      page,
      limit,
      keyword,
      status,
    };
    const paramsPick = _.pickBy(filterData, (value) => {
      return value !== "" && value !== "0" && value !== null;
    });

    const query = new URLSearchParams(paramsPick).toString();
    const adminServices = new AdminServices();
    const response = await adminServices.getListRestaurant(query);
    console.log("🚀 ~ GET ~ response:", response);
    return NextResponse.json(response?.response);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    throw new Error(500);
  }
}
