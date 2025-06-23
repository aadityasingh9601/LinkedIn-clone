import { create } from "zustand";
import { tryCatchWrapper, apiPost, apiGet } from "../utils/helper";

const useAnalyticStore = create((set, get) => ({
  analyticsEvent: localStorage.getItem("analyticsEvent"),

  analyticsData: [],

  fetchData: async (range) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(
        `/analytics?q1=${get().analyticsEvent}&q2=${range}`
      );
      console.log(response);
      set({ analyticsData: response.data });
    });
  },

  setAnalyticsEvent: (value) => {
    localStorage.setItem("analyticsEvent", value);
    set({ analyticsEvent: value });
  },

  logEvent: async (data) => {
    tryCatchWrapper(async () => {
      const response = await apiPost("/analytics", { eventData: data }, {});
      console.log(response);
    });
  },
}));

export default useAnalyticStore;
