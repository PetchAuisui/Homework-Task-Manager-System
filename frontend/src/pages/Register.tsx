import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      await api.post("/api/auth/register", {
        full_name: fullName,
        email,
        password,
      });

      setMsg("สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...");
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setMsg("สมัครสมาชิกไม่สำเร็จ (อีเมลอาจซ้ำ)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-600">
            Homework Manager
          </h1>
          <p className="text-gray-500 mt-2">
            สมัครสมาชิกเพื่อเริ่มจัดการงานของคุณ
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-center">สมัครสมาชิก</h2>

        <div className="mt-6 space-y-4">

          {/* Full Name */}
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          {/* Register Button */}
          <button
            onClick={register}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition select-none"
          >
            สมัครสมาชิก
          </button>

          {/* Message */}
          {msg && <p className="text-center text-gray-600">{msg}</p>}

          {/* Go to Login */}
          <p className="text-sm text-center mt-2">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login" className="text-green-600 underline">
              เข้าสู่ระบบ
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
