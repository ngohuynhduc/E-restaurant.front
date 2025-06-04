"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import { useCategoriesStore } from "@/store/useRestaurantStore";
import { useDialogStore } from "@/store/useDialogStore";
import _ from "lodash";
import { useUserStore } from "@/store/useUserStore";

export default function CategoryManager() {
  const categories = useCategoriesStore((state) => state.categories);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editData, setEditData] = useState(null);
  const { showDialog } = useDialogStore();
  const { user } = useUserStore((state) => state);
  const isAdmin = user?.role === "ADMIN";

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: newCategory }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    } else {
      showDialog({
        message: "Thêm danh mục thành công",
        type: "success",
        onOk: () => window.location.reload(),
      });
    }
    setNewCategory("");
    setOpen(false);
  };

  const handleDelete = (id) => {
    showDialog({
      message: "Bạn có chắc chắn muốn xóa danh mục này không?",
      type: "confirm",
      onOk: async () => {
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message);
          return;
        } else {
          showDialog({
            message: "Xóa danh mục thành công",
            type: "success",
            onOk: () => window.location.reload(),
          });
        }
      },
    });
  };

  const handleEdit = (id) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setNewCategory(category.name);
      setEditData({
        id: category.id,
        name: category.name,
      });
      setOpen(true);
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.trim() || _.isEmpty(editData)) return;
    const category = categories.find((cat) => cat.id === editData?.id);
    console.log("🚀 ~ handleEditCategory ~ category:", category);
    const res = await fetch(`/api/admin/categories/${category?.id}`, {
      method: "PUT",
      body: JSON.stringify({ name: newCategory }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    } else {
      showDialog({
        message: "Chỉnh sửa danh mục thành công",
        type: "success",
        onOk: () => window.location.reload(),
      });
    }
    setNewCategory("");
    setOpen(false);
    setEditData(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Bạn không có quyền truy cập vào trang này</h1>
      </div>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Quản lý danh mục</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Thêm danh mục</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editData ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Tên danh mục"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={editData ? handleEditCategory : handleAddCategory}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((cat, index) => (
            <TableRow key={cat.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(cat.id)}
                    className="text-blue-500"
                  >
                    Chỉnh sửa
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>
                    Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
