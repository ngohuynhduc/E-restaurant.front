import { Star, StarHalf } from "lucide-react";

export const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalStars }, (_, i) => {
        if (i < fullStars)
          return <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />;
        if (i === fullStars && halfStar)
          return <StarHalf key={i} size={20} className="text-yellow-400 fill-yellow-400" />;
        return <Star key={i} size={20} className="text-gray-300" />;
      })}
    </div>
  );
};
