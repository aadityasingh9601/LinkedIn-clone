import { create } from "zustand";
import { toast } from "react-toastify";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";
import {
  tryCatchWrapper,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  safeParseJSON,
} from "../utils/helper";

const setCurrUserProfile = useUserStore.getState().setCurrUserProfile;
const logEvent = useAnalyticStore.getState().logEvent;
const currUserId = useUserStore.getState().currUserId;

const useProfileStore = create((set, get) => ({
  profile: {},

  userProfiles: [],

  editSkills: false,

  setEditSkills: (value) => {
    set({ editSkills: value });
  },

  editHead: false,

  setEditHead: (value) => {
    set({ editHead: value });
  },

  editAbout: false,

  setEditAbout: (value) => {
    set({ editAbout: value });
  },

  //Create separate methods here for updating profilehead, skills, about, experience etc sections.

  getProfileData: async (userId) => {
    tryCatchWrapper(async () => {
      //LOGIC TO ENSURE THAT WHENEVER A USER VISITS SOME OTHER USER'S PROFILE, A EVENT GETS LOGGED IN THE
      //DATABASE, THAT CAN BE USED LATER TO SHOW ANALYTICS DATA.

      if (currUserId !== userId) {
        let eventData = {
          userId: userId,
          eventType: "profile_view",
        };
        logEvent(eventData);
      }
      const response = await apiGet(`/profile/${userId}`);
      console.log(response);
      //We'll persist the data of the current user's profile to use that later.
      if (userId === currUserId) {
        localStorage.setItem("currUserProfile", JSON.stringify(response.data));
        setCurrUserProfile(response.data);
      }
      set({ profile: response.data.userProfile });
    });
  },

  getProfiles: async (username) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/profile/allUsers?username=${username}`);
      console.log(response);
      if (response.status === 200) {
        set({ userProfiles: response.data });

        let eventData = {
          eventType: "search_appearance",
          users: response.data.map((u) => {
            return u.userId;
          }),
        };

        logEvent(eventData);
      }

      if (response.status === 404) {
        setUserProfiles("No users found!");
      }
    });
  },

  updateProfileHeader: async (profileHeaderData, setIsLoading) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/profile/header`,
        { profileHeaderData },
        {
          "Content-Type": "multipart/form-data",
        },
      );
      console.log(response.data.updatedData);

      if (response.status === 200) {
        set((state) => ({
          profile: { ...state.profile, ...response?.data?.updatedData },
        }));
        setIsLoading(false);
        set({ editHead: false });
        return toast.success(response?.data?.message);
      }
    });
  },

  updateProfileAbout: async (data, setIsLoading) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPatch(`/profile/about`, { data }, {});
      console.log(response);

      if (response.status === 200) {
        set((state) => ({
          profile: { ...state.profile, about: response?.data?.updatedData },
        }));
        setIsLoading(false);
        set({ editAbout: false });
        return toast.success(response?.data?.message);
      }
    });
  },

  addNewSkill: async (newSkill, setIsLoading) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPost(`/profile/skills`, { newSkill }, {});
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            skills: [...state.profile.skills, newSkill],
          },
        }));
        setIsLoading(false);
        return toast.success(response?.data?.message);
      }
    });
  },

  deleteSkill: async (skill) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/profile/skills?skill=${skill}`, {});
      console.log(response);

      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            skills: state.profile.skills?.filter((s) => s !== skill),
          },
        }));
        return toast.success(response?.data?.message);
      }
    });
  },

  addEducation: async (educationData, setIsLoading) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/profile/education`,
        { educationData },
        {},
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            education: [
              ...state.profile.education,
              response?.data?.newEducation,
            ],
          },
        }));
        setIsLoading(false);
        return toast.success(response?.data?.message);
      }
    });
  },

  updateEducation: async (
    educationId,
    educationData,
    setIsLoading,
    setEdit,
  ) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/profile/education/${educationId}`,
        { educationData },
        {},
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            education: state.profile.education.map((edu) =>
              edu._id === educationId ? response.data.updatedEducation : edu,
            ),
          },
        }));
        setIsLoading(false);
        setEdit(false);
        return toast.success(response?.data?.message);
      }
    });
  },

  deleteEducation: async (educationId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/profile/education/${educationId}`, {});
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            education: state.profile.education.filter(
              (e) => e._id !== educationId,
            ),
          },
        }));
        return toast.success(response?.data?.message);
      }
    });
  },

  addExperience: async (experienceData, setIsLoading) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/profile/experience`,
        { experienceData },
        {},
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            experience: [
              ...state.profile.experience,
              response?.data?.newExperience,
            ],
          },
        }));
        setIsLoading(false);
        return toast.success(response?.data?.message);
      }
    });
  },

  updateExperience: async (
    experienceId,
    experienceData,
    setIsLoading,
    setEdit,
  ) => {
    setIsLoading(true);
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/profile/experience/${experienceId}`,
        { experienceData },
        {},
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            experience: state.profile.experience.map((edu) =>
              edu._id === experienceId ? response.data.updatedExperience : edu,
            ),
          },
        }));
        setIsLoading(false);
        setEdit(false);
        return toast.success(response?.data?.message);
      }
    });
  },

  deleteExperience: async (experienceId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(
        `/profile/experience/${experienceId}`,
        {},
      );
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          profile: {
            ...state.profile,
            experience: state.profile.experience.filter(
              (e) => e._id !== experienceId,
            ),
          },
        }));
        return toast.success(response?.data?.message);
      }
    });
  },
}));

export default useProfileStore;
