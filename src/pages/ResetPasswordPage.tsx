import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("Liên kết đặt lại mật khẩu không hợp lệ.");
      return;
    }
    
    // Check for error parameters
    const error = searchParams.get("error");
    if (error === "user_not_found") {
      setStatus("error");
      setMessage("Không tìm thấy người dùng.");
      return;
    }
    if (error === "invalid_token") {
      setStatus("error");
      setMessage("Token không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại email.");
      return;
    }
    
    setStatus("pending");
    setMessage("Vui lòng nhập mật khẩu mới.");
  }, [email, token, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setStatus("error");
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      // Decode token properly to handle URL encoding
      // Replace spaces with + first, then decode
      const decodedToken = token ? decodeURIComponent(token.replace(/ /g, '+')) : '';
      console.log('Original token:', token);
      console.log('Decoded token:', decodedToken);
      
      const response = await fetch('https://bookingpickleball.onrender.com/api/Account/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          token: decodedToken, // Use decoded token
          password: newPassword,
          confirmPassword: confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      } else {
        setStatus("error");
        setMessage(data.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setStatus("error");
      setMessage("Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (status === "error" && !email && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center space-y-6 p-8">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertCircle size={40} className="text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Lỗi</h3>
                <p className="text-gray-600 leading-relaxed">{message}</p>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Quay lại đăng nhập
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center space-y-6 p-8">
              {/* Success Animation */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400 rounded-full opacity-20 animate-ping"></div>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Thành công!
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mật khẩu của bạn đã được đặt lại thành công. 
                  Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Đăng nhập ngay
              </Button>

              {/* Additional Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🔐</span>
                    </div>
                  </div>
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Bảo mật tài khoản</p>
                    <p>Hãy giữ mật khẩu mới an toàn và không chia sẻ với ai khác.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Lock size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đặt lại mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600">
              Nhập mật khẩu mới cho tài khoản: <span className="font-medium text-blue-600">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{message}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Đặt lại mật khẩu
                  </>
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;



