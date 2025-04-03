import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";

const logEvent = useAnalyticStore.getState().logEvent;
const currUserId = useUserStore.getState().currUserId;

const useProfileStore = create((set, get) => ({
  profile: {},

  fetchProfileData: async (userId) => {
    //LOGIC TO ENSURE THAT WHENEVER A USER VISITS SOME OTHER USER'S PROFILE, A EVENT GETS LOGGED IN THE
    //DATABASE, THAT CAN BE USED LATER TO SHOW ANALYTICS DATA.

    if (currUserId !== userId) {
      let eventData = {
        userId: userId,
        eventType: "profile_view",
      };
      logEvent(eventData);
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/profile/${userId}`,
        { withCredentials: true }
      );

      console.log(response);
      set({ profile: response.data });
    } catch (err) {
      console.log(err);
      return toast.err(err.message);
    }
  },

  handleChange1: (e) => {
    set((state) => ({
      profile: { ...state.profile, [e.target.name]: e.target.value },
    }));
  },
}));

export default useProfileStore;
