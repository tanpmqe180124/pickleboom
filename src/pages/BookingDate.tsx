
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import '../css/booking-date.css';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, TimeSlot } from '@/services/bookingService';

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

          {/* Middle Section - Calendar */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard2 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn ngày</h2>
                <p className="text-gray-600">Vui lòng chọn ngày bạn muốn đặt sân</p>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-sm animate-fade-in">
                  <Calendar
                    onChange={(date) => {
                      setSelectedDate(date as Date);
                      setSelectedTimes([]);
                    }}
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

          {/* Right Section - Time Selection */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard3 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn giờ</h2>
                <p className="text-gray-600">
                  {selectedDate ? `Ngày: ${selectedDate.toLocaleDateString('vi-VN')}` : 'Vui lòng chọn ngày trước'}
                </p>
              </div>

              {selectedDate ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg text-center animate-fade-in">
                    <p className="text-sm font-medium text-blue-800">
                      📅 Ngày đã chọn: {selectedDate.toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Đang tải khung giờ...</span>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600 text-sm">{error}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}

                  {/* Time Slots */}
                  {!loading && !error && (
                    <div className="grid grid-cols-3 gap-2 animate-fade-in">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((slot, index) => (
                          <button
                            key={`time-slot-${slot}-${index}`}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                              selectedTimes.includes(slot)
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
                            }`}
                            onClick={() => handleToggleTime(slot)}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          <p>Không có khung giờ nào khả dụng</p>
                        </div>
                      )}
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
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">⏰</span>
                  </div>
                  <p className="text-gray-600">Vui lòng chọn ngày để xem các khung giờ khả dụng</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
