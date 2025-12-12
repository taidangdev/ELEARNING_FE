import Link from "next/link";
import { Suspense } from "react";
import {
  getDanhSachKhoaHoc,
  getDanhMucKhoaHoc,
  getKhoaHocTheoDanhMuc,
} from "./services/quanglykhoahoc";
import SafeImage from "./services/components/SafeImage";
import CategoryMenu from "./services/components/CategoryMenu";

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams;

  // Gọi song song danh mục và danh sách khóa học
  const [categories, courses] = await Promise.all([
    getDanhMucKhoaHoc(),
    category
      ? getKhoaHocTheoDanhMuc(category)
      : getDanhSachKhoaHoc(),
  ]);

  const data = courses;

  return (
    <>
      {/* NAVIGATION */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold text-indigo-700">
            🎓 EduCenter
          </h1>

          {/* Menu */}
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Trang chủ
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Khóa học
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Giảng viên
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Liên hệ
            </li>
          </ul>

          {/* Button đăng nhập */}
          <button
            className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-lg 
                       font-semibold hover:bg-indigo-700 transition"
          >
            Đăng nhập
          </button>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-2xl cursor-pointer text-indigo-700">
            ☰
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 px-6 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-3">
            📚 Danh Sách Khóa Học
          </h1>
          <p className="text-gray-600">
            Hiển thị đầy đủ thông tin từng khóa học
          </p>
        </div>

        {/* Category Menu */}
        <div className="max-w-[1700px] mx-auto mb-8">
          <Suspense fallback={<div className="flex justify-center">Đang tải danh mục...</div>}>
            <CategoryMenu categories={categories} />
          </Suspense>
        </div>

        {/* Course Grid */}
        {Array.isArray(data) && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-7 max-w-[1700px] mx-auto">
            {data.map((item: any) => (
              <div
                key={item.maKhoaHoc}
                className="group bg-white rounded-2xl overflow-hidden shadow-md
             hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
             flex flex-col h-full"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <SafeImage
                    src={item.hinhAnh}
                    alt={item.tenKhoaHoc}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <span
                    className="absolute top-3 right-3 bg-red-500 text-white text-[10px]
                                   px-2 py-1 rounded-full shadow"
                  >
                    {item.maNhom}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-1 text-xs text-gray-700 flex-1">
                  <h2 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">
                    {item.tenKhoaHoc}
                  </h2>

                  <p className="italic text-gray-500 line-clamp-2 mb-2">
                    {item.moTa}
                  </p>

                  <Link
                    href={`/course/${item.maKhoaHoc}`}
                    className="mt-auto py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 
                    text-white text-sm font-semibold hover:brightness-110 transition text-center"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-[1700px] mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Không tìm thấy khóa học
              </h2>
              <p className="text-gray-600 mb-6">
                {category
                  ? "Không có khóa học nào trong danh mục này."
                  : "Hiện tại chưa có khóa học nào."}
              </p>
              {category && (
                <Link
                  href="/"
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Xem tất cả khóa học
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
