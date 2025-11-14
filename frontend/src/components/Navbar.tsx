import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-green-600">
        Homework Manager
      </Link>

      <div className="flex items-center gap-4 text-gray-700">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={logout}
              className="px-4 py-1 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1 bg-green-600 text-white rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
