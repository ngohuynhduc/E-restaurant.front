"use client";

import { useUserStore } from "@/store/useUserStore";
import { useCategoriesStore } from "@/store/useRestaurantStore";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const UserProvider = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const { status } = useSession();
  console.log("🚀 ~ UserProvider ~ status:", status);
  const pathname = usePathname(); //

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated") {
        const response = await fetch("/api/auth/get-user");
        const userInfo = await response.json();
        console.log("🚀 ~ fetchUser ~ userInfo:", userInfo);

        setUser(userInfo?.data);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [status, pathname]);

  useEffect(() => {
    const publicPath = ["/auth"];
    if (publicPath.includes(pathname)) {
      setCategories([]);
      return;
    }

    const fetchCateGories = async () => {
      const response = await fetch("/api/restaurants/category");
      const categories = await response.json();
      setCategories(categories?.data);
    };

    fetchCateGories();
  }, []);

  return <>{children}</>;
};
