"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart2,
  DollarSign,
  MessageSquare,
  Calendar,
  Lock,
  UserPlus,
  ChevronUp,
  ChevronDown,
  Megaphone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

// Sidebar Component
export const Sidebar = () => {
  const { user } = useUserStore((state) => state);
  console.log("🚀 ~ Sidebar ~ user:", user);
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN";
  const isMerchant = user?.role === "BUSINESS_OWNER";
  const isUser = user?.role === "USER";

  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({
    dashboard: true,
    ecommerce: false,
    community: false,
    finance: false,
    jobBoard: false,
    tasks: false,
    settings: false,
    utility: false,
    authentication: false,
    onboarding: false,
    components: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="w-64 bg-white h-screen sticky top-0 flex flex-col border-r overflow-y-auto">
      <div className="p-4 flex items-center  justify-center">
        <Link href="/admin/dashboard" className="flex items-center text-left">
          <img src="/logo-e.png" alt="Logo" />
        </Link>
      </div>

      {/* Menu Sections */}
      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Pages</div>
      <div className="flex-1 px-3">
        {isAdmin && (
          <>
            <div className="mb-1">
              <Link
                href={"/admin/dashboard"}
                className={`flex items-center justify-between w-full p-2 rounded-lg ${
                  pathname.includes("/dashboard")
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <LayoutDashboard size={18} className="mr-2" />
                  <span className="font-medium">Tổng quan</span>
                </div>
              </Link>
            </div>
            <div className="mb-1">
              <Link
                href="/admin/categories"
                className={`flex items-center justify-between w-full p-2 rounded-lg ${
                  pathname.includes("/categories")
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <BarChart2 size={18} className="mr-2" />
                  <span className="font-medium">Quản lý danh mục</span>
                </div>
              </Link>
            </div>
            <div className="mb-1">
              <Link
                href="/admin/users"
                className={`flex items-center justify-between w-full p-2 rounded-lg ${
                  pathname.includes("/users")
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <UserPlus size={18} className="mr-2" />
                  <span className="font-medium">Quản lý thành viên</span>
                </div>
              </Link>
            </div>
            <div className="mb-1">
              <Link
                href="/admin/stats"
                className={`flex items-center justify-between w-full p-2 rounded-lg ${
                  pathname.includes("/stats")
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span className="font-medium">Thống kê</span>
                </div>
              </Link>
            </div>
          </>
        )}

        <div className="mb-1">
          <Link
            href="/admin/restaurants"
            className={`flex items-center justify-between w-full p-2 rounded-lg ${
              pathname.includes("/restaurants")
                ? "bg-violet-100 text-violet-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <DollarSign size={18} className="mr-2" />
              <span className="font-medium">Quản lý nhà hàng</span>
            </div>
          </Link>
        </div>

        {/* Finance */}

        <div className="mb-1">
          <Link
            href="/messages"
            className="flex items-center justify-between w-full p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <MessageSquare size={18} className="mr-2" />
              <span className="font-medium">Tin nhắn</span>
            </div>
            <div className="bg-violet-500 rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-white text-xs">4</span>
            </div>
          </Link>
        </div>

        {isMerchant && (
          <div className="mb-1">
            <Link
              href="/admin/reservations"
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                pathname.includes("/reservations")
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Megaphone size={18} className="mr-2" />
                <span className="font-medium">Tình trạng đặt bàn</span>
              </div>
            </Link>
          </div>
        )}

        {/* More Section */}
        <div className="mt-6">
          <div className="px-1 py-2 text-xs font-medium text-gray-500 uppercase">Cài đặt</div>

          {/* Authentication */}
          <div className="mb-1">
            <Link
              href="/"
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                pathname.startsWith("/auth")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Lock size={18} className="mr-2" />
                <span className="font-medium">Về trang chủ</span>
              </div>
            </Link>
          </div>

          {/* Onboarding */}
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("onboarding")}
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                pathname.startsWith("/onboarding")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <UserPlus size={18} className="mr-2" />
                <span className="font-medium">Đăng xuất</span>
              </div>
              {openMenus.onboarding ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Components */}
          {/* <div className="mb-1">
            <button
              onClick={() => toggleMenu("components")}
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                pathname.startsWith("/components")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Package size={18} className="mr-2" />
                <span className="font-medium">Components</span>
              </div>
              {openMenus.components ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
