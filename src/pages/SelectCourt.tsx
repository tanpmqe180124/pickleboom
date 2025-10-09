import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, Court, TimeSlot } from '@/services/bookingService';

interface Partner {
  id: string;
  bussinessName: string;
  address: string;
}

interface CourtWithTimeSlots {
  id: string;
  name: string;
  timeSlotIDs: TimeSlot[];
}

type Step = 'partners' | 'date' | 'courts';

interface PartnerCardProps {
  partner: Partner;
  selected: boolean;
  onSelect: (partner: Partner) => void;
}

interface CourtCardProps {
  court: CourtWithTimeSlots;
  selected: boolean;
  onSelect: (court: CourtWithTimeSlots) => void;
}

function PartnerCard({ partner, selected, onSelect }: PartnerCardProps) {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl cursor-pointer hover:-translate-y-2 ${
        selected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-blue-300'
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      onClick={() => onSelect(partner)}
    >
      <div className="p-6">
        <h3 className="font-sport text-xl mb-2 text-gray-900">
          {partner.bussinessName}
        </h3>
        <p className="text-sm mb-3 line-clamp-2 text-gray-600">
          {partner.address || 'Địa chỉ chưa cập nhật'}
        </p>
        
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-sport py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Xem sân của {partner.bussinessName}
        </button>
      </div>
    </div>
  );
}
function CourtCard({ court, selected, onSelect }: CourtCardProps) {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });
  
  const getTimeSlotStatus = (status: number | undefined) => {
    switch (status) {
      case 0: return { text: 'Trống', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 1: return { text: 'Đã đặt', color: 'text-red-600', bgColor: 'bg-red-100' };
      default: return { text: 'Trống', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl cursor-pointer hover:-translate-y-2 ${
        selected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-blue-300'
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      onClick={() => onSelect(court)}
    >
      {/* Court Info */}
      <div className="p-6">
        <h3 className="font-sport text-xl mb-4 text-gray-900">
          {court.name}
        </h3>
        
        {/* Time Slots */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Khung giờ khả dụng:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {court.timeSlotIDs.map((slot, index) => {
              const statusInfo = getTimeSlotStatus(slot.status);
              return (
                <div
                  key={index}
                  className={`px-2 py-1 rounded text-xs text-center ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  {slot.startTime} - {slot.endTime}
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-sport py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          onClick={e => { e.stopPropagation(); onSelect(court); }}
        >
          Chọn sân này
        </button>
      </div>
    </div>
  );
}

export default function SelectCourt() {
  const navigate = useNavigate();
  const setSelectedCourtStore = useBookingStore((state) => state.setSelectedCourt);
  
  // State management
  const [currentStep, setCurrentStep] = useState<Step>('partners');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [courts, setCourts] = useState<CourtWithTimeSlots[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<CourtWithTimeSlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Load partners on mount
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const partnersData = await bookingService.getPartners();
        setPartners(partnersData);
      } catch (err) {
        console.error('Error loading partners:', err);
        setError('Không thể tải danh sách đối tác. Vui lòng thử lại.');
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  // Load courts when partner and date are selected
  useEffect(() => {
    if (selectedPartner && selectedDate) {
      const loadCourts = async () => {
        setLoading(true);
        setError(null);
        try {
          const courtsData = await bookingService.getCourtsByPartnerAndDate(selectedPartner.id, selectedDate);
          setCourts(courtsData);
        } catch (err) {
          console.error('Error loading courts:', err);
          setError('Không thể tải danh sách sân. Vui lòng thử lại.');
          setCourts([]);
        } finally {
          setLoading(false);
        }
      };

      loadCourts();
    }
  }, [selectedPartner, selectedDate]);

  // Handlers
  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setCurrentStep('date');
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setCurrentStep('courts');
  };

  const handleSelectCourt = (court: CourtWithTimeSlots) => {
    setSelectedCourt(court);
    // Store selected court in global store and navigate to booking date page
    setSelectedCourtStore(court as any);
    navigate('/booking/date');
  };

  const handleBack = () => {
    if (currentStep === 'date') {
      setCurrentStep('partners');
      setSelectedPartner(null);
    } else if (currentStep === 'courts') {
      setCurrentStep('date');
      setSelectedDate('');
      setCourts([]);
    }
  };




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
          <h1 className="text-3xl font-sport text-gray-900 mb-2">
            {currentStep === 'partners' && 'Chọn đối tác'}
            {currentStep === 'date' && 'Chọn ngày đặt sân'}
            {currentStep === 'courts' && 'Chọn sân và khung giờ'}
          </h1>
          <p className="text-gray-600">
            {currentStep === 'partners' && 'Vui lòng chọn đối tác để xem danh sách sân'}
            {currentStep === 'date' && `Sân của ${selectedPartner?.bussinessName} - Chọn ngày bạn muốn đặt`}
            {currentStep === 'courts' && `Ngày ${selectedDate} - Chọn sân và khung giờ phù hợp`}
          </p>
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

        {/* Content based on current step */}
        {!loading && !error && (
          <>
            {/* Step 1: Partners */}
            {currentStep === 'partners' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {partners.map((partner: Partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    selected={selectedPartner?.id === partner.id}
                    onSelect={handleSelectPartner}
                  />
                ))}
              </div>
            )}

            {/* Step 2: Date Selection */}
            {currentStep === 'date' && (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Chọn ngày đặt sân</h3>
                    <p className="text-gray-600">Chọn ngày bạn muốn đặt sân tại {selectedPartner?.bussinessName}</p>
                  </div>
                  
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => handleSelectDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Courts with Time Slots */}
            {currentStep === 'courts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {courts.map((court: CourtWithTimeSlots) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    selected={selectedCourt?.id === court.id}
                    onSelect={handleSelectCourt}
                  />
                ))}
              </div>
            )}
          </>
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

      </div>
    </div>
  );
} 