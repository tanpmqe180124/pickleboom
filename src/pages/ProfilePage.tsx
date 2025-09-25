import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { userService, UsersDto, UserRequest, ChangePasswordRequest } from '@/services/userService';
import { showToast } from '@/utils/toastManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, User, Lock, Mail, Phone, Calendar, Save, Upload, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UsersDto | null>(null);
  
  // Debug: Log profile state changes
  useEffect(() => {
    console.log('Profile state changed:', profile);
  }, [profile]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Reset animation keys when tab changes
  useEffect(() => {
    if (activeTab === 'profile') {
      setProfileAnimationKey(prev => prev + 1);
    } else if (activeTab === 'password') {
      setPasswordAnimationKey(prev => prev + 1);
    }
  }, [activeTab]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation refs
  const [headerRef, headerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [tabsRef, tabsInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  
  // Tab animation states - reset when tab changes
  const [profileAnimationKey, setProfileAnimationKey] = useState(0);
  const [passwordAnimationKey, setPasswordAnimationKey] = useState(0);

  // Form states
  const [profileForm, setProfileForm] = useState<UserRequest>({
    FullName: '',
    PhoneNumber: '',
    UserName: '',
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    CurrentPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      console.log('ProfilePage - user:', user);
      console.log('ProfilePage - user.userId:', user?.userId);
      console.log('ProfilePage - localStorage token:', localStorage.getItem('token'));
      
      if (!user?.userId) {
        console.log('No userId found, stopping loading');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Making API call to get user by ID:', user.userId);
        const userData = await userService.getUserById(user.userId);
        console.log('User data received:', userData);
        console.log('User data type:', typeof userData);
        console.log('User data keys:', Object.keys(userData || {}));
        console.log('User data FullName:', userData?.FullName);
        console.log('User data fullName:', (userData as any)?.fullName);
        
        // Use real data from API
        console.log('Setting profile data:', userData);
        setProfile(userData);
        
        // Handle both PascalCase and camelCase from API
        const formData = {
          FullName: userData.FullName || (userData as any).fullName || '',
          PhoneNumber: userData.PhoneNumber || (userData as any).phoneNumber || '',
          UserName: userData.UserName || (userData as any).userName || '',
        };
        console.log('Setting profile form data:', formData);
        setProfileForm(formData);
        
        // Update user store with real data
        const updatedUser = {
          ...user,
          fullName: userData.FullName || (userData as any).fullName,
          avatar: userData.Avatar || (userData as any).avatar
        };
        console.log('Updating user store:', updatedUser);
        setUser(updatedUser);
      } catch (error: any) {
        console.error('Error loading profile details:', {
          error,
          message: error.message,
          response: error.response?.data,
          status: error.status,
          userId: user?.userId
        });
        showToast.error('Lỗi tải thông tin', error.message || 'Không thể tải thông tin profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.userId]);

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Lỗi', 'Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('Lỗi', 'Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      await userService.uploadAvatar(user.userId, file);
      
      // Reload profile to get new avatar URL
      const updatedProfile = await userService.getUserById(user.userId);
      setProfile(updatedProfile);
      
      // Update user store with new avatar
      setUser({
        ...user,
        fullName: updatedProfile.FullName,
        avatar: updatedProfile.Avatar
      });
      
      showToast.success('Thành công', 'Cập nhật avatar thành công');
    } catch (error: any) {
      showToast.error('Lỗi upload', error.message || 'Không thể upload avatar');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    try {
      setUpdating(true);
      await userService.updateUser(user.userId, profileForm);
      
      // Reload profile
      const updatedProfile = await userService.getUserById(user.userId);
      setProfile(updatedProfile);
      
      // Update user store with new info
      setUser({
        ...user,
        fullName: updatedProfile.FullName,
        avatar: updatedProfile.Avatar
      });
      
      showToast.success('Thành công', 'Cập nhật thông tin thành công');
      setIsEditing(false); // Close edit mode after successful update
    } catch (error: any) {
      showToast.error('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setUpdating(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    if (passwordForm.NewPassword !== passwordForm.ConfirmPassword) {
      showToast.error('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordForm.NewPassword.length < 6) {
      showToast.error('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setChangingPassword(true);
      await userService.changePassword(user.userId, passwordForm);
      showToast.success('Thành công', 'Đổi mật khẩu thành công');
      
      // Reset form
      setPasswordForm({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
      });
    } catch (error: any) {
      showToast.error('Lỗi', error.message || 'Không thể đổi mật khẩu');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium animate-pulse">Đang tải thông tin...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log('Profile is null, showing error state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg text-red-600 font-medium">Không thể tải thông tin profile</p>
          <p className="text-sm text-gray-600 mt-2">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  console.log('Rendering profile page with data:', {
    profile,
    FullName: profile.FullName,
    PhoneNumber: profile.PhoneNumber,
    UserName: profile.UserName,
    Email: profile.Email,
    Avatar: profile.Avatar
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div 
          ref={headerRef}
          className={`mb-8 transition-all duration-700 transform ${
            headerInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4'
          }`}
        >
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={() => navigate('/dashboard')}
            title="Về dashboard"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 transform ${
            headerInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 animate-fade-in">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-sport bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent animate-fade-in">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Quản lý thông tin và cài đặt tài khoản của bạn một cách an toàn và tiện lợi
          </p>
        </div>

        {/* Tab Navigation */}
        <div 
          ref={tabsRef}
          className={`mb-8 transition-all duration-700 transform ${
            tabsInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm border p-1 hover:shadow-lg transition-all duration-300">
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 hover:scale-105 ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <User className="h-5 w-5 mr-2" />
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 hover:scale-105 ${
                  activeTab === 'password'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <Lock className="h-5 w-5 mr-2" />
                Đổi mật khẩu
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div 
            key={profileAnimationKey}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up"
          >
            {/* Avatar Section */}
            <div 
              key={`avatar-${profileAnimationKey}`}
              className="lg:col-span-1 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <Card className="h-fit bg-white shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Ảnh đại diện
                  </CardTitle>
                  <CardDescription className="text-center text-sm text-gray-600">
                    Cập nhật ảnh đại diện của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block">
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm border-2 border-gray-200 hover:shadow-md transition-all duration-300">
                      {(profile.Avatar || (profile as any).avatar) ? (
                        <img
                          src={profile.Avatar || (profile as any).avatar}
                          alt={profile.FullName || (profile as any).fullName || 'User'}
                          className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {(profile.FullName || (profile as any).fullName)?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-sport text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer">{profile.FullName || (profile as any).fullName}</h3>
                    <p className="text-sm text-gray-600">{profile.Email || (profile as any).email}</p>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Tài khoản hoạt động
                    </div>
                    {uploading && (
                      <div className="text-sm text-blue-600 mt-2 flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                        Đang upload...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div 
              key={`profile-info-${profileAnimationKey}`}
              className="lg:col-span-2 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <Card className="bg-white shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                        <User className="h-6 w-6 text-blue-600" />
                        Thông tin cá nhân
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {isEditing ? 'Cập nhật thông tin cá nhân của bạn' : 'Xem thông tin cá nhân của bạn'}
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="FullName" className="text-sm font-semibold text-gray-700">
                          Họ và tên
                        </Label>
                        <Input
                          id="FullName"
                          value={profileForm.FullName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, FullName: e.target.value }))}
                          placeholder="Nhập họ và tên"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="PhoneNumber" className="text-sm font-semibold text-gray-700">
                          Số điện thoại
                        </Label>
                        <Input
                          id="PhoneNumber"
                          value={profileForm.PhoneNumber}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, PhoneNumber: e.target.value }))}
                          placeholder="Nhập số điện thoại (10 chữ số)"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          required
                        />
                        <p className="text-xs text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          Số điện thoại Việt Nam gồm 10 chữ số
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="UserName" className="text-sm font-semibold text-gray-700">
                          Tên đăng nhập
                        </Label>
                        <Input
                          id="UserName"
                          value={profileForm.UserName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, UserName: e.target.value }))}
                          placeholder="Nhập tên đăng nhập"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="Email" className="text-sm font-semibold text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="Email"
                            value={profile.Email}
                            disabled
                            className="h-12 pl-12 bg-gray-50 border-gray-200 rounded-xl"
                          />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Email không thể thay đổi
                        </p>
                      </div>
                    </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                        >
                          Hủy
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={updating}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Đang cập nhật...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Cập nhật thông tin
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Read-only view
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 group">
                          <Label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            Họ và tên
                          </Label>
                          <div className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                            <p className="text-gray-900">
                              {profile?.FullName || (profile as any)?.fullName || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 group">
                          <Label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            Số điện thoại
                          </Label>
                          <div className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                            <p className="text-gray-900">
                              {profile?.PhoneNumber || (profile as any)?.phoneNumber || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 group">
                          <Label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            Tên đăng nhập
                          </Label>
                          <div className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                            <p className="text-gray-900">
                              {profile?.UserName || (profile as any)?.userName || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 group">
                          <Label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            Email
                          </Label>
                          <div className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                            <p className="text-gray-900">
                              {profile?.Email || (profile as any)?.email || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div 
            key={passwordAnimationKey}
            className="max-w-2xl mx-auto animate-fade-in-up"
          >
            <Card className="bg-white shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Đổi mật khẩu
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Thay đổi mật khẩu để bảo mật tài khoản của bạn
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="CurrentPassword" className="text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </Label>
                  <Input
                    id="CurrentPassword"
                    type="password"
                    value={passwordForm.CurrentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, CurrentPassword: e.target.value }))}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="NewPassword" className="text-sm font-medium text-gray-700">
                    Mật khẩu mới
                  </Label>
                  <Input
                    id="NewPassword"
                    type="password"
                    value={passwordForm.NewPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, NewPassword: e.target.value }))}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    className="h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ConfirmPassword" className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </Label>
                  <Input
                    id="ConfirmPassword"
                    type="password"
                    value={passwordForm.ConfirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, ConfirmPassword: e.target.value }))}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    disabled={changingPassword}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingPassword ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Đang đổi mật khẩu...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Đổi mật khẩu
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
