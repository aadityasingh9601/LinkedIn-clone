import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const useAnalyticStore = create((set) => ({
  analyticsEvent: localStorage.getItem("analyticsEvent"),
  //Persisting state.

  setAnalyticsEvent: (value) => {
    localStorage.setItem("analyticsEvent", value);
    set({ analyticsEvent: value });
  },

  logEvent: async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `http://localhost:8000/analytics`,
        {
          eventData: data,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  },
}));

export default useAnalyticStore;
