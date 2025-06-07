import { create } from "zustand";
import { toast } from "react-toastify";
import { tryCatchWrapper, apiPost } from "../utils/helper";

const useConnectionStore = create((set, get) => ({
  sendConnReq: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/connection/${userId}`, {}, {});
      console.log(response);
      if (response.status === 200) {
        return toast.success("Connection request sent!");
      }
    });
  },
}));

export default useConnectionStore;
