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
  console.log(reqHeaders);
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
    return toast.err(err.message);
  }
};

const timeRep = (time) => {
  const seconds = Math.floor(time / 1000); //Converting to seconds
  const minutes = Math.floor(seconds / 60); //Converting to minutes
  const hours = Math.floor(minutes / 60); //Converting to hours
  const days = Math.floor(hours / 24); //Converting to days.
  return { seconds, minutes, hours, days };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export {
  timeRep,
  formatDate,
  tryCatchWrapper,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
};
