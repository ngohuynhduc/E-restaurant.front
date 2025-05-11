"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useUserStore } from "@/store/useUserStore";

const mockUsers = [
  {
    id: 1,
    full_name: "Nguyen Van A",
    email: "a@gmail.com",
    phone: "0909123456",
    role: "USER",
  },
  {
    id: 2,
    full_name: "Tran Thi B",
    email: "b@gmail.com",
    phone: "0909222333",
    role: "BUSINESS_OWNER",
  },
  {
    id: 3,
    full_name: "Le Van C",
    email: "c@gmail.com",
    phone: "0909555444",
    role: "ADMIN",
  },
];

const roleMap = {
  USER: "Khách hàng",
  BUSINESS_OWNER: "Chủ nhà hàng",
  ADMIN: "Quản trị viên",
};

export default function UserManagement() {
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
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý người dùng</h2>

      <div className="flex gap-4 mb-4">
        <Input placeholder="Tìm kiếm theo tên hoặc email..." className="w-1/3" />
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="USER">Khách hàng</SelectItem>
            <SelectItem value="BUSINESS_OWNER">Chủ nhà hàng</SelectItem>
            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="overflow-x-auto">
        <Table className="min-w-full border text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border p-2 text-left">STT</TableHead>
              <TableHead className="border p-2 text-left">Email</TableHead>
              <TableHead className="border p-2 text-left">Tên</TableHead>
              <TableHead className="border p-2 text-left">Số điện TableHeadoại</TableHead>
              <TableHead className="border p-2 text-left">Vai trò</TableHead>
              <TableHead className="border p-2 text-left">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user, index) => (
              <TableRow key={user.id} className="border-t">
                <TableCell className="border p-2">{index + 1}</TableCell>
                <TableCell className="border p-2">{user.email}</TableCell>
                <TableCell className="border p-2">{user.full_name}</TableCell>
                <TableCell className="border p-2">{user.phone}</TableCell>
                <TableCell className="border p-2">{roleMap[user.role]}</TableCell>
                <TableCell className="border p-2 space-x-2">
                  <Button variant="destructive" size="sm">
                    Xóa
                  </Button>
                  {user.role === "BUSINESS_OWNER" && (
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
