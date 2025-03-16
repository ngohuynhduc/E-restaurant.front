"use client";

import { useSession } from "next-auth/react";
import businessReg from "@/assets/img/business.jpg";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { uploadMultipleImage } from "@/services/uploadImageService";
import { Button } from "@/components/ui/button";
import { SquareX } from "lucide-react";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function BusinessRegisterPage() {
  const { data: session, status } = useSession();
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    phone: "",
  });
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    coordinate: "",
    hotline: "",
    description: "",
    menu_image: [],
    restaurant_image: [],
    tables: {},
  });
  const isLogin = status === "authenticated" && !_.isEmpty(session);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTables, setSelectedTables] = useState({
    table2: false,
    table4: false,
    table6: false,
  });
  const [tableQuantities, setTableQuantities] = useState({
    table2: 0,
    table4: 0,
    table6: 0,
  });
  const menuImageRef = useRef(null);
  const restaurantImageRef = useRef(null);
  console.log("🚀 ~ BusinessRegisterPage ~ selectedTables:", selectedTables, tableQuantities);

  useEffect(() => {
    if (status === "authenticated" && !_.isEmpty(session)) {
      setRegisterData((prev) => ({
        ...prev,
        email: session?.user?.email,
        full_name: session?.user?.name,
      }));
    }
  }, [session, status]);

  const handleSubmit = async (e) => {
    console.log("🚀 ~ handleSubmit ~ e:", e);
    e.preventDefault();
    const tables = Object.entries(tableQuantities)
      .filter(([key]) => selectedTables[key] && tableQuantities[key])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const submitValue = {
      ...registerData,
      ...restaurantData,
      tables,
    };
    setLoading(true);
    setError("");

    try {
      const result = await fetch("/api/auth/business-register", {
        method: "POST",
        body: JSON.stringify(submitValue),
      });
    } catch (errors) {
      console.log("🚀 ~ handleSubmit ~ errors:", errors);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e, type) => {
    const newFiles = Array.from(e.target.files);
    const newFilesLengh = e?.target?.files?.length ?? 0;
    if (newFilesLengh > 5) {
      setError("Chỉ được chọn tối đa 5 ảnh");
      e.target.value = "";
      return;
    }

    if (type === "menu" && newFilesLengh + restaurantData?.menu_image?.length > 5) {
      setError("Chỉ được chọn tối đa 5 ảnh");
      e.target.value = "";
      return;
    }

    if (type === "res" && newFilesLengh + restaurantData?.restaurant_image.length > 5) {
      setError("Chỉ được chọn tối đa 5 ảnh");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      const uploadedImages = await uploadMultipleImage(newFiles);
      if (type === "menu") {
        setRestaurantData((prev) => ({
          ...prev,
          menu_image: prev.menu_image.concat(uploadedImages),
        }));
      } else if (type === "restaurant") {
        setRestaurantData((prev) => ({
          ...prev,
          restaurant_image: prev.restaurant_image.concat(uploadedImages),
        }));
      }
    } catch (error) {
      console.log("🚀 ~ handleUploadImage ~ error:", error);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedTables((prev) => ({ ...prev, [name]: checked }));

    if (!checked) {
      setTableQuantities((prev) => ({ ...prev, [name]: 0 }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/^\d{0,3}$/.test(value)) {
      setTableQuantities((prev) => ({ ...prev, [name]: Number(value) }));
    }
  };

  const handleRemoveImage = (type = "menu", id) => {
    if (type === "menu") {
      setRestaurantData((prev) => ({
        ...prev,
        menu_image: prev?.menu_image?.filter((item) => item?.public_id !== id),
      }));
      return;
    }
    setRestaurantData((prev) => ({
      ...prev,
      restaurant_image: prev?.restaurant_image?.filter((item) => item?.public_id !== id),
    }));
    return;
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-xl font-bold text-[#FC8842] mb-4">Thông tin tài khoản</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={registerData.email}
          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          required
          disabled={isLogin}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent disabled:bg-gray-200 disabled:text-gray-500"
        />
      </div>

      {!isLogin && (
        <>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="confirm_password"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Nhập lại mật khẩu
            </label>
            <input
              id="confirm_password"
              type="password"
              value={registerData.confirm_password}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirm_password: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
            />
          </div>
        </>
      )}

      <div className="mt-4">
        <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 mb-1">
          Họ và tên
        </label>
        <input
          id="full_name"
          type="text"
          value={registerData.full_name}
          onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
          required
          disabled={isLogin}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent disabled:bg-gray-200 disabled:text-gray-500"
        />
      </div>

      {!isLogin && (
        <div className="mt-4">
          <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            value={registerData.phone}
            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
          />
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="bg-[#FC8842] text-white py-2 px-6 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="mr-4 text-gray-600 hover:text-[#FC8842] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#FC8842]">Thông tin nhà hàng</h2>
      </div>

      <div>
        <label htmlFor="restaurant-name" className="block text-sm font-bold text-gray-700 mb-1">
          Tên nhà hàng
        </label>
        <input
          type="text"
          id="restaurant-name"
          value={restaurantData.name}
          onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="restaurant-address" className="block text-sm font-bold text-gray-700 mb-1">
          Địa chỉ nhà hàng
        </label>
        <input
          type="text"
          id="restaurant-address"
          value={restaurantData.address}
          onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="restaurant-coordinates"
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          Tọa độ
        </label>
        <input
          type="text"
          id="restaurant-coordinates"
          value={restaurantData.coordinate}
          onChange={(e) => setRestaurantData({ ...restaurantData, coordinate: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="restaurant-hotline" className="block text-sm font-bold text-gray-700 mb-1">
          Hotline
        </label>
        <input
          type="tel"
          id="restaurant-hotline"
          value={restaurantData.hotline}
          onChange={(e) => setRestaurantData({ ...restaurantData, hotline: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors duration-300 font-bold cursor-pointer"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="bg-[#FC8842] text-white py-2 px-6 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="mr-4 text-gray-600 hover:text-[#FC8842] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#FC8842]">Hình ảnh và mô tả</h2>
      </div>

      <div>
        <label
          htmlFor="restaurant-description"
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          Mô tả nhà hàng
        </label>
        <textarea
          name="restaurant-description"
          id="restaurant-description"
          value={restaurantData.description}
          onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent h-24"
        />
      </div>

      <div className="mt-4 flex flex-row justify-between self-center">
        <label
          htmlFor="restaurant-menu-image"
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          Ảnh menu (tối đa 5 ảnh)
        </label>
        <input
          ref={menuImageRef}
          type="file"
          id="restaurant-menu-image"
          name="restaurant-menu-image"
          onChange={(e) => handleUploadImage(e, "menu")}
          className="hidden"
          multiple
          accept="image/*"
        />
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={() => menuImageRef.current.click()}
          loading={uploading}
          disabled={uploading || restaurantData?.menu_image.length >= 5}
          className="bg-[#FC8842] text-white py-1 px-4 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          Upload
        </Button>
      </div>
      {!_.isEmpty(restaurantData?.menu_image) && (
        <div className="flex flex-row gap-[10px]">
          {restaurantData?.menu_image.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <span
                className="absolute top-0 right-0 bg-gray-500 cursor-pointer"
                onClick={() => handleRemoveImage("menu", image?.public_id)}
              >
                <SquareX size={16} color="#ffffff" />
              </span>
              <img
                src={image.url}
                alt="menu-image"
                className="w-[80px] h-[80px] object-cover rounded-md border-[1px] border-gray-300"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-row justify-between self-center">
        <label htmlFor="restaurant-image" className="block text-sm font-bold text-gray-700 mb-1">
          Ảnh nhà hàng (tối đa 5 ảnh)
        </label>
        <input
          ref={restaurantImageRef}
          type="file"
          id="restaurant-image"
          name="restaurant-image"
          onChange={(e) => handleUploadImage(e, "restaurant")}
          className="hidden"
          multiple
          accept="image/*"
        />
        <Button
          type="button"
          disabled={uploading || restaurantData?.restaurant_image.length >= 5}
          loading={uploading}
          variant="default"
          size="default"
          onClick={() => restaurantImageRef.current.click()}
          className="bg-[#FC8842] text-white py-1 px-4 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          Upload
        </Button>
      </div>
      {!_.isEmpty(restaurantData?.restaurant_image) && (
        <div className="flex flex-row gap-[10px]">
          {restaurantData?.restaurant_image.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <span
                className="absolute top-0 right-0 bg-gray-500 cursor-pointer"
                onClick={() => handleRemoveImage("menu", image?.public_id)}
              >
                <SquareX size={16} color="#ffffff" />
              </span>
              <img
                src={image.url}
                alt="menu-image"
                className="w-[80px] h-[80px] object-cover rounded-md border-[1px] border-gray-300"
              />
            </div>
          ))}
        </div>
      )}

      {[
        { key: "table2", label: "Bàn 2 chỗ" },
        { key: "table4", label: "Bàn 4 chỗ" },
        { key: "table6", label: "Bàn 6 chỗ" },
      ].map(({ key, label }) => (
        <div key={key} className="form-group">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-[10px] self-center">
              <input
                type="checkbox"
                name={key}
                checked={selectedTables[key]}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="tables-seat" className="block text-sm font-bold text-gray-700 mb-1">
                {label}
              </label>
            </div>
            <input
              type="text"
              name={key}
              value={tableQuantities[key]}
              onChange={handleInputChange}
              disabled={!selectedTables[key]}
              placeholder="Số lượng"
              className="max-w-[100px] w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent disabled:bg-gray-200 disabled:text-gray-500"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors duration-300 font-bold cursor-pointer"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FC8842] text-white py-2 px-6 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="flex h-screen w-full">
        {/* Phần hình ảnh - chiếm 1/2 màn hình */}
        <div className="relative w-1/2 h-full hidden md:block">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${businessReg.src})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
        </div>
        {/* Phần form đăng ký - chiếm 1/2 màn hình */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#FC8842]">Liên kết với E-Restaurant!</h1>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-800 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
