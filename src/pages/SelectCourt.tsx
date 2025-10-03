import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, Court, TimeSlot } from '@/services/bookingService';

interface CourtCardProps {
  court: Court;
  selected: boolean;
  onSelect: (court: Court) => void;
}
function CourtCard({ court, selected, onSelect }: CourtCardProps) {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });
  
  const getStatusInfo = (status: number | undefined) => {
    switch (status) {
      case 0: return { text: 'Hoạt động', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 1: return { text: 'Bảo trì', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 2: return { text: 'Ngưng hoạt động', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      default: return { text: 'Kín lịch', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  const statusInfo = getStatusInfo(court.courtStatus);
  
  // Check if court is disabled (not active)
  const isDisabled = court.courtStatus !== 0;

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
        isDisabled 
          ? 'opacity-60 grayscale cursor-not-allowed' 
          : `hover:shadow-xl cursor-pointer hover:-translate-y-2 ${
              selected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-blue-300'
            }`
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      onClick={() => !isDisabled && onSelect(court)}
    >
      {/* Court Image */}
      <div className="relative">
        <img 
          src={court.imageUrl} 
          alt={court.name} 
          className={`w-full h-48 object-cover bg-gray-100 ${isDisabled ? 'grayscale' : ''}`} 
        />
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
            {statusInfo.text}
          </div>
        </div>
      </div>

      {/* Court Info */}
      <div className={`p-6 ${isDisabled ? 'opacity-75' : ''}`}>
        <h3 className={`font-sport text-xl mb-2 ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {court.name}
        </h3>
        <p className={`text-sm mb-3 line-clamp-2 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {court.description}
        </p>
        
        <div className={`flex items-center mb-3 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="text-sm">📍 {court.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>Giá:</span>
          <span className={`font-bold text-lg ${isDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
            {court.pricePerHour.toLocaleString()}đ/giờ
          </span>
        </div>

        {isDisabled ? (
          <button
            className="w-full bg-gray-300 text-gray-500 font-sport py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            {court.courtStatus === 1 ? 'Đang bảo trì' : 
             court.courtStatus === 2 ? 'Ngưng hoạt động' : 'Kín lịch'}
          </button>
        ) : (
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-sport py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={e => { e.stopPropagation(); onSelect(court); }}
          >
            Chọn sân này
          </button>
        )}
      </div>
    </div>
  );
}

export default function SelectCourt() {
  const navigate = useNavigate();
  const setSelectedCourt = useBookingStore((state) => state.setSelectedCourt);
  const [allCourts, setAllCourts] = useState<Court[]>([]); // Store all courts for sorting
  const [courts, setCourts] = useState<Court[]>([]); // Displayed courts for current page
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourtState] = useState<Court | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Load all courts from API (only once) for proper sorting
  useEffect(() => {
    const loadAllCourts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load all courts to enable proper sorting across all data
        const response = await bookingService.getCourts(1, 1000); // Load all courts
        
        // Sort courts: Active courts first (status = 0), then by name
        const sortedCourts = response.data.sort((a, b) => {
          // First priority: Active courts (status = 0) come first
          if (a.courtStatus === 0 && b.courtStatus !== 0) return -1;
          if (a.courtStatus !== 0 && b.courtStatus === 0) return 1;
          
          // Second priority: Sort by name for consistent ordering
          return a.name.localeCompare(b.name);
        });
        
        setAllCourts(sortedCourts);
        setTotal(sortedCourts.length);
      } catch (err) {
        console.error('Error loading courts:', err);
        setError('Không thể tải danh sách sân. Vui lòng thử lại.');
        setAllCourts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadAllCourts();
  }, []); // Only load once

  // Update displayed courts when page changes (frontend pagination)
  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourts = allCourts.slice(startIndex, endIndex);
    setCourts(paginatedCourts);
  }, [page, allCourts, pageSize]);

  // Function to refresh courts data (can be called when admin updates courts)
  const refreshCourts = async () => {
    try {
      const response = await bookingService.getCourts(1, 1000);
      
      // Sort courts: Active courts first (status = 0), then by name
      const sortedCourts = response.data.sort((a, b) => {
        if (a.courtStatus === 0 && b.courtStatus !== 0) return -1;
        if (a.courtStatus !== 0 && b.courtStatus === 0) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setAllCourts(sortedCourts);
      setTotal(sortedCourts.length);
    } catch (err) {
      console.error('Error refreshing courts:', err);
    }
  };

  // Listen for storage events to refresh when admin updates courts
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'courtsUpdated') {
        refreshCourts();
        // Clear the flag
        localStorage.removeItem('courtsUpdated');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSelectCourt = async (court: Court) => {
    try {
      // Store selected court
      setSelectedCourt(court);
      
      // Navigate to date selection page
      navigate('/booking/date');
    } catch (err) {
      console.error('Error selecting court:', err);
      alert('Không thể chọn sân. Vui lòng thử lại.');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-sport text-gray-900 mb-2">Chọn sân muốn đặt</h1>
          <p className="text-gray-600">Vui lòng chọn sân phù hợp để tiếp tục đặt lịch</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách sân...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courts.map((court: Court) => (
              <CourtCard
                key={court.id}
                court={court}
                selected={selectedCourt?.id === court.id}
                onSelect={handleSelectCourt}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏟️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có sân nào</h3>
            <p className="text-gray-600">Hiện tại không có sân nào khả dụng.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-blue-50 transition disabled:opacity-50 flex items-center gap-2"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
              Trang trước
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Trang {page} / {totalPages}
              </span>
            </div>

            <button
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-blue-50 transition disabled:opacity-50 flex items-center gap-2"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Trang sau
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 