import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    TokenCybersoft:
      process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "",
  },

  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // tránh lỗi SSR (NextJS App Router)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

        window.location.href = "/login";
      }
    }

    if (status === 403) {
      alert("Bạn không có quyền thực hiện hành động này");
    }

    if (status === 500) {
      console.error("Server error:", error.response?.data);
    }
    if (!error.response) {
      alert("Không thể kết nối server!");
    }

    return Promise.reject(error);
  }
);