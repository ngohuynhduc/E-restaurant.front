"use client";

import { MyAccount } from "@/components/profile/account/MyAccount";
import { MenuProfileAside } from "@/components/profile/MenuProfileAside";
import { useUserStore } from "@/store/useUserStore";

const ProfilePage = () => {
  const { user } = useUserStore((state) => state);

  return (
    <div className="flex flex-row w-full">
      <MenuProfileAside />
      <div className="w-[80%]">{user && <MyAccount userInfo={user} />}</div>
    </div>
  );
};

export default ProfilePage;
