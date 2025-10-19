import { bannerCardData } from '@/constant/bannerCard-data';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

export const Banner = () => {
  const middleIndex = Math.ceil(bannerCardData.length / 2);
  const leftItems = bannerCardData.slice(0, middleIndex);
  const rightItems = bannerCardData.slice(middleIndex);

  // Thêm ref và inView cho từng box và hình ảnh
  const [imgRef, imgInView] = useInViewAnimation({ threshold: 0.15 });

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-6 md:grid-cols-12">
      <div className="flex flex-col gap-6 pl-20 md:col-span-5">
        {leftItems.map((item, index) => {
          const [ref, inView] = useInViewAnimation({ threshold: 0.15 });
          return (
            <div
              key={index}
              ref={ref}
              className={`relative flex flex-col justify-start rounded-2xl bg-primary-foreground p-4 shadow-lg max-w-lg mx-auto hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCBA6B] text-[#2F3C54] shadow-lg border-2 border-white">
                {item.icon}
              </div>
              <h3 className="mb-2 mt-6 text-xl font-bold">{item.title}</h3>
              <span className="leading-relaxed">{item.content}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center md:col-span-2">
        <img
          ref={imgRef}
          src="/img/loi-ich-pickleball.png"
          alt="Lợi ích pickleball"
          className={`h-[520px] w-[360px] object-cover rounded-[2rem] shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300 bg-white/60 transition-all duration-700 ${imgInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        />
      </div>

      <div className="flex flex-col gap-6 pr-20 md:col-span-5">
        {rightItems.map((item, index) => {
          const [ref, inView] = useInViewAnimation({ threshold: 0.15 });
          return (
            <div
              key={index + middleIndex}
              ref={ref}
              className={`relative flex flex-col justify-start rounded-2xl bg-primary-foreground p-4 shadow-lg max-w-lg mx-auto hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCBA6B] text-[#2F3C54] shadow-lg border-2 border-white">
                {item.icon}
              </div>
              <h3 className="mb-2 mt-6 text-xl font-bold">{item.title}</h3>
              <span className="leading-relaxed">{item.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
