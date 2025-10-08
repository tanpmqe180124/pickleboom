import React, { useState, useEffect } from 'react';
import { adminService, AdminUser, AdminUserParams, AdminUserUpdateRequest } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  // ========== FETCH USERS ==========
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build search parameters - backend uses AND logic, so we'll try different fields
      let params: AdminUserParams = {
        Page: currentPage,
        PageSize: pageSize,
        Status: statusFilter !== null ? statusFilter : undefined,
      };

      if (searchTerm) {
        // Try FullName first
        params.FullName = searchTerm;
      }

      console.log('Search parameters being sent:', params);

      let response = await adminService.getUsers(params);
      console.log('API Response:', response);
      
      // If no results and we have a search term, try other fields
      if (response.data.length === 0 && searchTerm) {
        console.log('No results with FullName, trying Email...');
        
        // Try Email search
        const emailParams = { ...params };
        delete emailParams.FullName;
        emailParams.Email = searchTerm;
        
        const emailResponse = await adminService.getUsers(emailParams);
        console.log('Email search result:', emailResponse.data);
        
        if (emailResponse.data.length > 0) {
          response = emailResponse;
        } else {
          console.log('No results with Email, trying PhoneNumber...');
          
          // Try PhoneNumber search
          const phoneParams = { ...params };
          delete phoneParams.FullName;
          phoneParams.PhoneNumber = searchTerm;
          
          const phoneResponse = await adminService.getUsers(phoneParams);
          console.log('PhoneNumber search result:', phoneResponse.data);
          
          if (phoneResponse.data.length > 0) {
            response = phoneResponse;
          }
        }
      }
      
      setUsers(response.data);
      setTotalPages(Math.ceil(response.total / response.pageSize));
      setTotalCount(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  // ========== UPDATE USER STATUS ==========
  const updateUserStatus = async (userId: string, newStatus: number) => {
    try {
      console.log('Updating user ID:', userId, 'New status:', newStatus);
      const userData: AdminUserUpdateRequest = { Status: newStatus };
      await adminService.updateUserStatus(userId, userData);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      const statusText = newStatus === 0 ? 'kích hoạt' : 'vô hiệu hóa';
      showToast.success('Cập nhật thành công', `Đã ${statusText} người dùng.`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast.error('Lỗi cập nhật', 'Không thể cập nhật trạng thái người dùng.');
    }
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
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
    fetchUsers();
  }, [currentPage]);

  // ========== RENDER STATUS BADGE ==========
  const renderStatusBadge = (status: number) => {
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
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
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
          Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} người dùng
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
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
            <p className="text-sm text-gray-500">Quản lý tài khoản và quyền truy cập</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Làm mới</span>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter === null ? '' : statusFilter}
              onChange={(e) => handleFilterChange(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={0}>Hoạt động</option>
              <option value={1}>Vô hiệu hóa</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ========== USERS TABLE ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Không tìm thấy người dùng nào</p>
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {user.avatar ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                                src={user.avatar}
                                alt={user.fullName}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-gray-100">
                                <span className="text-sm font-semibold text-white">
                                  {user.fullName?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              @{user.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500 font-medium">{user.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={user.address}>
                          {user.address || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {renderStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateUserStatus(user.id, user.status === 0 ? 1 : 0)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                              user.status === 0
                                ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                                : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {user.status === 0 ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
    </div>
  );
};

export default UserManagement;

