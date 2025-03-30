"use client";

import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const UserProvider = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);
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
  return <>{children}</>;
};
