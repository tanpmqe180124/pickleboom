import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Building2 } from 'lucide-react';

const PartnerLink: React.FC = () => {
  const { userRole } = useAuth();
  
  console.log('PartnerLink - userRole from useAuth:', userRole);
  console.log('PartnerLink - localStorage userRole:', localStorage.getItem('userRole'));

  if (!userRole || (userRole !== 'partner' && userRole.toLowerCase() !== 'partner')) {
    console.log('PartnerLink - Not partner, hiding panel');
    return null;
  }
  
  console.log('PartnerLink - Showing partner panel');

  const handleClick = () => {
    console.log('PartnerLink - Clicked, navigating to /partner');
  };

  return (
    <Link
      to="/partner"
      onClick={handleClick}
      className="group flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
    >
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="font-medium">Partner Panel</span>
      </div>
      <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
    </Link>
  );
};

export default PartnerLink;
