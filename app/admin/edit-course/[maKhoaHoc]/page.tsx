"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getDanhMucKhoaHoc,
  capNhatKhoaHoc,
  getThongTinKhoaHoc,
} from "../../../services/quanglykhoahoc";
import { getCurrentUser, isLoggedIn } from "../../../services/authClient";
import Link from "next/link";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const maKhoaHocParam = params.maKhoaHoc as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    maKhoaHoc: "",
    tenKhoaHoc: "",
    biDanh: "",
    moTa: "",
    luotXem: 0,
    danhGia: 0,
    hinhAnh: "",
    maNhom: "GP01",
    maDanhMucKhoaHoc: "",
    ngayTao: "",
    taiKhoanNguoiTao: "",
  });

  useEffect(() => {
    // 1. Kiểm tra đăng nhập và quyền Giáo vụ
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

    // 2. Fetch danh mục & thông tin khóa học
    const fetchInitialData = async () => {
      try {
        const cats = await getDanhMucKhoaHoc();
        setCategories(cats);

        if (maKhoaHocParam) {
          const courseInfo = await getThongTinKhoaHoc(maKhoaHocParam);
          if (courseInfo) {
            setFormData({
              maKhoaHoc: courseInfo.maKhoaHoc,
              tenKhoaHoc: courseInfo.tenKhoaHoc,
              biDanh: courseInfo.biDanh || "",
              moTa: courseInfo.moTa || "",
              luotXem: courseInfo.luotXem || 0,
              danhGia: courseInfo.danhGia || 0,
              hinhAnh: courseInfo.hinhAnh || "",
              maNhom: courseInfo.maNhom || "GP01",
              maDanhMucKhoaHoc:
                courseInfo.danhMucKhoaHoc?.maDanhMucKhoahoc ||
                courseInfo.danhMucKhoaHoc?.maDanhMuc ||
                (cats.length > 0 ? cats[0].maDanhMuc : ""),
              ngayTao: courseInfo.ngayTao || "",
              taiKhoanNguoiTao:
                courseInfo.nguoiTao?.taiKhoan || currentUser.taiKhoan,
            });
          }
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router, maKhoaHocParam]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData({ ...formData, tenKhoaHoc: name, biDanh: slug });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.maKhoaHoc || !formData.tenKhoaHoc || !formData.hinhAnh) {
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await capNhatKhoaHoc(formData);
      if (res.success) {
        alert("Cập nhật khóa học thành công!");
        router.push("/admin");
      } else {
        alert("Lỗi: " + (res.message || "Không thể cập nhật khóa học."));
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 text-center font-bold">
        Đang tải thông tin khóa học...
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-slate-50 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
          >
            ← Quay lại
          </Link>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Chỉnh Sửa Khóa Học
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mã khóa học (Không thể sửa) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mã khóa học * (Không thể đổi)
                </label>
                <input
                  type="text"
                  name="maKhoaHoc"
                  value={formData.maKhoaHoc}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none transition"
                  required
                />
              </div>

              {/* Tên khóa học */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tên khóa học *
                </label>
                <input
                  type="text"
                  name="tenKhoaHoc"
                  value={formData.tenKhoaHoc}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  required
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Danh mục khóa học
                </label>
                <select
                  name="maDanhMucKhoaHoc"
                  value={formData.maDanhMucKhoaHoc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  {categories.map((cat: any) => (
                    <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mã nhóm */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mã nhóm
                </label>
                <select
                  name="maNhom"
                  value={formData.maNhom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="GP01">GP01</option>
                  <option value="GP02">GP02</option>
                  <option value="GP03">GP03</option>
                  <option value="GP04">GP04</option>
                  <option value="GP05">GP05</option>
                  <option value="GP06">GP06</option>
                  <option value="GP07">GP07</option>
                  <option value="GP08">GP08</option>
                  <option value="GP09">GP09</option>
                </select>
              </div>

              {/* Hình ảnh */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Đường dẫn hình ảnh (URL) *
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {formData.hinhAnh ? (
                      <img
                        src={formData.hinhAnh}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) =>
                          (e.target.src = "https://picsum.photos/100")
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        🖼️
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="hinhAnh"
                    value={formData.hinhAnh}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mô tả khóa học
                </label>
                <textarea
                  name="moTa"
                  rows={4}
                  value={formData.moTa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-slate-500">
                👤 Cập nhật bởi:{" "}
                <span className="font-bold text-amber-600">{user?.hoTen}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition shadow-xl shadow-amber-100 disabled:opacity-50"
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
