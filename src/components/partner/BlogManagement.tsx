import React from 'react';
                                                                                                             import BaseBlogManagement from '@/components/shared/BaseBlogManagement';
import { partnerService } from '@/services/partnerService';

const BlogManagement: React.FC = () => {
  return (
    <BaseBlogManagement
      userRole="Partner"
      apiService={{
        getBlogs: partnerService.getBlogs,
        getBlogById: partnerService.getBlogById,
        createBlog: partnerService.createBlog,
        updateBlog: partnerService.updateBlog,
        deleteBlog: partnerService.deleteBlog,
      }}
      permissions={{
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: false, // Partner chỉ xem blog của mình
      }}
    />
  );
};

export default BlogManagement;