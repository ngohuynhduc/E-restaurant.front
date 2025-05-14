import { UserService } from "@/services/userService";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const userService = new UserService();
    const response = await userService.writeReview(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in POST /reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
