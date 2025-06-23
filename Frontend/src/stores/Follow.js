import { create } from "zustand";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";
import { tryCatchWrapper, apiDelete, apiPost } from "../utils/helper";

const setAllFollowed = useUserStore.getState().setAllFollowed;

const logEvent = useAnalyticStore.getState().logEvent;

const useFollowStore = create((set) => ({
  follow: async (userId, updateIsFollowed) => {
    let eventData = {
      userId: userId,
      eventType: "follower",
    };
    logEvent(eventData);
    tryCatchWrapper(async () => {
      const response = await apiPost(`/follow/${userId}`, {}, {});
      if (response.status === 200) {
        setAllFollowed("follow", userId);
        updateIsFollowed(true);
      }
    });
  },

  unfollow: async (userId, updateIsFollowed) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/follow/${userId}`);
      if (response.status === 200) {
        setAllFollowed("unfollow", userId);
        updateIsFollowed(false);
      }
    });
  },
}));

export default useFollowStore;
