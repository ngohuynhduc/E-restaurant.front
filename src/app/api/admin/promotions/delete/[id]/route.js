import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const paramsList = await params;
    const adminService = new AdminServices();
    const response = await adminService.deletePromotion(paramsList?.id);

    return NextResponse.json({ message: "Xóa thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
