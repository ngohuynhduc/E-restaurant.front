"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const weekdaysMap = {
  CN: 0,
  T2: 1,
  T3: 2,
  T4: 3,
  T5: 4,
  T6: 5,
  T7: 6,
};

function generateTimeSlots(start, end) {
  const slots = [];
  let current = dayjs(`2020-01-01T${start}`);
  const endTime = dayjs(`2020-01-01T${end}`);

  while (current.isBefore(endTime)) {
    slots.push(current.format("HH:mm"));
    current = current.add(30, "minute");
  }

  return slots;
}

function getValidSlots(matched, isToday, now) {
  const validSlots = [];

  const filterSlots = (start, end) => {
    let timeSlots = generateTimeSlots(start, end);
    const latestAllowTime = dayjs(`2020-01-01T${end}`).subtract(1, "hour");

    return timeSlots.filter((t) => {
      const time = dayjs(`2020-01-01T${t}`);
      const validBeforeClosing = time.isSameOrBefore(latestAllowTime);
      if (!validBeforeClosing) return false;

      if (isToday) {
        const slotTime = dayjs(`${now.format("YYYY-MM-DD")}T${t}`);
        return slotTime.isAfter(now.add(15, "minute"));
      }

      return true;
    });
  };

  if (matched.lunch_from && matched.lunch_to) {
    validSlots.push(...filterSlots(matched.lunch_from, matched.lunch_to));
  }

  if (matched.dinner_from && matched.dinner_to) {
    validSlots.push(...filterSlots(matched.dinner_from, matched.dinner_to));
  }

  return validSlots;
}

export const DateTimeSelector = ({ openTimes, setDateTime }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [validDates, setValidDates] = useState([]);
  const [isTodayDisabled, setIsTodayDisabled] = useState(false);

  useEffect(() => {
    setDateTime?.((prev) => ({
      ...prev,
      date: selectedDate,
      time: selectedTime,
    }));
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const today = dayjs();
    const available = [];
    let todayValid = true;

    for (let i = 0; i < 30; i++) {
      const date = today.add(i, "day");
      const dow = date.day();
      const matched = openTimes?.find((ot) => weekdaysMap[ot.day_of_week] === dow);
      if (!matched) continue;

      if (i === 0) {
        const validSlots = getValidSlots(matched, true, today);
        if (validSlots.length === 0) {
          todayValid = false;
          continue;
        }
      }

      available.push(date.toDate());
    }

    setValidDates(available);
    setIsTodayDisabled(!todayValid);
  }, [openTimes]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) return;

    const dow = date.getDay();
    const matched = openTimes?.find((ot) => weekdaysMap[ot.day_of_week] === dow);
    if (!matched) return;

    const isToday = dayjs().isSame(dayjs(date), "day");
    const slots = getValidSlots(matched, isToday, dayjs());

    setAvailableTimes(slots);
    setSelectedTime("");
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row gap-3 w-full">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          includeDates={validDates}
          placeholderText="Chọn ngày"
          dateFormat="dd/MM/yyyy"
          className="p-2 border rounded-md w-full"
        />

        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="p-2 border rounded-md w-full"
          disabled={availableTimes.length === 0}
        >
          <option value="">-- Chọn giờ --</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      {isTodayDisabled && (
        <p className="text-sm text-red-500 italic">
          * Hôm nay không còn khung giờ hợp lệ để đặt bàn.
        </p>
      )}
    </div>
  );
};
