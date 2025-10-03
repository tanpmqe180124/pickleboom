
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { blogCardData } from '@/constant/elementor-data';
import dayjs from 'dayjs';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

export const BlogCard = () => {
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`flex items-center justify-center gap-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {blogCardData.map((item, index) => {
        const Icon = item.footer.icon;
        return (
          <Card
            key={index}
            className="max-w-sm bg-white/90 text-[#2F3C54] border border-[#e0e0d1] shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl hover:border-[#2F3C54]/60 cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-lg">
                <img
                  src={item.img}
                  className="h-full max-h-[100%] w-auto object-contain"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-semibold">{item.title}</span>
              <CardDescription className="text-[#2F3C54]/80">{item.content}</CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-start gap-2">
              <Icon size={24} color="#FCBA6B" strokeWidth={1} />
              <CardDescription className="text-[#2F3C54]/70">
                {dayjs(item.footer.date).format('DD/MM/YYYY')}
              </CardDescription>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
