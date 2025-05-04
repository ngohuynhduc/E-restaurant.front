"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PreviewImage } from "./dialog/PreviewImage";
import { MenuTab } from "./MenuTab";
import { OpenTimeTab } from "./OpenTimeTab";
import { Loader2 } from "lucide-react";

export const DetailTabs = ({ restaurant }) => {
  const [loadingMap, setLoadingMap] = useState(true);

  const lat = useMemo(() => {
    return restaurant?.lat || "";
  }, [restaurant]);

  const lng = useMemo(() => {
    return restaurant?.lng || "";
  }, [restaurant]);

  return (
    <Tabs defaultValue="overview" className="w-full mt-6">
      <TabsList className="sticky top-[80px] grid w-full grid-cols-5 [&>*]:cursor-pointer [&>*]:font-semibold bg-gray-200">
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="menu">Thực đơn</TabsTrigger>
        <TabsTrigger value="open-time">Giờ hoạt động</TabsTrigger>
        <TabsTrigger value="maps">Chỉ đường</TabsTrigger>
        <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="p-4 whitespace-pre-line">{restaurant?.description}</div>
      </TabsContent>

      <TabsContent value="menu">
        <MenuTab menu={restaurant?.menu_image} />
      </TabsContent>

      <TabsContent value="open-time">
        <OpenTimeTab openTimes={restaurant?.openTimes} />
      </TabsContent>

      <TabsContent value="maps">
        <div className="p-4">
          {loadingMap && (
            <div className="inset-0 bg-black opacity-[0.3] h-[600px] flex justify-center items-center">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          )}
          {restaurant?.coordinate ? (
            <iframe
              width="100%"
              height="600"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${lng},${lat}&z=15&output=embed`}
              onLoad={() => setLoadingMap(false)}
            />
          ) : (
            <h2 className="text-2xl text-center mt-4">Đang tải bản đồ...</h2>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        <div className="p-4">⭐ Đây là phần đánh giá từ khách hàng.</div>
      </TabsContent>
    </Tabs>
  );
};
