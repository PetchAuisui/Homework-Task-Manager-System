import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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
    bio: "",
    profile_image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profile_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const register = async () => {
    if (form.password !== form.confirm_password) {
      setMsg("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null) formData.append(k, v as any);
    });

    try {
      await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...");
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setMsg("สมัครสมาชิกไม่สำเร็จ (อีเมลอาจซ้ำ)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 flex justify-center items-start py-16 px-4">

      <div className="relative w-full max-w-xl">
        {/* BACKGROUND GLOW */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-200/60 via-sky-200/40 to-purple-200/50 blur-2xl opacity-60"></div>

        {/* MAIN CARD */}
        <div className="relative bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-indigo-50">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text">
              Homework Manager
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              ลงทะเบียนเพื่อเริ่มต้นการจัดการงานของคุณ
            </p>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            สมัครสมาชิก
          </h2>

          {/* FORM */}
          <div className="flex flex-col gap-5">

            <FormInput
              label="ชื่อผู้ใช้"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <FormInput
              label="ชื่อ - นามสกุล"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
            />

            <FormInput
              type="email"
              label="อีเมล"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <FormInput
              type="password"
              label="รหัสผ่าน"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <FormInput
              type="password"
              label="ยืนยันรหัสผ่าน"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
            />

            {/* GENDER + BIRTHDAY */}
            <div className="grid grid-cols-2 gap-5">
              {/* Gender */}
              <div className="flex flex-col">
                <label className="form-label">เพศ</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-input-strong"
                >
                  <option value="">เลือกเพศ</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่น ๆ</option>
                </select>
              </div>

              {/* Birthday */}
              <FormInput
                type="date"
                label="วันเกิด"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
              />
            </div>

            {/* Profile Image */}
            <div className="flex flex-col">
              <label className="form-label">รูปโปรไฟล์</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="form-input-strong cursor-pointer"
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-28 h-28 object-cover rounded-xl mt-3 shadow-md border"
                />
              )}
            </div>

            {/* Bio */}
            <div className="flex flex-col">
              <label className="form-label">แนะนำตัว</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="เขียนแนะนำตัว..."
                className="form-input-strong h-28 resize-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={register}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl mt-8 font-semibold shadow-md transition active:scale-95"
          >
            สมัครสมาชิก
          </button>

          {/* MESSAGES */}
          {msg && <p className="text-center text-indigo-600 mt-4">{msg}</p>}

          <p className="text-sm text-center mt-4 text-slate-500">
            มีบัญชีแล้ว?{" "}
            <Link to="/login" className="text-indigo-600 underline font-semibold">
              เข้าสู่ระบบ
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}


// --------------------------------
// REUSABLE INPUT COMPONENT
// --------------------------------
function FormInput({ label, type = "text", name, value, placeholder, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="form-input-strong"
      />
    </div>
  );
}
