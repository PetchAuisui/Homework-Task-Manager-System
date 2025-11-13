import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const AuthAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),

  register: (data: { full_name: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),
};

export default api;
