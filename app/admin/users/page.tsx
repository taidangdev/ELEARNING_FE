"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDanhSachNguoiDungPhanTrang,
  xoaNguoiDung,
} from "../../services/quanlynguoidung";
import { getCurrentUser, isLoggedIn } from "../../services/authClient";
import Link from "next/link";

export default function AdminUsersPage() {
  const router = useRouter();
  const [usersData, setUsersData] = useState<any>({
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

    const delayDebounceFn = setTimeout(() => {
      fetchUsers(page, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [router, page, searchTerm]);

  const fetchUsers = async (currentPage: number, searchKeyword: string) => {
    setIsLoading(true);
    try {
      const data = await getDanhSachNguoiDungPhanTrang(
        currentPage,
        pageSize,
        searchKeyword,
      );
      if (data) {
        setUsersData({
          items: data.items || [],
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
        });
      } else {
        setUsersData({
          items: [],
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        });
      }
    } catch (error) {
      console.error("Lỗi tải người dùng phân trang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taiKhoan: string, hoTen: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng "${hoTen} (${taiKhoan})" không? Hành động này không thể hoàn tác.`,
      )
    ) {
      const res = await xoaNguoiDung(taiKhoan);
      if (res.success) {
        alert("Xóa người dùng thành công!");
        fetchUsers(page, searchTerm);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Quản Trị Người Dùng
            </h1>
            <p className="text-slate-500 mt-2">
              Quản lý các tài khoản trên hệ thống EduCenter
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm"
            >
              ← Về Quản lý Khóa học
            </Link>
            <Link
              href="/admin/users/add-user"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition shadow-lg shadow-indigo-200"
            >
              <span className="text-xl">+</span> THÊM NGƯỜI DÙNG
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 border border-slate-100 mt-6">
          <div className="mb-6 flex">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tài khoản hoặc họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-md px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-40">
                    Tài khoản
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">
                    Họ và tên
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-48">
                    Email
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-36">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-32">
                    Chức vụ
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 w-48 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersData.items.length > 0 ? (
                  usersData.items.map((user: any) => (
                    <tr
                      key={user.taiKhoan}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {user.taiKhoan}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 truncate">
                        {user.hoTen}
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.soDT}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs rounded-md font-bold ${
                            user.maLoaiNguoiDung === "GV"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {user.maLoaiNguoiDung === "GV"
                            ? "Giáo vụ"
                            : "Học viên"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link
                          href={`/admin/users/edit-user/${user.taiKhoan}`}
                          className="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-semibold hover:bg-amber-100 transition"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(user.taiKhoan, user.hoTen)
                          }
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Tổng cộng:{" "}
              <span className="font-bold">{usersData.totalCount}</span> người
              dùng
            </div>
            {usersData.totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-slate-600"
                >
                  Trang trước
                </button>
                <div className="flex items-center px-4 font-semibold text-indigo-600 bg-indigo-50 rounded-lg">
                  {page} / {usersData.totalPages}
                </div>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, usersData.totalPages))
                  }
                  disabled={page === usersData.totalPages}
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
