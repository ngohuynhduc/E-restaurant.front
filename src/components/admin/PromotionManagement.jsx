"use client";

import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default function PromotionManagement() {
  const { user } = useUserStore((state) => state);
  const userId = user?.id;
  const [open, setOpen] = useState(false);
  const [restaurantList, setRestaurantList] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [session, setSession] = useState("");
  const [dataPromotion, setDataPromotion] = useState({
    title: "",
    description: "",
    discount: 0,
    start_date: "",
    end_date: "",
  });
  const [restaurantId, setRestaurantId] = useState("");
  console.log("🚀 ~ PromotionManagement ~ restaurantId:", restaurantId);

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

  const fetchPromotions = async (id) => {
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "GET",
      });
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  useEffect(() => {
    if (restaurantList.length > 0) {
      fetchPromotions(restaurantList[0].id);
      setRestaurantId(restaurantList[0].id);
    }
  }, [restaurantList]);

  const handleDeletePromotion = (id) => {
    fetch(`/api/admin/promotions/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 200) {
          alert("Thành công");
          fetchPromotions(restaurantId);
        } else {
          console.error("Error updating status:", data?.message);
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const handleSubmit = () => {
    if (
      !dataPromotion.title ||
      !dataPromotion.description ||
      !dataPromotion.discount ||
      !dataPromotion.start_date ||
      !dataPromotion.end_date
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!restaurantId) {
      alert("Vui lòng chọn nhà hàng");
      return;
    }
    console.log("🚀 ~ handleSubmit ~ dataPromotion:", dataPromotion);

    fetch("/api/admin/promotions", {
      method: "POST",
      body: JSON.stringify({
        ...dataPromotion,
        start_date: format(dataPromotion?.start_date, "yyyy-MM-dd"),
        end_date: format(dataPromotion?.end_date, "yyyy-MM-dd"),
        restaurant_id: restaurantId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 200) {
          alert("Thêm khuyến mãi thành công");
          setOpen(false);
          setDataPromotion({
            title: "",
            description: "",
            discount: 0,
            start_date: "",
            end_date: "",
          });
          fetchPromotions(restaurantId);
        } else {
          console.error("Error adding promotion:", data?.message);
        }
      })
      .catch((err) => console.error("Error adding promotion:", err));
  };

  const selectEndDate = (date) => {
    if (date && dataPromotion.start_date) {
      const startDate = new Date(dataPromotion.start_date);
      if (date < startDate) {
        alert("Ngày kết thúc không thể trước ngày bắt đầu");
        return;
      }
    }
    setDataPromotion({ ...dataPromotion, end_date: date });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tình trạng đặt bàn</h1>
      <Select
        onValueChange={(value) => {
          fetchPromotions(value);
          setRestaurantId(value);
        }}
      >
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
          <div className="overflow-x-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Thêm khuyến mãi</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khuyến mãi</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tiêu đề:</label>
                  <Input
                    placeholder="Tiêu đề"
                    value={dataPromotion.title}
                    onChange={(e) => setDataPromotion({ ...dataPromotion, title: e.target.value })}
                  />
                  <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                  <Input
                    placeholder="Mô tả"
                    value={dataPromotion.description}
                    onChange={(e) =>
                      setDataPromotion({ ...dataPromotion, description: e.target.value })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">Giảm giá (%):</label>
                  <Input
                    placeholder="Giảm giá"
                    value={dataPromotion.discount < 0 ? 0 : dataPromotion.discount}
                    type="number"
                    onChange={(e) =>
                      setDataPromotion({
                        ...dataPromotion,
                        discount: Number(e.target.value) < 0 ? 0 : Number(e.target.value),
                      })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu:</label>
                  <DatePicker
                    selected={dataPromotion.start_date ? new Date(dataPromotion.start_date) : null}
                    onChange={(date) => setDataPromotion({ ...dataPromotion, start_date: date })}
                    placeholderText="Chọn ngày"
                    dateFormat="dd/MM/yyyy"
                    className="p-2 border rounded-md w-full"
                  />
                  <label className="block text-sm font-medium text-gray-700">Ngày kết thúc:</label>
                  <DatePicker
                    selected={dataPromotion.end_date ? new Date(dataPromotion.end_date) : null}
                    onChange={(date) => selectEndDate(date)}
                    placeholderText="Chọn ngày"
                    dateFormat="dd/MM/yyyy"
                    className="p-2 border rounded-md w-full"
                  />
                  <div className="h-4"></div>
                  <Button onClick={handleSubmit}>Lưu</Button>
                </div>
              </DialogContent>
            </Dialog>
            <table className="w-full mt-4 border rounded">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">STT</th>
                  <th className="p-2 border">Tiêu đề</th>
                  <th className="p-2 border">Mô tả</th>
                  <th className="p-2 border">Giảm giá (%)</th>
                  <th className="p-2 border">Ngày bắt đầu</th>
                  <th className="p-2 border">Ngày kết thúc</th>
                  <th className="p-2 border">Ngày tạo</th>
                  <th className="p-2 border">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length > 0 ? (
                  promotions.map((r, i) => (
                    <tr key={r.id} className="border-b">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{r.title}</td>
                      <td className="p-2 border">{r.description}</td>
                      <td className="p-2 border">{r.discount}</td>
                      <td className="p-2 border">
                        {r.start_date ? format(r.start_date, "dd/MM/yyyy") : <span>-</span>}
                      </td>
                      <td className="p-2 border">
                        {r.end_date ? format(r.end_date, "dd/MM/yyyy") : <span>-</span>}
                      </td>
                      <td className="p-2 border">
                        {r.created_at ? format(r.created_at, "dd/MM/yyyy") : <span>-</span>}
                      </td>
                      <td className="p-2 border space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePromotion(r.id)}
                        >
                          Xóa
                        </Button>
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
