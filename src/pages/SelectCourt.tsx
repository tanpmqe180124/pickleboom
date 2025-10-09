import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { bookingService } from '@/services/bookingService';

interface Partner {
  id: string;
  bussinessName: string;
  address: string;
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


export default function SelectCourt() {
  const navigate = useNavigate();
  
  // State management
  const [partners, setPartners] = useState<Partner[]>([]);
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

  // Handlers
  const handleSelectPartner = (partner: Partner) => {
    // Redirect to BookingDate.tsx instead of showing date selection in this page
    navigate('/booking/date');
  };

  const handleBack = () => {
    navigate(-1);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn đối tác</h1>
            <p className="text-gray-600">Chọn đối tác bạn muốn đặt sân</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {partners.map((partner: Partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  selected={false}
                  onSelect={handleSelectPartner}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
