"use client";

import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfileClient() {
  const { data: session, status } = useSession();

  const userData = useUserStore((state) => state.user);
  console.log("🚀 ~ ProfileClient ~ userData:", userData);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Profile (Client Component)</h1>
      <p>Welcome {session?.user.name}!</p>
      <p>Role: {session?.user.role}</p>
    </div>
  );
}
