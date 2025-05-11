"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function ReservationManagement() {
  const { user } = useUserStore((state) => state);
  const userId = user?.id;
  console.log("🚀 ~ ReservationManagement ~ user:", user);
  const [date, setDate] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("");
  const [session, setSession] = useState("");
  const [search, setSearch] = useState("");
  console.log("🚀 ~ ReservationManagement ~ reservations:", restaurantList);
  console.log("🚀 ~ ReservationManagement ~ reservations:", reservations);

  useEffect(() => {
    if (!userId) return;
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`/api/admin/restaurants/owner?userId=${userId}`, {
          method: "GET",
        });
        const data = await res.json();
        setRestaurantList(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, [userId]);

  const fetchReservations = async (id) => {
    try {
      const res = await fetch(`/api/admin/reservations/owner/${id}`, {
        method: "GET",
      });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  useEffect(() => {
    if (restaurantList.length > 0) {
      fetchReservations(restaurantList[0].id);
    }
  }, [restaurantList]);

  const handleUpdateStatus = (type, id) => {
    fetch(`/api/admin/reservations/change-status`, {
      method: "PATCH",
      body: JSON.stringify({
        id,
        status: type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 200) {
          alert("Cập nhật trạng thái thành công");
          window.location.reload();
        } else {
          console.error("Error updating status:", data?.message);
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "CONFIRMED":
        return "bg-orange-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tình trạng đặt bàn</h1>
      <Select onValueChange={(value) => fetchReservations(value)}>
        <SelectTrigger>
          <span>{restaurantList.length > 0 ? restaurantList[0].name : "Chọn nhà hàng"}</span>
        </SelectTrigger>
        <SelectContent>
          {restaurantList.map((restaurant) => (
            <SelectItem key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Select onValueChange={setStatus}>
              <SelectTrigger>
                <span>{status || "Trạng thái"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"></PopoverContent>
            </Popover>

            <Select onValueChange={setSession}>
              <SelectTrigger>
                <span>{session || "Buổi"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LUNCH">Trưa</SelectItem>
                <SelectItem value="DINNER">Tối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mt-4 border rounded">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">STT</th>
                  <th className="p-2 border">Tên KH</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">SĐT</th>
                  <th className="p-2 border">Ngày</th>
                  <th className="p-2 border">Giờ</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((r, i) => (
                    <tr key={r.id} className="border-b">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{r.full_name}</td>
                      <td className="p-2 border">{r.email}</td>
                      <td className="p-2 border">{r.phone}</td>
                      <td className="p-2 border">
                        {r.date ? format(r.date, "dd/MM/yyyy") : <span>-</span>}
                      </td>
                      <td className="p-2 border">{r.arrival_time}</td>
                      <td className="p-2 border">
                        <p
                          className={`px-3 py-1 text-center rounded-full text-sm font-bold ${getStatusColor(
                            r.status
                          )}`}
                        >
                          {r.status === "PENDING"
                            ? "Chờ xác nhận"
                            : r.status === "CONFIRMED"
                            ? "Đã xác nhận"
                            : r.status === "CANCELLED"
                            ? "Đã hủy"
                            : "Hoàn tất"}
                        </p>
                      </td>
                      <td className="p-2 border space-x-2">
                        {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus("CANCELLED", r.id)}
                          >
                            Hủy bỏ
                          </Button>
                        )}
                        {r.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUpdateStatus("COMPLETED", r.id)}
                          >
                            Hoàn tất
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
