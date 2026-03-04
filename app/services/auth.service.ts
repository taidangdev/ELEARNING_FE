import { api } from "../lib/api";

/**
 * GHI DANH KHÓA HỌC
 */
export const enrollCourse = async (maKhoaHoc: string) => {
  if (typeof window === "undefined") return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await api.post("/QuanLyKhoaHoc/DangKyKhoaHoc", {
    maKhoaHoc,
    taiKhoan: user.taiKhoan,
  });

  return res.data;
};