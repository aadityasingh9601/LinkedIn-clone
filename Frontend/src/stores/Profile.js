import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import useAnalyticStore from "./Analytic";
import useUserStore from "./User";

const logEvent = useAnalyticStore.getState().logEvent;
const currUserId = useUserStore.getState().currUserId;

const useProfileStore = create((set, get) => ({
  profile: {},

  newSkill: "",

  setNewSkill: (value) => {
    set({ newSkill: value });
  },

  editSkills: false,

  setEditSkills: (value) => {
    set({ editSkills: value });
  },

  editAbout: false,

  setEditAbout: (value) => {
    set({ editAbout: value });
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
    //LOGIC TO ENSURE THAT WHENEVER A USER VISITS SOME OTHER USER'S PROFILE, A EVENT GETS LOGGED IN THE
    //DATABASE, THAT CAN BE USED LATER TO SHOW ANALYTICS DATA.

    if (currUserId !== userId) {
      let eventData = {
        userId: userId,
        eventType: "profile_view",
      };
      logEvent(eventData);
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/profile/${userId}`,
        { withCredentials: true }
      );

      console.log(response);
      set({ profile: response.data });
    } catch (err) {
      console.log(err);
      return toast.err(err.message);
    }
  },

  createProfile: async (data) => {
    console.log(data);

    try {
      const response = await axios.post(
        `http://localhost:8000/profile/${currUserId}`,
        {
          data,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
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
          get().setNewSkill("");
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

          set().setAddExperience(false);
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
    } catch (err) {
      console.log(err);
    }
  },

  editProfile: async (data) => {
    console.log(data);
    const { section, sectionId } = data;
    try {
      const response = await axios.patch(
        `http://localhost:8000/profile/${currUserId}`,
        { data },
        { withCredentials: true }
      );

      console.log(response);
      if (response.status === 200) {
        if (section === "about") {
          get().setEditAbout(false);
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
    } catch (err) {
      console.log(err);
    }
  },

  //Delete method doesn't supports a request body, so we are using query parameters instead.
  deleteProfile: async (data) => {
    let { skill, section, sectionId } = data;

    try {
      const response = await axios.delete(
        `http://localhost:8000/profile/${currUserId}?skill=${skill}&section=${section}&sectionId=${sectionId}`,

        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        if (skill) {
          set((state) => ({
            profile: {
              ...state.profile,
              skills: prevProfile.skills.filter((s) => s !== skill),
            },
          }));

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
      }
    } catch (err) {
      console.log(err);
    }
  },

  handleChange1: (e) => {
    set((state) => ({
      profile: { ...state.profile, [e.target.name]: e.target.value },
    }));
  },
}));

export default useProfileStore;
