"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RestaurantsManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [restaurants, setRestaurants] = useState([]);
  console.log("🚀 ~ RestaurantsManagement ~ restaurants:", restaurants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [total, setTotal] = useState(0);

  const query = useMemo(() => {
    return searchParams.toString(); // ?search=abc&category=1&day=T2
  }, [searchParams]);

  useEffect(() => {
    fetchRestaurants(query);
  }, [query]);

  const fetchRestaurants = async (query) => {
    try {
      const res = await fetch(`/api/admin/restaurants?${query}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log("🚀 ~ fetchRestaurants ~ data:", data);
      setRestaurants(data?.data);
      setTotal(data?.pagination?.total ?? 0);
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    const filters = {
      status: statusFilter,
      q: search,
    };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEditRestaurant = (id) => {
    router.push(`/admin/restaurants/${id}`);
  };

  const handleChangeStatus = (type, id) => {
    fetch(`/api/admin/restaurants/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: type }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 200) {
          fetchRestaurants(query);
        } else {
          alert(data.message);
        }
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "SUSPENDED":
        return "bg-orange-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Quản lý nhà hàng</h2>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên nhà hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Button size="sm" variant="success" onClick={handleFilter}>
          Lọc
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên nhà hàng</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Hotline</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants?.length ? (
            restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <Link href={`/admin/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
                </TableCell>
                <TableCell>{restaurant.address}</TableCell>
                <TableCell>{restaurant.hotline}</TableCell>
                <TableCell>
                  <p
                    className={`px-3 py-1 text-center rounded-full text-sm font-bold ${getStatusColor(
                      restaurant.status
                    )}`}
                  >
                    {restaurant.status === "PENDING"
                      ? "Chờ duyệt"
                      : restaurant.status === "APPROVED"
                      ? "Đã duyệt"
                      : restaurant.status === "SUSPENDED"
                      ? "Tạm ngưng"
                      : "Từ chối"}
                  </p>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {restaurant.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleChangeStatus("APPROVED", restaurant.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleChangeStatus("REJECTED", restaurant.id)}
                      >
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditRestaurant(restaurant.id)}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Không có dữ liệu phù hợp
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
