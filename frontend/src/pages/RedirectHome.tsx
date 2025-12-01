import { Navigate } from "react-router-dom";

export default function RedirectHome() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/overview" replace />;
}
