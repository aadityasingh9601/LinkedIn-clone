import { create } from "zustand";
import { toast } from "react-toastify";
import { tryCatchWrapper, apiPost, apiDelete } from "../utils/helper";
import useUserStore from "./User";

const setAllConnections = useUserStore.getState().setAllConnections;

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

  removeConn: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/connection/${userId}`);
      console.log(response);
      let { user1, user2 } = response.data;
      if (response.status === 200) {
        //Update the state also.
        setAllConnections("remove", user1, user2);

        return toast.success("Connection removed!");
      }
    });
  },
}));

export default useConnectionStore;
