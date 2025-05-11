"use client";

import React from "react";
import { ChevronDown, Search, Bell, Sun, ChevronRight } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export const HeaderAdmin = () => {
  const { user } = useUserStore((state) => state);
  console.log("🚀 ~ HeaderAdmin ~ user:", user);

  return (
    <div className="h-16 sticky z-10 top-0 px-6 bg-white border-b flex items-center justify-between">
      {/* Left side with breadcrumb */}
      <div className="flex items-center space-x-1 text-sm">
        <span className="text-gray-500">Dashboard</span>
        <ChevronRight size={16} className="text-gray-400" />
        <span className="font-medium">Analytics</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="py-1.5 pl-10 pr-4 rounded-lg border border-gray-300 w-64 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme toggle */}
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Sun size={18} className="text-gray-600" />
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
            <span className="text-xs font-medium">AC</span>
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.full_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
