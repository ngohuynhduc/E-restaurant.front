import { clsx } from "clsx";
import _ from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isTrulyEmpty = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string" && val.trim() === "") return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return true;
  return false;
};

export const getImageUrl = (url) => {
  if (url && typeof url === "string") {
    const objectImage = JSON.parse(url);
    if (!_.isEmpty(objectImage)) {
      return objectImage.url;
    }
  }
  return "/no-picture.png";
};

export const getTodayKey = () => {
  const today = new Date().getDay();
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][today];
};
