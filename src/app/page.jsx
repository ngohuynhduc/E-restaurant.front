import LogoutButton from "@/components/auth/LogoutButton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      <Link href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </Link>
      <LogoutButton />
    </div>
  );
}
