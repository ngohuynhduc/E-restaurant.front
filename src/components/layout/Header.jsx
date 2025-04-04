"use client";

import { ROLES } from "@/app/shared/const";
import { useUserStore } from "@/store/useUserStore";
import { ChevronDown, Search, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const menu = [
  {
    name: "Nhà Hàng",
    href: "/restaurants",
    subMenu: [
      { name: "Hải sản", href: "/restaurants/seafood" },
      { name: "Nẩu", href: "/restaurants/hotpot" },
      { name: "Nướng", href: "/restaurants/grill" },
      { name: "Buffet", href: "/restaurants/buffet" },
    ],
  },
  {
    name: "Liên Hệ",
    href: "/contact",
    subMenu: [
      {
        name: "Đăng Ký Nhà Hàng",
        href: "/auth/business-register",
      },
    ],
  },
  { name: "Tin Tức", href: "/news" },
];

const excludeUrl = ["/auth/login", "/auth/register", "/auth/business-register"];

export const Header = () => {
  const user = useUserStore((state) => state.user);
  const [openMenuUser, setIsOpenMenuUser] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const userMenuRef = useRef();

  const { data: session, status } = useSession();
  console.log("🚀 ~ Header ~ session:", status);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsOpenMenuUser(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogout = async () => {
    if (session?.accessToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    }

    // Đăng xuất trên NextAuth
    signOut({ callbackUrl: "/" });
  };

  const handleSubMenuToggle = (menuName) => {
    if (openSubMenu === menuName) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(menuName);
    }
  };

  const handleOpenUserMenu = () => {
    setIsOpenMenuUser(!openMenuUser);
    setOpenSubMenu(null);
  };

  if (excludeUrl.includes(pathname)) {
    return null;
  }

  return (
    <header className="sticky h-[80px] top-0 z-[999] bg-[#FF9C00] shadow-md">
      <div className="container mx-auto h-full w-full">
        <div className="flex items-center gap-[100px] justify-between py-[8px] h-full">
          <div className="flex items-center">
            <Link href="/" className="h-[80px] flex items-center text-left">
              <img src="/logo-e.png" alt="Logo" className="h-[80px]" />
            </Link>
          </div>
          <div className="relative mr-6 w-[400px]">
            <input
              type="text"
              placeholder="Tìm kiếm nhà hàng..."
              className="pl-10 pr-4 py-2 rounded-full border text-[#F2F2F2] border-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2] focus:border-transparent placeholder-gray-50 w-[400px] transition-all duration-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F2F2F2]"
              size={18}
            />
          </div>

          {/* Menu Items */}
          <nav className="flex items-center space-x-6">
            {menu?.map((item) => (
              <div key={item.name} className="relative group">
                {item.subMenu ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-[16px] font-medium uppercase text-[#F2F2F2] cursor-pointer hover:text-[#860001]"
                    onMouseEnter={() => handleSubMenuToggle(item.name)}
                  >
                    <span>{item.name}</span>
                    <span
                      className={`transition-transform duration-200 ${
                        openSubMenu === item.name ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={20} />
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[16px] font-medium uppercase text-[#F2F2F2] hover:text-[#860001]"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown for submenus */}
                {item.subMenu && openSubMenu === item.name && (
                  <div
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[#860001] ring-opacity-5 z-10"
                    onMouseLeave={() => setOpenSubMenu(null)}
                  >
                    <div className="py-1">
                      {item.subMenu?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-gray-100 hover:text-[#860001]"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="relative flex items-center h-full  justify-end cursor-pointer">
            {user ? (
              <div className="flex items-center gap-[8px]" onClick={handleOpenUserMenu}>
                <div className="text-[16px] text-[#1A1A1A] font-semibold">{user?.full_name}</div>
                <div>
                  <UserRound size={24} color="#860001" />
                </div>
                {openMenuUser && (
                  <div
                    className="absolute top-[50px] mx-auto w-[165px] shadow-md rounded-md text-center bg-white border border-[#860001] text-[#860001]"
                    ref={userMenuRef}
                  >
                    <div className="py-2 px-4 [&>*]:border-b [&>*]:border-[#860001]">
                      <Link
                        href="/profile"
                        className="block py-2"
                        onClick={() => setIsOpenMenuUser(false)}
                      >
                        Cài đặt
                      </Link>
                      {user?.role === ROLES.BUSINESS_OWNER && (
                        <Link
                          href="/dashboard"
                          className="block py-2"
                          onClick={() => setIsOpenMenuUser(false)}
                        >
                          Quản lý cửa hàng
                        </Link>
                      )}
                      <div onClick={handleLogout} className="block py-2 border-none">
                        Đăng xuất
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm text-[16px] text-[#860001] rounded-md border-[2px] border-[#860001] hover:bg-[#860001] hover:text-white"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
