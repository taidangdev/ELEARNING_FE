"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDanhSachKhoaHocPhanTrang,
  xoaKhoaHoc,
} from "../services/quanglykhoahoc";
import { getCurrentUser, isLoggedIn } from "../services/authClient";
import Link from "next/link";
import Image from "next/image";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [coursesData, setCoursesData] = useState<any>({
    items: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

    // Debouncing the search for the API
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(page, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [router, page, searchTerm]);

  const fetchCourses = async (currentPage: number, searchKeyword: string) => {
    setIsLoading(true);
    try {
      const data = await getDanhSachKhoaHocPhanTrang(
        currentPage,
        pageSize,
        searchKeyword,
      );
      if (data) {
        setCoursesData({
          items: data.items || [],
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
        });
      } else {
        setCoursesData({
          items: [],
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        });
      }
    } catch (error) {
      console.error("Lỗi tải khóa học phân trang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (maKhoaHoc: string, tenKhoaHoc: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa khóa học "${tenKhoaHoc}" không? Hành động này không thể hoàn tác.`,
      )
    ) {
      const res = await xoaKhoaHoc(maKhoaHoc);
      if (res.success) {
        alert("Xóa khóa học thành công!");
        fetchCourses(page, searchTerm);
      } else {
        alert("Lỗi: " + res.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 text-center font-bold text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-slate-50 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Quản Trị Khóa Học
            </h1>
            <p className="text-slate-500 mt-2">
              Quản lý các khóa học trên hệ thống EduCenter
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm"
            >
              👥 QUẢN LÝ NGƯỜI DÙNG
            </Link>
            <Link
              href="/admin/add-course"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition shadow-lg shadow-indigo-200"
            >
              <span className="text-xl">+</span> THÊM KHÓA HỌC
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
          {/* Thanh tìm kiếm */}
          <div className="mb-6 flex">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-md px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-40">
                    Mã KH
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-32">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">
                    Tên khóa học
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-32">
                    Lượt xem
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-48 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coursesData.items.length > 0 ? (
                  coursesData.items.map((course: any) => (
                    <tr
                      key={course.maKhoaHoc}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {course.maKhoaHoc}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 relative">
                          <img
                            src={course.hinhAnh}
                            alt={course.tenKhoaHoc}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = "https://picsum.photos/200/100";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {course.tenKhoaHoc}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {course.moTa}
                        </div>
                        <span className="inline-block mt-1 px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-md font-medium">
                          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                            "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        👁️ {course.luotXem}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/admin/enrollment/course/${course.maKhoaHoc}`}
                          className="inline-block px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-100 transition"
                        >
                          Ghi danh
                        </Link>
                        <Link
                          href={`/admin/edit-course/${course.maKhoaHoc}`}
                          className="inline-block px-3 py-2 bg-amber-50 text-amber-600 rounded-lg font-semibold hover:bg-amber-100 transition"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(course.maKhoaHoc, course.tenKhoaHoc)
                          }
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Không tìm thấy khóa học nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Tổng cộng:{" "}
              <span className="font-bold">{coursesData.totalCount}</span> khóa
              học
            </div>
            {coursesData.totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-slate-600"
                >
                  Trang trước
                </button>
                <div className="flex items-center px-4 font-semibold text-indigo-600 bg-indigo-50 rounded-lg">
                  {page} / {coursesData.totalPages}
                </div>
                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, coursesData.totalPages),
                    )
                  }
                  disabled={page === coursesData.totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-slate-600"
                >
                  Trang tiếp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
