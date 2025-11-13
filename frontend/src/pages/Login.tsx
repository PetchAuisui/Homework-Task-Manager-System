import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMsg("เข้าสู่ระบบสำเร็จ!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <Navbar />

      <div className="flex items-center justify-center px-4 pt-24">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-green-600 tracking-tight">
              Homework Manager
            </h1>
            <p className="text-gray-500 mt-3 text-sm">
              ระบบจัดการการบ้านและงานของคุณ
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            เข้าสู่ระบบ
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-gray-700 text-sm font-medium">อีเมล</label>
              <input
                type="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              onClick={login}
              className="w-full bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-xl font-medium text-lg shadow"
            >
              เข้าสู่ระบบ
            </button>

            {msg && (
              <p className="text-center text-green-600 font-medium">{msg}</p>
            )}

            <p className="text-sm text-center mt-3">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-green-600 underline">
                สมัครสมาชิก
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
