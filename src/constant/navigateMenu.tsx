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
    label: 'Home',
    roles: [],
    path: '/home',
    children: [
      { key: 'homelist1', path: '/home/item1-link1', label: 'Link Home 1' },
      { key: 'homelist2', path: '/home/item1-link2', label: 'Link Home 2' },
      { key: 'homelist3', path: '/home/item1-link3', label: 'Link Home 3' },
    ],
  },
  {
    key: 'shop',
    label: 'Shop',
    roles: [],
    path: '/shop',
    children: [
      { key: 'shoplist1', path: '/shop/item1-link1', label: 'Link Shop 1' },
      { key: 'shoplist2', path: '/shop/item1-link2', label: 'Link Shop 2' },
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
    label: 'Sell on Martfury',
    roles: [],
    path: '/sellonmartfury',
  },
  {
    key: 'extra2',
    label: 'Tract your order',
    roles: [],
    path: '/tractyourorder',
  },
  {
    key: 'extra3',
    label: 'USD',
    roles: [],
    path: '/usd',
  },
  {
    key: 'extra4',
    label: 'VietNamese',
    roles: [],
    path: '/vietnam',
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
