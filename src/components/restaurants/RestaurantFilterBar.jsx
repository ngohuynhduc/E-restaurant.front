"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonInteract } from "../ui/interactButton";
import { useCategoriesStore } from "@/store/useRestaurantStore";
import { DAYS, SORT_OPTIONS } from "@/app/shared/const";
import { Button } from "../ui/button";

const DEFAULT_FILTERS = {
  categoryId: "",
  priceMin: "",
  priceMax: "",
  dayOfWeek: "",
  sort: "",
};

export const RestaurantFilterBar = ({ onFilterChange }) => {
  const categories = useCategoriesStore((state) => state.categories);
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const checkSticky = () => {
      const currentPosition = window.getComputedStyle(element).position;
      const rect = element.getBoundingClientRect();
      const isElementSticky =
        (currentPosition === "sticky" || currentPosition === "-webkit-sticky") && rect.top === 80;
      console.log("🚀 ~ checkSticky ~ isElementSticky:", rect.top);

      setIsSticky(isElementSticky);
    };

    window.addEventListener("scroll", checkSticky);

    checkSticky();

    return () => {
      window.removeEventListener("scroll", checkSticky);
    };
  }, []);

  const handleSubmitFilter = () => {
    console.log("🚀 ~ handleSubmitFilter ~ filters:", filters);
    onFilterChange && onFilterChange(filters);
  };

  return (
    <div ref={ref} className="sticky top-[80px] z-10">
      <Card
        className={`mb-4 shadow-md ${
          !isSticky ? "py-6" : "py-1"
        } bg-white transition-all duration-200`}
      >
        <CardContent
          className={`flex flex-wrap gap-4 items-center ${
            !isSticky ? "p-4" : ""
          } transition-all duration-200`}
        >
          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleChange("categoryId", value)}
          >
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Giá từ"
            className="w-[100px] cursor-pointer"
            value={filters.priceMin}
            onChange={(e) => handleChange("priceMin", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Đến"
            className="w-[100px] cursor-pointer"
            value={filters.priceMax}
            onChange={(e) => handleChange("priceMax", e.target.value)}
          />

          <Select
            value={filters.dayOfWeek}
            onValueChange={(value) => handleChange("dayOfWeek", value)}
          >
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Ngày mở cửa" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sort} onValueChange={(value) => handleChange("sort", value)}>
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="ml-auto px-[16px] py-[8px] bg-white text-black"
          >
            Làm mới
          </Button>

          <ButtonInteract onClick={handleSubmitFilter} className="px-[16px] py-[8px]">
            Tìm kiếm
          </ButtonInteract>
        </CardContent>
      </Card>
    </div>
  );
};
