import { NextResponse } from "next/server";
import { RestaurantService } from "@/services/restaurantsService";
import _ from "lodash";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const categoryId = searchParams.get("categoryId") || "";
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const keyword = searchParams.get("q") || "";
    const dayOfWeek = searchParams.get("dayOfWeek") || "";

    const filterData = {
      page,
      limit,
      categoryId,
      priceMin,
      priceMax,
      keyword,
      dayOfWeek,
    };
    const paramsPick = _.pickBy(filterData, (value) => {
      return value !== "" && value !== "0" && value !== null;
    });

    const query = new URLSearchParams(paramsPick).toString();
    const restaurantsService = new RestaurantService();
    const response = await restaurantsService.getListRestaurant(query);
    return NextResponse.json(response?.data);
  } catch (error) {
    throw new Error(500);
  }
}
