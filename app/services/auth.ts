import { api } from "../lib/api";

interface RegisterPayload {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string; // Viết hoa cả D và T
  maNhom: string; // Mã nhóm (ví dụ: "GP01")
  email: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface LoginPayload {
  taiKhoan: string;
  matKhau: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    // Log payload để debug
    console.log("Payload đang gửi:", payload);
    
    const res = await api.post("/QuanLyNguoiDung/DangKy", payload);
    
    console.log("Response thành công:", res.data);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    
    // Log chi tiết error response
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Headers:", error.response.headers);
    }
    
    // Xử lý lỗi từ API
    let errorMessage = "Đăng ký thất bại. Vui lòng thử lại!";
    
    if (error.response) {
      // Server trả về response với status code
      const responseData = error.response.data;
      
      // Xử lý các trường hợp response data khác nhau
      if (typeof responseData === "string") {
        // Nếu data là string trực tiếp
        errorMessage = responseData;
      } else if (responseData && typeof responseData === "object") {
        // Nếu data là object
        errorMessage =
          responseData.content ||
          responseData.message ||
          responseData.error ||
          JSON.stringify(responseData);
      } else {
        errorMessage = `Lỗi ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
    } else {
      // Lỗi khi setup request
      errorMessage = error.message || errorMessage;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    console.log("Payload đăng nhập:", payload);
    
    const res = await api.post("/QuanLyNguoiDung/DangNhap", payload);
    
    console.log("Đăng nhập thành công:", res.data);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    
    // Log chi tiết error response
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
    }
    
    // Xử lý lỗi từ API
    let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại!";
    
    if (error.response) {
      const responseData = error.response.data;
      
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData && typeof responseData === "object") {
        errorMessage =
          responseData.content ||
          responseData.message ||
          responseData.error ||
          JSON.stringify(responseData);
      } else {
        errorMessage = `Lỗi ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

