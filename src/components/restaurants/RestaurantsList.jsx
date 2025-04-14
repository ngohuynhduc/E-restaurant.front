import _ from "lodash";
import { RestaurantItem } from "./RestaurantItem";
import NoRestaurant from "@/assets/img/closed-sign.png";

export const RestaurantsList = ({ restaurants, total }) => {
  return (
    <>
      {_.isEmpty(restaurants) ? (
        <div className="flex flex-col justify-center items-center py-6">
          <img src={NoRestaurant.src} alt="no-restaurant" />
          <h1 className="text-xl font-medium mb-4">
            Không tìm thấy nhà hàng nào phù hợp với yêu cầu của bạn. Vui lòng thử lại
          </h1>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4">
            {restaurants.map((res) => (
              <RestaurantItem restaurant={res} key={res.id} />
            ))}
          </ul>
        </>
      )}
      <p className="mt-4 text-sm text-gray-600">Tổng cộng: {total} nhà hàng</p>
    </>
  );
};
