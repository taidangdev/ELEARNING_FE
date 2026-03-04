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

export async function getDanhSachKhoaHocPhanTrang(page: number, pageSize: number, tenKhoaHoc: string = "") {
  try {
    let url = `/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?page=${page}&pageSize=${pageSize}&MaNhom=GP01`;
    if (tenKhoaHoc) {
      url += `&tenKhoaHoc=${encodeURIComponent(tenKhoaHoc)}`;
    }
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách khóa học phân trang:", error);
    return null;
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
    const res = await api.get(
      `/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`
    );
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy khóa học theo danh mục:", error);

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

export async function dangKyKhoaHoc(maKhoaHoc: string, taiKhoan: string) {
  try {
    const res = await api.post("/QuanLyKhoaHoc/DangKyKhoaHoc", {
      maKhoaHoc,
      taiKhoan,
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi đăng ký khóa học:", error);
    return {
      success: false,
      message: error.response?.data || "Đăng ký khóa học thất bại",
    };
  }
}

export async function themKhoaHoc(payload: any) {
  try {
    const res = await api.post("/QuanLyKhoaHoc/ThemKhoaHoc", payload);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi thêm khóa học:", error);
    return {
      success: false,
      message: error.response?.data || "Thêm khóa học thất bại",
    };
  }
}

export async function xoaKhoaHoc(maKhoaHoc: string) {
  try {
    const res = await api.delete(`/QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${maKhoaHoc}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi xóa khóa học:", error);
    let message = "Xóa khóa học thất bại";
    if (typeof error.response?.data === 'string') message = error.response.data;
    else if (error.response?.data?.content) message = error.response.data.content;
    return {
      success: false,
      message: message,
    };
  }
}

export async function capNhatKhoaHoc(payload: any) {
  try {
    const res = await api.put("/QuanLyKhoaHoc/CapNhatKhoaHoc", payload);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi cập nhật khóa học:", error);
    let message = "Cập nhật khóa học thất bại";
    if (typeof error.response?.data === 'string') message = error.response.data;
    else if (error.response?.data?.content) message = error.response.data.content;
    return {
      success: false,
      message: message,
    };
  }
}
