"use client";

import { useSession } from "next-auth/react";
import businessReg from "@/assets/img/business.jpg";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _, { add, debounce } from "lodash";
import { uploadMultipleImage } from "@/services/uploadImageService";
import { Button } from "@/components/ui/button";
import { Asterisk, Check, ChevronLeft, CircleCheckBig, Loader, SquareX } from "lucide-react";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonInteract } from "@/components/ui/interactButton";
import { DAYS, HOURS } from "@/app/shared/const";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, isTrulyEmpty } from "@/lib/utils";
import CategoryMultiDropdown from "@/components/auth/CategoryDropdown";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useUserStore } from "@/store/useUserStore";

const STATUS_OBJECT = [
  {
    value: "PENDING",
    label: "Chờ xác nhận",
  },
  {
    value: "APPROVED",
    label: "Duyệt",
  },
  {
    value: "REJECTED",
    label: "Từ chối",
  },
  {
    value: "SUSPENDED",
    label: "Tạm dừng",
  },
];

export const EditRestaurant = ({ restaurant }) => {
  const { user } = useUserStore((state) => state);
  const isAdmin = user?.role === "ADMIN";
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    coordinate: "",
    hotline: "",
    description: "",
    menu_image: [],
    restaurant_image: [],
    tables: {},
    price_min: "",
    price_max: "",
    categories: [],
  });
  const router = useRouter();
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
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isTypingAddress, setIsTypingAddress] = useState(false);
  const [isOpenComplelte, setIsOpenComplelte] = useState(false);
  const [openTimeData, setOpenTimeData] = useState({});
  const [open, setOpen] = useState(false);
  const [displayDays, setDisplayDays] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const menuImageRef = useRef(null);
  const restaurantImageRef = useRef(null);

  useEffect(() => {
    if (!_.isEmpty(restaurant)) {
      const daysData = restaurant?.openTimes?.reduce((acc, item) => {
        if (item?.day_of_week) {
          acc.push(item?.day_of_week);
        }
        return acc;
      }, []);
      const selectedCate = restaurant?.categories?.reduce((acc, item) => {
        if (item?.id) {
          acc.push(item?.id);
        }
        return acc;
      }, []);
      const lunchHours = {
        from: restaurant?.openTimes?.[0]?.lunch_from?.slice(0, 5),
        to: restaurant?.openTimes?.[0]?.lunch_to?.slice(0, 5),
      };
      const dinner = {
        from: restaurant?.openTimes?.[0]?.dinner_from?.slice(0, 5),
        to: restaurant?.openTimes?.[0]?.dinner_to?.slice(0, 5),
      };

      const tableRes = restaurant?.tables;
      const tablesSelect = {};
      const tablesQuantity = {};

      tableRes.forEach((item) => {
        const key = `table${item.table_type}`;
        tablesSelect[key] = true;
        tablesQuantity[key] = item.quantity;
      });

      setRestaurantData((prev) => ({
        ...prev,
        ...restaurant,
        tables: restaurant?.tables ?? {},
        categories: restaurant?.categories ?? [],
        coordinate: restaurant?.coordinate?.coordinates.join(","),
      }));

      setOpenTimeData({
        days: daysData,
        lunchHours: lunchHours,
        dinnerHours: dinner,
      });
      setSelectedTables(tablesSelect);
      setTableQuantities(tablesQuantity);
      setSelectedCategories(selectedCate ?? []);
    }
  }, [restaurant]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRes = await fetch("/api/restaurants/category", {
        method: "GET",
      });
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData?.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setError("");
  }, [selectedTables, restaurantData, openTimeData]);

  useEffect(() => {
    if (openTimeData?.days?.length === 0) {
      setDisplayDays("Chưa chọn ngày");
      return;
    }

    if (openTimeData?.days?.length === 7) {
      setDisplayDays("Cả tuần");
      return;
    }

    if (openTimeData?.days?.length > 0) {
      setDisplayDays(`Đã chọn ${openTimeData?.days?.length} ngày`);
    }
  }, [openTimeData.days]);

  const handleDayChange = (day) => {
    setOpenTimeData((prev) => {
      const selected = prev?.days?.includes(day);
      let newDays;

      if (selected) {
        newDays = prev?.days?.filter((d) => d !== day);
      } else {
        newDays = [...prev.days, day];
      }

      if (newDays?.length > 0 && error) {
        setError("");
      }

      return {
        ...prev,
        days: newDays,
      };
    });
  };

  const handleSelectAllDays = (selectAll) => {
    setOpenTimeData({
      ...openTimeData,
      days: selectAll ? DAYS.map((d) => d.value) : [],
    });
  };

  const handleLunchHoursChange = (field, value) => {
    const newLunchHours = { ...openTimeData.lunchHours, [field]: value };
    const checkValidate = validateLunchHours(newLunchHours);
    if (!checkValidate) return;

    setOpenTimeData({
      ...openTimeData,
      lunchHours: newLunchHours,
    });
  };

  const handleDinnerHoursChange = (field, value) => {
    const newDinnerHours = { ...openTimeData.dinnerHours, [field]: value };
    const checkValidate = validateDinnerHours(newDinnerHours);
    if (!checkValidate) return;

    setOpenTimeData({
      ...openTimeData,
      dinnerHours: newDinnerHours,
    });
  };

  const validateLunchHours = (lunchHours) => {
    const from = parseInt(lunchHours?.from?.split(":")[0]);
    const to = parseInt(lunchHours?.to?.split(":")[0]);

    if (to <= from) {
      setError("Giờ kết thúc phải sau giờ bắt đầu");
      return false;
    }

    setError("");

    const checkValidate = validateDinnerHours(openTimeData.dinnerHours, lunchHours);

    if (!checkValidate) return false;

    return true;
  };

  const validateDinnerHours = (dinnerHours, lunchHours = openTimeData.lunchHours) => {
    const lunchTo = parseInt(lunchHours?.to?.split(":")[0]);
    const dinnerFrom = parseInt(dinnerHours?.from?.split(":")[0]);
    const dinnerTo = parseInt(dinnerHours?.to?.split(":")[0]);

    if (dinnerFrom <= lunchTo) {
      setError("Giờ tối phải bắt đầu sau giờ trưa");
      return false;
    }

    if (dinnerTo <= dinnerFrom) {
      setError("Giờ kết thúc phải sau giờ bắt đầu");
      return false;
    }

    setError("");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    const tables = Object.entries(tableQuantities)
      .filter(([key]) => selectedTables[key] && tableQuantities[key])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const submitValue = {
      ...restaurantData,
      tables,
      open_time: openTimeData,
    };

    if (_.isEmpty(openTimeData.days)) {
      setError("Chưa chọn ngày mở cửa");
      return;
    }

    if (submitValue.price_min >= submitValue.price_max) {
      setError("Nhập sai khoảng giá!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetch(`/api/admin/restaurants/${restaurantData?.id}`, {
        method: "PUT",
        body: JSON.stringify(submitValue),
      });
      const response = await result.json();
      if (!result.ok && response?.message) {
        setError(response.message);
      }
      if (result?.ok && response?.message) {
        alert(response?.message);
        router.push("/admin/restaurants");
      }
    } catch (errors) {
      setError(errors?.message);
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

    if (type === "res" && newFilesLengh + restaurantData?.restaurant_image?.length > 5) {
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
  };
  const fetchResults = async (searchText) => {
    const searchParams = encodeURIComponent(searchText);
    const autoCompleteUrl = `${process.env.NEXT_PUBLIC_GEOAPIFY_API_URL}?text=${searchParams}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`;
    const autoCompleteResponse = await fetch(autoCompleteUrl);
    const autoCompleteData = await autoCompleteResponse.json();
    const results = autoCompleteData?.features?.map((item) => ({
      address: item?.properties?.formatted,
      coordinate: item?.geometry?.coordinates?.toString(),
    }));

    setResults(results);
    setShowResults(true);
  };

  const debouncedFetch = useCallback(debounce(fetchResults, 2000), []);

  const handleChangeAddress = (e) => {
    const value = e.target.value;
    setIsTypingAddress(Boolean(e.target.value));
    setRestaurantData({ ...restaurantData, address: value });
    if (value.trim()) {
      debouncedFetch(value);
    }
    setResults([]);
    setShowResults(false);
  };

  const handleSelectAddress = (selectedValue) => {
    console.log("🚀 ~ handleSelectAddress ~ selectedValue:", selectedValue.coordinate);
    setRestaurantData({
      ...restaurantData,
      address: selectedValue?.address,
      coordinate: selectedValue?.coordinate,
    });
    setResults([]);
    setIsTypingAddress(false);
    setShowResults(false);
  };

  const handleInputPrice = (e, type) => {
    setError("");
    const value = +e.target.value;
    if (type === "max") {
      setRestaurantData({
        ...restaurantData,
        price_max: value,
      });
      return;
    }
    setRestaurantData({
      ...restaurantData,
      price_min: value,
    });
  };

  const handleChangeStatus = (value) => {
    setRestaurantData({
      ...restaurantData,
      status: value,
    });
  };

  const disabledStatus = (statusItem) => {
    console.log("🚀 ~ disabledStatus ~ statusItem:", statusItem);
    if (statusItem === "PENDING") {
      return true;
    }

    if (!isAdmin && ["APPROVED", "REJECTED"].includes(statusItem)) {
      return true;
    }
    return false;
  };

  const renderStep2 = () => (
    <>
      <div>
        <label htmlFor="restaurant-name" className="flex text-sm font-bold text-gray-700 mb-1">
          Trạng thái
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
        </label>
        <RadioGroup
          value={restaurantData?.status}
          onValueChange={handleChangeStatus}
          className="flex flex-row gap-6"
        >
          {STATUS_OBJECT.map((item) => (
            <div key={item.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={item.value}
                id={item.value}
                disabled={disabledStatus(item.value)}
              />
              <label htmlFor={item.value}>{item.label}</label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <label htmlFor="restaurant-name" className="flex text-sm font-bold text-gray-700 mb-1">
          Tên nhà hàng
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
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

      <div className="relative mt-4">
        <label htmlFor="restaurant-address" className="flex text-sm font-bold text-gray-700 mb-1">
          Địa chỉ nhà hàng
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
        </label>
        <input
          type="text"
          id="restaurant-address"
          value={restaurantData.address}
          onChange={handleChangeAddress}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
        />
        {isTypingAddress && !showResults && (
          <div className="absolute left-0 flex justify-center w-full mt-1 bg-white border rounded h-[50px] overflow-y-auto shadow-md border-[#FC8842] px-[12px]">
            <img src="/loadingInline.svg" alt="loading" />
          </div>
        )}
        {showResults && results?.length > 0 && (
          <ul className="absolute left-0 w-full mt-1 bg-white border rounded max-h-[200px] overflow-y-auto shadow-md border-[#FC8842] px-[12px]">
            {results.map((item, index) => (
              <li
                key={index}
                className={`${
                  index ? "border-t border-t-gray-300" : ""
                } p-2 cursor-pointer hover:bg-gray-200`}
                onClick={() => handleSelectAddress(item)}
              >
                {item?.address}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="restaurant-hotline" className="flex text-sm font-bold text-gray-700 mb-1">
          Hotline
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
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

      <div>
        <label
          htmlFor="restaurant-description"
          className="flex text-sm font-bold text-gray-700 mb-1"
        >
          Mô tả nhà hàng
        </label>
        <textarea
          name="restaurant-description"
          id="restaurant-description"
          value={restaurantData.description}
          onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent h-48 resize-none"
        />
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div>
        <label htmlFor="restaurant-category" className="flex text-sm font-bold text-gray-700 mb-1">
          Loại nhà hàng
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
        </label>
        <CategoryMultiDropdown
          categories={categories}
          setRestaurantData={setRestaurantData}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      <div className="relative mt-4">
        <label
          htmlFor="restaurant-price-range"
          className="flex text-sm font-bold text-gray-700 mb-1"
        >
          Khoảng giá
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
        </label>
        <div className="flex flex-row gap-[10px] items-center">
          <input
            type="text"
            id="restaurant-price-min"
            value={restaurantData.price_min}
            onChange={(e) => handleInputPrice(e, "min")}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
          />
          VNĐ
          <span>~</span>
          <input
            type="text"
            id="restaurant-price-max"
            value={restaurantData.price_max}
            onChange={(e) => handleInputPrice(e, "max")}
            onBlur={(e) => {
              const value = e.target.value;
              if (restaurantData.price_min >= value) {
                setError("Nhập sai giá!");
                return;
              }
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8842] focus:border-transparent"
          />
          VNĐ
        </div>
      </div>

      <div className="mt-4">
        <div className="space-y-2">
          <label
            htmlFor="restaurant-open-days"
            className="flex text-sm font-bold text-gray-700 mb-1"
          >
            Mở cửa
            <span>
              <Asterisk size={16} color="#ff0000" strokeWidth={1} />
            </span>
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {displayDays}
                <div className="ml-2 opacity-50">↓</div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <div className="border-t px-2 py-1 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAllDays(true)}
                    type="button"
                  >
                    Chọn tất cả
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAllDays(false)}
                    type="button"
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>
                <CommandGroup>
                  {DAYS.map((day) => (
                    <CommandItem
                      key={day.value}
                      value={day.value}
                      onSelect={() => handleDayChange(day.value)}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-2 h-4 w-4 border rounded-sm flex items-center justify-center",
                            openTimeData?.days?.includes(day.value)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          )}
                        >
                          {openTimeData?.days?.includes(day.value) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {day.label}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-rows justify-between mt-4">
          {/* Giờ trưa */}
          <div>
            <label
              htmlFor="restaurant-open-lunch"
              className="flex text-sm font-bold text-gray-700 mb-1"
            >
              Giờ trưa
              <span>
                <Asterisk size={16} color="#ff0000" strokeWidth={1} />
              </span>
            </label>

            <div className="flex items-center">
              <Select
                value={openTimeData?.lunchHours?.from}
                onValueChange={(value) => handleLunchHoursChange("from", value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Từ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Giờ bắt đầu</SelectLabel>
                    {HOURS.map((hour) => (
                      <SelectItem key={`lunch-from-${hour.value}`} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span className="mx-2">~</span>

              <Select
                value={openTimeData?.lunchHours?.to}
                onValueChange={(value) => handleLunchHoursChange("to", value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Giờ kết thúc</SelectLabel>
                    {HOURS.map((hour) => (
                      <SelectItem key={`lunch-to-${hour.value}`} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Giờ tối */}
          <div>
            <label
              htmlFor="restaurant-open-dinner"
              className="flex text-sm font-bold text-gray-700 mb-1"
            >
              Giờ tối
              <span>
                <Asterisk size={16} color="#ff0000" strokeWidth={1} />
              </span>
            </label>

            <div className="flex items-center">
              <Select
                value={openTimeData?.dinnerHours?.from}
                onValueChange={(value) => handleDinnerHoursChange("from", value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Từ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Giờ bắt đầu</SelectLabel>
                    {HOURS.map((hour) => {
                      const hourVal = parseInt(hour.value);
                      const lunchToHour = parseInt(openTimeData?.lunchHours?.to?.split(":")[0]);
                      const disabled = hourVal <= lunchToHour;

                      return (
                        <SelectItem
                          key={`dinner-from-${hour.value}`}
                          value={hour.value}
                          disabled={disabled}
                        >
                          {hour.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span className="mx-2">~</span>

              <Select
                value={openTimeData?.dinnerHours?.to}
                onValueChange={(value) => handleDinnerHoursChange("to", value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Giờ kết thúc</SelectLabel>
                    {HOURS.map((hour) => (
                      <SelectItem key={`dinner-to-${hour.value}`} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <div className="mt-4 flex flex-row justify-between self-center">
        <label
          htmlFor="restaurant-menu-image"
          className="flex text-sm font-bold text-gray-700 mb-1"
        >
          Ảnh menu (tối đa 5 ảnh)
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
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
          disabled={uploading || restaurantData?.menu_image?.length >= 5}
          className="bg-[#FC8842] text-white py-1 px-4 rounded-md hover:bg-[#e67a35] transition-colors duration-300 font-bold cursor-pointer"
        >
          Upload
        </Button>
      </div>
      {!_.isEmpty(restaurantData?.menu_image) && (
        <div className="flex flex-row gap-[10px]">
          {restaurantData?.menu_image?.map((image, index) => (
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
        <label htmlFor="restaurant-image" className="flex text-sm font-bold text-gray-700 mb-1">
          Ảnh nhà hàng (tối đa 5 ảnh)
          <span>
            <Asterisk size={16} color="#ff0000" strokeWidth={1} />
          </span>
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
          {restaurantData?.restaurant_image?.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <span
                className="absolute top-0 right-0 bg-gray-500 cursor-pointer"
                onClick={() => handleRemoveImage("restaurant", image?.public_id)}
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

      <label htmlFor="restaurant-image" className="flex text-sm font-bold text-gray-700 mb-1">
        Thông tin bàn (có thể chọn nhiều)
        <span>
          <Asterisk size={16} color="#ff0000" strokeWidth={1} />
        </span>
      </label>
      <div className="form-group flex flex-row gap-[20px]">
        {[
          { key: "table2", label: "Bàn 2 chỗ" },
          { key: "table4", label: "Bàn 4 chỗ" },
          { key: "table6", label: "Bàn 6 chỗ" },
        ].map(({ key, label }) => (
          <div className="flex flex-col gap-[4px]" key={key}>
            <div className="flex flex-row gap-[10px] self-center">
              <input
                type="checkbox"
                name={key}
                checked={selectedTables[key]}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="tables-seat" className="flex text-sm font-bold text-gray-700 mb-1">
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
        ))}
      </div>

      <div className="flex justify-between mt-6">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStep2()}
      {renderStep3()}
      {renderStep4()}
    </form>
  );
};
