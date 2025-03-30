"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export const TopBanner = () => {
  const swiperRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchNewestRestaurants = async () => {
      const response = await fetch("/api/restaurants/newest");
      const data = await response.json();
      setRestaurants(data?.data);
      console.log("🚀 ~ useEffect ~ response:", data);
    };
    fetchNewestRestaurants();
  }, []);

  return (
    <div className="relative w-full h-[calc(100dvh-80px)]">
      <Swiper
        autoplay={{ delay: 5000 }}
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        className="w-full h-full"
        loop={true}
        navigation={true}
      >
        {restaurants.map((item, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {({ isActive }) => (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${item?.image?.url})`,
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))] flex flex-col justify-center items-center p-[100px]">
                  <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 50,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    }}
                    className="revolution text-white text-[72px] mb-4"
                  >
                    {item?.name}
                  </motion.h2>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 30,
                        transition: {
                          duration: 0.8,
                          delay: 0.3,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="text-white text-lg"
                  >
                    {item?.description}
                  </motion.p>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: {
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -30,
                        transition: {
                          duration: 0.8,
                          delay: 0.3,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="text-white text-[16px] flex flex-row items-center text-lg my-[50px]"
                  >
                    <span>
                      <MapPin size={24} />
                    </span>
                    <span className="ml-2">{item?.address}</span>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : 30,
                      transition: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      },
                    }}
                    whileTap={{ scale: 0.85 }}
                    className="px-4 py-2 text-sm text-[16px] bg-[#FF9C00] rounded-md border-[2px]hover:bg-[#860001] text-white cursor-pointer"
                    onMouseEnter={() => swiperRef.current?.swiper.autoplay.stop()}
                    onMouseLeave={() => swiperRef.current?.swiper.autoplay.start()}
                  >
                    Order Now
                  </motion.button>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
