"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Form Data đăng nhập:", formData);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        if (typeof window !== "undefined" && result.data) {
          try {
            const token = (result.data as any).accessToken;
            if (token) {
              localStorage.setItem("accessToken", token);
            }
            localStorage.setItem("user", JSON.stringify(result.data));
          } catch {
            // ignore lỗi lưu localStorage
          }
        }
        
        // Hiển thị thông báo và redirect về trang chủ
        alert("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
        router.push("/");
      } else {
        setError(result.message || "Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="pt-28 min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
                Đăng Nhập
              </h1>
              <p className="text-gray-600">
                Chào mừng bạn quay trở lại
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div className="flex-1">
                    <p className="text-red-600 text-sm font-semibold">
                      {error}
                    </p>
                    {error.toLowerCase().includes("sai") && (
                      <p className="text-red-500 text-xs mt-1">
                        💡 Vui lòng kiểm tra lại tài khoản và mật khẩu
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tài khoản */}
              <div>
                <label
                  htmlFor="taiKhoan"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taiKhoan"
                  name="taiKhoan"
                  value={formData.taiKhoan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none"
                  placeholder="Nhập tên tài khoản"
                  autoComplete="username"
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label
                  htmlFor="matKhau"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="matKhau"
                  name="matKhau"
                  value={formData.matKhau}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 
                         text-white font-semibold rounded-lg hover:brightness-110 
                         transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Link to Register */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 
                           hover:underline transition"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

