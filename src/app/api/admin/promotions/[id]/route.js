import { NextResponse } from "next/server";
import _ from "lodash";
import { AdminServices } from "@/services/adminService";

export async function GET(req, { params }) {
  try {
    const paramsList = await params;

    const adminServices = new AdminServices();
    const response = await adminServices.getListPromotionsByRestaurant(paramsList?.id);
    return NextResponse.json(response);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    throw new Error(500);
  }
}
