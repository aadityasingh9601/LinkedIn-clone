import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "./User";
const newAccessToken = useUserStore.getState().newAccessToken;

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
    if (noti.notiType === "connection") {
      try {
        const response = await axios.post(
          `http://localhost:8000/connection/respond/${noti.sender}`,
          { response: action, to: noti.sender, notiId: noti._id },
          {
            withCredentials: true,
          }
        );
        console.log(response);
        if (response.status === 200) {
          //Update the state as well.
          set((state) => ({
            notifications: state.notifications.filter(
              (n) => n._id !== noti._id
            ),
          }));
        }
      } catch (err) {
        console.log(err);
        alert("Failed to accept or reject request");
        return;
      }
    }
  },

  fetchNotifications: async function () {
    try {
      let response = await axios.get(
        "http://localhost:8000/notification",

        {
          withCredentials: true,
        }
      );
      // console.log(response.data);
      set({ notifications: response.data });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  markAsRead: async function () {
    try {
      const response = await axios.patch(
        `http://localhost:8000/notification/markasread`,
        {},
        {
          withCredentials: true,
        }
      );
      //  console.log(response);
    } catch (err) {
      console.log(err);

      return toast.err(err.message);
    }

    //The whole issue of why the notiCount was updating here, all in this function shown below,because what
    //happening was that the useEffect function written in the app.jsx component was re-rendering each time
    //as the notifications state variable was updating, so when a new notification came , it got re-rendered
    //the value of unreadOnes also got updated & call went to the setNotiCount function with whatever value of
    //unreadOnes.length was , so also in the useEffect written in notificationBox.jsx first call went to
    //setNotiCount(0) & state got updated properly as u wished for, but , in the same useEffect , call was also
    //going to the markAsRead function whose job was to update the notifications isRead field on the backend
    //in the database, and as it successfully gets updated on the backend response came to the frontend &
    //according to the response , the state , notifications also gets updated on the frontend , but the issue
    //was that the state notifications was getting updated, & triggering a re-render of useEffect of the app.jsx
    //but the problem was that in the function below I was updating the state incorrectly, instead of writing
    // "isRead:true" , I wrote, "read:true" & so ultimately notifications's isRead didn't got updated, but
    //the useEffect was triggered in app.jsx because of notifications updation, so request was going again
    //to the setNotiCount in the store, with the wrong value of unreadOnes(wrong because isRead was not really
    //updated, so, the notiCount got set again to the unreadOnes.length, whatever it's current value was) &
    //that's why all this issue was occuring.
    set((state) => ({
      notifications: state.notifications.map((noti) => {
        return { ...noti, isRead: true };
      }),
    }));
  },

  deleteNoti: async function (id) {
    try {
      const response = await axios.delete(
        `http://localhost:8000/notification/${id}`,

        {
          withCredentials: true,
        }
      );
      // console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }

    //Update the state as well.
    set((state) => ({
      notifications: state.notifications.filter((noti) => noti._id !== id),
    }));
  },
}));

export default useNotificationStore;
