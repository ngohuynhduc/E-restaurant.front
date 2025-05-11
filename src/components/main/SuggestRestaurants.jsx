"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Giả lập dữ liệu từ API
const restaurantData = [
  {
    id: 14,
    name: "Nesta Kawa Restaurant - Hào Nam",
    address: "O Cho Dua Street, Đống Đa District, Hà Nội, 10178, Vietnam",
    description:
      "Nesta Kawa Restaurant là nhà hàng mang đậm phong cách ẩm thực truyển thống Nhật Bản với sự hòa quyện độc đáo của đa dạng các loại món đặc trưng của Nhật, nổi bật trong đó là các món chuyên hải sản đang bơi và Sashimi, Sushi, Tempura, Yaki, Hotpot.",
    image: {
      public_id: "hjtggxdlnpritsydseqn",
      url: "https://res.cloudinary.com/dua8lsqda/image/upload/v1744385711/hjtggxdlnpritsydseqn.png",
    },
    price_min: 500000,
    price_max: 1000000,
  },
  {
    id: 13,
    name: "King BBQ",
    address: "Vincom Thái Nguyên, Đường Lương Ngọc Quyến, Thái Nguyên, Thai Nguyen 20000, Vietnam",
    description:
      'Chuỗi King BBQ - Vua nướng Hàn Quốc thuộc tập đoàn ẩm thực lớn mạnh RedSun ITI, nổi bật với các món thịt nướng thơm ngon cùng công thức "nước sốt King" độc quyền.',
    image: {
      public_id: "i5frrvpqpfp55rxkk49h",
      url: "https://res.cloudinary.com/dua8lsqda/image/upload/v1743519009/i5frrvpqpfp55rxkk49h.jpg",
    },
    price_min: 200000,
    price_max: 600000,
  },
  {
    id: 12,
    name: "Dookki",
    address:
      "Lầu 3-08-09 tầng 3 tòa S1 TTTM Vincom Plaza Skylake, Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội",
    description:
      "Nhà hàng Dookki Hà Nội với phong cách phục vụ buffet lẩu tteokbokki độc đáo là địa chỉ yêu thích của nhiều bạn trẻ.",
    image: {
      public_id: "tb9ng4scwznw3yripjf6",
      url: "https://res.cloudinary.com/dua8lsqda/image/upload/v1743307765/tb9ng4scwznw3yripjf6.jpg",
    },
    price_min: 129000,
    price_max: 349000,
  },
  {
    id: 11,
    name: "Yakimono",
    address: "Trung Hòa",
    description: "GOOD",
    image: {
      public_id: "hfrntjzxcx556l8kcy5e",
      url: "https://res.cloudinary.com/dua8lsqda/image/upload/v1742992865/hfrntjzxcx556l8kcy5e.jpg",
    },
    price_min: 259000,
    price_max: 329000,
  },
];

// Format giá hiển thị
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function SuggestRestaurants({ title = "Nhà hàng gần bạn" }) {
  const [restaurants, setRestaurants] = useState(restaurantData);

  return (
    <div className="w-full py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center border-b pb-4 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button className="text-sm font-semibold text-[#FF9C00] hover:text-orange-600 flex items-center">
            Xem thêm
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          className="restaurant-swiper"
          style={{
            "--swiper-navigation-color": "#FF9C00",
            "--swiper-pagination-color": "#FF9C00",
          }}
        >
          {restaurants.map((restaurant) => (
            <SwiperSlide key={restaurant.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                {/* Restaurant Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={restaurant.image.url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">{restaurant.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FF9C00] font-medium">
                      {formatPrice(restaurant.price_min)} - {formatPrice(restaurant.price_max)}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .restaurant-swiper {
            padding: 20px 0;
          }
          .swiper-pagination-fraction,
          .swiper-pagination-custom,
          .swiper-horizontal > .swiper-pagination-bullets,
          .swiper-pagination-bullets.swiper-pagination-horizontal {
            bottom: -5px;
          }
          .restaurant-swiper .swiper-button-next,
          .restaurant-swiper .swiper-button-prev {
            background-color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .restaurant-swiper .swiper-button-next:after,
          .restaurant-swiper .swiper-button-prev:after {
            font-size: 18px;
          }

          .restaurant-swiper .swiper-pagination-bullet-active {
            background-color: #ff9c00;
          }
        `}</style>
      </div>
    </div>
  );
}
