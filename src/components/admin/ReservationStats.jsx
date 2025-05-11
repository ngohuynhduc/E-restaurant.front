"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar, Printer } from "lucide-react";

const mockReservations = [
  {
    date: "2025-05-01",
    restaurantName: "ThaiExpress - Aeon Mall Hà Đông",
    timeSlot: "LUNCH",
    time: "11:30",
    customerName: "Nguyễn Văn A",
    customerPhone: "0912345678",
    restaurantHotline: "023456789",
  },
  {
    date: "2025-05-01",
    restaurantName: "Chang - Xuân La",
    timeSlot: "DINNER",
    time: "19:00",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    restaurantHotline: "0333333333",
  },
  {
    date: "2025-05-02",
    restaurantName: "Nhà hàng Gió",
    timeSlot: "DINNER",
    time: "18:30",
    customerName: "Lê Văn C",
    customerPhone: "0933333333",
    restaurantHotline: "023456789",
  },
];

export default function ReservationStats() {
  const [selectedDate, setSelectedDate] = useState("2025-05-01");
  const [search, setSearch] = useState("");

  const filtered = mockReservations.filter((r) => {
    const matchDate = selectedDate
      ? format(new Date(r.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;
    const matchSearch = r.restaurantName.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <Calendar />
        </div>
        <Input
          className="max-w-sm"
          placeholder="Tìm kiếm nhà hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Printer className="cursor-pointer" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày</TableHead>
            <TableHead>Nhà hàng</TableHead>
            <TableHead>Buổi</TableHead>
            <TableHead>Giờ</TableHead>
            <TableHead>Tên khách</TableHead>
            <TableHead>SĐT Khách</TableHead>
            <TableHead>Hotline Nhà hàng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((res, index) => (
            <TableRow key={index}>
              <TableCell>{res.date}</TableCell>
              <TableCell>{res.restaurantName}</TableCell>
              <TableCell>{res.timeSlot === "LUNCH" ? "Trưa" : "Tối"}</TableCell>
              <TableCell>{res.time}</TableCell>
              <TableCell>{res.customerName}</TableCell>
              <TableCell>{res.customerPhone}</TableCell>
              <TableCell>{res.restaurantHotline}</TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Không có dữ liệu phù hợp
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
