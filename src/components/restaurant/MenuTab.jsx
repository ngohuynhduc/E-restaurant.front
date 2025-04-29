"use client";

import { useState } from "react";
import { PreviewImage } from "./dialog/PreviewImage";

export const MenuTab = ({ menu }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (index) => {
    setStartIndex(index);
    setIsOpen(true);
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Thực đơn</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 w-full">
        {menu?.map((item, index) => (
          <img
            key={index}
            src={item?.url}
            alt={index}
            className="rounded-2xl w-full h-[500px] object-cover cursor-pointer"
            onClick={() => handleOpen(index)}
          />
        ))}
      </div>
      <PreviewImage
        images={menu}
        isOpen={isOpen}
        startIndex={startIndex}
        setIsOpen={setIsOpen}
        title="Thực đơn"
      />
    </div>
  );
};
