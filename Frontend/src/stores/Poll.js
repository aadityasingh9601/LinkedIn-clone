import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const usePollStore = create((set) => ({
  poll: false,

  setPoll: (value) => {
    set({ poll: value });
  },

  createPoll: async (pollData) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/poll/create`,
        { pollData },
        {
          withCredentials: true,
        }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },
}));

export default usePollStore;
