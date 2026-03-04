"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  capNhatThongTinNguoiDung,
  getThongTinNguoiDungTaiKhoan,
} from "../../../../services/quanlynguoidung";
import { isLoggedIn, getCurrentUser } from "../../../../services/authClient";
import Link from "next/link";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const taiKhoanParam =
    typeof params.taiKhoan === "string"
      ? decodeURIComponent(params.taiKhoan)
      : "";

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    maLoaiNguoiDung: "HV",
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

    const fetchInitialData = async () => {
      try {
        if (taiKhoanParam) {
          const userInfo = await getThongTinNguoiDungTaiKhoan(taiKhoanParam);
          if (userInfo) {
            setFormData({
              taiKhoan: userInfo.taiKhoan,
              matKhau: userInfo.matKhau || "",
              hoTen: userInfo.hoTen || "",
              email: userInfo.email || "",
              soDT: userInfo.soDT || "",
              maLoaiNguoiDung: userInfo.maLoaiNguoiDung || "HV",
              maNhom: "GP01",
            });
          } else {
            alert("Không tìm thấy thông tin người dùng!");
            router.push("/admin/users");
          }
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router, taiKhoanParam]);

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
      const res = await capNhatThongTinNguoiDung(formData);
      if (res.success) {
        alert("Cập nhật thông tin người dùng thành công!");
        router.push("/admin/users");
      } else {
        alert("Lỗi: " + (res.message || "Không thể cập nhật người dùng."));
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 text-center font-bold text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        Đang tải thông tin người dùng...
      </div>
    );
  }

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
            Chỉnh Sửa Người Dùng
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tài khoản * (Không thể đổi)
                </label>
                <input
                  type="text"
                  name="taiKhoan"
                  value={formData.taiKhoan}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition bg-amber-50 font-semibold text-amber-700"
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
                <span className="font-bold text-amber-600">{user?.hoTen}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition shadow-xl shadow-amber-200 disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "CẬP NHẬT GHI NHẬN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
