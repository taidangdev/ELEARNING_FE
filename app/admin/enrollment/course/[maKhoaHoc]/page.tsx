"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, isLoggedIn } from "../../../../services/authClient";
import { getThongTinKhoaHoc } from "../../../../services/quanglykhoahoc";
import {
  getDanhSachNguoiDungChuaGhiDanh,
  getDanhSachHocVienChoXetDuyet,
  getDanhSachHocVienKhoaHoc,
  ghiDanhKhoaHoc,
  huyGhiDanh,
} from "../../../../services/ghidanh";

export default function CourseEnrollmentPage() {
  const router = useRouter();
  const params = useParams();
  const maKhoaHocParam =
    typeof params.maKhoaHoc === "string"
      ? decodeURIComponent(params.maKhoaHoc)
      : "";

  const [course, setCourse] = useState<any>(null);
  const [unEnrolledUsers, setUnEnrolledUsers] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchNewUser, setSearchNewUser] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    const currentUser = getCurrentUser();
    if (currentUser?.maLoaiNguoiDung !== "GV") {
      router.push("/");
      return;
    }
    fetchData();
  }, [router, maKhoaHocParam]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cInfo = await getThongTinKhoaHoc(maKhoaHocParam);
      setCourse(cInfo);

      // Lấy 3 danh sách song song
      const [dsChua, dsCho, dsDa] = await Promise.all([
        getDanhSachNguoiDungChuaGhiDanh(maKhoaHocParam),
        getDanhSachHocVienChoXetDuyet(maKhoaHocParam),
        getDanhSachHocVienKhoaHoc(maKhoaHocParam),
      ]);
      setUnEnrolledUsers(Array.isArray(dsChua) ? dsChua : []);
      setPendingUsers(Array.isArray(dsCho) ? dsCho : []);
      setEnrolledUsers(Array.isArray(dsDa) ? dsDa : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (taiKhoan: string) => {
    const res = await ghiDanhKhoaHoc(taiKhoan, maKhoaHocParam);
    if (res.success) {
      alert("Đã ghi danh thành công!");
      fetchData(); // Refresh UI
    } else {
      alert(res.message);
    }
  };

  const handleCancel = async (taiKhoan: string) => {
    if (window.confirm(`Hủy ghi danh học viên ${taiKhoan}?`)) {
      const res = await huyGhiDanh(taiKhoan, maKhoaHocParam);
      if (res.success) {
        alert("Đã hủy thành công!");
        fetchData(); // Refresh UI
      } else {
        alert(res.message);
      }
    }
  };

  const filteredUnEnrolledUsers = unEnrolledUsers.filter(
    (u) =>
      u.hoTen?.toLowerCase().includes(searchNewUser.toLowerCase()) ||
      u.taiKhoan?.toLowerCase().includes(searchNewUser.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="pt-32 text-center font-bold">Đang tải dữ liệu...</div>
    );

  return (
    <main className="pt-28 pb-20 min-h-screen bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"
          >
            ← Về Danh sách KH
          </Link>
          <h1 className="text-3xl font-black text-slate-900">
            GHI DANH CHO:{" "}
            <span className="text-indigo-600">
              [{course?.maKhoaHoc}] {course?.tenKhoaHoc}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BẢNG 1: THÊM HỌC VIÊN MỚI (Chưa ghi danh) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-emerald-600">
              👤 THÊM HỌC VIÊN MỚI
            </h2>
            <input
              type="text"
              placeholder="Tìm tài khoản, họ tên..."
              value={searchNewUser}
              onChange={(e) => setSearchNewUser(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="overflow-y-auto flex-1 border rounded-lg">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Học viên</th>
                    <th className="p-3 w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {filteredUnEnrolledUsers.map((u) => (
                    <tr key={u.taiKhoan}>
                      <td className="p-3 font-semibold truncate">
                        {u.hoTen} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {u.taiKhoan}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEnroll(u.taiKhoan)}
                          className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded font-bold hover:bg-emerald-100"
                        >
                          Ghi danh
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUnEnrolledUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-6 text-center text-slate-500"
                      >
                        Trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BẢNG 2: CHỜ DUYỆT */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-amber-500">
              ⏳ HỌC VIÊN CHỜ DUYỆT
            </h2>
            <div className="overflow-y-auto flex-1 border rounded-lg mt-14">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Học viên</th>
                    <th className="p-3 w-[140px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {pendingUsers.map((u) => (
                    <tr key={u.taiKhoan}>
                      <td className="p-3 font-semibold truncate">
                        {u.hoTen} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {u.taiKhoan}
                        </span>
                      </td>
                      <td className="p-3 space-x-2 flex">
                        <button
                          onClick={() => handleEnroll(u.taiKhoan)}
                          className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold hover:bg-blue-100"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleCancel(u.taiKhoan)}
                          className="text-red-600 bg-red-50 px-2 py-1 rounded font-bold hover:bg-red-100"
                        >
                          Hủy
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-6 text-center text-slate-500"
                      >
                        Trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BẢNG 3: ĐÃ GHI DANH */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              ✅ ĐÃ GHI DANH
            </h2>
            <div className="overflow-y-auto flex-1 border rounded-lg mt-14">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Học viên</th>
                    <th className="p-3 w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {enrolledUsers.map((u) => (
                    <tr key={u.taiKhoan}>
                      <td className="p-3 font-semibold truncate">
                        {u.hoTen} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {u.taiKhoan}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleCancel(u.taiKhoan)}
                          className="text-red-600 bg-red-50 px-3 py-1 rounded font-bold hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enrolledUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-6 text-center text-slate-500"
                      >
                        Trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
