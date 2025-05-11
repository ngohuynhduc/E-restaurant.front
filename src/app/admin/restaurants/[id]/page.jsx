"use client";

import { EditRestaurant } from "@/components/admin/EditRestaurant";
import { Breadcrumbs } from "@/components/layout/BreadCrumbs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantDetailAdmin() {
  const [restaurant, setRestaurant] = useState({});
  console.log("🚀 ~ RestaurantDetailPage ~ restaurant:", restaurant);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${id}?isAdmin=true`, {
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

  if (notFound) {
    throw new Error(404);
  }

  return (
    <section className="bg-gray-100 pb-4">
      <div className="container mx-auto px-4 py-8 ">
        <EditRestaurant restaurant={restaurant} />
      </div>
    </section>
  );
}
