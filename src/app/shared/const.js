export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  BUSINESS_OWNER: "BUSINESS_OWNER",
};

Object.freeze(ROLES);

export const DAYS = [
  { value: "T2", label: "Thứ 2" },
  { value: "T3", label: "Thứ 3" },
  { value: "T4", label: "Thứ 4" },
  { value: "T5", label: "Thứ 5" },
  { value: "T6", label: "Thứ 6" },
  { value: "T7", label: "Thứ 7" },
  { value: "CN", label: "Chủ nhật" },
];

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "rating", label: "Đánh giá" },
  { value: "nearby", label: "Gần tôi" },
];
