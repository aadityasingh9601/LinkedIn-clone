import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import usePostStore from "./Post";

const setPostFormModal = usePostStore.getState().setPostFormModal;

const usePollStore = create((set) => ({
  poll: false,

  polls: [],

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
      //Update the polls state variable.
      set((state) => ({
        polls: [...state.polls, response.data],
      }));

      if (response.status === 201) {
        setPostFormModal(false);
        return toast.success("Poll created successfully!");
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  fetchAllPolls: async () => {
    console.log("inside fetchAllPolls in the zustand store");
    try {
      const response = await axios.get(
        `http://localhost:8000/poll/all`,

        {
          withCredentials: true,
        }
      );

      //console.log(response);
      if (response.status === 200) {
        set({ polls: response.data });
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  voteInPoll: async (pollId, optionId) => {
    console.log("inside voteInPoll in the zustand store");
    try {
      const response = await axios.post(
        `http://localhost:8000/poll/${pollId}/vote/${optionId}`,
        {},
        {
          withCredentials: true,
        }
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
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  unVote: async (pollId) => {
    console.log("inside unvote in the zustand store");
    try {
      const response = await axios.post(
        `http://localhost:8000/poll/${pollId}/unvote`,
        {},
        {
          withCredentials: true,
        }
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
        return false;
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  checkVote: async (pollId) => {
    console.log("inside checkVote in the zustand store");
    try {
      const response = await axios.get(
        `http://localhost:8000/poll/${pollId}/checkvote`,

        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.data === "Yes") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  deletePoll: async (pollId) => {
    console.log("inside deletePoll in the zustand store");
    try {
      const response = await axios.delete(
        `http://localhost:8000/poll/${pollId}/delete`,

        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          polls: state.polls.filter((p) => p._id !== pollId),
        }));
      }
      return toast.success(response.data);
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },
}));

export default usePollStore;
