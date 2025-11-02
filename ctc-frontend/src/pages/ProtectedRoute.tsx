import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, role, isLoading } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (isLoading) return;

    if (!user) {
      navigate("/auth/login");
    } else if (requiredRole && role !== requiredRole) {
      navigate(`/dashboard/${role}`);
    }
  }, [user, role, requiredRole, navigate, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return children;
};

export default ProtectedRoute;
