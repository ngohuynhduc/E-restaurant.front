"use client";

import React, { useEffect, useState } from "react";
import { Clock, Users, Calendar, Phone, MapPin, FileText } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

// Utility functions for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} - ${formatDate(dateString)}`;
};

// Item Component
const ReservationItem = ({ reservation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date
  const formattedDate = formatDate(reservation.date);

  // Status badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{reservation.restaurant_name}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{formattedDate}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{reservation.arrival_time.substring(0, 5)}</span>
            <span className="mx-2">•</span>
            <span>{reservation.time_slot}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              reservation.status
            )}`}
          >
            {reservation.status}
          </span>
          <div className="ml-4">
            {isExpanded ? (
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span className="text-gray-700">{reservation.restaurant_address}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{reservation.guest_count} người</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{reservation.phone}</span>
            </div>
            {reservation.note && (
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <span className="text-gray-700">{reservation.note}</span>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            • Đặt lúc: {formatDateTime(reservation.created_at)}
          </div>
        </div>
      )}
    </div>
  );
};

// List Component
const ReservationList = ({ reservations, total }) => {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Không có lịch sử đặt bàn nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Lịch sử đặt bàn ({total})</h2>
      {reservations.map((reservation) => (
        <ReservationItem key={reservation.reservation_id} reservation={reservation} />
      ))}
    </div>
  );
};

// Example usage
const ReservationHistoryPage = () => {
  const [reservations, setReservations] = useState([]);
  console.log("🚀 ~ ReservationHistoryPage ~ reservations:", reservations);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/reservations-history");
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        setReservations(data?.reservations);
        setTotal(data?.pagination?.total);
        console.log("Fetched reservations:", data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ReservationList reservations={reservations} total={total} />
      <Pagination limit={10} total={total ?? 0} />
    </div>
  );
};

export default ReservationHistoryPage;
