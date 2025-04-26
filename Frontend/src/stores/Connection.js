import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";

const logEvent = useAnalyticStore.getState().logEvent;
const currUserId = useUserStore.getState().currUserId;

const useConnectionStore = create((set, get) => ({
  sendConnReq: async (userId) => {
    console.log(userId);
    try {
      let response = await axios.post(
        `http://localhost:8000/connection/${userId}`,
        {},
        {
          withCredentials: true, // This includes cookies and credentials in the request, and our cookie has our
          //token in it, so we don't need to send our headers anymore.
        }
      );

      console.log(response);
      if (response.status === 200) {
        return toast.success("Connection request sent!");
      }
    } catch (err) {
      console.log(err);
    }
  },
}));

export default useConnectionStore;
