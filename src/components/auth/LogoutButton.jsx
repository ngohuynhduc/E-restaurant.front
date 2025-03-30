"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session?.accessToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    }

    // Đăng xuất trên NextAuth
    signOut({ callbackUrl: "/" });
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
      Đăng xuất
    </button>
  );
}
