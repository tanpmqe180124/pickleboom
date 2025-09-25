import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/infrastructure/storage/tokenStorage";

const PrivateRoute: React.FC = () => {
  // Chỉ kiểm tra accessToken, không phụ thuộc isAuthenticated
  const accessToken = useAuthStore(state => state.token);

  console.log("PrivateRoute - accessToken:", accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 