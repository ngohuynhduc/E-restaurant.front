import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const adminService = new AdminServices();
    const response = await adminService.createPromotion({ ...data });

    return NextResponse.json({ message: "Tạo thành công!", status: 200, response });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
