import { getDanhSachKhoaHoc } from "./services/quanglykhoahoc";
import SafeImage from "./services/components/SafeImage";

export default async function Page() {
  const data = await getDanhSachKhoaHoc();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-7 max-w-[1700px] mx-auto">
          {Array.isArray(data) &&
            data.map((item: any) => (
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

                  <div className="space-y-1">
                    <p>
                      📌 <b>Mã:</b> {item.maKhoaHoc || "Đang cập nhật"}
                    </p>
                    <p>
                      👀 <b>Lượt xem:</b> {item.luotXem ?? 0}
                    </p>
                    <p>
                      👨‍🎓 <b>Học viên:</b> {item.soLuongHocVien ?? 0}
                    </p>
                    <p>
                      📅 <b>Ngày tạo:</b> {item.ngayTao || "Chưa có"}
                    </p>
                    <p>
                      👤 <b>Người tạo:</b>{" "}
                      {item.nguoiTao?.hoTen || "Chưa cập nhật"}
                    </p>
                    <p className="text-indigo-600 font-semibold">
                      📂 {item.danhMucKhoaHoc?.tenDanhMucKhoaHoc}
                    </p>
                  </div>

                  <button
                    className="mt-auto py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 
             text-white text-sm font-semibold hover:brightness-110 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
