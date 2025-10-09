// constants/navigateMenu.ts
import { NavItem } from '@/types/nav';
import { Slide } from '@/types/slide';
import {
  CreditCard,
  Gift,
  MessagesSquare,
  RefreshCcw,
  Rocket,
} from 'lucide-react';

export const navigateMenu = (): NavItem[] => [
  {
    key: 'home',
    label: 'Trang chủ',
    roles: [],
    path: '/home',
    children: [
      { key: 'homelist1', path: '/home/about', label: 'Về chúng tôi' },
      { key: 'homelist2', path: '/home/features', label: 'Tính năng' },
      { key: 'homelist3', path: '/home/contact', label: 'Liên hệ' },
    ],
  },
  {
    key: 'courts',
    label: 'Tìm sân',
    roles: [],
    path: '/courts',
    children: [
      { key: 'courtlist1', path: '/courts/search', label: 'Tìm sân gần đây' },
      { key: 'courtlist2', path: '/courts/booking', label: 'Đặt sân' },
    ],
  },
  {
    key: 'partner',
    label: 'Đối tác',
    roles: [],
    path: '/partner',
    children: [
      { key: 'partnerlist1', path: '/partner/register', label: 'Đăng ký sân' },
      { key: 'partnerlist2', path: '/partner/dashboard', label: 'Quản lý sân' },
    ],
  },
];

export const productFilter = (): NavItem[] => [
  {
    key: 'special',
    label: 'Shop by Department',
    roles: [],
    path: '',
    children: [
      { key: 'special1', path: '/special/special1', label: 'Special 1' },
      { key: 'special2', path: '/special/special2', label: 'Special 2' },
      {
        key: 'special3',
        path: '/special/special3',
        label: 'Special 3',
        children: [
          {
            key: 'specialChild',
            path: '/special/specialChild',
            label: 'Special Child',
          },
          {
            key: 'specialChild1',
            path: '/special/specialChild1',
            label: 'Special Child1',
          },
        ],
      },
      { key: 'special4', path: '/special/special4', label: 'Special 4' },
    ],
  },
];

export const navigationExtra = (): NavItem[] => [
  {
    key: 'extra1',
    label: 'Đăng ký sân',
    roles: [],
    path: '/partner/register',
  },
  {
    key: 'extra2',
    label: 'Lịch đặt của tôi',
    roles: ['User'],
    path: '/my-bookings',
  },
  {
    key: 'extra3',
    label: 'VND',
    roles: [],
    path: '/currency',
  },
  {
    key: 'extra4',
    label: 'Tiếng Việt',
    roles: [],
    path: '/language',
    children: [{ key: 'english', path: '/english', label: 'English' }],
  },
];

export const imageHome = (): Slide[] => [
  {
    image: '/img/huawei-2.webp',
    linkUrl: '#',
  },
  {
    image: '/img/download.jpg',
    linkUrl: '#',
  },
];
export const imageHome2 = (): Slide[] => [
  {
    image: '/img/promotion_1.jpg',
    linkUrl: '#',
  },
  {
    image: '/img/promotion_2.jpg',
    linkUrl: '#',
  },
];

export const siteFeature = () => [
  {
    icon: <Rocket size={50} color="#FCBA6B" />,
    title: 'Đặt sân dễ dàng',
    content: 'Tìm và đặt sân pickleball nhanh chóng, tiện lợi',
  },

  {
    icon: <RefreshCcw size={50} color="#FCBA6B" />,
    title: 'Quản lý sân hiệu quả',
    content: 'Công cụ quản lý sân và lịch đặt cho chủ sân',
  },

  {
    icon: <CreditCard size={50} color="#FCBA6B" />,
    title: 'Thanh toán an toàn',
    content: 'Hệ thống thanh toán bảo mật, đa dạng phương thức',
  },

  {
    icon: <MessagesSquare size={50} color="#FCBA6B" />,
    title: 'Hỗ trợ 24/7',
    content: 'Đội ngũ hỗ trợ chuyên nghiệp, luôn sẵn sàng',
  },

  {
    icon: <Gift size={50} color="#FCBA6B" />,
    title: 'Kết nối cộng đồng',
    content: 'Tạo cộng đồng pickleball sôi động, kết nối người chơi',
  },
];

export const sectionDeal = () => [
  {
    title: 'Deal of the day',
  },
];
