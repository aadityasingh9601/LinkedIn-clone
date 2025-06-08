import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import usePostStore from "./Post";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const setPostFormModal = usePostStore.getState().setPostFormModal;

const usePollStore = create((set) => ({
  poll: false,

  polls: [],

  setPoll: (value) => {
    set({ poll: value });
  },

  createPoll: async (pollData) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/poll/create`, { pollData }, {});
      console.log(response);
      //Update the polls state variable.
      set((state) => ({
        polls: [...state.polls, response.data],
      }));

      if (response.status === 201) {
        setPostFormModal(false);
        return toast.success("Poll created successfully!");
      }
    });
  },

  fetchAllPolls: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet("/poll/all");
      if (response.status === 200) {
        set({ polls: response.data });
      }
    });
  },

  voteInPoll: async (pollId, optionId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/poll/${pollId}/vote/${optionId}`,
        {},
        {}
      );
      console.log(response);
      if (response.status === 200) {
        //Update the poll voters and options votes carefully.
        set((state) => ({
          polls: state.polls.map((poll) =>
            poll._id === pollId
              ? {
                  ...poll,
                  voters: response.data.voters,
                  options: response.data.options,
                }
              : poll
          ),
        }));
      }
    });
  },

  unVote: async (pollId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/poll/${pollId}/unvote`, {}, {});
      console.log(response);
      if (response.status === 200) {
        //Update the poll voters and options votes carefully.
        set((state) => ({
          polls: state.polls.map((poll) =>
            poll._id === pollId
              ? {
                  ...poll,
                  voters: response.data.voters,
                  options: response.data.options,
                }
              : poll
          ),
        }));
        return false;
      }
    });
  },

  checkVote: async (pollId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/poll/${pollId}/checkvote`);
      console.log(response);
      if (response.data === "Yes") {
        return true;
      } else {
        return false;
      }
    });
  },

  deletePoll: async (pollId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/poll/${pollId}/delete`);
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          polls: state.polls.filter((p) => p._id !== pollId),
        }));
      }
      return toast.success(response.data);
    });
  },
}));

export default usePollStore;
