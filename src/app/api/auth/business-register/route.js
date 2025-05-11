import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import validator from "validator";
import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { ROLES } from "@/app/shared/const";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const requestData = await req.json();
    const {
      email,
      password,
      confirm_password,
      full_name,
      phone,
      name,
      address,
      coordinate,
      hotline,
      description,
      menu_image,
      restaurant_image,
      tables,
    } = requestData;

    // validate
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Email sai định dạng" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!session && !validator.isLength(password, { min: 6 })) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!session && password !== confirm_password) {
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

    if (!session && !validator.isMobilePhone(phone, "vi-VN")) {
      return NextResponse.json(
        { message: "Số điện thoại không hợp lệ" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    if (!validator.isMobilePhone(hotline, "vi-VN")) {
      return NextResponse.json(
        { message: "Hotline không hợp lệ" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    const buildHeader = new Headers();
    buildHeader.append("Content-Type", "application/json");
    if (session?.accessToken) {
      buildHeader.append("Authorization", `Bearer ${session.accessToken}`);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/business-register`, {
      method: "POST",
      body: JSON.stringify({
        ...requestData,
        role: ROLES.BUSINESS_OWNER,
      }),
      headers: buildHeader,
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
