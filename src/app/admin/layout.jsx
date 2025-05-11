import { HeaderAdmin } from "@/components/admin/HeaderAdmin";
import { Sidebar } from "@/components/admin/SideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ROLES } from "../shared/const";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ AdminLayout ~ session:", session);

  if (session?.user?.role === ROLES.USER) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Bạn không có quyền truy cập vào trang này</h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full">
        <HeaderAdmin />
        <main className="pt-16 pl-16 p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
