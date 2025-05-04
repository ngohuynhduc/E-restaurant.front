import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Kiểm tra xem route có cần auth không
  const isAuthRequired = [
    "/dashboard",
    "/profile",
    "/settings",
    // Thêm các protected routes khác
  ].some((route) => pathname.startsWith(route));

  if (isAuthRequired) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Nếu không có token, chuyển hướng về trang login
    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/login).*)"],
};
