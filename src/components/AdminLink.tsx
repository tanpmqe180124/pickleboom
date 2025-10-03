import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Shield } from 'lucide-react';

const AdminLink: React.FC = () => {
  const { userRole } = useAuth();
  
  console.log('AdminLink - userRole from useAuth:', userRole);
  console.log('AdminLink - localStorage userRole:', localStorage.getItem('userRole'));

  if (!userRole || userRole.toLowerCase() !== 'admin') {
    console.log('AdminLink - Not admin, hiding panel');
    return null;
  }
  
  console.log('AdminLink - Showing admin panel');

  return (
    <Link
      to="/admin"
      className="group flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
    >
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4" />
        <span className="font-medium">Admin Panel</span>
      </div>
      <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
    </Link>
  );
};

export default AdminLink;

