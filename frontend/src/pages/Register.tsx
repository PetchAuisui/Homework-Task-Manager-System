import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    gender: "",
    education_level: "",
    institution_name: "",
    major: "",
    bio: "",
    profile_image: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    // ตรวจสอบรหัสผ่านตรงกันไหม
    if (form.password !== form.confirm_password) {
      setMsg("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    try {
      await api.post("/api/auth/register", {
        username: form.username,
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        education_level: form.education_level,
        institution_name: form.institution_name,
        major: form.major,
        bio: form.bio,
        profile_image: form.profile_image,
      });

      setMsg("สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...");
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setMsg("สมัครสมาชิกไม่สำเร็จ (อีเมลอาจซ้ำ)");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4 pt-24">
        <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-green-600">
              Homework Manager
            </h1>
            <p className="text-gray-500 mt-2">
              สมัครสมาชิกเพื่อเริ่มจัดการงานของคุณ
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-6">สมัครสมาชิก</h2>

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้ (Username)"
              value={form.username}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Full Name */}
            <input
              type="text"
              name="full_name"
              placeholder="ชื่อ-นามสกุล"
              value={form.full_name}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={form.email}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirm_password"
              placeholder="ยืนยันรหัสผ่าน"
              value={form.confirm_password}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Date of Birth */}
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            {/* Gender */}
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            >
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่น ๆ</option>
            </select>

            {/* Education Level */}
            <select
              name="education_level"
              value={form.education_level}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            >
              <option value="">ระดับการศึกษา</option>
              <option value="มัธยมศึกษา">มัธยมศึกษา</option>
              <option value="ปริญญาตรี">ปริญญาตรี</option>
              <option value="ปริญญาโท">ปริญญาโท</option>
              <option value="ปริญญาเอก">ปริญญาเอก</option>
            </select>

            {/* Institution Name */}
            <input
              type="text"
              name="institution_name"
              placeholder="สถาบัน (เช่น KMITL)"
              value={form.institution_name}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            />

            {/* Major */}
            <input
              type="text"
              name="major"
              placeholder="สาขาวิชา"
              value={form.major}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            />

            {/* Profile Image */}
            <input
              type="text"
              name="profile_image"
              placeholder="ลิงก์รูปโปรไฟล์"
              value={form.profile_image}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            />

          </div>

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="แนะนำตัวเอง"
            value={form.bio}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full mt-4 focus:ring-2 focus:ring-green-500"
          />

          {/* Register Button */}
          <button
            onClick={register}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl mt-6 transition"
          >
            สมัครสมาชิก
          </button>

          {/* Message */}
          {msg && <p className="text-center text-green-600 mt-3">{msg}</p>}

          <p className="text-sm text-center mt-4">
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
