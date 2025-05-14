import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { AdminServices } from "@/services/adminService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import validator from "validator";

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

export async function PATCH(req, { params }) {
  try {
    const paramId = await params;
    const { status } = await req.json();
    const adminService = new AdminServices();
    const response = await adminService.updateStatusRestaurant(paramId?.id, { status });

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

export async function PUT(req) {
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

    if (!validator.isMobilePhone(hotline, "vi-VN")) {
      return NextResponse.json(
        { message: "Hotline không hợp lệ" },
        { status: ErrorsStatus.Bad_Request }
      );
    }

    const buildHeader = new Headers();
    buildHeader.append("Content-Type", "application/json");
    buildHeader.append("Authorization", `Bearer ${session.accessToken}`);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/restaurants/${requestData?.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...requestData,
        }),
        headers: buildHeader,
      }
    );
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
