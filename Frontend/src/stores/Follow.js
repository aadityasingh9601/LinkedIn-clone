import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAnalyticStore from "./Analytic";

const logEvent = useAnalyticStore.getState().logEvent;

const useFollowStore = create((set) => ({
  isFollowed: false,

  checkFollow: async function (userId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/follow/checkfollow/${userId}`,
        {
          withCredentials: true,
        }
      );

      //console.log(response);
      if (response.data === "yes") {
        set({ isFollowed: true });
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  follow: async (userId) => {
    let eventData = {
      userId: userId,
      eventType: "follower",
    };
    logEvent(eventData);
    console.log(userId);
    try {
      const response = await axios.post(
        `http://localhost:8000/follow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        set({ isFollowed: true });
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  unfollow: async (userId) => {
    //console.log(userId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/follow/${userId}`,

        {
          withCredentials: true,
        }
      );
      //console.log(response);
      if (response.status === 200) {
        set({ isFollowed: false });
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },
}));

export default useFollowStore;
