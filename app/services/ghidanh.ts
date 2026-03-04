import { api } from "../lib/api";

// ==========================================
// 1. CÁC API THEO TÀI KHOẢN (Xem theo User)
// ==========================================
export async function getDanhSachKhoaHocChuaGhiDanh(TaiKhoan: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh", { TaiKhoan });
        return res.data;
    } catch (error) {
        return [];
    }
}

export async function getDanhSachKhoaHocChoXetDuyet(TaiKhoan: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet", { TaiKhoan });
        return res.data;
    } catch (error) {
        return [];
    }
}

export async function getDanhSachKhoaHocDaXetDuyet(TaiKhoan: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet", { TaiKhoan });
        return res.data;
    } catch (error) {
        return [];
    }
}

// ==========================================
// 2. CÁC API THEO KHÓA HỌC (Xem theo Course)
// ==========================================
export async function getDanhSachNguoiDungChuaGhiDanh(maKhoaHoc: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh", { maKhoaHoc });
        return res.data;
    } catch (error) {
        return [];
    }
}

export async function getDanhSachHocVienChoXetDuyet(maKhoaHoc: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet", { maKhoaHoc });
        return res.data;
    } catch (error) {
        return [];
    }
}

export async function getDanhSachHocVienKhoaHoc(maKhoaHoc: string) {
    try {
        const res = await api.post("/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc", { maKhoaHoc });
        return res.data;
    } catch (error) {
        return [];
    }
}

// ==========================================
// 3. API THAO TÁC GHI DANH / HỦY
// ==========================================
export async function ghiDanhKhoaHoc(taiKhoan: string, maKhoaHoc: string) {
    try {
        const res = await api.post("/QuanLyKhoaHoc/GhiDanhKhoaHoc", { taiKhoan, maKhoaHoc });
        return { success: true, data: res.data };
    } catch (error: any) {
        return { success: false, message: error.response?.data || "Lỗi cập nhật Ghi danh" };
    }
}

export async function huyGhiDanh(taiKhoan: string, maKhoaHoc: string) {
    try {
        const res = await api.post("/QuanLyKhoaHoc/HuyGhiDanh", { taiKhoan, maKhoaHoc });
        return { success: true, data: res.data };
    } catch (error: any) {
        return { success: false, message: error.response?.data || "Lỗi Hủy Ghi danh" };
    }
}
