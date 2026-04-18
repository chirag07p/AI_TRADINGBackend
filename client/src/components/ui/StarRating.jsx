import React from 'react';
import { Star } from 'lucide-react';
import { cn } from './Card';

export const StarRating = ({ rating, className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
};
