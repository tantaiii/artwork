import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../secure/AuthContext.tsx";
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  // SQL Server migration: `roleID` is now just the raw role id string; the
  // populated role object (with `.name`) is returned separately as `role`.
  const roleName = user?.role?.name;
  if (!roleName) {
    return <Navigate to="/" replace state={{ from: location }} />;
  } else if (!allowedRoles.includes(roleName)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />; // Render children routes if authorized
};
export default ProtectedRoute;
