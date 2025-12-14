import Link from "next/link";
import { getThongTinKhoaHoc } from "../../services/quanglykhoahoc";
import SafeImage from "../../services/components/SafeImage";

interface PageProps {
  params: Promise<{
    maKhoaHoc: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { maKhoaHoc } = await params;
  const course = await getThongTinKhoaHoc(maKhoaHoc);

  // Xử lý trường hợp không tìm thấy khóa học
  if (!course) {
    return (
      <>
        <main className="pt-28 min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Khóa học không tồn tại
            </h1>
            <p className="text-gray-600 mb-6">
              Không tìm thấy khóa học với mã: {maKhoaHoc}
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Quay về trang chủ
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="pt-28 min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  Trang chủ
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  Khóa học
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">
                {course.tenKhoaHoc || "Chi tiết khóa học"}
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto min-h-[400px]">
                <SafeImage
                  src={course.hinhAnh}
                  alt={course.tenKhoaHoc}
                  className="w-full h-full object-cover"
                />
                {course.maNhom && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-lg font-semibold">
                    {course.maNhom}
                  </span>
                )}
              </div>

              {/* Info Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 rounded-full mb-3">
                      📂 {course.danhMucKhoaHoc.tenDanhMucKhoaHoc}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {course.tenKhoaHoc || "Chưa có tên khóa học"}
                </h1>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {course.moTa || "Chưa có mô tả"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">👀</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {course.luotXem ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Lượt xem</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">👨‍🎓</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {course.soLuongHocVien ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Học viên</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-sm font-bold text-gray-900">
                      {course.ngayTao
                        ? new Date(course.ngayTao).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Ngày tạo</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">📌</div>
                    <div className="text-xs font-bold text-gray-900 break-all">
                      {course.maKhoaHoc || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Mã KH</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:brightness-110 transition shadow-lg">
                    Đăng ký ngay
                  </button>
                  <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition">
                    ⭐ Yêu thích
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📖 Giới thiệu khóa học
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.moTa || "Chưa có thông tin mô tả chi tiết về khóa học này."}
                  </p>
                </div>
              </div>

              {/* Instructor Section */}
              {course.nguoiTao && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    👤 Thông tin giảng viên
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                      {course.nguoiTao.hoTen?.[0]?.toUpperCase() || "👤"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {course.nguoiTao.hoTen || "Chưa cập nhật"}
                      </h3>
                      <p className="text-gray-600">
                        {course.nguoiTao.taiKhoan || ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ℹ️ Thông tin khóa học
                </h3>
                <div className="space-y-3">
                  {course.maKhoaHoc && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Mã khóa học</div>
                      <div className="font-semibold text-gray-900">
                        {course.maKhoaHoc}
                      </div>
                    </div>
                  )}
                  {course.danhMucKhoaHoc && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Danh mục</div>
                      <div className="font-semibold text-indigo-600">
                        {course.danhMucKhoaHoc.tenDanhMucKhoaHoc}
                      </div>
                    </div>
                  )}
                  {course.ngayTao && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Ngày tạo</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(course.ngayTao).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back Button */}
              <Link
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition"
              >
                ← Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

