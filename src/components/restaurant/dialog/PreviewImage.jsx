"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const PreviewImage = ({
  images = [],
  isOpen,
  startIndex,
  setIsOpen,
  title = "Bộ sưu tập",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl w-full p-0 bg-white">
        <DialogHeader className="px-4 pt-4 flex flex-row justify-between">
          <DialogTitle className="text-lg text-black">{title}</DialogTitle>
          <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <XIcon />
          </span>
        </DialogHeader>
        <Swiper
          initialSlide={startIndex}
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-[80vh]"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img.url}
                alt={`preview-${idx}`}
                className="w-full h-full object-contain bg-black rounded-ee-lg rounded-es-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </DialogContent>
    </Dialog>
  );
};
