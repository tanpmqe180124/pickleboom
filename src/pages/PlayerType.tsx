import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { ChevronRight, ArrowLeft, Users, User, Ticket, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';


export const PlayerType = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.15 });
  const [showSubOptions, setShowSubOptions] = useState(false);
  const subOptionRef = useRef<HTMLDivElement>(null);
  
  // Animation states
  const [showCard, setShowCard] = useState(false);
  const [showMainOptions, setShowMainOptions] = useState(false);
  const [showSubOptionsAnimated, setShowSubOptionsAnimated] = useState(false);
  // Initialize animations
  useEffect(() => {
    setShowCard(true);
    const timer1 = setTimeout(() => {
      setShowMainOptions(true);
    }, 300);
    
    return () => clearTimeout(timer1);
  }, []);

  // Handle sub-options animation
  useEffect(() => {
    if (showSubOptions) {
      const timer = setTimeout(() => {
        setShowSubOptionsAnimated(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowSubOptionsAnimated(false);
    }
  }, [showSubOptions]);

  const handleSelectType = (type: string) => {
    navigate('/booking/select-court', { state: { playerType: type } });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div 
          className={`mb-6 transition-all duration-500 transform ${
            showCard 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4'
          }`}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </Button>
        </div>

        <Card 
          className={`shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-700 transform ${
            showCard 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all duration-700 transform ${
              showCard 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-75 rotate-180'
            }`}>
              <Users size={32} className="text-white" />
            </div>
            <CardTitle className={`text-2xl font-bold text-gray-900 transition-all duration-700 transform ${
              showCard 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}>
              Chọn loại người chơi
            </CardTitle>
            <CardDescription className={`text-gray-600 transition-all duration-700 transform ${
              showCard 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}>
              Vui lòng chọn hình thức đặt sân phù hợp với bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Hourly Booking with Sub-options */}
            <div className="relative">
              <Card 
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-300 transform ${
                  showMainOptions 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-8'
                }`}
                onClick={() => setShowSubOptions(!showSubOptions)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Đặt sân theo giờ</h4>
                      <p className="text-sm text-gray-600">Chọn thời gian và sân chơi</p>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={`text-blue-500 transition-all duration-300 transform ${showSubOptions ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sub-options Dropdown */}
              {showSubOptions && (
                <div className={`mt-2 space-y-2 transition-all duration-500 transform ${
                  showSubOptionsAnimated 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-4'
                }`}>
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-blue-200 hover:border-blue-300 transform ${
                      showSubOptionsAnimated 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: '100ms' }}
                    onClick={() => handleSelectType('member')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <User size={20} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Hội viên</h5>
                          <p className="text-sm text-gray-600">Giá ưu đãi cho thành viên</p>
                        </div>
                        <ChevronRight size={16} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-blue-200 hover:border-blue-300 transform ${
                      showSubOptionsAnimated 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: '200ms' }}
                    onClick={() => handleSelectType('guest')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-orange-100">
                          <Users size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Vãng lai</h5>
                          <p className="text-sm text-gray-600">Giá tiêu chuẩn cho khách</p>
                        </div>
                        <ChevronRight size={16} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Social/Ticket Booking */}
            <Card 
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-300 transform ${
                showMainOptions 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
              onClick={() => handleSelectType('ticket')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors">
                    <Ticket size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Social/Xé vé</h4>
                    <p className="text-sm text-gray-600">Tham gia sự kiện và hoạt động</p>
                  </div>
                  <ChevronRight size={20} className="text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div 
          className={`mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-700 transform ${
            showCard 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin size={16} className="text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Địa điểm</p>
              <p>Chi nhánh 123, đường ABC, phường XYZ, Quy Nhơn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
