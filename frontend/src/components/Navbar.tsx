import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [imgError, setImgError] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goHome = () => {
    token ? navigate("/dashboard") : navigate("/");
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handler = (e: any) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ปิด Drawer เมื่อคลิกนอก
  useEffect(() => {
    const handler = (e: any) => {
      if (
        openDrawer &&
        drawerRef.current &&
        !(drawerRef.current as any).contains(e.target)
      ) {
        setOpenDrawer(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDrawer]);

  const hasValidImage =
    user?.profile_image &&
    /\.(png|jpg|jpeg|webp)$/i.test(user.profile_image);

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-md px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between w-full">

          {/* HAMBURGER — mobile only */}
          {token && (
            <button
              className="sm:hidden text-3xl mr-2"
              onClick={() => setOpenDrawer(true)}
            >
              ☰
            </button>
          )}

          {/* LOGO */}
          <button
            onClick={goHome}
            className="text-2xl font-extrabold text-green-600 whitespace-nowrap"
          >
            Homework Manager
          </button>

          {/* DESKTOP MENU */}
          {token && (
            <div className="hidden sm:flex flex-1 justify-center">
              <div className="flex items-center gap-6 bg-gray-100 px-8 py-2 rounded-full shadow-sm text-sm whitespace-nowrap">
                <Link to="/dashboard" className="hover:text-green-600">ภาพรวม</Link>
                <Link to="/tasks/add" className="hover:text-green-600">เพิ่มงาน</Link>
                <Link to="/study" className="hover:text-green-600">วิชาทั้งหมด</Link>
                <Link to="/tasks" className="hover:text-green-600">งานที่ต้องทำ</Link>
                <Link to="/events" className="hover:text-green-600">เหตุการณ์สำคัญ</Link>
                <Link to="/tags" className="hover:text-green-600">แท็กงาน</Link>
              </div>
            </div>
          )}

          {/* PROFILE */}
          <div className="relative ml-4" ref={dropdownRef}>
            {token ? (
              <button onClick={() => setOpenProfile(!openProfile)}>
                {hasValidImage && !imgError ? (
                  <img
                    src={user.profile_image}
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold border">
                    {user?.full_name?.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gray-700 text-white rounded-lg">
                  Register
                </Link>
              </div>
            )}

            {/* PROFILE DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">โปรไฟล์ของฉัน</Link>
                <Link to="/levels" className="block px-4 py-2 hover:bg-gray-100">ระดับชั้น</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">ตั้งค่า</Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {token && (
        <div className={`fixed inset-0 z-50 transition ${openDrawer ? "visible" : "invisible"}`}>
          
          {/* BACKDROP */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity ${openDrawer ? "opacity-100" : "opacity-0"}`}></div>

          {/* DRAWER BOX */}
          <div
            ref={drawerRef}
            className={`
              absolute top-0 left-0 h-full w-64 bg-white shadow-xl 
              transform transition-transform duration-300 
              ${openDrawer ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="p-4 text-xl font-bold text-green-600 border-b">
              เมนูทั้งหมด
            </div>

            <div className="flex flex-col text-lg">

              <Link to="/dashboard" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                ภาพรวม
              </Link>

              <Link to="/tasks/add" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                เพิ่มงาน
              </Link>

              <Link to="/subjects" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                วิชาทั้งหมด
              </Link>

              <Link to="/tasks" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                งานที่ต้องทำ
              </Link>

              <Link to="/events" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                เหตุการณ์สำคัญ
              </Link>

              <Link to="/tags" className="px-6 py-3 hover:bg-gray-100" onClick={() => setOpenDrawer(false)}>
                แท็กงาน
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
