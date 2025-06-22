//Only store those functions in here that are used in multiple files throughout the codebase, store the state specific logic and actions in
//their respective zustand stores only.
import { toast } from "react-toastify";
import { BACKEND_URL } from "./config";
import axios from "axios";
import useUserStore from "../stores/User";
const { newAccessToken } = useUserStore.getState();

const apiGet = async (endPoint) => {
  const response = await axios.get(`${BACKEND_URL}${endPoint}`, {
    withCredentials: true,
  });
  return response;
};

const apiPost = async (endPoint, reqBody, reqHeaders) => {
  //console.log(reqHeaders);
  const response = await axios.post(
    `${BACKEND_URL}${endPoint}`,
    reqBody,

    {
      headers: reqHeaders,
      withCredentials: true,
    }
  );

  return response;
};

const apiPatch = async (endPoint, reqBody, reqHeaders) => {
  const response = await axios.patch(`${BACKEND_URL}${endPoint}`, reqBody, {
    headers: reqHeaders,
    withCredentials: true,
  });
  return response;
};

const apiDelete = async (endPoint) => {
  const response = await axios.delete(`${BACKEND_URL}${endPoint}`, {
    withCredentials: true,
  });
  return response;
};

const tryCatchWrapper = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    console.log(err);
    if (err.response.status === 401) {
      newAccessToken();
      return toast.error("Something went wrong! Please try again.");
    }
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
  const options = { weekday: "short", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const hours = date.getHours().toString().padStart(2, "0"); //padStart 2 to ensure numbers are atleast two
  const minutes = date.getMinutes().toString().padStart(2, "0"); //digits long by adding leading zeroes.

  return `${formattedDate.replace(",", "")} at ${hours}:${minutes}`;
};

export {
  timeRep,
  formatDate,
  formatDate2,
  parseISODate,
  tryCatchWrapper,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
};
