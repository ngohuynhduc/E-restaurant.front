"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const reservationData = [
  { month: "Jan", reservations: 20 },
  { month: "Feb", reservations: 35 },
  { month: "Mar", reservations: 25 },
  { month: "Apr", reservations: 40 },
  { month: "May", reservations: 30 },
];

const statusData = [
  { label: "Chờ xác nhận", name: "Chờ xác nhận", value: 12 },
  { label: "Đã xác nhận", name: "Đã xác nhận", value: 22 },
  { label: "Hủy", name: "Hủy", value: 6 },
];

const COLORS = ["#8884d8", "#82ca9d", "#FF6961"];

export default function AdminDashboard() {
  const { user } = useUserStore((state) => state);
  console.log("🚀 ~ Sidebar ~ user:", user);
  const isAdmin = user?.role === "ADMIN";
  const isMerchant = user?.role === "BUSINESS_OWNER";
  const isUser = user?.role === "USER";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Bạn không có quyền truy cập vào trang này</h1>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Thống kê đặt bàn theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reservations" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Tình trạng đặt bàn</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
