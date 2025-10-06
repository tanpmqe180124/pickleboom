import React from 'react';
import BaseBlogManagement from '@/components/shared/BaseBlogManagement';
import { adminService } from '@/services/adminService';

const BlogManagement: React.FC = () => {
  return (
    <BaseBlogManagement
      userRole="Admin"
      apiService={{
        getBlogs: adminService.getBlogs,
        getBlogById: adminService.getBlogById,
        createBlog: adminService.createBlog,
        updateBlog: adminService.updateBlog,
        deleteBlog: adminService.deleteBlog,
      }}
      permissions={{
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true, // Admin xem tất cả
      }}
    />
  );
};

export default BlogManagement;