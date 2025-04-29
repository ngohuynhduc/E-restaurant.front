"use client";

import { useMemo, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import _ from "lodash";
import { Skeleton } from "../ui/skeleton";
import { BookingComponent } from "./BookingComponent";
import { PreviewImage } from "./dialog/PreviewImage";
import { DetailTabs } from "./DetailTabs";
import { CircleDollarSign, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export const RestaurantDetail = ({ restaurant }) => {
  const swiperRef = useRef(null);
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const imageList = useMemo(() => {
    return [...(restaurant?.restaurant_image || []), ...(restaurant?.menu_image || [])];
  }, [restaurant]);

  const handlePreview = (index) => {
    setStartIndex(index);
    setIsPreviewImage(true);
  };

  const handleCategory = (categoryId) => {
    router.push(`/restaurants?categoryId=${categoryId}`);
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="relative bg-white shadow-md rounded-lg p-6 w-[70%]">
        <h1 className="text-2xl font-bold mb-4 border-b text-[#860001] border-gray-200 pb-2">
          {restaurant?.name}
        </h1>
        <div className="flex flex-row justify-start">
          {!_.isEmpty(restaurant?.restaurant_image) ? (
            <Swiper
              speed={600}
              autoplay={{ delay: 7000 }}
              ref={swiperRef}
              modules={[Autoplay, Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={0}
              pagination={{ clickable: true }}
              className="w-[73%] h-[500px]"
              loop={true}
              navigation={true}
              observer={true}
              observeParents={true}
              onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {restaurant?.restaurant_image?.map((item, index) => (
                <SwiperSlide key={item?.public_id} className="relative w-full h-full">
                  {({ isActive }) => (
                    <div className="w-full bg-cover bg-center bg-no-repeat h-full cursor-pointer">
                      <img
                        src={item?.url}
                        className="h-full w-full object-cover rounded-lg"
                        alt="image"
                        onClick={() => handlePreview(index)}
                      />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Skeleton className="w-[73%] h-[500px]" />
          )}
          <div className="w-[25%] max-w-[25%] p-4 bg-white shadow-md rounded-lg h-[500px] overflow-y-auto">
            <div className="flex flex-row flex-wrap gap-2 max-w-ful justify-center">
              {restaurant?.restaurant_image?.map((item, index) => (
                <img
                  key={item?.public_id}
                  src={item?.url}
                  className={`xl:w-[100px] xl:h-[100px] w-[80px] h-[80px] object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${
                    activeSlide === index ? "border-4 border-[#FF9C00]" : ""
                  }`}
                  onClick={() => {
                    swiperRef.current.slideTo(index, 600, false);
                    setActiveSlide(index);
                  }}
                  alt="image"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="text-[16px] flex text-[#860001] flex-row items-center gap-[5px]">
            {restaurant?.categories?.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-slate-100 rounded-md px-2 py-1 cursor-pointer"
                onClick={() => handleCategory(item?.id)}
              >
                <span>{item?.name}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-green-600 flex flex-row gap-[5px] items-center">
            <CircleDollarSign size={20} /> {restaurant?.price_min?.toLocaleString()}đ ~{" "}
            {restaurant?.price_max?.toLocaleString()}đ
          </p>
          <p className="text-[16px] flex text-[#FF9C00] flex-row items-center gap-[5px]">
            <MapPin size={20} />
            <span className="text-gray-500">{restaurant?.address}</span>
          </p>
        </div>
        <DetailTabs restaurant={restaurant} />
      </div>
      <BookingComponent restaurant={restaurant} />
      <PreviewImage
        images={restaurant?.restaurant_image}
        isOpen={isPreviewImage}
        startIndex={startIndex}
        setIsOpen={setIsPreviewImage}
      />
    </div>
  );
};
