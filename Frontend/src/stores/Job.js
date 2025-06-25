import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "./User";
import { persist } from "zustand/middleware";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const currUserId = useUserStore.getState().currUserId;

const useJobStore = create(
  persist(
    (set, get) => ({
      jobs: [],

      applicants: [],

      jobFitStats: {},

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

      createJob: async (jobData) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(`/jobs/create`, { jobData }, {});
          console.log(response);
          if (response.status === 200) {
            set({ postJob: false });
            set((state) => ({
              jobs: [...state.jobs, response.data],
            }));
            return toast.success("Job posted successfully!");
          }
        });
      },

      updateJob: async (jobData, jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiPatch(`/jobs/${jobId}`, { jobData }, {});
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
        });
      },

      fetchAllJobs: async () => {
        tryCatchWrapper(async () => {
          const response = await apiGet("/jobs/alljobs");
          console.log(response);
          //Update the state variable here accordingly.
          set({ jobs: response.data });
        });
      },

      fetchMyJobs: async (type) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/myjobs?q=${type}`);
          set({ jobs: response.data });
        });
      },

      applyToJob: async (jobId, data, navigate) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(
            `/jobs/${jobId}/apply`,
            { data },
            {
              "Content-Type": "multipart/form-data",
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
            //Navigate.
            navigate("/jobs");
            return toast.success("Applied successfully!");
          }
        });
      },

      saveJob: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(`/jobs/${jobId}/save`, {}, {});
          console.log(response);
          if (response.status === 200) {
            return toast.success(response.data);
          }
        });
      },

      getAllApplicants: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/${jobId}/applicants`);
          console.log(response);
          if (response.status === 200) {
            set({ applicants: response.data });
          }
        });
      },

      markAsReviewed: async (jobId, applicationId) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(
            `/jobs/${jobId}/markReviewed/${applicationId}`,
            {},
            {}
          );
          console.log(response);
        });
      },

      fetchJobFitStats: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/${jobId}/jobfitstats`);
          console.log(response);
          if (response.status === 200) {
            //Update the state.
            set({ jobFitStats: response.data });
          }
        });
      },

      unapplyFromJob: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiDelete(`/jobs/${jobId}/unapply`);
          console.log(response);
          if (response.status === 200) {
            set((state) => ({
              jobs: state.jobs.map((job) => {
                if (job._id === jobId) {
                  return {
                    ...job,
                    applicants: job.applications.filter(
                      (a) => a.applicant !== currUserId
                    ),
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
        });
      },

      deleteJob: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiDelete(`/jobs/${jobId}`);
          console.log(response);
          if (response.status === 200) {
            set((state) => ({
              jobs: state.jobs.filter((j) => j._id !== jobId),
            }));
            return toast.success("Job deleted successfully!");
          }
        });
      },

      rejectUserApplication: async (jobId, applicationId, navigate) => {
        tryCatchWrapper(async () => {
          console.log(jobId, applicationId);
          const response = await apiDelete(
            `/jobs/${jobId}/reject/${applicationId}`
          );
          console.log(response);
          if (response.status === 200) {
            //Delete the application data from local storage and also update the state variable also.
            set((state) => ({
              applicants: state.applicants.filter(
                (a) => a._id !== applicationId
              ),
            }));

            navigate(`/jobs/${jobId}/applications`);
            return toast.success(response.data);
          }
        });
      },
    }),
    {
      name: "job-store", // Key in localStorage
      partialize: (state) => ({
        jobs: state.jobs,
        applicants: state.applicants,
      }),
    }
  )
);

export default useJobStore;
