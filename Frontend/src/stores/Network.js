import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useNetworkStore = create((set) => ({
  network: [],

  fetchNetwork: async (type, currUserId) => {
    tryCatchWrapper(async () => {
      const endpoint =
        type === "followers"
          ? "/follow/followers"
          : type === "following"
          ? "/follow/following"
          : type === "connections"
          ? `/connection/${currUserId}`
          : null;

      const response = await apiGet(endpoint);
      set({ network: response.data });
    });
  },

  handleRemove: async (type, id) => {
    tryCatchWrapper(async () => {
      const endpoint =
        type === "followers"
          ? `/follow/${id}/remove`
          : type === "following"
          ? `/follow/${id}`
          : type === "connections"
          ? `/connection/${id}`
          : null;

      const response = await apiDelete(endpoint);
      console.log(response.data);

      if (response.status === 200) {
        set((state) => ({
          network: state.network.filter(
            (item) => item._id !== response.data.deletedId
          ),
        }));
        toast.success(
          type === "followers"
            ? "Follower removed!"
            : type === "following"
            ? "Unfollowed successfully!"
            : type === "connections"
            ? "Connection removed!"
            : null
        );
      }
    });
  },
}));

export default useNetworkStore;
