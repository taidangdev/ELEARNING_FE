
"use client"; 
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  getThongTinKhoaHoc,
  dangKyKhoaHoc,
} from "../../services/quanglykhoahoc";
import { getCurrentUser, isLoggedIn } from "../../services/authClient";
import SafeImage from "../../services/components/SafeImage";
import Link from "next/link";

interface CourseDetailPageProps {
  params: Promise<{ maKhoaHoc: string }>;
}

import { getThongTinTaiKhoan } from "../../services/auth";

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter();
  const { maKhoaHoc } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getThongTinKhoaHoc(maKhoaHoc);
        setCourse(courseData);

        if (isLoggedIn()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);

          // Lấy thông tin chi tiết tài khoản để kiểm tra danh sách khóa học đã đăng ký
          const profile = await getThongTinTaiKhoan();
          if (profile && profile.chiTietKhoaHocGhiDanh) {
            const isExist = profile.chiTietKhoaHocGhiDanh.some(
              (item: any) => item.maKhoaHoc === maKhoaHoc
            );
            setIsAlreadyRegistered(isExist);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [maKhoaHoc]);

  const handleRegister = async () => {
    if (!isLoggedIn()) {
      alert("Vui lòng đăng nhập để đăng ký khóa học!");
      router.push("/login");
      return;
    }

    if (user?.maLoaiNguoiDung === "GV") {
      alert("Tài khoản Giáo vụ không được quyền đăng ký khóa học!");
      return;
    }

    setIsRegistering(true);
    try {
      const res = await dangKyKhoaHoc(maKhoaHoc, user.taiKhoan);
      if (res.success) {
        setIsAlreadyRegistered(true);
        alert("Đăng ký khóa học thành công!");
        router.push("/profile");
      } else {
        alert(
          res.message ||
            "Đăng ký thất bại, có thể bạn đã đăng ký khóa học này rồi."
        );
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau!");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Đang tải thông tin khóa học...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-lg mx-6">
          <div className="text-6xl mb-6">🏜️</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Không tìm thấy khóa học
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Rất tiếc, thông tin về khóa học này không tồn tại hoặc đã bị gỡ bỏ.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <SafeImage
            src={course.hinhAnh}
            alt={course.tenKhoaHoc}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto h-full px-6 flex flex-col justify-end pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full mb-6 w-fit uppercase tracking-widest">
            {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-3xl">
            {course.tenKhoaHoc}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <span className="font-bold">
                {course.nguoiTao?.hoTen || "Giảng viên chuyên gia"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span className="font-bold">{course.ngayTao}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👁️</span>
              <span className="font-bold">{course.luotXem} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-20">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-100 flex items-center justify-center rounded-xl text-indigo-600 text-lg">
                📝
              </span>
              Mô tả khóa học
            </h2>
            <div className="prose prose-slate max-w-none text-gray-600 leading-loose">
              {course.moTa || "Khóa học chưa có mô tả chi tiết từ giảng viên."}
              <p className="mt-4">
                Tham gia khóa học này, bạn sẽ được tiếp cận với những kiến thức
                thực tiễn nhất, được đúc kết từ kinh nghiệm làm việc thực tế của
                các chuyên gia hàng đầu trong ngành.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">
                Bạn sẽ học được gì?
              </h3>
              <ul className="space-y-3 opacity-90 font-medium italic">
                <li>✓ Làm chủ các kỹ năng cốt lõi</li>
                <li>✓ Tiếp cận phương pháp tư duy mới</li>
                <li>✓ Xây dựng các dự án thực tế</li>
                <li>✓ Nhận chứng chỉ sau khi hoàn thành</li>
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">
                Yêu cầu khóa học
              </h3>
              <ul className="space-y-3 text-gray-600 font-medium">
                <li>• Máy tính có kết nối internet</li>
                <li>• Sự kiên trì và ham học hỏi</li>
                <li>• Không yêu cầu kiến thức nền</li>
                <li>• Thời gian học tập linh hoạt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-2xl shadow-slate-300 border border-slate-100 overflow-hidden">
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative group">
              <SafeImage
                src={course.hinhAnh}
                alt={course.tenKhoaHoc}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 text-2xl animate-pulse shadow-xl">
                  ▶
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-3xl font-black text-gray-900">
                Miễn phí
              </span>
              <span className="text-gray-400 line-through font-bold text-lg">
                999.000đ
              </span>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRegister}
                disabled={isRegistering || isAlreadyRegistered}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl
                    ${
                      user?.maLoaiNguoiDung === "GV" || isAlreadyRegistered
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:brightness-110 active:scale-95 shadow-indigo-200"
                    }`}
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ĐANG XỬ LÝ...</span>
                  </div>
                ) : isAlreadyRegistered ? (
                  "BẠN ĐÃ ĐĂNG KÝ KHÓA HỌC"
                ) : user?.maLoaiNguoiDung === "GV" ? (
                  "CHỈ DÀNH CHO HỌC VIÊN"
                ) : (
                  "ĐĂNG KÝ NGAY"
                )}
              </button>

              <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                Cam kết chất lượng đạt chuẩn quốc tế
              </p>
            </div>

            <hr className="my-8 border-slate-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2">
                  ⏱ Cấp độ:
                </span>
                <span className="text-gray-900 italic">Mọi cấp độ</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2">
                  📚 Học viên:
                </span>
                <span className="text-gray-900 italic">
                  {course.soLuongHocVien || 0} người
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2">
                  📜 Chứng chỉ:
                </span>
                <span className="text-gray-900 italic">Có sẵn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
