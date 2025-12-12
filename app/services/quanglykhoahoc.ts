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
