import { BlogCard } from '@/types/elementorInline';
import { CalendarDays } from 'lucide-react';
import {
  CourtPricingItem,
  ElementorInline,
  LogoItems,
} from '@/types/elementorInline';
import { Check, Clock, Phone } from 'lucide-react';

export const blogCardData: BlogCard[] = [
  {
    img: '/img/blog.jpg',
    title: 'Pickleball là gì? Vì sao môn thể thao này đang bùng nổ tại Việt Nam?',
    content: 'Từ sân chơi cộng đồng tại Mỹ, Pickleball đang trở thành xu hướng mới cho giới trẻ Việt. Cùng tìm hiểu vì sao nó lại hấp dẫn đến vậy!',
    footer: {
      icon: CalendarDays,
      contentFooter: 'Kiến thức cơ bản',
      date: '2025-06-20T08:30:00Z',
    },
  },
  {
    img: '/img/blog.jpg',
    title: 'Chọn vợt Pickleball: Đâu là lựa chọn phù hợp với bạn?',
    content: 'Bạn đang phân vân giữa các dòng vợt khác nhau? Tìm ngay bí quyết chọn vợt đúng theo phong cách chơi của bạn!',
    footer: {
      icon: CalendarDays,
      contentFooter: 'Trang bị & kỹ thuật',
      date: '2025-06-21T09:00:00Z',
    },
  },
  {
    img: '/img/blog.jpg',
    title: 'Hướng dẫn người mới: Quy tắc cơ bản khi chơi Pickleball',
    content: 'Đừng ngại khám phá môn thể thao mới! Cùng tìm hiểu những quy tắc đơn giản để bắt đầu chơi ngay hôm nay.',
    footer: {
      icon: CalendarDays,
      contentFooter: 'Dành cho người mới',
      date: '2025-06-22T10:15:00Z',
    },
  },
];

export const elementorList: ElementorInline[] = [
  {
    icon: Phone,
    title: 'Đặt sân online',
    path: '/booking-play',
  },
  {
    icon: Clock,
    title: 'Thời gian tiếp nhận cuộc gọi Hotline: 0389145575 (9h - 23h)',
    path: '/tel',
  },
  {
    icon: Check,
    title: 'Mở cửa Hoạt động 24/7',
    path: '/open-24-7',
  },
];

export const elementorNotIcon: ElementorInline[] = [
  {
    title: 'SÂN PICKLEBALL',
    path: '/',
  },
  {
    title: 'TRANG CHỦ',
    path: '/',
  },
  {
    title: 'TIN TỨC & KHUYẾN MÃI',
    path: '/',
  },
];

export const imageHouse = {
  image: '/img/2.jpg',
};

export const logoHomeItems: LogoItems[] = [
  {
    img: '/img/logochuanquocte-Photoroom.png',
    title: 'Sân Pickleball chuẩn quốc tế',
  },
  {
    img: '/img/ChatGPT Image 10_54_54 30 thg 6, 2025.png',
    title: 'Tổ hợp café & thể thao tích hợp',
  },
  {
    img: '/img/logodatonline.png',
    title: 'Đặt sân – đăng ký chơi dễ dàng online',
  },
  {
    img: '/img/ChatGPT Image 14_49_07 2 thg 7, 2025.png',
    title: 'Miễn phí tiện ích & hoạt động cộng đồng',
  },
];

export const courtPricing: CourtPricingItem[] = [
  {
    content: 'Sân chuẩn quốc tế – mặt sân acrylic đa lớp',
  },
  {
    content: 'Có phòng riêng – phù hợp nhóm bạn & gia đình',
  },
  {
    content: 'Đặt lịch – thanh toán online nhanh chóng',
  },
  {
    content: 'Nhân viên hỗ trợ thân thiện, sẵn sàng hướng dẫn',
  },
  {
    content: 'Vệ sinh & kiểm tra sân định kỳ mỗi ca chơi ',
  },
];
