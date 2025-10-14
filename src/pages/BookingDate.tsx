
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from 'react-calendar';
import '../css/booking-date.css';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, Court, TimeSlot } from '@/services/bookingService';

interface Partner {
  id: string;
  bussinessName: string;
  address: string;
}

// Use Court interface from bookingService which matches backend structure

type Step = 'partners' | 'date' | 'time';

export default function BookingDate() {
  const navigate = useNavigate();
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Get selected partner from store
  const selectedPartnerFromStore = useBookingStore((state) => state.selectedPartner);
  const setSelectedPartnerStore = useBookingStore((state) => state.setSelectedPartner);

  // State management for workflow
  const [currentStep, setCurrentStep] = useState<Step>('partners');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation states for each card
  const [showCard1, setShowCard1] = useState(false);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);

  // Sync selectedPartner from store and auto-advance step
  useEffect(() => {
    if (selectedPartnerFromStore) {
      setSelectedPartner(selectedPartnerFromStore);
      setCurrentStep('date'); // Auto-advance to date selection
    }
  }, [selectedPartnerFromStore]);

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
          const dateString = selectedDate.toISOString().split('T')[0];
          const courtsData = await bookingService.getCourtsByPartnerAndDate(selectedPartner.id, dateString);
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

  // Get available times from selected court (only Free slots)
  const availableTimes = selectedCourt && selectedCourt.timeSlotIDs
    ? selectedCourt.timeSlotIDs
        .filter(slot => slot && slot.startTime && slot.status === 0) // Backend returns 0 for Free (available)
        .map(slot => slot.startTime)
        .sort()
    : [];

  // Initialize animations based on current step
  useEffect(() => {
    // Show first card immediately
    setShowCard1(true);
    
    // Show second card when partner is selected
    if (currentStep === 'date' || currentStep === 'time') {
      const timer1 = setTimeout(() => {
        setShowCard2(true);
      }, 300);
      
      // Show third card when date is selected
      if (currentStep === 'time') {
        const timer2 = setTimeout(() => {
          setShowCard3(true);
        }, 600);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
      
      return () => clearTimeout(timer1);
    }
  }, [currentStep]);

  // Handlers
  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setSelectedPartnerStore(partner); // Save to store
    setCurrentStep('date');
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep('time');
  };

  const handleSelectCourt = (court: Court) => {
    setSelectedCourt(court);
    setSelectedTimes([]); // Reset selected times when changing court
  };

  const handleBack = () => {
    if (currentStep === 'date') {
      setCurrentStep('partners');
      setSelectedPartner(null);
      setSelectedPartnerStore(null); // Reset in store
    } else if (currentStep === 'time') {
      setCurrentStep('date');
      setSelectedDate(null);
      setCourts([]);
      setSelectedCourt(null);
    } else {
      navigate(-1);
    }
  };

  const handleToggleTime = (slot: string) => {
    if (selectedTimes.includes(slot)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== slot));
    } else {
      setSelectedTimes([...selectedTimes, slot]);
    }
  };

  const handleContinue = () => {
    if (!selectedDate || selectedTimes.length === 0 || !selectedCourt || !selectedCourt.timeSlotIDs) return;
    
    // Map selected time strings to time slot IDs
    const selectedTimeSlotIds = selectedTimes
      .map(timeString => {
        const slot = selectedCourt.timeSlotIDs?.find(slot => slot.startTime === timeString);
        return slot ? slot.id : null;
      })
      .filter((id): id is string => id !== null);
    
    // Store in booking store for checkout
    const setSelectedDateStore = useBookingStore.getState().setSelectedDate;
    const setSelectedTimesStore = useBookingStore.getState().setSelectedTimes;
    const setSelectedTimeSlotsStore = useBookingStore.getState().setSelectedTimeSlots;
    const setSelectedTimeSlotIdsStore = useBookingStore.getState().setSelectedTimeSlotIds;
    const setSelectedCourtStore = useBookingStore.getState().setSelectedCourt;
    
    setSelectedDateStore(selectedDate);
    setSelectedTimesStore(selectedTimes);
    setSelectedTimeSlotsStore(selectedTimes); // Also save to selectedTimeSlots for CheckOut compatibility
    setSelectedTimeSlotIdsStore(selectedTimeSlotIds);
    setSelectedCourtStore(selectedCourt);
    
    navigate('/booking/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group" 
            onClick={handleBack}
          >
            <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1: Partners */}
          {currentStep === 'partners' && (
            <div className="lg:col-span-3">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn đối tác</h1>
                <p className="text-gray-600">Chọn đối tác bạn muốn đặt sân</p>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
              )}

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

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner: Partner) => (
                    <div
                      key={partner.id}
                      className="p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      onClick={() => handleSelectPartner(partner)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{partner.bussinessName}</h3>
                          <p className="text-gray-600 text-sm">{partner.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 'date' && (
            <div className="lg:col-span-3">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn ngày đặt sân</h1>
                <p className="text-gray-600">Sân của {selectedPartner?.bussinessName} - Chọn ngày bạn muốn đặt</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Chọn ngày đặt sân</h3>
                    <p className="text-gray-600">Chọn ngày bạn muốn đặt sân tại {selectedPartner?.bussinessName}</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <CalendarComponent
                      onChange={(date) => handleSelectDate(date as Date)}
                      value={selectedDate}
                      minDate={new Date()}
                      locale="vi-VN"
                      tileClassName={({ date }) =>
                        selectedDate && date.toDateString() === selectedDate.toDateString()
                          ? 'bg-blue-600 text-white rounded-lg' : 'hover:bg-blue-50 rounded-lg'
                      }
                      formatMonthYear={(locale, date) => `${date.getMonth() + 1} - ${date.getFullYear()}`}
                      className="rounded-xl shadow-sm border border-gray-200 p-4 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Court and Time Selection */}
          {currentStep === 'time' && (
            <div className="lg:col-span-3">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <span className="text-2xl">🏟️</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn sân và khung giờ</h1>
                <p className="text-gray-600 text-lg">
                  {selectedDate ? `Ngày ${selectedDate.toLocaleDateString('vi-VN')} - Chọn sân và khung giờ phù hợp` : 'Vui lòng chọn ngày trước'}
                </p>
              </div>

              {selectedDate ? (
                <div className="space-y-6">
                  {/* Court Selection */}
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg">🎾</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Chọn sân</h3>
                        <p className="text-gray-600 text-sm">Chọn sân bạn muốn đặt</p>
                      </div>
                    </div>

                    {loading && (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Đang tải sân...</span>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    {!loading && !error && (
                      <div className="space-y-3">
                        {courts.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-2xl">🏟️</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sân nào khả dụng</h3>
                            <p className="text-gray-500">Vui lòng chọn ngày khác hoặc liên hệ với đối tác</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courts.map((court: Court) => (
                            <div
                              key={court.id}
                                className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                                selectedCourt?.id === court.id
                                    ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                                    : 'border-gray-200 hover:border-green-300'
                              }`}
                              onClick={() => handleSelectCourt(court)}
                            >
                                {/* Court Image */}
                                <div className="relative h-40 overflow-hidden rounded-t-xl">
                                  {court.imageUrl ? (
                                    <img 
                                      src={court.imageUrl} 
                                      alt={court.name}
                                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50">
                                      <Calendar size={40} className="text-gray-400" />
                                    </div>
                                  )}
                                  
                                  {/* Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                  
                                  {/* Court Status Badge */}
                                  <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                      court.courtStatus === 0 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-red-500 text-white'
                                    }`}>
                                      {court.courtStatus === 0 ? 'Có sẵn' : 'Không có sẵn'}
                                    </span>
                                  </div>
                                  
                                  {/* Court Name Overlay */}
                                  <div className="absolute bottom-3 left-3">
                                    <h3 className="text-white font-bold text-lg drop-shadow-lg">{court.name}</h3>
                                  </div>
                                </div>
                                
                                {/* Court Info */}
                                <div className="p-5">
                                  {/* Location */}
                                  <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                                    <p className="text-gray-600 text-sm">{court.location || 'Địa chỉ chưa cập nhật'}</p>
                                  </div>
                                  
                                  {/* Price */}
                                  <div className="mb-4">
                                    <p className="text-2xl font-bold text-green-600">
                                      {court.pricePerHour ? `${court.pricePerHour.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
                                    </p>
                                    <p className="text-sm text-gray-500">/giờ</p>
                                  </div>
                                  
                                  {/* Available Time Slots */}
                                  {court.timeSlotIDs && court.timeSlotIDs.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-2">Khung giờ có sẵn:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {court.timeSlotIDs
                                          .filter(slot => slot.status === 0)
                                          .slice(0, 4)
                                          .map((slot, index) => (
                                            <span 
                                              key={index}
                                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200"
                                            >
                                              {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                                            </span>
                                          ))}
                                        {court.timeSlotIDs.filter(slot => slot.status === 0).length > 4 && (
                                          <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                                            +{court.timeSlotIDs.filter(slot => slot.status === 0).length - 4}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Selection Indicator */}
                                  {selectedCourt?.id === court.id && (
                                    <div className="mt-4 pt-3 border-t border-green-200">
                                      <div className="flex items-center text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium">Đã chọn</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  {selectedCourt && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-lg">⏰</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Chọn khung giờ</h3>
                          <p className="text-gray-600 text-sm">Sân: {selectedCourt.name}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Morning Time Slots */}
                        {availableTimes.filter(time => {
                          const hour = parseInt(time.split(':')[0]);
                          return hour >= 4 && hour < 12;
                        }).length > 0 && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="text-lg mr-2">🌅</span>
                              Sáng (4:00 - 12:00)
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {availableTimes
                                .filter(time => {
                                  const hour = parseInt(time.split(':')[0]);
                                  return hour >= 4 && hour < 12;
                                })
                                .map((slot, index) => (
                                  <button
                                    key={`morning-${slot}-${index}`}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                      selectedTimes.includes(slot)
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-transparent shadow-lg'
                                        : 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400'
                                    }`}
                                    onClick={() => handleToggleTime(slot)}
                                  >
                                    {slot}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Afternoon Time Slots */}
                        {availableTimes.filter(time => {
                          const hour = parseInt(time.split(':')[0]);
                          return hour >= 12 && hour < 18;
                        }).length > 0 && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="text-lg mr-2">☀️</span>
                              Chiều (12:00 - 18:00)
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {availableTimes
                                .filter(time => {
                                  const hour = parseInt(time.split(':')[0]);
                                  return hour >= 12 && hour < 18;
                                })
                                .map((slot, index) => (
                                  <button
                                    key={`afternoon-${slot}-${index}`}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                      selectedTimes.includes(slot)
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg'
                                        : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50 hover:border-orange-400'
                                    }`}
                                    onClick={() => handleToggleTime(slot)}
                                  >
                                    {slot}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Evening Time Slots */}
                        {availableTimes.filter(time => {
                          const hour = parseInt(time.split(':')[0]);
                          return hour >= 18 || hour < 4;
                        }).length > 0 && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="text-lg mr-2">🌙</span>
                              Tối (18:00 - 4:00)
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {availableTimes
                                .filter(time => {
                                  const hour = parseInt(time.split(':')[0]);
                                  return hour >= 18 || hour < 4;
                                })
                                .map((slot, index) => (
                                  <button
                                    key={`evening-${slot}-${index}`}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                      selectedTimes.includes(slot)
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-lg'
                                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400'
                                    }`}
                                    onClick={() => handleToggleTime(slot)}
                                  >
                                    {slot}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* No time slots available */}
                        {availableTimes.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>Không có khung giờ nào khả dụng</p>
                          </div>
                        )}

                        {/* Continue Button */}
                        {selectedTimes.length > 0 && (
                          <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Đã chọn:</span>
                              <span className="font-medium text-blue-600">
                                {selectedTimes.length} khung giờ
                              </span>
                            </div>
                            
                            <button
                              onClick={handleContinue}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                              Tiếp tục
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-gray-600">Vui lòng chọn ngày để xem các sân và khung giờ khả dụng</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
