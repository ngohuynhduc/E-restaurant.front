import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
}
