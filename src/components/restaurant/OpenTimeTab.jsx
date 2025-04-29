"use client";

import { WEEK_DAYS } from "@/app/shared/restaurants";
import { cn, getTodayKey } from "@/lib/utils";

export const OpenTimeTab = ({ openTimes }) => {
  const todayKey = getTodayKey();

  return (
    <div className="space-y-2 p-4">
      <h1 className="text-xl font-semibold">Giờ hoạt động</h1>

      {openTimes.map((item) => {
        const isToday = item.day_of_week === todayKey;

        return (
          <div
            key={item.id}
            className={cn(
              "flex justify-between items-center p-2 rounded-md mt-2",
              isToday && "bg-yellow-100 text-yellow-800 font-semibold"
            )}
          >
            <span>{WEEK_DAYS[item.day_of_week] || item.day_of_week}</span>
            <span className="text-md text-gray-700">
              {item.lunch_from && item.lunch_to && (
                <span>
                  Trưa: {item.lunch_from.slice(0, 5)} - {item.lunch_to.slice(0, 5)}
                </span>
              )}
              {item.lunch_from && item.dinner_from && <span> | </span>}
              {item.dinner_from && item.dinner_to && (
                <span>
                  Tối: {item.dinner_from.slice(0, 5)} - {item.dinner_to.slice(0, 5)}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};
