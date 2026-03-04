"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDanhSachTatCaNguoiDung } from "../services/quanlynguoidung";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Lấy danh sách toàn bộ người dùng và lọc theo mã GV
        const allUsers = await getDanhSachTatCaNguoiDung("GP01");
        if (Array.isArray(allUsers)) {
          const gvUsers = allUsers.filter((u) => u.maLoaiNguoiDung === "GV");
          setInstructors(gvUsers);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách giảng viên", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center font-bold text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          Đang tải danh sách giảng viên...
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-slate-50 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Đội ngũ <span className="text-indigo-600">Giảng Viên</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Gặp gỡ những chuyên gia, giảng viên giàu kinh nghiệm và đầy nhiệt
            huyết đang đồng hành cùng EduCenter.
          </p>
        </div>

        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {instructors.map((gv, index) => (
              <div
                key={gv.taiKhoan + index}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-100/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-32 h-32 rounded-full mb-6 p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden border-4 border-white flex items-center justify-center text-4xl font-black text-slate-400 bg-white">
                    {gv.hoTen?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">
                  {gv.hoTen}
                </h3>

                <div className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  Chuyên gia Đào tạo
                </div>

                <p className="text-slate-500 text-sm mb-6 mt-auto">
                  Tài khoản:{" "}
                  <span className="font-semibold">{gv.taiKhoan}</span>
                </p>

                <Link
                  href={`/courses`}
                  className="w-full py-3 bg-slate-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition"
                >
                  Xem các KH
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Chưa có Giảng viên nào
            </h2>
            <p className="text-slate-500">
              Hệ thống hiện tại chưa có tài khoản nào được phân quyền là Giáo vụ
              (GV).
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
