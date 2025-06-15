import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";
import {
  tryCatchWrapper,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../utils/helper";

const logEvent = useAnalyticStore.getState().logEvent;
const currUserId = useUserStore.getState().currUserId;

const useProfileStore = create((set, get) => ({
  profile: {},

  editSkills: false,

  setEditSkills: (value) => {
    set({ editSkills: value });
  },

  addEducation: false,

  setAddEducation: (value) => {
    set({ addEducation: value });
  },

  addExperience: false,

  setAddExperience: (value) => {
    set({ addExperience: value });
  },

  editHead: false,

  setEditHead: (value) => {
    set({ editHead: value });
  },

  fetchProfileData: async (userId) => {
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
      set({ profile: response.data });
    });
  },

  createProfile: async (data) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/profile/${currUserId}`,
        { data },
        {
          "Content-Type": "multipart/form-data",
        }
      );
      console.log(response);
      if (response.status === 200) {
        if (data.skill) {
          set((state) => ({
            profile: {
              ...state.profile,
              skills: [...state.profile.skills, data.skill],
            },
          }));
        }

        if (data.education) {
          set((state) => ({
            profile: {
              ...state.profile,
              education: response.data.education,
            },
          }));
          get().setAddEducation(false);
        }

        if (data.experience) {
          set((state) => ({
            profile: {
              ...state.profile,
              experience: response.data.experience,
            },
          }));

          get().setAddExperience(false);
        } else {
          //Update the profile object here in a way that doesn't ruin performance of the app.

          set((state) => ({
            profile: {
              ...state.profile,
              name: response.data.name,
              headline: response.data.headline,
              location: response.data.location,
              contactInfo: response.data.contactInfo,
              profileImage: response.data.profileImage,
              bannerImage: response.data.bannerImage,
            },
          }));

          get().setEditHead(false);
        }

        return toast.success("Added successfully!");
      }
    });
  },

  editProfile: async (data) => {
    tryCatchWrapper(async () => {
      const { section, sectionId } = data;
      const response = await apiPatch(`/profile/${currUserId}`, { data }, {});
      console.log(response);
      if (response.status === 200) {
        if (section === "about") {
          return toast.success("Updated successfully");
        }

        if (section === "education") {
          set((state) => ({
            profile: { ...state.profile, education: response.data.education },
          }));
        }

        if (section === "experience") {
          set((state) => ({
            profile: { ...state.profile, experience: response.data.experience },
          }));
        }
        return toast.success("Updated successfully");
      }
    });
  },

  //Delete method doesn't supports a request body, so we are using query parameters instead.
  deleteProfile: async (data) => {
    tryCatchWrapper(async () => {
      let { skill, section, sectionId } = data;
      const response = await apiDelete(
        `/profile/${currUserId}?skill=${skill}&section=${section}&sectionId=${sectionId}`
      );
      console.log(response);
      if (response.status === 200) {
        if (skill) {
          set((state) => ({
            profile: {
              ...state.profile,
              skills: state.skills?.filter((s) => s !== skill),
            },
          }));
        }

        if (section === "education") {
          set((state) => ({
            profile: {
              ...state.profile,
              education: state.profile.education.filter(
                (e) => e._id !== sectionId
              ),
            },
          }));
        }

        if (section === "experience") {
          console.log("triggered");
          set((state) => ({
            profile: {
              ...state.profile,
              experience: state.profile.experience.filter(
                (e) => e._id !== sectionId
              ),
            },
          }));
        }

        return toast.success("Deleted successfully!");
      }
    });
  },
}));

export default useProfileStore;
