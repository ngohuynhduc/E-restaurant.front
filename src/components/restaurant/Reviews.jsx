"use client";

import { useEffect, useState } from "react";
import ReviewDialog from "./dialog/ReviewDialog";
import ReviewList from "./ReviewList";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export const Reviews = ({ canReview }) => {
  const [listReviews, setListReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params?.id;

  const fetchReviewsList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews/restaurant-reviews?restaurantId=${id}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log("🚀 ~ fetchReviewsList ~ data:", data);
      if (data?.length > 0) {
        setListReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsList();
  }, []);

  return (
    <div className="space-y-2 p-4">
      {loading && <Loader2 className="animate-spin mx-auto text-gray-500" size={64} />}
      {listReviews.length > 0 ? (
        <ReviewList reviews={listReviews} handleComplete={fetchReviewsList} />
      ) : (
        <p className="text-gray-500">Chưa có đánh giá nào</p>
      )}
      {canReview && <ReviewDialog onComplete={fetchReviewsList} />}
    </div>
  );
};
