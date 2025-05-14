"use client";

import { ROLES } from "@/app/shared/const";
import { useUserStore } from "@/store/useUserStore";
import { useCategoriesStore } from "@/store/useRestaurantStore";
import { ChevronDown, MoveRightIcon, Search, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import _, { debounce } from "lodash";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

const menu = [
  {
    id: "restaurants",
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
    id: "contact",
    name: "Liên Hệ",
    href: "/contact",
    subMenu: [
      {
        name: "Đăng Ký Nhà Hàng",
        href: "/auth/business-register",
      },
    ],
  },
  { id: "news", name: "Tin Tức", href: "/news" },
];

const excludeUrl = ["/auth/login", "/auth/register", "/auth/business-register", "/admin"];

export const Header = () => {
  const user = useUserStore((state) => state.user);
  const categories = useCategoriesStore((state) => state.categories);
  const router = useRouter();
  const [openMenuUser, setIsOpenMenuUser] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isFetchingSearch, setIsFetchingSearch] = useState(false);
  const userMenuRef = useRef();
  const subMenuRef = useRef();
  const searchResultsRef = useRef();
  const searchValueRef = useRef("");
  const { data: session, status } = useSession();
  console.log("🚀 ~ Header ~ session:", session);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsOpenMenuUser(false);
      }
      if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
        setOpenSubMenu(null);
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowResults(false);
        setIsFetchingSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef, subMenuRef, searchResultsRef]);

  useEffect(() => {
    setSearchValue("");
    setShowResults(false);
    setResults([]);
    setIsFetchingSearch(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (session?.accessToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    }

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

  const renderSubMenu = (id, subMenu) => {
    const categoriesData = categories.map((category) => ({
      ...category,
      href: `/restaurants?categoryId=${category.id}`,
    }));

    const subMenuData = id === "restaurants" ? categoriesData : subMenu;
    return (
      <div
        ref={subMenuRef}
        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[#860001] ring-opacity-5 z-10"
        onMouseLeave={() => setOpenSubMenu(null)}
      >
        <div className="py-1">
          {subMenuData.map((subItem) => (
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
    );
  };

  const handleRedirectSearch = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      if (searchTerm) {
        router.push(`/restaurants?q=${searchTerm}`);
      }
    }
  };

  const fetchResults = async (searchText) => {
    const searchParams = encodeURIComponent(searchText);
    if (searchText !== searchValueRef.current) return;
    const res = await fetch(`/api/restaurants?q=${searchParams}&page=1&limit=5`, {
      method: "GET",
    });
    const data = await res.json();
    setIsFetchingSearch(false);
    setResults(data?.data);
    setShowResults(true);
  };

  const debounceFetchSearch = useCallback(debounce(fetchResults, 2000), []);

  const handleFetchDebouncedSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    searchValueRef.current = value;

    if (!value.trim()) {
      setIsFetchingSearch(false);
      setResults([]);
      setShowResults(false);
      return;
    }
    if (value.trim()) {
      setIsFetchingSearch(true);
      debounceFetchSearch(value);
    }
    setResults([]);
    setShowResults(false);
  };

  const renderResults = () => {
    if (isFetchingSearch && !showResults) {
      return (
        <>
          <span className="text-[16px] font-semibold">Đang tìm kiếm...</span>
          <img src="/magnify.svg" alt="loading" />
        </>
      );
    }

    if (!isFetchingSearch && showResults) {
      return !_.isEmpty(results) ? (
        <>
          <div className="w-full max-h-[300px] overflow-y-auto">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/restaurants/${item.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setSearchValue("");
                  setShowResults(false);
                }}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold">{item.name}</span>
                  <span className="text-[14px] text-gray-500 line-clamp-2">{item.address}</span>
                </div>
              </Link>
            ))}
            <Link
              href={"/restaurants?q=" + searchValue}
              className="text-[#FF9C00] font-semibold flex items-center gap-1"
            >
              Xem tất cả <MoveRightIcon size={16} />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="text-[16px] font-semibold">Không tìm thấy nhà hàng nào</div>
          <Link
            href={"/restaurants"}
            className="text-[#FF9C00] font-semibold flex items-center gap-1"
          >
            Xem tất cả <MoveRightIcon size={16} />
          </Link>
        </>
      );
    }
  };

  if (excludeUrl.some((url) => pathname.startsWith(url))) {
    return null;
  }
  return (
    <header className="sticky h-[80px] top-0 z-[999] bg-[#FF9C00] shadow-md">
      <div className="container mx-auto h-full w-full">
        <div className="flex items-center gap-[20px] justify-between py-[8px] h-full">
          <div className="flex items-center">
            <Link href="/" className="h-[80px] flex items-center text-left">
              <img src="/logo-e.png" alt="Logo" className="h-[80px]" />
            </Link>
          </div>
          <div className="relative mr-6 w-[300px] xl:w-[500px]">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleFetchDebouncedSearch(e)}
              placeholder="Tìm kiếm nhà hàng..."
              className="pl-10 pr-4 py-2 rounded-full border text-[#F2F2F2] border-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2] focus:border-transparent placeholder-gray-50 w-[300px] xl:w-[500px] transition-all duration-500"
              onKeyDown={(e) => handleRedirectSearch(e)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F2F2F2]"
              size={18}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity:
                  (isFetchingSearch && !showResults) || (!isFetchingSearch && showResults) ? 1 : 0,
                y:
                  (isFetchingSearch && !showResults) || (!isFetchingSearch && showResults)
                    ? 0
                    : -20,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              ref={searchResultsRef}
              className={`absolute top-12 flex justify-center items-center left-0 w-full bg-white shadow-lg rounded-md p-4 ${
                (isFetchingSearch && !showResults) || (!isFetchingSearch && showResults)
                  ? ""
                  : "pointer-events-none"
              }`}
            >
              {renderResults()}
            </motion.div>
          </div>

          {/* Menu Items */}
          <nav className="flex items-center space-x-6">
            {menu?.map((item) => (
              <div key={item.name} className="relative group whitespace-nowrap">
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
                {item.subMenu && openSubMenu === item.name && renderSubMenu(item.id, item.subMenu)}
              </div>
            ))}
          </nav>
          <div className="relative flex items-center h-full  justify-end cursor-pointer">
            {user ? (
              <div className="flex items-center gap-[8px]" onClick={handleOpenUserMenu}>
                <div className="text-[16px] text-[#1A1A1A] font-semibold line-clamp-1">
                  {user?.full_name}
                </div>
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
                        href="/profile/account"
                        className="block py-2"
                        onClick={() => setIsOpenMenuUser(false)}
                      >
                        Cài đặt
                      </Link>
                      {user?.role === ROLES.BUSINESS_OWNER && (
                        <Link
                          href="/admin/restaurants"
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
              <>
                <Link
                  href="/auth/register"
                  className="px-2 py-2 text-sm text-[16px] text-[#860001] rounded-md border-[2px] border-[#860001] hover:bg-[#860001] hover:text-white w-min whitespace-nowrap"
                >
                  Đăng ký
                </Link>
                <Link
                  href="/auth/login"
                  className="ml-2 px-2 py-2 text-sm text-[16px] text-[#860001] rounded-md border-[2px] border-[#860001] hover:bg-[#860001] hover:text-white w-min whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
