import axios from "axios";

export const api = axios.create({
  // Sử dụng biến môi trường cho baseURL
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    accept: "application/json",
    // Sử dụng biến môi trường cho Token
    TokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN,
  },
});