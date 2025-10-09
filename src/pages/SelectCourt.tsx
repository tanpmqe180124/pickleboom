import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService } from '@/services/bookingService';

interface Partner {
  id: string;
  bussinessName: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
  isApproved?: boolean;
}


type Step = 'partners';

interface PartnerCardProps {
  partner: Partner;
  selected: boolean;
  onSelect: (partner: Partner) => void;
}

function PartnerCard({ partner, selected, onSelect }: PartnerCardProps) {
  return (
    <div
      className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300 hover:bg-white'
      }`}
      onClick={() => onSelect(partner)}
    >
      {/* Status Badge */}
      {partner.isApproved && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Đã duyệt
          </span>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            {partner.avatar ? (
              <img 
                src={partner.avatar} 
                alt={partner.bussinessName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <Calendar className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
              {partner.bussinessName}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{partner.address || 'Địa chỉ chưa cập nhật'}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {partner.phoneNumber && (
            <div className="flex items-center text-gray-600 text-sm">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{partner.phoneNumber}</span>
            </div>
          )}
          {partner.email && (
            <div className="flex items-center text-gray-600 text-sm">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{partner.email}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 group-hover:bg-blue-500 group-hover:text-white'
          }`}>
            <Calendar className="h-4 w-4 mr-2" />
            Chọn đối tác
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
}


export default function SelectCourt() {
  const navigate = useNavigate();
  const setSelectedPartner = useBookingStore((state) => state.setSelectedPartner);
  
  // State management
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  const [searchTerm, setSearchTerm] = useState('');
  
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Load partners on mount
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const partnersData = await bookingService.getPartners();
        setPartners(partnersData);
        setFilteredPartners(partnersData);
      } catch (err) {
        console.error('Error loading partners:', err);
        setError('Không thể tải danh sách đối tác. Vui lòng thử lại.');
        setPartners([]);
        setFilteredPartners([]);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  // Filter partners based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPartners(partners);
    } else {
      const filtered = partners.filter(partner =>
        partner.bussinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartners(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, partners]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = filteredPartners.slice(startIndex, endIndex);

  // Handlers
  const handleSelectPartner = (partner: Partner) => {
    // Save selected partner to store
    setSelectedPartner(partner);
    // Redirect to BookingDate.tsx
    navigate('/booking/date');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of content
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group mb-6" 
            onClick={handleBack}
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn đối tác</h1>
            <p className="text-gray-600">Chọn đối tác bạn muốn đặt sân</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đối tác..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Hiển thị {currentPartners.length} trong {filteredPartners.length} đối tác
              {searchTerm && ` cho "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div ref={containerRef} className={`transition-all duration-700 ${containerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Content based on current step */}
          {!loading && !error && (
            <>
              {/* Partners Grid */}
              {currentPartners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentPartners.map((partner: Partner) => (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      selected={false}
                      onSelect={handleSelectPartner}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Không tìm thấy đối tác' : 'Không có đối tác nào'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `Không có đối tác nào phù hợp với "${searchTerm}"`
                      : 'Hiện tại chưa có đối tác nào được đăng ký'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-blue-600 hover:text-blue-800 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
