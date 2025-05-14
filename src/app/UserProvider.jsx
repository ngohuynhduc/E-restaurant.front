"use client";

import { useUserStore } from "@/store/useUserStore";
import { useCategoriesStore } from "@/store/useRestaurantStore";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ErrorsStatus } from "./shared/errorsStatus";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocationStore } from "@/store/useLocationStore";

export const UserProvider = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const setLocation = useLocationStore((state) => state.setLocation);

  const { status } = useSession();
  const pathname = usePathname(); //
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ latitude, longitude });
    }
  }, [latitude, longitude, setLocation]);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated") {
        const response = await fetch("/api/auth/get-user");
        const userInfo = await response.json();
        if (
          !response.ok &&
          response.status === ErrorsStatus.Unauthorized &&
          userInfo?.message === "Token expired"
        ) {
          setUser(null);
          signOut({ callbackUrl: "/" });
          return;
        }
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
