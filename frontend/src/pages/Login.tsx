import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      if (!res.data.token) {
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบล้มเหลว",
          text: "ไม่พบ token จากเซิร์ฟเวอร์",
        });
        return;
      }

      // 🔥 สำคัญ!! เก็บ token และ user ลง localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#4f46e5",
      }).then(() => navigate("/dashboard"));

    } catch {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 flex items-center justify-center px-4">

      <div className="relative w-full max-w-md">
        {/* Glow background */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-200/60 via-sky-200/40 to-purple-200/50 blur-2xl opacity-50"></div>

        <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-indigo-50">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text tracking-tight">
              Homework Manager
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              ระบบจัดการงานและการบ้านของคุณ
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            เข้าสู่ระบบ
          </h2>

          <div className="space-y-6">

            <div>
              <label className="form-label">อีเมล</label>
              <input
                type="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="form-input-strong w-full"
              />
            </div>

            <div>
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-strong w-full"
              />
            </div>

            <button
              onClick={login}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold shadow-md active:scale-95"
            >
              เข้าสู่ระบบ
            </button>

            <p className="text-sm text-center text-slate-500">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-indigo-600 underline font-semibold">
                สมัครสมาชิก
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
