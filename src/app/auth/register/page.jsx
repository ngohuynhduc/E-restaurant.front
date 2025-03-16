"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import loginBG from "@/assets/img/login-bg.jpg";
import { ErrorsStatus } from "@/app/shared/errorsStatus";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    redirect("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      const response = await result?.json();

      if (result?.ok && result?.status === ErrorsStatus.Created) {
        router.push("/auth/login");
      }

      if (!result?.ok && response?.message) {
        setError(response?.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      {status === "unauthenticated" && (
        <div className="flex h-screen w-full">
          {/* Phần hình ảnh - chiếm 1/2 màn hình */}
          <div className="relative w-1/2 h-full hidden md:block">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center animate-pulse"
              style={{
                backgroundImage: `url(${loginBG.src})`,
                animation: "slowPan 20s infinite alternate ease-in-out",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
          </div>

          {/* Phần form đăng ký - chiếm 1/2 màn hình */}
          <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#FC8842]">Đăng Ký</h1>
              </div>

              {error && <div className="p-4 bg-red-100 text-red-800 rounded mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-bold text-gray-700 mb-1"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    value={registerData.confirm_password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirm_password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    value={registerData.full_name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, full_name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FC8842] text-white py-2 px-4 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Đã có tài khoản?{" "}
                    <a href="/auth/login" className="text-[#FC8842] hover:underline font-medium">
                      Đăng nhập
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
