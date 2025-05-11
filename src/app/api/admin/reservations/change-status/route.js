import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { status, id } = await req.json();
    const adminService = new AdminServices();
    const response = await adminService.updateStatusReservation(id, { status });

    console.log("🚀 ~ PATCH ~ response:", response);
    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Cập nhật thất bại", status: 400 });
    }

    return NextResponse.json({ message: "Cập nhật thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
