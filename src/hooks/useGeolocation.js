import { useEffect, useState } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        ...location,
        error: "Trình duyệt của bạn không hỗ trợ định vị địa lý",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          error: error.message,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true, // Tăng độ chính xác nếu thiết bị hỗ trợ
        timeout: 5000, // Thời gian tối đa chờ phản hồi (5 giây)
        maximumAge: 0, // Không sử dụng dữ liệu cache
      }
    );
  }, []);

  return location;
}
