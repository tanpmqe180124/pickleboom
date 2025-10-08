import React, { useState, useEffect } from 'react';
import { adminService, RegisterPartnerRequest, AdminUser } from '@/services/adminService';
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
  User,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PartnerManagement: React.FC = () => {
  // ========== STATE ==========
  const [partners, setPartners] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterPartnerRequest>({
    Email: '',
    FullName: '',
    BussinessName: '',
    Address: '',
    PhoneNumber: ''
  });

  // ========== FETCH PARTNERS ==========
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const params: any = {
        Page: currentPage,
        PageSize: pageSize,
        Status: statusFilter !== null ? statusFilter : undefined,
      };

      if (searchTerm) {
        params.FullName = searchTerm;
      }

      console.log('Fetching partners with params:', params);
      const response = await adminService.getPartners(params);
      console.log('Partners API Response:', response);
      
      // Map backend data to frontend format
      const mappedPartners = response.data.map((partner: any) => ({
        ...partner,
        Status: partner.IsApproved ? 0 : 1, // Convert boolean to number
        UserName: partner.UserName || partner.Email?.split('@')[0] || 'N/A', // Fallback for missing UserName
        Address: partner.Address || 'Chưa cập nhật', // Fallback for missing Address
        Avatar: partner.Avatar || '', // Fallback for missing Avatar
      }));
      
      setPartners(mappedPartners);
      setTotalPages(Math.ceil(response.total / response.pageSize));
      setTotalCount(response.total);
    } catch (error) {
      console.error('Error fetching partners:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách Partner.');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== UPDATE PARTNER STATUS ==========
  const updatePartnerStatus = async (partnerId: string, newStatus: number) => {
    try {
      console.log('Updating partner ID:', partnerId, 'New status:', newStatus);
      const partnerData = { Status: newStatus };
      await adminService.updatePartnerStatus(partnerId, partnerData);
      
      // Update local state - map Status back to IsApproved
      setPartners(prevPartners => 
        prevPartners.map(partner => 
          partner.ID === partnerId ? { 
            ...partner, 
            Status: newStatus,
            IsApproved: newStatus === 0 // Convert number back to boolean
          } : partner
        )
      );
      
      const statusText = newStatus === 0 ? 'kích hoạt' : 'vô hiệu hóa';
      showToast.success('Cập nhật thành công', `Đã ${statusText} Partner.`);
    } catch (error) {
      console.error('Error updating partner status:', error);
      showToast.error('Lỗi cập nhật', 'Không thể cập nhật trạng thái Partner.');
    }
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPartners();
  };

  // ========== HANDLE FILTER CHANGE ==========
  const handleFilterChange = (status: number | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // ========== HANDLE PAGE CHANGE ==========
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchPartners();
  }, [currentPage]);

  // ========== HANDLE FORM SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.Email || !formData.FullName || !formData.BussinessName || !formData.Address || !formData.PhoneNumber) {
      showToast.error('Lỗi xác thực', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      await adminService.registerPartner(formData);
      showToast.success('Tạo thành công', 'Tài khoản partner đã được tạo thành công.');
      setShowModal(false);
      resetForm();
      fetchPartners(); // Refresh danh sách sau khi tạo
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

  // ========== RENDER STATUS BADGE ==========
  const renderStatusBadge = (status: number | undefined) => {
    if (status === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200">
          <UserCheck className="h-3 w-3 mr-1.5" />
          Hoạt động
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200">
          <UserX className="h-3 w-3 mr-1.5" />
          Vô hiệu hóa
        </span>
      );
    }
  };

  // ========== RENDER PAGINATION ==========
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
            i === currentPage
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} Partner
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Partner</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản đối tác và sân Pickleball</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Tạo Partner</span>
        </button>
      </div>

      {/* ========== SEARCH AND FILTER ========== */}
      <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter === null ? '' : statusFilter}
              onChange={(e) => handleFilterChange(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white shadow-sm transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={0}>Hoạt động</option>
              <option value={1}>Vô hiệu hóa</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ========== PARTNERS TABLE ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Không tìm thấy Partner nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {partners.map((partner) => (
                    <tr key={partner.ID} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {partner.Avatar ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                                src={partner.Avatar}
                                alt={partner.FullName}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center ring-2 ring-gray-100">
                                <span className="text-sm font-semibold text-white">
                                  {partner.FullName?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {partner.FullName}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              @{partner.UserName || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{partner.Email}</div>
                        <div className="text-sm text-gray-500 font-medium">{partner.PhoneNumber}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={partner.Address || 'Chưa có địa chỉ'}>
                          {partner.Address || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {renderStatusBadge(partner.Status || 1)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updatePartnerStatus(partner.ID, (partner.Status || 1) === 0 ? 1 : 0)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                              (partner.Status || 1) === 0
                                ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                                : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {(partner.Status || 1) === 0 ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
                Tạo tài khoản Partner
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="partner@example.com"
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Họ và tên <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.FullName}
                    onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    Tên doanh nghiệp <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.BussinessName}
                    onChange={(e) => setFormData({ ...formData, BussinessName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Công ty TNHH ABC"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    Số điện thoại <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.PhoneNumber}
                    onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Địa chỉ <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none"
                  placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                  rows={3}
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
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
