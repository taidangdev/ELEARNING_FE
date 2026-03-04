import { api } from "../lib/api";

export async function getDanhSachNguoiDungPhanTrang(
    page: number,
    pageSize: number,
    tuKhoa: string = ""
) {
    try {
        let url = `/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang?MaNhom=GP01&page=${page}&pageSize=${pageSize}`;
        if (tuKhoa) {
            url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`;
        }
        const res = await api.get(url);
        return res.data;
    } catch (error: any) {
        console.error("Lỗi lấy danh sách người dùng phân trang:", error);
        return null;
    }
}

export async function xoaNguoiDung(taiKhoan: string) {
    try {
        const res = await api.delete(
            `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${encodeURIComponent(taiKhoan)}`
        );
        return { success: true, data: res.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data || "Lỗi xóa người dùng",
        };
    }
}

export async function themNguoiDung(userData: any) {
    try {
        const res = await api.post("/QuanLyNguoiDung/ThemNguoiDung", userData);
        return { success: true, data: res.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data || "Lỗi thêm người dùng",
        };
    }
}

export async function capNhatThongTinNguoiDung(userData: any) {
    try {
        const res = await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", userData);
        return { success: true, data: res.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data || "Lỗi cập nhật người dùng",
        };
    }
}

export async function getThongTinNguoiDungTaiKhoan(taiKhoan: string) {
    try {
        const res = await api.post(`/QuanLyNguoiDung/ThongTinTaiKhoan?taiKhoan=${encodeURIComponent(taiKhoan)}`);
        return res.data;
    } catch (error: any) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        return null;
    }
}

export async function getDanhSachTatCaNguoiDung(maNhom: string = "GP01") {
    try {
        const res = await api.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
        return res.data;
    } catch (error: any) {
        console.error("Lỗi lấy danh sách người dùng:", error);
        return [];
    }
}
