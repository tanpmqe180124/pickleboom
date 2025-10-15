import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { courtPricing, logoHomeItems } from '@/constant/elementor-data';

const PricingSection = () => {
  return (
    <>
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
      </div>
    </>
  );
};

export default PricingSection;
