"use client";

import React, { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryMultiDropdown({
  categories,
  setRestaurantData,
  selectedCategories,
  setSelectedCategories,
}) {
  console.log("🚀 ~ CategoryMultiDropdown ~ categories:", categories);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRestaurantData((prev) => ({
      ...prev,
      categories: selectedCategories,
    }));
  }, [selectedCategories]);

  const handleSelectCategory = (currentValue) => {
    setSelectedCategories((prev) => {
      if (prev.includes(currentValue)) {
        return prev.filter((item) => item !== currentValue);
      } else {
        return [...prev, currentValue];
      }
    });
  };

  const handleRemoveCategory = (e, categoryValue) => {
    e.stopPropagation();
    setSelectedCategories((prev) => prev.filter((item) => item !== categoryValue));
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
            <div className="flex flex-wrap items-center gap-1 p-2 min-h-10">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((categoryValue) => (
                  <div
                    key={categoryValue}
                    className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                  >
                    <span>
                      {categories?.find((category) => category.id === categoryValue)?.name}
                    </span>
                    <span
                      role="button"
                      className="h-5 w-5 p-0 ml-1 hover:bg-slate-200 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={(e) => handleRemoveCategory(e, categoryValue)}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500">Chọn danh mục nhà hàng...</span>
              )}
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Tìm kiếm danh mục..." />
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={() => handleSelectCategory(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
