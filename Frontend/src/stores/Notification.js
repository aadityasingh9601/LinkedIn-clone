import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "./User";

import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useNotificationStore = create((set) => ({
  notifications: [],

  notiCount: 0,

  setNotiCount: (value) => {
    //console.log(value);
    set({ notiCount: value });
  },

  addNoti: (noti) => {
    set((state) => ({
      notifications: [...state.notifications, noti],
    }));
  },

  handleConnRes: async (noti, action) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/connection/respond/${noti.sender}`,
        { response: action, notiId: noti._id },
        {}
      );

      console.log(response);
      if (response.status === 200) {
        //Update the state as well.
        set((state) => ({
          notifications: state.notifications.filter((n) => n._id !== noti._id),
        }));
      }
    });
  },

  fetchNotifications: async function () {
    tryCatchWrapper(async () => {
      const response = await apiGet("/notification");
      set({ notifications: response.data });
    });
  },

  markAsRead: async function () {
    tryCatchWrapper(async () => {
      const response = await apiPatch(`/notification/markasread`, {}, {});
      set((state) => ({
        notifications: state.notifications.map((noti) => {
          return { ...noti, isRead: true };
        }),
      }));
    });
  },

  deleteNoti: async function (id) {
    tryCatchWrapper(async () => {
      const response = apiDelete(`/notification/${id}`);
      //Update the state as well.
      set((state) => ({
        notifications: state.notifications.filter((noti) => noti._id !== id),
      }));
    });
  },
}));

export default useNotificationStore;
