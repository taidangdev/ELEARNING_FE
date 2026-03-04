"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDT: "",
    maNhom: "GP01", // Mã nhóm mặc định
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Log form data trước khi gửi
    console.log("Form Data trước khi gửi:", formData);

    try {
      const result = await registerUser(formData);

      if (result.success) {
        // Hiển thị alert và redirect
        alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        router.push("/login");
      } else {
        setError(result.message || "Đăng ký thất bại. Vui lòng thử lại!");
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
          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
                Đăng Ký Tài Khoản
              </h1>
              <p className="text-gray-600">
                Tạo tài khoản mới để bắt đầu học tập
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div className="flex-1">
                    <p className="text-red-600 text-sm font-semibold mb-1">
                      {error}
                    </p>
                    {error.toLowerCase().includes("tồn tại") && (
                      <p className="text-red-500 text-xs">
                        💡 Vui lòng thử với tài khoản, email hoặc số điện thoại
                        khác
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
                />
              </div>

              {/* Họ tên */}
              <div>
                <label
                  htmlFor="hoTen"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none"
                  placeholder="Nhập email"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label
                  htmlFor="soDT"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="soDT"
                  name="soDT"
                  value={formData.soDT}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Mã nhóm (GP01, GP02, ...) */}
              <div>
                <label
                  htmlFor="maNhom"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mã nhóm <span className="text-red-500">*</span>
                </label>
                <select
                  id="maNhom"
                  name="maNhom"
                  value={formData.maNhom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           transition outline-none bg-white"
                >
                  <option value="GP01">Nhóm GP01</option>
                  <option value="GP02">Nhóm GP02</option>
                  <option value="GP03">Nhóm GP03</option>
                  <option value="GP04">Nhóm GP04</option>
                  <option value="GP05">Nhóm GP05</option>
                  <option value="GP06">Nhóm GP06</option>
                  <option value="GP07">Nhóm GP07</option>
                  <option value="GP08">Nhóm GP08</option>
                  <option value="GP09">Nhóm GP09</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 
                         text-white font-semibold rounded-lg hover:brightness-110 
                         transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </button>
            </form>

            {/* Link to Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 
                           hover:underline transition"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
