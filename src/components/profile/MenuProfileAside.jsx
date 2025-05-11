"use client";

import { CalendarClock, Star, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const MenuProfileAside = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("🚀 ~ MenuProfileAside ~ pathname:", pathname);

  const menuItems = [
    {
      title: "Thông tin tài khoản",
      path: "/profile/account",
      icon: <UserRoundSearch size={24} color="#FF9C00" />,
    },
    {
      title: "Lịch sử đặt bàn",
      path: "/profile/reservations-history",
      icon: <CalendarClock size={24} color="#FF9C00" />,
    },
    {
      title: "Đánh giá",
      path: "/profile/reviews",
      icon: <Star size={24} color="#FF9C00" />,
    },
  ];

  return (
    <aside className="w-[20%] h-fit sticky top-[90px] m-4">
      <div className="bg-white shadow-md rounded-lg p-4 w-[300px] mx-auto">
        <h2 className="font-bold text-lg mb-6 text-[#FF9C00]">Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
