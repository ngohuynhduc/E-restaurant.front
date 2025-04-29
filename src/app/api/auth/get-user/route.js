import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { UserService } from "@/services/userService";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.accessToken) {
      const userServices = new UserService();
      const response = await userServices.getUserInfo();
      return NextResponse.json(response);
    }
  } catch (error) {
    if (error?.message === "Token expired") {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }
    throw NextResponse.json({ message: "Failed get user" }, { status: 500 });
  }
}
