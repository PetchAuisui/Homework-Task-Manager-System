import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goHome = () => {
    if (token) navigate("/dashboard");
    else navigate("/");
  };

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

        {/* Middle: Gray menu (NOT full width) */}
        {token && (
          <div className="hidden md:flex items-center justify-center">
            <div className="inline-flex items-center gap-4 bg-gray-100 px-6 py-2 rounded-full shadow-sm">
              <Link to="/dashboard" className="hover:text-green-600 transition">
                ภาพรวม
              </Link>
              <Link to="/tasks/add" className="hover:text-green-600 transition">
                เพิ่มงาน
              </Link>
              <Link to="/subjects" className="hover:text-green-600 transition">
                วิชาทั้งหมด
              </Link>
              <Link to="/tasks" className="hover:text-green-600 transition">
                งานที่ต้องทำ
              </Link>
              <Link to="/events" className="hover:text-green-600 transition">
                เหตุการณ์สำคัญ
              </Link>
              <Link to="/tags" className="hover:text-green-600 transition">
                แท็กงาน
              </Link>
            </div>
          </div>
        )}

        {/* Right: User menu / login */}
        <div className="flex items-center gap-3">
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

          {token && (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                โปรไฟล์
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
