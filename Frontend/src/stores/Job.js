import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "./User";
import { persist } from "zustand/middleware";

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

      applyToJob: async (jobId, data, navigate) => {
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
            //Navigate.
            navigate("/jobs");
            return toast.success("Applied successfully!");
          }
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
      },

      getAllApplicants: async (jobId) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/jobs/${jobId}/applicants`,

            {
              withCredentials: true,
            }
          );
          console.log(response);
          if (response.status === 200) {
            set({ applicants: response.data });
          }
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
      },

      markAsReviewed: async (jobId, applicationId) => {
        try {
          const response = await axios.post(
            `http://localhost:8000/jobs/${jobId}/markReviewed/${applicationId}`,
            {},
            { withCredentials: true }
          );
          console.log(response);
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
      },

      fetchJobFitStats: async (jobId) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/jobs/${jobId}/jobfitstats`,

            { withCredentials: true }
          );
          console.log(response);
          if (response.status === 200) {
            //Update the state.
            set({ jobFitStats: response.data });
          }
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
      },

      unapplyFromJob: async (jobId) => {
        console.log(jobId);
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
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
      },

      deleteJob: async (jobId) => {
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

      rejectUserApplication: async (jobId, applicationId, navigate) => {
        console.log("inside deleteJob in job store.");
        console.log(jobId);
        try {
          const response = await axios.delete(
            `http://localhost:8000/jobs/${jobId}/reject/${applicationId}`,

            { withCredentials: true }
          );
          console.log(response);
          if (response.status === 200) {
            //Delete the application data from local storage and also update the state variable also.
            set((state) => ({
              applicants: state.applicants.filter((a) => a._id !== applicantId),
            }));

            navigate(`/jobs/${jobId}/applications`);
            return toast.success(response.data);
          }
        } catch (e) {
          console.log(e);
          return toast.error(e.message);
        }
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
