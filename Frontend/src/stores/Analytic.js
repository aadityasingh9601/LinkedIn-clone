import { create } from "zustand";
import { tryCatchWrapper, apiPost } from "../utils/helper";

const useAnalyticStore = create((set) => ({
  analyticsEvent: localStorage.getItem("analyticsEvent"),
  //Persisting state.

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
