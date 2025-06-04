"use client";

import { ReservationForm } from "@/components/reservations/ReservationForm";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { ButtonInteract } from "@/components/ui/interactButton";
import { useReservationsStore } from "@/store/useRestaurantStore";
import { useUserStore } from "@/store/useUserStore";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const userData = useUserStore((state) => state.user);
  const [reservationsData, setReservationsData] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reservations/${id}?isHolding=true`, {
          method: "GET",
        });
        if (!res.ok) {
          setNotFound(true);
        }
        const data = await res.json();
        setReservationsData(data?.data);
      } catch (error) {
        setLoading(false);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, []);

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

  if (notFound) {
    throw new Error(404);
  }

  return (
    <>
      {loading && <FullScreenLoader />}
      {!_.isEmpty(reservationsData) ? (
        <ReservationForm reservationData={reservationsData} userData={userData} />
      ) : (
        <div className="text-center mt-4 p-4 min-h-[70vh] flex flex-col items-center justify-center">
          <h2 className="text-xl">Bạn chưa đặt bàn, vui lòng đặt bàn trước.</h2>
          <ButtonInteract className="mt-2" onClick={() => router.push("/restaurants")}>
            Đặt bàn ngay!
          </ButtonInteract>
        </div>
      )}
    </>
  );
}
