"use client";

import ReservationHistoryPage from "@/components/profile/history/ReservationHistoryPage";
import { MenuProfileAside } from "@/components/profile/MenuProfileAside";

const ProfilePage = () => {
  return (
    <div className="flex flex-row w-full">
      <MenuProfileAside />
      <div className="w-[80%]">
        <ReservationHistoryPage />
      </div>
    </div>
  );
};

export default ProfilePage;
