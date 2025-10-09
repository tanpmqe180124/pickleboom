
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import '../css/booking-date.css';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, Court, TimeSlot } from '@/services/bookingService';

interface Partner {
  id: string;
  bussinessName: string;
  address: string;
}

interface CourtWithTimeSlots extends Court {
  timeSlots: TimeSlot[];
}

export default function BookingDate() {
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimes = useBookingStore((state) => state.selectedTimes);
  const drinkOption = useBookingStore((state) => state.drinkOption);
  const allTimeSlots = useBookingStore((state) => state.allTimeSlots);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedTimes = useBookingStore((state) => state.setSelectedTimes);
  const setSelectedTimeSlots = useBookingStore((state) => state.setSelectedTimeSlots);
  const setSelectedTimeSlotIds = useBookingStore((state) => state.setSelectedTimeSlotIds);
  const setAllTimeSlots = useBookingStore((state) => state.setAllTimeSlots);
  const setDrinkOption = useBookingStore((state) => state.setDrinkOption);
  const navigate = useNavigate();
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Animation states for each card
  const [showCard1, setShowCard1] = useState(false);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);
  
  // Loading state for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New states for partners and courts
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [courts, setCourts] = useState<CourtWithTimeSlots[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<CourtWithTimeSlots | null>(null);
  const [currentStep, setCurrentStep] = useState<'partners' | 'date' | 'courts'>('partners');

  // Load partners on mount
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const partnersData = await bookingService.getPartners();
        setPartners(partnersData);
        setShowCard1(true);
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

  // Load time slots from API
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (allTimeSlots.length > 0) return; // Already loaded
      
      setLoading(true);
      setError(null);
      try {
        console.log('Loading time slots...');
        const timeSlots = await bookingService.getTimeSlots();
        console.log('Time slots loaded:', timeSlots);
        setAllTimeSlots(timeSlots);
      } catch (err) {
        console.error('Error loading time slots:', err);
        setError('Không thể tải danh sách khung giờ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadTimeSlots();
  }, [allTimeSlots.length, setAllTimeSlots]);

  // Load courts when partner and date are selected
  useEffect(() => {
    if (selectedPartner && selectedDate) {
      const loadCourts = async () => {
        setLoading(true);
        setError(null);
        try {
          const courtsData = await bookingService.getCourtsByPartnerAndDate(selectedPartner.id, selectedDate);
          setCourts(courtsData);
          setCurrentStep('courts');
          setShowCard3(true);
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

  // Get available times from API data
  const availableTimes = allTimeSlots
    .filter(slot => slot && slot.startTime) // Filter out invalid slots
    .map(slot => slot.startTime)
    .sort();
  
  // Debug logging
  console.log('Available times for display:', availableTimes);
  console.log('All time slots:', allTimeSlots);
  console.log('Filtered time slots:', allTimeSlots.filter(slot => slot && slot.startTime));

  // Initialize animations on mount
  useEffect(() => {
    // Show first card immediately
    setShowCard1(true);
    
    // Show cards progressively based on user's progress
    if (drinkOption) {
      const timer1 = setTimeout(() => {
        setShowCard2(true);
      }, 300);
      
      if (selectedDate) {
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
  }, []);

  // Show second card when drink option is selected
  useEffect(() => {
    if (drinkOption) {
      const timer = setTimeout(() => {
        setShowCard2(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [drinkOption]);

  // Show third card when date is selected
  useEffect(() => {
    if (selectedDate) {
      const timer = setTimeout(() => {
        setShowCard3(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  // Handlers
  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setCurrentStep('date');
    setShowCard2(true);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimes([]);
  };

  const handleSelectCourt = (court: CourtWithTimeSlots) => {
    setSelectedCourt(court);
    // Extract time slots from selected court
    const courtTimeSlots = court.timeSlots || [];
    const timeStrings = courtTimeSlots.map(slot => slot.startTime);
    setSelectedTimes(timeStrings);
  };

  const handleToggleTime = (slot: string) => {
    if (selectedTimes.includes(slot)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== slot));
    } else {
      setSelectedTimes([...selectedTimes, slot]);
    }
  };

  const handleContinue = () => {
    if (!selectedDate || selectedTimes.length === 0) return;
    
    console.log('Selected times:', selectedTimes);
    console.log('All time slots:', allTimeSlots);
    
    // Map selected time strings to time slot IDs
    const selectedTimeSlotIds = selectedTimes
      .map(timeString => {
        const slot = allTimeSlots.find(slot => slot.startTime === timeString);
        console.log(`Mapping ${timeString} to slot:`, slot);
        return slot ? slot.id : null;
      })
      .filter((id): id is string => id !== null);
    
    console.log('Selected time slot IDs:', selectedTimeSlotIds);
    
    // Sắp xếp các slot đã chọn theo thứ tự thời gian
    const sortedTimes = [...selectedTimes].sort();
    setSelectedTimeSlots(sortedTimes);
    setSelectedTimeSlotIds(selectedTimeSlotIds);
    navigate('/booking/checkout');
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Service Info & Drink Options */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard1 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🏓</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Pickle Boom</h1>
                <p className="text-gray-600">Dịch vụ đặt sân chuyên nghiệp</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center animate-fade-in">
                    <span className="mr-2"></span>
                    Dịch vụ bổ sung
                  </h4>
                  <p className="text-sm text-gray-600 animate-fade-in">
                    Quý khách có muốn thêm nước uống giải khát vào đơn đặt sân không?
                  </p>
                  
                  <div className="space-y-3 animate-fade-in">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input 
                        type="radio" 
                        name="drink" 
                        value="yes" 
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                        checked={drinkOption === 'yes'}
                        onChange={(e) => setDrinkOption(e.target.value)}
                      />
                      <span className="text-sm font-medium text-gray-700">Có, tôi muốn sử dụng</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input 
                        type="radio" 
                        name="drink" 
                        value="no" 
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                        checked={drinkOption === 'no'}
                        onChange={(e) => setDrinkOption(e.target.value)}
                      />
                      <span className="text-sm font-medium text-gray-700">Không, tôi không có nhu cầu</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Partners, Calendar, or Courts */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard2 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              {/* Partners Selection */}
              {currentStep === 'partners' && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn đối tác</h2>
                    <p className="text-gray-600">Chọn đối tác bạn muốn đặt sân</p>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {partners.map((partner) => (
                        <button
                          key={partner.id}
                          onClick={() => handleSelectPartner(partner)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            selectedPartner?.id === partner.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">{partner.bussinessName}</h3>
                          <p className="text-sm text-gray-600">{partner.address}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Date Selection */}
              {currentStep === 'date' && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn ngày</h2>
                    <p className="text-gray-600">Chọn ngày bạn muốn đặt sân tại {selectedPartner?.bussinessName}</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-full max-w-sm animate-fade-in">
                      <Calendar
                        onChange={handleSelectDate}
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
                </>
              )}

              {/* Courts Selection */}
              {currentStep === 'courts' && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn sân</h2>
                    <p className="text-gray-600">Chọn sân và khung giờ phù hợp</p>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Đang tải sân...</span>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  ) : courts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Không có sân nào khả dụng</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {courts.map((court) => (
                        <button
                          key={court.id}
                          onClick={() => handleSelectCourt(court)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            selectedCourt?.id === court.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">{court.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{court.address}</p>
                          {court.timeSlots && court.timeSlots.length > 0 && (
                            <div className="flex flex-wrap gap-1">
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
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Section - Time Selection or Summary */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard3 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn giờ</h2>
                <p className="text-gray-600">
                  {selectedDate ? `Ngày: ${selectedDate.toLocaleDateString('vi-VN')}` : 'Vui lòng chọn ngày trước'}
                </p>
              </div>

              {/* Show different content based on current step */}
              {currentStep === 'partners' && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Vui lòng chọn đối tác để tiếp tục</p>
                </div>
              )}

              {currentStep === 'date' && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Vui lòng chọn ngày để xem các sân khả dụng</p>
                </div>
              )}

              {currentStep === 'courts' && selectedDate && (
                <div className="space-y-6">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg text-center animate-fade-in">
                    <p className="text-sm font-medium text-blue-800">
                      📅 Ngày đã chọn: {selectedDate.toLocaleDateString('vi-VN')}
                    </p>
                    {selectedPartner && (
                      <p className="text-xs text-blue-600 mt-1">
                        Đối tác: {selectedPartner.bussinessName}
                      </p>
                    )}
                  </div>

                  {/* Selected Court Info */}
                  {selectedCourt && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                      <h4 className="font-semibold text-green-900 mb-2">Sân đã chọn:</h4>
                      <p className="text-sm text-green-800 font-medium">{selectedCourt.name}</p>
                      <p className="text-xs text-green-700 mt-1">{selectedCourt.address}</p>
                      {selectedCourt.timeSlots && selectedCourt.timeSlots.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-green-700 mb-1">Khung giờ khả dụng:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedCourt.timeSlots.map((slot, index) => (
                              <span key={index} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Time Slots Selection */}
                  {selectedCourt && selectedCourt.timeSlots && selectedCourt.timeSlots.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Chọn khung giờ:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCourt.timeSlots.map((slot, index) => (
                          <button
                            key={`time-slot-${slot.id}-${index}`}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                              selectedTimes.includes(slot.startTime)
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
                            }`}
                            onClick={() => handleToggleTime(slot.startTime)}
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTimes.length > 0 && (
                    <div className="space-y-4 animate-fade-in">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
