import { api } from "../lib/api";

export async function getDanhSachKhoaHoc() {
  try {
    const res = await api.get(
      "/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01"
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách khóa học:", error);
    return [];
  }
}

export async function getThongTinKhoaHoc(maKhoaHoc: string) {
  try {
    const res = await api.get(
      `/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy thông tin khóa học:", error);
    return null;
  }
}

export async function getDanhMucKhoaHoc() {
  try {
    const res = await api.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy danh mục khóa học:", error);
    return [];
  }
}

export async function getKhoaHocTheoDanhMuc(maDanhMuc: string) {
  try {
    // Thử endpoint với các biến thể khác nhau
    const res = await api.get(
      `/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`
    );
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy khóa học theo danh mục:", error);
    // Nếu API lỗi (404, 400, ...), filter từ danh sách tất cả khóa học
    try {
      const allCourses = await getDanhSachKhoaHoc();
      return Array.isArray(allCourses)
        ? allCourses.filter(
            (course: any) =>
              course.danhMucKhoaHoc?.maDanhMucKhoaHoc === maDanhMuc
          )
        : [];
    } catch (filterError) {
      console.error("Lỗi filter khóa học:", filterError);
      return [];
    }
  }
}
