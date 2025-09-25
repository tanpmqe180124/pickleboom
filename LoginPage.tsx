import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../contexts/ToastContext';

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const verified = location.state?.verified;
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccess, showError } = useToast();

  const { login, isAuthenticated, isLoading, error } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (verified) {
      showSuccess('Đăng ký thành công!', 'Hãy đăng nhập để tiếp tục.');
    }
  }, [isAuthenticated, navigate, verified, showSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    try {
      await login({ Email: email, Password: password });
      showSuccess('Đăng nhập thành công!', 'Chào mừng bạn quay lại!');
      navigate('/dashboard');
    } catch (err: any) {
      showError('Đăng nhập thất bại!', err.message || 'Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            title="Quay lại"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chào mừng bạn quay lại! Vui lòng đăng nhập để tiếp tục.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="email"
                    id="email"
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Nhập email của bạn"
                    required
                    ref={emailRef}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Nhập mật khẩu"
                    required
                    ref={passwordRef}
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>


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
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
