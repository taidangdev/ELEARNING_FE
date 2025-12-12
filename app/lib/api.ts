import axios from "axios";

export const api = axios.create({
  baseURL: "https://elearningnew.cybersoft.edu.vn/api/",

  // token cybesoft
  headers: {
    accept: "application/json",
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NiIsIkhldEhhblN0cmluZyI6IjMwLzA0LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NzUwNzIwMDAwMCIsIm5iZiI6MTc0OTkyMDQwMCwiZXhwIjoxNzc3NjU0ODAwfQ.GVFThE6gKR0iLystNcnByNEvenUzv2DP5TtmJhk2mvI",
      
  },
  
});
