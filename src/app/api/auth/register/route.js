import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { redirect } from "next/dist/server/api-utils";
import validator from "validator";
import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { ROLES } from "@/app/shared/const";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { email, password, confirm_password, full_name, phone } = await req.json();
    if (session) {
      redirect("/");
    }

    // validate
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Email sai định dạng" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!validator.isLength(password, { min: 6 })) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { message: "Mật khẩu không khớp" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!validator.isLength(full_name, { min: 6 })) {
      return NextResponse.json(
        { message: "Họ tên phải có ít nhất 6 ký tự" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!validator.isMobilePhone(phone, "vi-VN")) {
      return NextResponse.json(
        { message: "Số điện thoại không hợp lệ" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, full_name, phone, role: ROLES.USER }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data?.status === ErrorsStatus.Created) {
      return NextResponse.json({ message: "Đăng ký thành công" }, { status: data?.status });
    } else {
      return NextResponse.json({ message: data?.message }, { status: data?.status });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra. Vui lòng thử lại sau" },
      { status: ErrorsStatus.Internal_Server_Error }
    );
  }
}
