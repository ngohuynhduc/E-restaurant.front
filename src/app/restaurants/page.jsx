"use client";

import { Breadcrumbs } from "@/components/layout/BreadCrumbs";
import { RestaurantFilterBar } from "@/components/restaurants/RestaurantFilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { RestaurantsList } from "@/components/restaurants/RestaurantsList";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocationStore } from "@/store/useLocationStore";

export default function RestaurantListClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [restaurants, setRestaurants] = useState([]);
  console.log("🚀 ~ RestaurantListClient ~ restaurants:", restaurants);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { location: locationClient } = useLocationStore();
  console.log("🚀 ~ RestaurantListClient ~ location:", locationClient);

  const query = useMemo(() => {
    return searchParams.toString(); // ?search=abc&category=1&day=T2
  }, [searchParams]);

  useEffect(() => {
    fetchRestaurants(query);
  }, [query]);

  const fetchRestaurants = async (query) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/restaurants?${query}`, {
        method: "GET",
      });
      const data = await res.json();
      setRestaurants(data?.data);
      setTotal(data?.pagination?.total ?? 0);
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      if (key === "sort" && value === "nearby") {
        params.set("lat", locationClient?.latitude);
        params.set("lng", locationClient?.longitude);
      }
    });

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <Breadcrumbs />
        <RestaurantFilterBar onFilterChange={handleFilter} />
        <h1 className="text-xl font-bold mb-4">Danh sách nhà hàng</h1>
        {loading ? (
          <FullScreenLoader />
        ) : (
          <>
            <RestaurantsList restaurants={restaurants} total={total} />
            <Pagination
              total={total}
              currentPage={Number(searchParams.get("page")) || 1}
              limit={Number(searchParams.get("limit")) || 10}
            />
          </>
        )}
      </div>
    </div>
  );
}
