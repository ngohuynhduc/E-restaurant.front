import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name } = await req.json();
    const adminService = new AdminServices();
    const response = await adminService.createCategory({ name });

    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Tạo thất bại", status: 400 });
    }

    return NextResponse.json({ message: "Tạo thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt bàn:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
