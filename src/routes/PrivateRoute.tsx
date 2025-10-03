import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute: React.FC = () => {
  // Chỉ kiểm tra accessToken, không phụ thuộc isAuthenticated
  const { accessToken } = useAuth();

  console.log("PrivateRoute - accessToken:", accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 