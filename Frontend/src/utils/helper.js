//Only store those functions in here that are used in multiple files throughout the codebase, store the state specific logic and actions in
//their respective zustand stores only.
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../stores/User";
const { newAccessToken } = useUserStore.getState();
import axiosInstance from "./api/axiosInstance";

const BE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const apiGet = async (endPoint, headers = {}) => {
  const response = await axiosInstance.get(`${endPoint}`, {
    ...headers,
  });
  return response;
};

const apiPost = async (endPoint, reqBody, reqHeaders) => {
  //console.log(reqHeaders);
  const response = await axiosInstance.post(`${endPoint}`, reqBody, {
    headers: reqHeaders,
  });

  return response;
};

const apiPatch = async (endPoint, reqBody, reqHeaders) => {
  const response = await axiosInstance.patch(`${endPoint}`, reqBody, {
    headers: reqHeaders,
  });
  return response;
};

const apiDelete = async (endPoint) => {
  const response = await axiosInstance.delete(`${endPoint}`);
  return response;
};

const tryCatchWrapper = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    //This logic is very shallow & error prone here, not at all applicable & scalable for all routes. Optimize this to use
    //this one for all the routes effectively.
    console.log(err);
    return toast.error(err);
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
  // Convert the string into a Date object
  const date = new Date(time);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12

  // Format the minutes with leading zero if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Combine the results
  const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
  //console.log(formattedTime);
  return formattedTime;
};

function parseISODate(isoDate) {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}`,
  };
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDate2 = (isoDate) => {
  const date = new Date(isoDate);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

export {
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
