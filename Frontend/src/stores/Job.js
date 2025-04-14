import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "./User";

const currUserId = useUserStore.getState().currUserId;

const useJobStore = create((set) => ({
  jobs: [],

  postJob: false,

  setpostJob: (value) => {
    set({ postJob: value });
  },

  editJob: false,

  seteditJob: (value) => {
    set({ editJob: value });
  },

  currJobListingId: localStorage.getItem("currJobListingId"),

  setcurrJobListingId: (value) => {
    localStorage.setItem("currJobListingId", value);
    set({ currJobListingId: value });
  },

  applied: false,

  setApplied: (value) => {
    set({ applied: value });
  },

  createJob: async (jobData) => {
    console.log("inside createJob in job store.");
    try {
      const response = await axios.post(
        `http://localhost:8000/jobs/create`,
        {
          jobData,
        },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        set({ postJob: false });
        set((state) => ({
          jobs: [...state.jobs, response.data],
        }));
        return toast.success("Job posted successfully!");
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  updateJob: async (jobData, jobId) => {
    console.log("inside updateJob in job store.");
    try {
      const response = await axios.patch(
        `http://localhost:8000/jobs/${jobId}`,
        {
          jobData,
        },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        set({ editJob: false });
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job._id === jobId ? { ...job, ...response.data } : job
          ),
        }));
        return toast.success("Job updated successfully!");
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  fetchAllJobs: async () => {
    console.log("inside fetchJob in job store.");
    try {
      const response = await axios.get(
        `http://localhost:8000/jobs/alljobs`,

        { withCredentials: true }
      );
      console.log(response);

      //Update the state variable here accordingly.

      set({ jobs: response.data });
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  fetchMyJobs: async () => {
    console.log("inside fetchMyJobs in job store.");
    try {
      const response = await axios.get(
        `http://localhost:8000/jobs/myjobs`,

        { withCredentials: true }
      );
      console.log(response);

      //Update the state variable here accordingly.

      set({ jobs: response.data });
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  applyToJob: async (jobId, data) => {
    console.log(jobId, data);
    try {
      const response = await axios.post(
        `http://localhost:8000/jobs/${jobId}/apply`,
        { data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          jobs: state.jobs.map((job) => {
            if (job._id === jobId) {
              return { ...job, applicants: response.data };
            } else {
              return job;
            }
          }),
        }));
        return toast.success("Applied successfully!");
      }
      if (response.status === 404) {
        return toast.warn(response.data);
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  appliedStatus: async (jobId) => {
    console.log("inside appliedStatus in job store.");
    console.log(jobId);
    try {
      const response = await axios.get(
        `http://localhost:8000/jobs/${jobId}/checkapplied`,

        { withCredentials: true }
      );
      console.log(response);
      if (response.data === "yes") {
        set({ applied: true });
      }
      if (response.data === "no") {
        set({ applied: false });
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  unapplyFromJob: async (jobId) => {
    console.log("inside unapplyfrom job in the store.");
    try {
      const response = await axios.delete(
        `http://localhost:8000/jobs/${jobId}/unapply`,

        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          jobs: state.jobs.map((job) => {
            if (job._id === jobId) {
              return {
                ...job,
                applicants: job.applicants.filter((a) => a._id !== currUserId),
              };
            }
            return job;
          }),
        }));
        return toast.success("Unapplied!");
      }
      if (response.status === 404) {
        return toast.warn(response.data);
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  deleteJob: async (jobId) => {
    console.log("inside deleteJob in job store.");
    console.log(jobId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/jobs/${jobId}`,

        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          jobs: state.jobs.filter((j) => j._id !== jobId),
        }));
        return toast.success("Job deleted successfully!");
      }
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },
}));

export default useJobStore;
