import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from './Card';

export const StarRating = ({ rating, onChange, interactive = false, className }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={cn("flex space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-5 h-5 transition-colors duration-150",
            star <= (hovered || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 dark:text-gray-600",
            interactive && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
    </div>
  );
};
