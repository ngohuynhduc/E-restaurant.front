import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile/Profile";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ ProfilePage ~ session:", session);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      {/* <h1>Profile (Server Component)</h1>
      <p>Server rendered: {session.user.name}</p>
      <p>Role: {session.user.role}</p> */}

      {/* Client component if needed */}
      <ProfileClient />
    </div>
  );
}
