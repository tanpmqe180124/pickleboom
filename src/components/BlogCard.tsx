import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Eye } from 'lucide-react';
import dayjs from 'dayjs';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { PublicBlog } from '@/services/blogService';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  blog: PublicBlog;
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, index = 0 }) => {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.15 });
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog.id}`);
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card
      ref={ref}
      className={`max-w-sm bg-white/90 text-[#2F3C54] border border-[#e0e0d1] shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl hover:border-[#2F3C54]/60 cursor-pointer ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {blog.thumbnailUrl ? (
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 ${blog.thumbnailUrl ? 'hidden' : ''}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm text-gray-600">Pickleball Blog</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
          {blog.title}
        </CardTitle>
        <CardDescription className="text-[#2F3C54]/80 line-clamp-3">
          {truncateContent(blog.content)}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#2F3C54]/70">
          <Calendar size={16} />
          <span>{dayjs(blog.createdAt).format('DD/MM/YYYY')}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
          <Eye size={16} />
          <span>Đọc thêm</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
