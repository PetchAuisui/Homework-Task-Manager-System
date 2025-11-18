import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ดึงข้อมูล user จาก localStorage
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // สำหรับ fallback กรณีรูปโหลดไม่ได้
  const [imgError, setImgError] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goHome = () => {
    if (token) navigate("/dashboard");
    else navigate("/");
  };

  // คุณสมบัติ: ตรวจว่ารูปมี .jpg/.png หรือไม่
  const hasValidImage =
    user?.profile_image &&
    (user.profile_image.endsWith(".png") ||
      user.profile_image.endsWith(".jpg") ||
      user.profile_image.endsWith(".jpeg") ||
      user.profile_image.endsWith(".webp"));

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="w-full flex items-center justify-between">

        {/* Left: Logo */}
        <button
          onClick={goHome}
          className="text-2xl font-extrabold text-green-600 tracking-wide hover:text-green-700 transition"
        >
          Homework Manager
        </button>

        {/* Middle menu */}
        {token && (
          <div className="hidden md:flex items-center justify-center">
            <div className="inline-flex items-center gap-4 bg-gray-100 px-6 py-2 rounded-full shadow-sm">
              <Link to="/dashboard" className="hover:text-green-600 transition">ภาพรวม</Link>
              <Link to="/tasks/add" className="hover:text-green-600 transition">เพิ่มงาน</Link>
              <Link to="/subjects" className="hover:text-green-600 transition">วิชาทั้งหมด</Link>
              <Link to="/tasks" className="hover:text-green-600 transition">งานที่ต้องทำ</Link>
              <Link to="/events" className="hover:text-green-600 transition">เหตุการณ์สำคัญ</Link>
              <Link to="/tags" className="hover:text-green-600 transition">แท็กงาน</Link>
            </div>
          </div>
        )}

        {/* Right: User menu */}
        <div className="flex items-center gap-3">

          {/* Not logged in */}
          {!token && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}

          {/* Logged in */}
          {token && (
            <>
              <Link to="/profile" className="flex items-center gap-2">
                {hasValidImage && !imgError ? (
                  <img
                    src={user.profile_image}
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold border">
                    {user?.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
