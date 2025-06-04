import { UserService } from "@/services/userService";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  try {
    const body = await req.json();
    const paramsList = await params;
    const userService = new UserService();
    const response = await userService.updateReview(body, paramsList?.id);
    console.log("🚀 ~ PUT ~ response:", response);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const paramsList = await params;
    const userService = new UserService();
    const response = await userService.deleteReview(paramsList?.id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
