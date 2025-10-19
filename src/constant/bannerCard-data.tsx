import { bannerCard } from '@/types/elementorInline';
import { Heart, Dumbbell, Weight, Brain, Zap } from 'lucide-react';

export const bannerCardData: bannerCard[] = [
  {
    id: 1,
    title: 'Tăng cường sức khỏe tim mạch',
    content:
      'Pickleball giúp tăng nhịp tim và cải thiện tuần hoàn máu. Những chuyển động nhanh và linh hoạt khi chơi giúp tim hoạt động hiệu quả hơn, giảm nguy cơ bệnh tim',
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: 2,
    title: 'Phát triển cơ bắp và sức bền',
    content:
      'Pickleball sử dụng nhiều nhóm cơ như tay, chân, vai và lưng. Việc di chuyển liên tục giúp xây dựng cơ bắp, tăng sức bền và giữ cơ thể săn chắc',
    icon: <Dumbbell className="w-6 h-6" />
  },
  {
    id: 3,
    title: 'Hỗ trợ giảm cân',
    content:
      'Với cường độ vận động vừa phải đến cao, một giờ chơi pickleball có thể đốt cháy từ 300–500 calo, giúp kiểm soát cân nặng hiệu quả và duy trì vóc dáng khỏe mạnh.',
    icon: <Weight className="w-6 h-6" />
  },
  {
    id: 4,
    title: 'Tăng cường sức khỏe tinh thần',
    content:
      'Pickleball là một hoạt động xã hội vui vẻ, giúp giảm căng thẳng, lo âu và cải thiện tâm trạng. Các hormone hạnh phúc như endorphin được tiết ra khi chơi sẽ giúp bạn cảm thấy tích cực hơn',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 5,
    title: 'Cải thiện phản xạ và sự phối hợp',
    content:
      'Pickleball yêu cầu phản xạ nhanh giữa mắt và tay. Chơi thường xuyên giúp tăng tốc độ xử lý, sự linh hoạt và khả năng phối hợp toàn thân.',
    icon: <Zap className="w-6 h-6" />
  },
];
