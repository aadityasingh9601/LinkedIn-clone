import { create } from "zustand";
import { toast } from "react-toastify";
import useUserStore from "./User";
import { persist } from "zustand/middleware";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
  safeParseJSON,
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

      currJobListingId: safeParseJSON("currJobListingId"),

      setcurrJobListingId: (value) => {
        localStorage.setItem("currJobListingId", value);
        set({ currJobListingId: value });
      },

      createJob: async (jobData, setIsLoading) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(`/jobs/create`, { jobData }, {});
          if (response.status === 200) {
            set({ postJob: false });
            set((state) => ({
              jobs: [...state.jobs, response.data],
            }));
            return toast.success("Job posted successfully!");
          }
          setIsLoading(false);
        });
      },

      updateJob: async (jobData, jobId, setIsLoading) => {
        tryCatchWrapper(async () => {
          const response = await apiPatch(`/jobs/${jobId}`, { jobData }, {});
          if (response.status === 200) {
            set({ editJob: false });
            set((state) => ({
              jobs: state.jobs.map((job) => {
                return job._id === jobId ? response.data : job;
              }),
            }));
            return toast.success("Job updated successfully!");
          }
          setIsLoading(false);
        });
      },

      getAllJobs: async () => {
        tryCatchWrapper(async () => {
          const response = await apiGet("/jobs/alljobs");
          set({ jobs: response.data.jobs });
        });
      },

      getMyJobs: async (type) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/myjobs?q=${type}`);
          set({ jobs: response.data });
        });
      },

      applyToJob: async (jobId, data, navigate, setIsLoading) => {
        tryCatchWrapper(async () => {
          const fd = new FormData();
          const { resume, ...textData } = data;
          fd.append("jobApplicationData", JSON.stringify(textData));
          if (resume instanceof File) fd.append("data[resume]", resume);
          const response = await apiPost(`/jobs/${jobId}/apply`, fd);
          if (response.status === 200) {
            toast.success("Applied successfully!");
            navigate("/jobs");
          }
          setIsLoading(false);
        });
      },

      saveJob: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiPost(`/jobs/${jobId}/save`, {}, {});
          if (response.status === 200) {
            return toast.success(response.data);
          }
        });
      },

      getAllApplicants: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/${jobId}/applicants`);
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
            {},
          );
        });
      },

      getJobFitStats: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiGet(`/jobs/${jobId}/jobfitstats`);
          if (response.status === 200) {
            //Update the state.
            set({ jobFitStats: response.data });
          }
        });
      },

      unapplyFromJob: async (jobId) => {
        tryCatchWrapper(async () => {
          const response = await apiDelete(`/jobs/${jobId}/unapply`);
          if (response.status === 200) {
            set((state) => ({
              jobs: state.jobs.map((job) => {
                if (job._id === jobId) {
                  return {
                    ...job,
                    applicants: job.applications.filter(
                      (a) => a.applicant !== currUserId,
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
          const response = await apiDelete(
            `/jobs/${jobId}/reject/${applicationId}`,
          );
          if (response.status === 200) {
            //Delete the application data from local storage and also update the state variable also.
            set((state) => ({
              applicants: state.applicants.filter(
                (a) => a._id !== applicationId,
              ),
            }));

            navigate(`/jobs/${jobId}/applications`);
            return toast.success(response.data.message);
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
    },
  ),
);

export default useJobStore;
