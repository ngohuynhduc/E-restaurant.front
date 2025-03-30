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
    return NextResponse.json({ message: "Failed get user" }, { status: 500 });
  }
}
