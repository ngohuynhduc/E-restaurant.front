"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import loginBG from "@/assets/img/login-bg.jpg";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSucess, setLoginSucess] = useState(false);
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    redirect("/");
  }

  useEffect(() => {
    if (loginSucess && !loading) router.push(callbackUrl);
  }, [loginSucess, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Sai tài khoản hoặc mật khẩu!");
      } else {
        setLoginSucess(true);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {status === "unauthenticated" && (
        <div className="relative h-screen w-full overflow-hidden">
          {/* Background hình ảnh với animation */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center animate-slow-pan"
            style={{
              backgroundImage: `url(${loginBG.src})`,
            }}
          ></div>

          {/* Container chính */}
          <div className="relative h-full w-full flex items-center justify-center p-4">
            {/* Form đăng nhập với nền blur */}
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-500 hover:shadow-xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#FC8842]">Đăng Nhập</h1>
              </div>

              {error && <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                    placeholder="youremail@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <a href="#" className="text-sm text-[#FC8842] hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FC8842] text-white py-2 px-4 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-medium"
                >
                  {loading ? "Đang đăng nhập" : "Đăng nhập"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
