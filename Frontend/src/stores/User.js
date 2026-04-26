import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useUserStore = create((set, get) => ({
  //We're persisting our state here by storing it in localStorage
  isLoggedIn: localStorage.getItem("isLoggedIn"),

  setIsLoggedIn: (value) => {
    set({ isLoggedIn: value });
  },

  currUserId: localStorage.getItem("currUserId"),

  isSetupComplete: localStorage.getItem("isSetupComplete"),

  setIsSetupComplete: (value) => {
    set({ isSetupComplete: value });
  },

  checkAuthStatus: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/users/checkauthstatus/${currUserId}`);
      setIsSetupComplete(response.data.isSetupComplete);
      console.log("checkAuthStatus", response);
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
      if (response.status === 401) {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
  },

  signUp: async (signupData, navigate) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/users/signup`, { signupData }, {});
      console.log(response.request.status);
      if (response.request.status === 201) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.warn(response.data.message);
      }
    });
  },

  login: async (loginData, navigate) => {
    tryCatchWrapper(async () => {
      console.log(loginData);
      const response = await apiPost(`/users/login`, { loginData }, {});
      console.log(response);
      if (response.status === 200) {
        toast.success("User logged in successfully!");
        set({ isLoggedIn: true, currUserId: response.data.id });
        localStorage.setItem("currUserId", response.data.id);
        localStorage.setItem("isLoggedIn", true);
        navigate("/setup");
      }
    });
  },

  setupAccount: async (userId, setupData, navigate) => {
    tryCatchWrapper(async () => {
      console.log(userId);
      console.log(setupData);
      const response = await apiPost(
        `/users/setup/${userId}`,
        { setupData },
        {},
      );
      console.log(response);
      if (response.request.status === 200) {
        toast.success("Account setup successful!");
        set({ isSetupComplete: true });
        localStorage.setItem("isSetupComplete", true);
        get().setIsSetupComplete(true);
        navigate("/home");
      }
    });
  },

  logout: async (userId, navigate) => {
    try {
      const response = await apiDelete(`/users/logout/${userId}`);
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem("currUserId");
        get().setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === (401 || 403)) {
        return toast.error(err.logout);
      }
    }
  },

  newAccessToken: async () => {
    const { setIsLoggedIn } = useUserStore.getState();
    try {
      console.log(window.location);
      const response = await apiGet(`/users/newaccesstoken`);
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response.status === (401 || 403)) {
        // User has been logged out or refresh token expired. Handle the scenario accordingly.
        // User will be asked to login again, because isLoggedIn is set to false, so protected routes will
        //ensure it gets redirected to the login page automatically.
        setIsLoggedIn(false);
      }
      if (window.location.pathname !== ("/signup" || "/login" || "/")) {
        return toast.error(err.message);
      }
    }
  },

  //Create a set as time complexity is 1 , so CRUD is faster on it.
  //But storing all ids of posts liked by the user will cause error, as we can store only a limited amount of
  //data in our localStorage, so we'll store only those ids that are liked by the user and are present in the
  //current feed.
  allLikedPosts: new Set(
    JSON.parse(localStorage.getItem("allLikedPosts") || "[]"),
  ),

  setAllLikedPosts: (action, postId) => {
    const likedPostIds = JSON.parse(
      localStorage.getItem("allLikedPosts") || "[]",
    ); //returns an array.
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

    console.log("Updated liked posts:", likedSet);
  },

  getAllLikedPosts: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/users/allLikedPosts`);
      //Save to local storage to persist state and to identify the posts liked by the user and update the state.
      let allLikedPosts = response.data;
      localStorage.setItem("allLikedPosts", JSON.stringify(allLikedPosts));
    });
  },

  allFollowed: new Set(JSON.parse(localStorage.getItem("allFollowed") || "[]")),

  setAllFollowed: (action, userId) => {
    const followedUserIds = JSON.parse(
      localStorage.getItem("allFollowed") || "[]",
    ); //returns an array.
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

    console.log("Updated followed :", followedSet);
  },

  getAllFollowed: async () => {
    tryCatchWrapper(async () => {
      const response = await apiGet("/follow/following");
      //Save to local storage to persist state and to identify the users followed by the user.
      let allFollowed = response.data.map((f) => {
        return f.userFollowed._id;
      });

      localStorage.setItem("allFollowed", JSON.stringify(allFollowed));
    });
  },

  allConnections: new Set(
    JSON.parse(localStorage.getItem("allConnections") || "[]"),
  ),

  setAllConnections: (action, userId1, userId2) => {
    const connectionsUserIds = JSON.parse(
      localStorage.getItem("allConnections") || "[]",
    ); //returns an array.
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

    console.log("Updated connections :", connectionsSet);
  },

  getAllConnections: async (userId) => {
    tryCatchWrapper(async () => {
      console.log(userId);
      const response = await apiGet(`/connection/${userId}`);
      //Save to local storage to persist state and to identify the users followed by the user.
      let allConnections = response.data.map((c) => {
        return [c.user, c.connectedUser].sort().join("-");
      });

      localStorage.setItem("allConnections", JSON.stringify(allConnections));
    });
  },
}));

export default useUserStore;
