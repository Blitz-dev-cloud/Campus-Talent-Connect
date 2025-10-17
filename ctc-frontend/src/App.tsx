import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import Chatbot from "./components/Chatbot";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import AlumniDashboard from "./pages/Dashboard/AlumniDashboard";
import FacultyDashboard from "./pages/Dashboard/FacultyDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Router>
      <AuthProvider>
        <CustomCursor />
        <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/alumni"
            element={
              <ProtectedRoute requiredRole="alumni">
                <AlumniDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/faculty"
            element={
              <ProtectedRoute requiredRole="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Chatbot />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
