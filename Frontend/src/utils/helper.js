//Only store those functions in here that are used in multiple files throughout the codebase, store the state specific logic and actions in
//their respective zustand stores only.
import { toast } from "react-toastify";
import axiosInstance from "./api/axiosInstance";

const apiGet = async (endPoint, headers = {}) => {
  try {
    const response = await axiosInstance.get(`${endPoint}`, {
      ...headers,
    });
    return response;
  } catch (error) {
    //console.log(error.response?.data.message);
    return toast.error(
      error.response?.data.message || error.message || "Something went wrong!",
    );
  }
};

const apiPost = async (endPoint, reqBody, headers = {}) => {
  try {
    const response = await axiosInstance.post(`${endPoint}`, reqBody, {
      ...headers,
    });
    return response;
  } catch (error) {
    //console.log(error.response.data.message);
    return toast.error(
      error.response?.data.message || error.message || "Something went wrong!",
    );
  }
};

const apiPatch = async (endPoint, reqBody, headers = {}) => {
  try {
    const response = await axiosInstance.patch(`${endPoint}`, reqBody, {
      ...headers,
    });
    return response;
  } catch (error) {
    //console.log(error.response.data.message);
    return toast.error(
      error.response?.data.message || error.message || "Something went wrong!",
    );
  }
};

const apiDelete = async (endPoint) => {
  try {
    const response = await axiosInstance.delete(`${endPoint}`);
    return response;
  } catch (error) {
    return toast.error(
      error.response?.data.message || error.message || "Something went wrong!",
    );
  }
};

const tryCatchWrapper = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    console.log(
      error.response?.data.message || error.message || "Something went wrong!",
    );
  }
};

const timeRep = (time) => {
  const seconds = Math.floor(time / 1000); //Converting to seconds
  const minutes = Math.floor(seconds / 60); //Converting to minutes
  const hours = Math.floor(minutes / 60); //Converting to hours
  const days = Math.floor(hours / 24); //Converting to days.
  const weeks = Math.floor(days / 7); //Converting to weeks.
  return { seconds, minutes, hours, days, weeks };
};

const formatTime = (time) => {
  const date = new Date(time);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

function parseISODate(isoDate) {
  const date = new Date(isoDate);
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type).value;

  return {
    date: `${get("day")}-${get("month")}-${get("year")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day").value;
  const month = parts.find((p) => p.type === "month").value;
  const year = parts.find((p) => p.type === "year").value;
  return `${day} ${month} ${year}`;
};

const formatDate2 = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

const safeParseJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return fallback;
    return JSON.parse(item);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

export {
  safeParseJSON,
  timeRep,
  formatDate,
  formatDate2,
  formatTime,
  parseISODate,
  tryCatchWrapper,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
};
