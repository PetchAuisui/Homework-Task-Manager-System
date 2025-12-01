import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RedirectHome from "./pages/RedirectHome";

import LevelsSubjectsPage from "./pages/LevelsSubjectsPage";
import AddTask from "./pages/AddTask";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* หน้าเช็ค token */}
        <Route path="/" element={<RedirectHome />} />

        {/* Public */}
        <Route path="/overview" element={<Overview />} />
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

        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <LevelsSubjectsPage />
            </ProtectedRoute>
          }
        />

        {/* หน้าเพิ่มงาน */}
        <Route
          path="/tasks/add"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}
