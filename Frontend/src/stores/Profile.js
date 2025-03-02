import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const useProfileStore = create((set) => ({
  profile: {},

  currProfileUserId: localStorage.getItem("currProfileUserId"),

  updateCurrProfileUserId: (newId) => {
    set({ currProfileUserId: newId });
  },
}));

export default useProfileStore;
