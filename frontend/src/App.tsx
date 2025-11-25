import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

// หน้าใหม่
import LevelsSubjectsPage from "./pages/LevelsSubjectsPage";
import AddLevel from "./pages/AddLevel";
import AddSubject from "./pages/AddSubject";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        {/* Public */}
        <Route path="/" element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* หน้าตามที่ออกแบบ */}
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <LevelsSubjectsPage />
            </ProtectedRoute>
          }
        />

        {/* เพิ่มระดับชั้น */}
        <Route
          path="/levels/add"
          element={
            <ProtectedRoute>
              <AddLevel />
            </ProtectedRoute>
          }
        />

        {/* เพิ่มวิชา */}
        <Route
          path="/subjects/add"
          element={
            <ProtectedRoute>
              <AddSubject />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}
