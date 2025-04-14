"use client";

import _, { set } from "lodash";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          setNotFound(true);
        }
        const data = await res.json();
        console.log("🚀 ~ fetchRestaurantDetail ~ res:", data);
        // console.log("Restaurant Detail:", data);
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
    <div>
      <h1>Nhà hàng ID: {id}</h1>
    </div>
  );
}
