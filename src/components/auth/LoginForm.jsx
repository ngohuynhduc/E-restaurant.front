"use client";

import { login } from "@/app/auth/login/action";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Tên người dùng
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            name="email"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          {state?.error && <p className="text-red-500 text-xs italic">{state.error}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Đăng nhập
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </div>
  );
}
