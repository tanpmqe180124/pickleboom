import React, { useState } from 'react';
import { adminService, RegisterPartnerRequest } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';
import { 
  UserPlus, 
  Plus, 
  Save,
  X,
  MapPin,
  Mail,
  Phone,
  Building,
  User
} from 'lucide-react';

const PartnerManagement: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterPartnerRequest>({
    Email: '',
    FullName: '',
    BussinessName: '',
    Address: '',
    PhoneNumber: ''
  });

  // ========== HANDLE FORM SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.Email || !formData.FullName || !formData.BussinessName || !formData.Address || !formData.PhoneNumber) {
      showToast.error('Lỗi dữ liệu', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      showToast.error('Lỗi dữ liệu', 'Địa chỉ email không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      await adminService.registerPartner(formData);
      showToast.success('Tạo thành công', 'Tài khoản partner đã được tạo thành công.');
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating partner:', error);
      const errorMessage = error.response?.data?.Message || 'Không thể tạo tài khoản partner.';
      showToast.error('Lỗi tạo tài khoản', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========== RESET FORM ==========
  const resetForm = () => {
    setFormData({
      Email: '',
      FullName: '',
      BussinessName: '',
      Address: '',
      PhoneNumber: ''
    });
  };

  // ========== HANDLE MODAL CLOSE ==========
  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-2">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Partner</h2>
            <p className="text-sm text-gray-500">Tạo và quản lý tài khoản đối tác</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Tạo Partner</span>
        </button>
      </div>

      {/* ========== INFO CARD ========== */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 rounded-lg p-3">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Tạo tài khoản Partner</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Tạo tài khoản đối tác mới để quản lý sân Pickleball. Partner sẽ nhận được email chứa thông tin đăng nhập và có thể bắt đầu quản lý sân ngay lập tức.
            </p>
          </div>
        </div>
      </div>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Tạo tài khoản Partner mới
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    placeholder="partner@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.FullName}
                    onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.PhoneNumber}
                    onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Tên doanh nghiệp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.BussinessName}
                    onChange={(e) => setFormData({ ...formData, BussinessName: e.target.value })}
                    placeholder="Công ty TNHH ABC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.Address}
                    onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-1">
                    <UserPlus className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Thông tin quan trọng</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Partner sẽ nhận được email chứa thông tin đăng nhập. Mật khẩu mặc định là <strong>123456</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Đang tạo...' : 'Tạo Partner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagement;
