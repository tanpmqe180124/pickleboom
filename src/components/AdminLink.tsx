import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { Settings, Shield } from 'lucide-react';

const AdminLink: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const hasAdminRole = await adminService.checkAdminRole();
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, []);

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

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

