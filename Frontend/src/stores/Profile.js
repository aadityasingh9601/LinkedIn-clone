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
const currUserProfile = useUserStore.getState().currUserProfile;
const logEvent = useAnalyticStore.getState().logEvent;
const currUserProfileId = useUserStore.getState().currUserProfileId;

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

  getProfileData: async (profileId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/profile/${profileId}`);
      //We'll persist the data of the current user's profile to use that later.
      if (profileId === currUserProfileId) {
        localStorage.setItem("currUserProfile", JSON.stringify(response.data));
        setCurrUserProfile(response.data);
      }
      set({ profile: response.data.userProfile });
      //LOGIC TO ENSURE THAT WHENEVER A USER VISITS SOME OTHER USER'S PROFILE, A EVENT GETS LOGGED IN THE
      //DATABASE, THAT CAN BE USED LATER TO SHOW ANALYTICS DATA.
      if (currUserProfile?._id !== profileId) {
        let eventData = {
          userId: response.data.userProfile.userId,
          eventType: "profile_view",
        };
        logEvent(eventData);
      }
    });
  },

  getProfiles: async (username) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/profile/allUsers?username=${username}`);
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
      const fd = new FormData();
      const { profileImage, bannerImage, ...textData } = profileHeaderData;
      fd.append("profileHeaderData", JSON.stringify(textData));
      if (profileImage instanceof File)
        fd.append("profileHeaderData[profileImage]", profileImage);
      if (bannerImage instanceof File)
        fd.append("profileHeaderData[bannerImage]", bannerImage);
      const response = await apiPatch(`/profile/header`, fd);

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
