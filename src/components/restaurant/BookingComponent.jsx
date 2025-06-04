"use client";

import { Clock, TicketPercent, User } from "lucide-react";
import { DateTimeSelector } from "./dialog/DatePicker";
import { useMemo, useState } from "react";
import { ButtonInteract } from "../ui/interactButton";
import { useSession } from "next-auth/react";
import { RequestLogin } from "./dialog/RequestLoginDialog";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useUserStore } from "@/store/useUserStore";

export const BookingComponent = ({ restaurant }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userData = useUserStore((state) => state.user);
  const [numOfCustomer, setNumOfCustomer] = useState(1);
  const [dateTimeSelected, setDateTimeSelected] = useState({
    date: "",
    time: "",
  });
  const [openDialogLogin, setOpenDialogLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisable = useMemo(() => {
    return !numOfCustomer || !dateTimeSelected?.date || !dateTimeSelected?.time;
  }, [numOfCustomer, dateTimeSelected]);

  const generateOptions = () => {
    const options = [];

    for (let i = 1; i <= 10; i++) {
      options.push(i);
    }

    for (let i = 12; i <= 20; i += 2) {
      options.push(i);
    }

    return options;
  };

  const options = generateOptions();

  const handleSubmit = async () => {
    // if (status === "unauthenticated") {
    //   setOpenDialogLogin(true);
    //   return;
    // }
    setLoading(true);

    const formattedDate = format(dateTimeSelected?.date, "yyyy-MM-dd");

    const reservationData = {
      user_id: userData?.id || null,
      phone: userData?.phone || null,
      email: userData?.email || null,
      restaurant_id: restaurant.id,
      guest_count: numOfCustomer,
      date: formattedDate,
      arrival_time: dateTimeSelected?.time,
      note: "",
    };

    const res = await fetch("/api/reservations/hold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    const result = await res.json();

    if (result.status === 200 && result?.data?.hold_id) {
      router.push(`/reservations/${result?.data?.hold_id}`);
    } else {
      alert(result.message);
    }

    // setReservationsData({
    //   ...dateTimeSelected,
    //   customerCount: numOfCustomer,
    //   restaurantName: restaurant.name,
    //   restaurantAddress: restaurant.address,
    //   restaurantId: restaurant.id,
    // });
    // router.push(`/reservations?rid=${restaurant.id}`);
  };

  return (
    <div className="sticky top-[90px] w-[30%] bg-white shadow-md rounded-lg p-6 h-fit flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-[#860001] mb-4">Đặt bàn</h2>
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center self-start">
            <Clock size={20} />
            <p className="text-[16px] font-semibold">Thời gian đến</p>
          </div>
          <div className="flex flex-row gap-2">
            <DateTimeSelector openTimes={restaurant?.openTimes} setDateTime={setDateTimeSelected} />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row gap-1 items-center self-start">
            <User size={20} />
            <p className="text-[16px] font-semibold">Số lượng người</p>
          </div>
          <div className="w-full">
            <select
              id="people"
              value={numOfCustomer}
              onChange={(e) => setNumOfCustomer(Number(e.target.value))}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm w-[50%]"
            >
              {options.map((num) => (
                <option key={num} value={num}>
                  {num} người
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <ButtonInteract disabled={isDisable} onClick={() => handleSubmit()}>
        Đặt bàn ngay!
      </ButtonInteract>
      {restaurant?.promotions?.length > 0 && (
        <div>
          <div className="text-center text-[18px] font-semibold text-gray-500 mb-2">
            Đặt bàn ngay để hưởng ưu đãi
          </div>
          <ul className="list-none text-[16px] text-red-700">
            {restaurant.promotions.map((promo, index) => (
              <li key={index} className="flex items-center gap-2 mb-2 justify-center">
                <TicketPercent size={20} className="self-start justify-self-start" />
                <div className="max-w-[calc(100%-40px)] text-center">{promo.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <RequestLogin isOpen={openDialogLogin} setIsOpen={setOpenDialogLogin} />
    </div>
  );
};
