import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from '@/infrastructure/api/axiosClient';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    // Kiểm tra nếu có email và token (reset password)
    if (email && token && !userId) {
      // Chuyển hướng đến trang reset password
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      return;
    }

    // Kiểm tra nếu có userId và token (confirm email)
    if (!userId || !token) {
      setStatus("error");
      setMessage("Liên kết xác minh không hợp lệ.");
      return;
    }

    // Gọi API xác minh đúng endpoint của backend
    api.get(`/Email/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`)
      .then((response) => {
        setStatus("success");
        setMessage("Xác minh email thành công! Bạn có thể đăng nhập ngay.");
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(error.message || "Xác minh thất bại hoặc liên kết đã hết hạn.");
      });
  }, [searchParams, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {status === "pending" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác minh email...</p>
        </div>
      )}
      
      {status === "success" && (
        <div className="text-center">
          <div className="text-green-600 text-lg font-semibold mb-4">
            ✅ {message}
          </div>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
      
      {status === "error" && (
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">
            ❌ {message}
          </div>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            Về trang đăng nhập
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage; 