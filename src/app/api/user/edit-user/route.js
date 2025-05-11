import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { UserService } from "@/services/userService";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const requestData = await req.json();
    const { full_name, phone } = requestData;

    if (!full_name && !phone) {
      return NextResponse.json({ message: "Thiếu thông tin người dùng" }, { status: 400 });
    }

    const userService = new UserService();
    const response = await userService.updateUserInfo({
      full_name,
      phone,
    });

    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Cập nhật thông tin thất bại!", status: 400 });
    }

    return NextResponse.json({ message: "Cập nhật thông tin thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
