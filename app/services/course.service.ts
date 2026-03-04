import { api } from "../lib/api"; // chỉnh đúng path api của bạn

export const getCourses = async () => {
  const res = await api.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc");

  return res.data;
};