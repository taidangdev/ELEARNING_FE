import { api } from "../../lib/api";

/**
 * Lấy toàn bộ khóa học
 */
export const getCourses = async () => {
  try {
    const res = await api.get(
      "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01"
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi lấy khóa học:", error);
    return [];
  }
};