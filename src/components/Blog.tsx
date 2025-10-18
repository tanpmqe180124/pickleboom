
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { blogService, PublicBlog } from '@/services/blogService';
import { CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { showToast } from '@/utils/toastManager';
import { useNavigate } from 'react-router-dom';

export const BlogCard = () => {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.15 });
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const latestBlogs = await blogService.getLatestBlogs(3);
        setBlogs(latestBlogs);
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
        showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách blog.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="max-w-sm bg-white/90 text-[#2F3C54] border border-[#e0e0d1] shadow-lg animate-pulse"
          >
            <CardHeader>
              <div className="h-48 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
            <CardFooter>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center gap-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {blogs.map((blog, index) => (
        <Card
          key={blog.id}
          className="max-w-sm bg-white/90 text-[#2F3C54] border border-[#e0e0d1] shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl hover:border-[#2F3C54]/60 cursor-pointer"
          onClick={() => navigate(`/blog/${blog.id}`)}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              <img
                src={blog.thumbnailUrl || '/img/blog.jpg'}
                alt={blog.title}
                className="h-full max-h-[100%] w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/img/blog.jpg';
                }}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-semibold">{blog.title}</span>
            <CardDescription className="text-[#2F3C54]/80">
              {blog.content.length > 100 
                ? `${blog.content.substring(0, 100)}...` 
                : blog.content
              }
            </CardDescription>
          </CardContent>
          <CardFooter className="flex items-center justify-start gap-2">
            <CalendarDays size={24} color="#FCBA6B" strokeWidth={1} />
            <CardDescription className="text-[#2F3C54]/70">
              {dayjs(blog.createdAt).format('DD/MM/YYYY')}
            </CardDescription>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
