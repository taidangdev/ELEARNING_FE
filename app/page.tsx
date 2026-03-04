"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, getCurrentUser } from "./services/authClient";
import Header from "./components/Header";
import FooterCounter from "./components/FooterCounter";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const status = isLoggedIn();
    setLoggedIn(status);
    if (status) {
      setUser(getCurrentUser());
    }
  }, []);
  return (
    <main className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm uppercase tracking-wider">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              Chào mừng đến với EduCenter
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Nâng tầm kỹ năng <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Làm chủ tương lai
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-xl italic">
              "Kiến thức là nền tảng của thành công. Hãy bắt đầu hành trình
              chinh phục những đỉnh cao mới cùng hàng ngàn giáo viên tâm huyết
              tại EduCenter."
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/courses"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 active:scale-95"
              >
                Khám phá khóa học ngay
              </Link>
              {loggedIn ? (
                <Link
                  href="/profile"
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 bg-indigo-50 rounded-2xl font-black text-lg hover:bg-indigo-100 transition active:scale-95 flex items-center gap-2"
                >
                  👤 Trang cá nhân của {user?.hoTen?.split(" ").pop()}
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="px-8 py-4 border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition active:scale-95"
                >
                  Đăng ký tài khoản
                </Link>
              )}
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
              <div>
                <p className="text-2xl font-black text-slate-900">10k+</p>
                <p className="text-sm text-slate-500 font-medium">Học viên</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">500+</p>
                <p className="text-sm text-slate-500 font-medium">Khóa học</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">99%</p>
                <p className="text-sm text-slate-500 font-medium">Hài lòng</p>
              </div>
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl aspect-[4/5] md:aspect-square flex items-center justify-center p-12">
              <div className="text-center">
                <div className="text-9xl mb-8 transform group-hover:scale-110 transition duration-500">
                  {loggedIn ? "🎓" : "🚀"}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 whitespace-nowrap">
                  {loggedIn
                    ? `Chào bạn, ${user?.hoTen}!`
                    : "Bắt đầu ngay hôm nay!"}
                </h3>
                <p className="text-slate-500 font-medium">
                  {loggedIn
                    ? "Tiếp tục hành trình chinh phục kiến thức"
                    : "Tìm kiếm khóa học phù hợp với bạn"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Tại sao chọn EduCenter?
            </h2>
            <p className="text-slate-500 font-medium italic">
              Chúng tôi mang lại giá trị thực học cho mọi người
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Lộ trình rõ ràng
              </h3>
              <p className="text-slate-600 leading-relaxed font-normal italic text-sm">
                Nội dung bài học được thiết kế logic, đi từ cơ bản đến nâng cao
                cho người mới bắt đầu.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                💎
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Chất lượng quốc tế
              </h3>
              <p className="text-slate-600 leading-relaxed font-normal italic text-sm">
                Đội ngũ giảng viên hàng đầu thế giới luôn sẵn sàng hỗ trợ bạn
                24/7.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🏗️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Dự án thực tế
              </h3>
              <p className="text-slate-600 leading-relaxed font-normal italic text-sm">
                Học đi đôi với hành thông qua các dự án thực tiễn ngay sau mỗi
                khóa học.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterCounter />
    </main>
  );
}
