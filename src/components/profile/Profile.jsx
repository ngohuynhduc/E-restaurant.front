"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfileClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>Profile (Client Component)</h1>
      <p>Welcome {session?.user.name}!</p>
      <p>Role: {session?.user.role}</p>
    </div>
  );
}
