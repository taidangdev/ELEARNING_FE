"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, isLoggedIn } from "../../../../services/authClient";
import { getThongTinNguoiDungTaiKhoan } from "../../../../services/quanlynguoidung";
import {
  getDanhSachKhoaHocChuaGhiDanh,
  getDanhSachKhoaHocChoXetDuyet,
  getDanhSachKhoaHocDaXetDuyet,
  ghiDanhKhoaHoc,
  huyGhiDanh,
} from "../../../../services/ghidanh";

export default function UserEnrollmentPage() {
  const router = useRouter();
  const params = useParams();
  const taiKhoanParam =
    typeof params.taiKhoan === "string"
      ? decodeURIComponent(params.taiKhoan)
      : "";

  const [userInfo, setUserInfo] = useState<any>(null);
  const [unEnrolledCourses, setUnEnrolledCourses] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchNewCourse, setSearchNewCourse] = useState("");

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
  }, [router, taiKhoanParam]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const uInfo = await getThongTinNguoiDungTaiKhoan(taiKhoanParam);
      setUserInfo(uInfo);

      const [dsChua, dsCho, dsDa] = await Promise.all([
        getDanhSachKhoaHocChuaGhiDanh(taiKhoanParam),
        getDanhSachKhoaHocChoXetDuyet(taiKhoanParam),
        getDanhSachKhoaHocDaXetDuyet(taiKhoanParam),
      ]);
      setUnEnrolledCourses(Array.isArray(dsChua) ? dsChua : []);
      setPendingCourses(Array.isArray(dsCho) ? dsCho : []);
      setEnrolledCourses(Array.isArray(dsDa) ? dsDa : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (maKhoaHoc: string) => {
    const res = await ghiDanhKhoaHoc(taiKhoanParam, maKhoaHoc);
    if (res.success) {
      alert("Đã ghi danh khóa học thành công!");
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const handleCancel = async (maKhoaHoc: string) => {
    if (window.confirm(`Hủy ghi danh khỏi khóa ${maKhoaHoc}?`)) {
      const res = await huyGhiDanh(taiKhoanParam, maKhoaHoc);
      if (res.success) {
        alert("Đã hủy thành công!");
        fetchData();
      } else {
        alert(res.message);
      }
    }
  };

  const filteredUnEnrolledCourses = unEnrolledCourses.filter(
    (c) =>
      c.tenKhoaHoc?.toLowerCase().includes(searchNewCourse.toLowerCase()) ||
      c.maKhoaHoc?.toLowerCase().includes(searchNewCourse.toLowerCase()),
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
            href="/admin/users"
            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"
          >
            ← Về Danh sách HV
          </Link>
          <h1 className="text-3xl font-black text-slate-900">
            TƯ VẤN KHÓA HỌC:{" "}
            <span className="text-indigo-600">
              [{taiKhoanParam}] {userInfo?.hoTen}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BẢNG 1: CHỌN KHÓA HỌC MỚI */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-emerald-600">
              📚 CHỌN KHÓA MỚI CHO HV
            </h2>
            <input
              type="text"
              placeholder="Tìm tên khóa học..."
              value={searchNewCourse}
              onChange={(e) => setSearchNewCourse(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="overflow-y-auto flex-1 border rounded-lg">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Tên Khóa Học</th>
                    <th className="p-3 w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {filteredUnEnrolledCourses.map((c) => (
                    <tr key={c.maKhoaHoc}>
                      <td className="p-3 font-semibold truncate">
                        {c.tenKhoaHoc} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {c.maKhoaHoc}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEnroll(c.maKhoaHoc)}
                          className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded font-bold hover:bg-emerald-100"
                        >
                          Ghi danh
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUnEnrolledCourses.length === 0 && (
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
              ⏳ HV CHỜ DUYỆT KHÓA NÀY
            </h2>
            <div className="overflow-y-auto flex-1 border rounded-lg mt-14">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Tên Khóa Học</th>
                    <th className="p-3 w-[140px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {pendingCourses.map((c) => (
                    <tr key={c.maKhoaHoc}>
                      <td className="p-3 font-semibold truncate">
                        {c.tenKhoaHoc} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {c.maKhoaHoc}
                        </span>
                      </td>
                      <td className="p-3 space-x-2 flex">
                        <button
                          onClick={() => handleEnroll(c.maKhoaHoc)}
                          className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold hover:bg-blue-100"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleCancel(c.maKhoaHoc)}
                          className="text-red-600 bg-red-50 px-2 py-1 rounded font-bold hover:bg-red-100"
                        >
                          Hủy
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingCourses.length === 0 && (
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
              ✅ HV ĐÃ ĐƯỢC CHẤP NHẬN
            </h2>
            <div className="overflow-y-auto flex-1 border rounded-lg mt-14">
              <table className="w-full text-left bg-slate-50 text-sm table-fixed">
                <thead className="sticky top-0 bg-slate-200">
                  <tr>
                    <th className="p-3">Tên Khóa Học</th>
                    <th className="p-3 w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {enrolledCourses.map((c) => (
                    <tr key={c.maKhoaHoc}>
                      <td className="p-3 font-semibold truncate">
                        {c.tenKhoaHoc} <br />{" "}
                        <span className="text-slate-500 font-normal">
                          {c.maKhoaHoc}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleCancel(c.maKhoaHoc)}
                          className="text-red-600 bg-red-50 px-3 py-1 rounded font-bold hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enrolledCourses.length === 0 && (
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
