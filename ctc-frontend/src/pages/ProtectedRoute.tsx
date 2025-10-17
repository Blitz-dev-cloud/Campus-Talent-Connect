import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = React.useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (requiredRole && role !== requiredRole) {
      navigate(`/dashboard/${role}`);
    }
  }, [user, role, requiredRole, navigate]);
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return children;
};

export default ProtectedRoute;
