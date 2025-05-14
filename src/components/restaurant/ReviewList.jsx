"use client";

import React from "react";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function ReviewList({ reviews }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    const ratingNumber = parseInt(rating, 10);
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= ratingNumber ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Đánh giá ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có đánh giá nào</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
                    {review.user_name.charAt(0)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{review.user_name}</h3>
                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                  </div>

                  <div className="mb-2">{renderStars(review.rating)}</div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.image && (
                    <div className="mt-2">
                      <img
                        src={review.image}
                        alt={`Hình ảnh đánh giá từ ${review.user_name}`}
                        className="h-24 w-auto rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(review.image, "_blank")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
