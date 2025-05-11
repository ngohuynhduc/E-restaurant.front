"use client";

import { useDialogStore } from "@/store/useDialogStore";
import { useState } from "react";

export const MyAccount = ({ userInfo: initialUserInfo }) => {
  console.log("🚀 ~ MyAccount ~ initialUserInfo:", initialUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [tempUserInfo, setTempUserInfo] = useState({ ...userInfo });
  const [loading, setLoading] = useState(false);
  const { showDialog } = useDialogStore();
  console.log("🚀 ~ MyAccount ~ showDialog:", showDialog);

  const handleEdit = () => {
    setTempUserInfo({ ...userInfo });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const body = {
        full_name: tempUserInfo.full_name,
        phone: tempUserInfo.phone,
      };
      setLoading(true);
      const res = await fetch("/api/user/edit-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.status === 200) {
        setUserInfo({
          ...tempUserInfo,
        });
        setIsEditing(false);
        showDialog({
          message: "Cập nhật thông tin thành công",
          type: "success",
          onOk: () => window.location.reload(),
        });
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value !== "" && !/^[0-9+]+$/.test(value)) {
      return;
    }
    setTempUserInfo({
      ...tempUserInfo,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mx-4 mt-4 mb-14">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Thông tin tài khoản
      </h2>

      <div className="space-y-6 min-h-[160px]">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-1/3">
            <label className="text-gray-600 font-medium">Họ và tên</label>
          </div>
          <div className="w-full md:w-2/3 mt-1 md:mt-0">
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={tempUserInfo.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{userInfo.full_name}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-1/3">
            <label className="text-gray-600 font-medium">Email</label>
          </div>
          <div className="w-full md:w-2/3 mt-1 md:mt-0">
            <p className="text-gray-800">{userInfo.email}</p>
            {!isEditing && <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-1/3">
            <label className="text-gray-600 font-medium">Số điện thoại</label>
          </div>
          <div className="w-full md:w-2/3 mt-1 md:mt-0">
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={tempUserInfo.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{userInfo.phone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full sm:w-auto cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#FF9C00] text-white rounded-md w-full sm:w-auto mt-3 sm:mt-0 cursor-pointer"
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full sm:w-auto cursor-pointer"
              onClick={() => showDialog({ message: "Chức năng chưa khả dụng", type: "success" })}
            >
              Đổi mật khẩu
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[#FF9C00] text-white rounded-md w-full sm:w-auto mt-3 sm:mt-0 cursor-pointer"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
