import { create } from "zustand";
import { toast } from "react-toastify";
import { safeParseJSON } from "../utils/helper";

import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useUserStore = create((set, get) => ({
  isLoggedIn: false,

  currUserId: safeParseJSON("currUserId", ""),

  checkAuthStatus: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet("/users/checkauthstatus", {
        _skipInterceptor: true,
      });
      console.log(response);

      if (response.status === 200) {
        set({ isLoggedIn: true, currUserId: response?.data.userId });
        localStorage.setItem("currUserId", response?.data.userId);
      }
    });
  },

  signUp: async (signupData, navigate, setIsLoading) => {
    tryCatchWrapper(async () => {
      setIsLoading(true);
      const response = await apiPost(`/users/signup`, { signupData }, {});
      setIsLoading(false);
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/login");
      }
    });
  },
  //If cookies are not setting in the browser in other ways, try sending them normally in a res.send object rather than
  //res.cookie & then use the cookie api on frontend to set them in the browser.
  login: async (loginData, navigate, setIsLoading) => {
    tryCatchWrapper(async () => {
      setIsLoading(true);
      const response = await apiPost(`/users/login`, { loginData }, {});
      setIsLoading(false);
      if (response.status === 200) {
        toast.success("User logged in successfully!");
        set({
          isLoggedIn: true,
          currUserId: response.data.id,
        });
        localStorage.setItem("currUserId", response.data.id);
        navigate("/home");
      }
    });
  },

  logout: async (userId, navigate) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/users/logout/${userId}`);
      if (response.status === 200) {
        localStorage.removeItem("currUserId");
        set({ isLoggedIn: false });
        navigate("/login");
      }
    });
  },

  //But storing all ids of posts liked by the user will cause error, as we can store only a limited amount of
  //data in our localStorage, so we'll store only those ids that are liked by the user and are present in the
  //current feed.
  allLikedPosts: new Set(safeParseJSON("allLikedPosts", [])),

  setAllLikedPosts: (action, postId) => {
    const likedPostIds = safeParseJSON("allLikedPosts", []);

    const likedSet = new Set(likedPostIds); //Create set from the array.

    if (action === "add") {
      likedSet.add(postId);
    }

    if (action === "remove") {
      likedSet.delete(postId);
    }
    // Update localStorage,Set isn't a plain JS object so we havae to serialize it like this in an array.
    localStorage.setItem("allLikedPosts", JSON.stringify([...likedSet]));

    // Update the state
    set({ allLikedPosts: likedSet });

    //console.log("Updated liked posts:", likedSet);
  },

  getAllLikedPosts: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/users/allLikedPosts`);
      //Save to local storage to persist state and to identify the posts liked by the user and update the state.
      let allLikedPosts = response.data;
      localStorage.setItem("allLikedPosts", JSON.stringify(allLikedPosts));
    });
  },

  allFollowed: new Set(safeParseJSON("allFollowed", [])),

  setAllFollowed: (action, userId) => {
    const followedUserIds = safeParseJSON("allFollowed", []);

    const followedSet = new Set(followedUserIds); //Create set from the array.

    if (action === "follow") {
      followedSet.add(userId);
    }

    if (action === "unfollow") {
      followedSet.delete(userId);
    }

    // Update localStorage,Set isn't a plain JS object so we havae to serialize it like this in an array.
    localStorage.setItem("allFollowed", JSON.stringify([...followedSet]));

    // Update the state
    set({ allFollowed: followedSet });

    //console.log("Updated followed :", followedSet);
  },

  getAllFollowed: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet("/follow/following");
      //console.log(response);
      //Save to local storage to persist state and to identify the users followed by the user.
      let allFollowed = response?.data?.map((f) => {
        return f.userFollowed._id;
      });

      localStorage.setItem("allFollowed", JSON.stringify(allFollowed));
    });
  },

  allConnections: new Set(safeParseJSON("allConnections", [])),

  setAllConnections: (action, userId1, userId2) => {
    const connectionsUserIds = safeParseJSON("allConnections", []);
    const connectionsSet = new Set(connectionsUserIds); //Create set from the array.
    const key = [userId1, userId2].sort().join("-");
    //We'll create a single unique key so it'll be easier to identify and look up for.

    if (action === "add") {
      connectionsSet.add(key);
    }

    if (action === "remove") {
      connectionsSet.delete(key);
    }

    // Update localStorage,Set isn't a plain JS object so we havae to serialize it like this in an array.
    localStorage.setItem("allConnections", JSON.stringify([...connectionsSet]));

    // Update the state
    set({ allConnections: connectionsSet });

    //console.log("Updated connections :", connectionsSet);
  },

  getAllConnections: async (userId) => {
    tryCatchWrapper(async () => {
      //console.log(userId);
      const response = await apiGet(`/connection/${userId}`);
      //console.log(response);
      //Save to local storage to persist state and to identify the users followed by the user.
      let allConnections = response?.data?.map((c) => {
        return [c.user, c.connectedUser].sort().join("-");
      });

      localStorage.setItem("allConnections", JSON.stringify(allConnections));
    });
  },
}));

export default useUserStore;
