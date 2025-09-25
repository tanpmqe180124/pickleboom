import {
  courtPricing,
  elementorList,
  elementorNotIcon,
  imageHouse,
  logoHomeItems,
} from '@/constant/elementor-data';

import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Banner } from './BannerHealth';
import { BlogCard } from './Blog';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="h-[100px] border-b bg-primary text-primary-foreground">
      <div className="w-full py-3">
        <div className="mr-2 flex items-center justify-center divide-x divide-muted-foreground">
          {elementorList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex space-x-1 px-4">
                {Icon && <Icon size={24} color="#FCBA6B" strokeWidth={1} />}
                <span className="cursor-pointer text-sm hover:text-primary-hl">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-wrap">
          <div className="grid w-full grid-cols-12">
            <div className="col-span-3 flex items-center justify-center">
              <img
                src="/img/brandlogo_white_clean.png"
                className="h-[63px] w-[112px] object-contain"
                alt="Brand Logo"
              />
            </div>

            <div className="col-span-6 flex items-center justify-center space-x-3">
              {elementorNotIcon.map((item, index) => {
                // Scroll to section if menu item is clicked
                const handleClick = () => {
                  if (item.title === 'TIN TỨC & KHUYẾN MÃI') {
                    const blogSection = document.getElementById('blog-section');
                    if (blogSection) {
                      blogSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else if (item.title === 'SÂN PICKLEBALL') {
                    const priceSection = document.getElementById(
                      'court-price-section',
                    );
                    if (priceSection) {
                      priceSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                };
                return (
                  <div key={index} className="flex">
                    <span
                      className="cursor-pointer text-sm hover:text-primary-hl"
                      onClick={handleClick}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="col-span-3 flex items-center justify-center space-x-4">
              <Link to="/playertype">
                <Button
                  variant="ghost"
                  className="hover:border-primary-dark flex min-w-[140px] items-center justify-center rounded-full border-2 border-primary bg-gradient-to-r from-white via-blue-50 to-white px-7 py-2 font-bold text-primary shadow-md transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-white hover:shadow-xl focus:bg-primary focus:text-white focus:shadow-lg"
                >
                  Đặt lịch ngay
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  asChild
                  variant="ghost"
                  className="hover:border-primary-dark flex min-w-[140px] items-center justify-center gap-2 rounded-full border-2 border-primary bg-gradient-to-r from-white via-blue-50 to-white px-7 py-2 font-bold text-primary shadow-md transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-white hover:shadow-xl focus:bg-primary focus:text-white focus:shadow-lg"
                >
                  <div className="flex flex-row items-center gap-2">
                    <UserRound
                      className="text-muted-foreground transition-colors group-hover:text-white"
                      strokeWidth={1}
                      color="#000000"
                    />
                    <span className="underline-offset-4 transition-all group-hover:text-white group-hover:underline">
                      Đăng nhập
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div
            className="relative h-[400px] w-full bg-center"
            style={{
              backgroundImage: `url(${imageHouse.image})`,
              backgroundSize: 'cover',
            }}
          >
            <div className="clip-diagonal-left absolute inset-0 bottom-10 z-0 bg-black/60"></div>
            <div className="clip-diagonal-right absolute inset-0 top-10 z-0 bg-cyan-700/80"></div>
            <div className="clip-middle absolute inset-0 z-0 bg-primary/60"></div>

            <div
              className="animate-fade-in-right absolute right-1/4 z-10 flex h-full max-w-[25%] items-center justify-center"
              style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
            >
              <img
                src="/img/mainimg-removebg-preview.png"
                className="h-full max-h-[100%] w-auto object-contain"
              />
            </div>

            <div className="absolute left-40 top-1/2 z-20 -translate-y-1/2">
              <div className="max-w-xl space-y-4 text-left">
                <h3 className="animate-fade-in-down text-3xl font-semibold leading-snug">
                  Chào mừng đến với Pickle Boom - Tổ hợp Pickleball & Café đầu
                  tiên tại Quy Nhơn
                </h3>
                <p
                  className="animate-fade-in-down text-lg font-medium leading-relaxed"
                  style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
                >
                  Pickle Boom là mô hình tiên phong tại Quy Nhơn kết hợp giữa
                  thể thao Pickleball, không gian café hiện đại, và cộng đồng
                  người chơi năng động. Tại đây, bạn không chỉ vận động nhẹ
                  nhàng, thư giãn sau giờ làm, mà còn dễ dàng kết nối bạn bè,
                  gia nhập hội nhóm, và tận hưởng một phong cách sống hiện đại –
                  lành mạnh – cá nhân hóa.
                </p>
                <Button
                  asChild
                  // variant="vivid"
                  className="animate-scale-in rounded-xl px-8 py-3 text-lg font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/80"
                  style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
                >
                  <Link to="/playertype">Đặt lịch ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-[#2F3C54] p-4 md:grid-cols-4">
          {logoHomeItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-xl border border-[#e0e0d1] bg-[#f1f1e6] p-4 text-center shadow-lg transition duration-300 hover:scale-105"
            >
              <img
                src={item.img}
                alt={item.title}
                className={`mb-3 object-contain drop-shadow-[0_2px_8px_rgba(252,186,107,0.3)] ${index <= 3 ? 'h-32 w-32' : 'h-16 w-16'}`}
              />
              <span className="text-sm font-medium text-[#2F3C54]">
                {item.title}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-custom-gradient w-full p-6">
          <div
            id="court-price-section"
            className="mt-16 flex w-full items-center justify-center"
          >
            <div className="animate-fade-in-up flex w-full max-w-sm cursor-pointer flex-col items-center space-y-5 rounded-2xl border border-transparent bg-[#f1f1e6] p-6 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#2F3C54] hover:bg-white/90 hover:shadow-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2F3C54]">
                Bảng giá sân
              </h3>

              <div className="flex items-end justify-center gap-1">
                <div className="text-2xl font-bold leading-none text-[#2F3C54]">
                  Đặt sân ngay - chỉ từ 29k
                </div>
                <span className="pb-1 text-sm italic tracking-wider text-[#2F3C54]/80">
                  ₫/h
                </span>
              </div>

              <Button
                asChild
                variant="default"
                className="group border-[#2F3C54] bg-[#2F3C54] text-[#f1f1e6] transition hover:border-[#2F3C54] hover:bg-[#f1f1e6] hover:text-[#2F3C54]"
              >
                <Link
                  to="/playertype"
                  className="transition-colors duration-200 group-hover:text-[#2F3C54] group-hover:underline group-hover:underline-offset-4"
                  style={{ fontWeight: 600 }}
                >
                  Check sân ngay
                </Link>
              </Button>

              <ul className="w-full space-y-2 text-left text-[#2F3C54]/90">
                {courtPricing.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-lg font-extrabold leading-none text-primary">
                      ✓
                    </span>
                    <span className="text-[15px] font-medium leading-tight">
                      {item.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-20 flex w-full flex-col items-center justify-center text-accent-foreground">
            <h2 className="text-3xl font-semibold text-[#23272f]">Lợi ích của pickleball</h2>
            <Banner />
          </div>
          <div
            id="blog-section"
            className="mt-8 flex flex-col items-center gap-4"
          >
            <h2 className="text-3xl font-semibold text-[#23272f]">BLOG & TIN TỨC</h2>
            <BlogCard />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
