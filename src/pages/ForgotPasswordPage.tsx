import React, { useRef, useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;

    if (!email) {
      setStatus('error');
      setMessage('Vui lòng nhập email.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`https://bookingpickleball.onrender.com/api/Account/forgot-email?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Gửi email thất bại!');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus('error');
      setMessage('Lỗi kết nối máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

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
              <Mail size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quên mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
        
        {status === 'success' ? (
          <div className="text-center space-y-6">
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
                Email đã được gửi!
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. 
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Link to="/login">
                  Quay lại đăng nhập
                </Link>
              </Button>
              
              <Button
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                  if (emailRef.current) emailRef.current.value = '';
                }}
                variant="outline"
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.01]"
              >
                Gửi lại email
              </Button>
            </div>

          </div>
        ) : (
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
                  ref={emailRef}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
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
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi mã đến email
                </>
              )}
            </Button>
          </form>
        )}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đã nhớ mật khẩu?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
