"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { themNguoiDung } from "../../../services/quanlynguoidung";
import { isLoggedIn, getCurrentUser } from "../../../services/authClient";
import Link from "next/link";

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    maLoaiNguoiDung: "HV", // Mặc định là HV
    maNhom: "GP01",
    email: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("Vui lòng đăng nhập để truy cập trang này!");
      router.push("/login");
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser?.maLoaiNguoiDung !== "GV") {
      alert("Bạn không có quyền truy cập trang quản trị này!");
      router.push("/");
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.taiKhoan ||
      !formData.matKhau ||
      !formData.hoTen ||
      !formData.email ||
      !formData.soDT
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await themNguoiDung(formData);
      if (res.success) {
        alert("Thêm người dùng mới thành công!");
        router.push("/admin/users");
      } else {
        alert("Lỗi: " + (res.message || "Không thể thêm người dùng."));
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-20 min-h-screen bg-slate-50 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/users"
            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
          >
            ← Quay lại
          </Link>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Thêm Người Dùng Mới
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tài khoản *
                </label>
                <input
                  type="text"
                  name="taiKhoan"
                  value={formData.taiKhoan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="matKhau"
                  value={formData.matKhau}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  name="soDT"
                  value={formData.soDT}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Loại người dùng (Chức vụ) *
                </label>
                <select
                  name="maLoaiNguoiDung"
                  value={formData.maLoaiNguoiDung}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-indigo-50 font-semibold text-indigo-700"
                >
                  <option value="HV">Học viên - HV</option>
                  <option value="GV">Giáo vụ - GV</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  Chỉ quản trị viên mới có thể thay đổi mục này.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-slate-500">
                👤 Quản trị thi hành:{" "}
                <span className="font-bold text-indigo-600">{user?.hoTen}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition shadow-xl shadow-indigo-200 disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "THÊM NGƯỜI DÙNG"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
