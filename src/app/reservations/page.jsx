"use client";

import { ReservationForm } from "@/components/reservations/ReservationForm";
import { ButtonInteract } from "@/components/ui/interactButton";
import { useReservationsStore } from "@/store/useRestaurantStore";
import { useUserStore } from "@/store/useUserStore";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const userData = useUserStore((state) => state.user);
  const { reservationsData, clearReservationsData } = useReservationsStore();
  console.log("🚀 ~ ReservationsPage ~ reservationsData:", reservationsData, userData);
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearReservationsData();
    };
  }, []);

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  return !_.isEmpty(reservationsData) ? (
    <ReservationForm reservationData={reservationsData} userData={userData} />
  ) : (
    <div className="text-center mt-4 p-4 min-h-[70vh] flex flex-col items-center justify-center">
      <h2 className="text-xl">Bạn chưa đặt bàn, vui lòng đặt bàn trước.</h2>
      <ButtonInteract className="mt-2" onClick={() => router.push("/restaurants")}>
        Đặt bàn ngay!
      </ButtonInteract>
    </div>
  );
}
