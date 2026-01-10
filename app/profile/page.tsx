"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getThongTinTaiKhoan } from "../services/auth";
import { isLoggedIn } from "../services/authClient";
import SafeImage from "../services/components/SafeImage";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getThongTinTaiKhoan();
        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Đang tải thông tin tài khoản...
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy thông tin
          </h2>
          <p className="text-gray-600 mb-6">
            Đã có lỗi xảy ra khi tải thông tin cá nhân của bạn.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const chiTietKhoaHocGhiDanh = userProfile.chiTietKhoaHocGhiDanh || [];

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 transform transition-all">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
            {/* Avatar Placeholder */}
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center text-4xl font-black text-indigo-700 border-2 border-indigo-50">
                {userProfile.hoTen?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-1">
                {userProfile.hoTen}
              </h1>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {userProfile.maLoaiNguoiDung === "GV"
                  ? "Giảng viên"
                  : "Học viên"}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-8 border-t border-gray-50 bg-slate-50/50">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                📧
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Email
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {userProfile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                📱
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Số điện thoại
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {userProfile.soDT}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                👤
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Tài khoản
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {userProfile.taiKhoan}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REGISTERED COURSES */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              📚 Khóa học của tôi
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                {chiTietKhoaHocGhiDanh.length}
              </span>
            </h2>
          </div>

          {chiTietKhoaHocGhiDanh.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {chiTietKhoaHocGhiDanh.map((item: any) => (
                <div
                  key={item.maKhoaHoc}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-100"
                >
                  <div className="relative overflow-hidden h-44">
                    <SafeImage
                      src={item.hinhAnh}
                      alt={item.tenKhoaHoc}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-bold">
                        Bắt đầu học ngay →
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {item.tenKhoaHoc}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                      {item.moTa || "Chưa có mô tả cho khóa học này."}
                    </p>

                    <Link
                      href={`/course/${item.maKhoaHoc}`}
                      className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-black hover:bg-indigo-600 hover:text-white transition-all text-center"
                    >
                      XEM CHI TIẾT
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
              <div className="text-5xl mb-4">🎒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Bạn chưa đăng ký khóa học nào
              </h3>
              <p className="text-gray-500 mb-6">
                Hãy khám phá các khóa học hấp dẫn của chúng tôi nhé!
              </p>
              <Link
                href="/"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                Khám phá ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
