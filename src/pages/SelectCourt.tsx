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
  location: string;
  pricePerHour: number;
  description?: string;
  imageUrl?: string;
  courtStatus?: number;
  timeSlots: TimeSlot[];
}

type Step = 'partners' | 'date' | 'courts';

interface PartnerCardProps {
  partner: Partner;
  selected: boolean;
  onSelect: (partner: Partner) => void;
}

function PartnerCard({ partner, selected, onSelect }: PartnerCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(partner)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{partner.bussinessName}</h3>
          <p className="text-gray-600 text-sm">{partner.address}</p>
        </div>
        {selected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CourtCardProps {
  court: CourtWithTimeSlots;
  selected: boolean;
  onSelect: (court: CourtWithTimeSlots) => void;
}

function CourtCard({ court, selected, onSelect }: CourtCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(court)}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{court.name}</h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <Calendar size={16} className="mr-1" />
          {court.location}
        </p>
        <p className="text-lg font-bold text-green-600">
          {court.pricePerHour.toLocaleString('vi-VN')} VNĐ/giờ
        </p>
      </div>

      {court.timeSlots && court.timeSlots.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Khung giờ khả dụng:</p>
          <div className="flex flex-wrap gap-2">
            {court.timeSlots.slice(0, 3).map((slot, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {slot.startTime} - {slot.endTime}
              </span>
            ))}
            {court.timeSlots.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{court.timeSlots.length - 3} khác
              </span>
            )}
          </div>
        </div>
      )}

      <button
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          selected
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {selected ? 'Đã chọn' : 'Chọn sân này'}
      </button>
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
    setSelectedCourtStore(court);
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
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group mb-4" 
            onClick={handleBack}
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStep === 'partners' && 'Chọn đối tác'}
              {currentStep === 'date' && 'Chọn ngày đặt sân'}
              {currentStep === 'courts' && 'Chọn sân và khung giờ'}
            </h1>
            <p className="text-gray-600">
              {currentStep === 'partners' && 'Chọn đối tác bạn muốn đặt sân'}
              {currentStep === 'date' && `Sân của ${selectedPartner?.bussinessName} - Chọn ngày bạn muốn đặt`}
              {currentStep === 'courts' && `Ngày ${selectedDate} - Chọn sân và khung giờ phù hợp`}
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
                  {courts.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sân nào</h3>
                      <p className="text-gray-500">Hiện tại không có sân nào khả dụng.</p>
                    </div>
                  ) : (
                    courts.map((court: CourtWithTimeSlots) => (
                      <CourtCard
                        key={court.id}
                        court={court}
                        selected={selectedCourt?.id === court.id}
                        onSelect={handleSelectCourt}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
