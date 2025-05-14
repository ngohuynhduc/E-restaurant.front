"use client";

import { Breadcrumbs } from "@/components/layout/BreadCrumbs";
import { RestaurantDetail } from "@/components/restaurant/RestaurantDetail";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useUserStore } from "@/store/useUserStore";
import _, { set } from "lodash";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  console.log("🚀 ~ RestaurantDetailPage ~ canReview:", canReview);
  const params = useParams();
  const id = params?.id;
  const { user } = useUserStore((state) => state);
  const isUser = user?.role === "USER";
  console.log("🚀 ~ RestaurantDetailPage ~ user:", user);

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!data?.id) {
          setNotFound(true);
          return;
        }
        setRestaurant(data);
      } catch (error) {
        setLoading(false);
        setNotFound(true);
        console.error("Error fetching restaurant detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetail();
  }, []);

  useEffect(() => {
    if (!isUser) return;
    const fetchCanReview = async () => {
      try {
        const res = await fetch(`/api/reviews/can-review?restaurantId=${id}`, {
          method: "GET",
        });
        const data = await res.json();
        console.log("🚀 ~ fetchCanReview ~ data:", data);
        if (data?.canReview) {
          setCanReview(true);
        }
      } catch (error) {
        console.error("Error fetching can review:", error);
      }
    };

    fetchCanReview();
  }, [isUser]);

  if (notFound) {
    throw new Error(404);
  }

  return (
    <section className="bg-gray-100 min-h-screen pb-4">
      <div className="container mx-auto px-4 py-8 ">
        <Breadcrumbs
          labelMap={{
            restaurants: "Nhà hàng",
            [id]: restaurant?.name,
          }}
        />
        {loading ? (
          <FullScreenLoader />
        ) : (
          <RestaurantDetail restaurant={restaurant} canReview={canReview} />
        )}
      </div>
    </section>
  );
}
