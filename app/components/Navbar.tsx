"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, isLoggedIn } from "../services/authClient";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const check = () => {
      const status = isLoggedIn();
      setLoggedIn(status);
      if (status) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setUserName(currentUser?.taiKhoan || currentUser?.hoTen || null);
      } else {
        setUser(null);
        setUserName(null);
      }
    };

    check();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    setLoggedIn(false);
    setUserName(null);
    router.push("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-indigo-700">
          🎓 EduCenter
        </Link>

        {/* Menu desktop */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="hover:text-indigo-600 transition cursor-pointer">
            <Link href="/">Trang chủ</Link>
          </li>
          <li className="hover:text-indigo-600 transition cursor-pointer">
            <Link href="/courses">Khóa học</Link>
          </li>
          {user?.maLoaiNguoiDung === "GV" && (
            <li className="hover:text-indigo-600 transition cursor-pointer">
              <Link href="/admin">Quản lý</Link>
            </li>
          )}
          <li className="hover:text-indigo-600 transition cursor-pointer">
            <Link href="/instructors">Giảng viên</Link>
          </li>
          <li className="hover:text-indigo-600 transition cursor-pointer">
            Liên hệ
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              {userName && (
                <Link
                  href="/profile"
                  className="hidden md:inline text-sm text-gray-700 hover:text-indigo-600 transition"
                >
                  Xin chào, <span className="font-semibold">{userName}</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="hidden md:block border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Đăng ký
              </Link>
            </>
          )}

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-2xl cursor-pointer text-indigo-700">
            ☰
          </div>
        </div>
      </div>
    </nav>
  );
}
