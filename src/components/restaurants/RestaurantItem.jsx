import { CircleDollarSign, MapPin } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ButtonInteract } from "../ui/interactButton";
import { useRouter } from "next/navigation";

export const RestaurantItem = ({ restaurant }) => {
  const { id, image, name, address, description, price_min, price_max } = restaurant;
  const router = useRouter();

  const imageUrl = useMemo(() => {
    return JSON.parse(image).url;
  }, [image]);

  const handleGoToDetail = (id) => {
    router.push(`/restaurants/${id}`);
  };

  return (
    <>
      <li key={id} className="relative border rounded-xl overflow-hidden p-4 cursor-pointer">
        <img src={imageUrl} alt={name} className="w-full h-40 object-cover rounded-lg mb-2" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:opacity-100"
        >
          <motion.div
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ButtonInteract
              variant="default"
              size="lg"
              className="text-white"
              onClick={() => handleGoToDetail(id)}
            >
              Đặt bàn ngay
            </ButtonInteract>
          </motion.div>
        </motion.div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm flex text-[#FF9C00] flex-row gap-[5px]">
          <MapPin size={16} />
          <span className="text-gray-500">{address}</span>
        </p>
        <p className="text-sm line-clamp-2 my-[6px]">{description}</p>
        <p className="text-sm text-green-600 flex flex-row gap-[5px] items-center">
          <CircleDollarSign size={16} /> {price_min.toLocaleString()}đ -{" "}
          {price_max.toLocaleString()}đ
        </p>
      </li>
    </>
  );
};
