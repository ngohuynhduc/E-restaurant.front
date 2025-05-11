import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const adminService = new AdminServices();
    const response = await adminService.deleteCategory(params.id);

    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Xóa thất bại", status: 400 });
    }

    return NextResponse.json({ message: "Xóa thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { name } = await req.json();
    const adminService = new AdminServices();
    const response = await adminService.updateCategory(params.id, { name });

    if (response?.status !== ErrorsStatus.OK) {
      return NextResponse.json({ message: "Cập nhật thất bại", status: 400 });
    }

    return NextResponse.json({ message: "Cập nhật thành công!", status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau.", status: 500 });
  }
}
