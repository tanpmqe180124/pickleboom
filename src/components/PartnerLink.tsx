import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const PartnerLink: React.FC = () => {
  const { userRole } = useAuth();

  // Only show for partner users
  const isPartner = userRole === 'partner' || userRole?.toLowerCase() === 'partner';

  if (!isPartner) {
    return null;
  }

  return (
    <Link
      to="/partner"
      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
      <div className="bg-white/20 rounded-lg p-2">
        <Settings size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Partner Dashboard</h3>
        <p className="text-purple-100 text-sm">
          Quản lý sân bóng, khung giờ và đặt sân
        </p>
      </div>
    </Link>
  );
};

export default PartnerLink;
