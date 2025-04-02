import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const useUserStore = create((set) => ({
  isLoggedIn: localStorage.getItem("isLoggedIn"),
  //We're persisting our state here by storing it in localStorage, backend authentication (checkToken) will
  //be done when user visits the login page or prelogin page only, else the state will persist.

  currUserId: localStorage.getItem("currUserId"),

  setIsLoggedIn: (value) => {
    set({ isLoggedIn: value });
  },

  checkToken: async (navigate) => {
    const { setIsLoggedIn } = useUserStore.getState();
    const response = await axios.get(
      "http://localhost:8000/users/checkaccesstoken",
      { withCredentials: true }
    );
    console.log(response);
    if (response.data === "yes") {
      localStorage.setItem("isLoggedIn", true);
      navigate("/home");
      setIsLoggedIn(true);
      //console.log("token is present.");
    }
    if (response.data === "no") {
      //console.log("token is not present.");
      localStorage.setItem("isLoggedIn", false);
      return toast.warn("Your session has expired.");
    }
  },

  newAccessToken: async () => {
    //const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
    //using hooks like this violates the rules of hooks , see in chatGPT for more information.
    //Instead, use like this shown below, why it's working? see in chatGPT and on internet.
    //Search why this is ok ,but the other way it wasn't working, ALSO EXPLORE MORE METHODS AND FUNCTIONS OF
    //ZUSTAND FOR MORE INFORMATION AND ADD TO YOUR NOTES.
    const { setIsLoggedIn } = useUserStore.getState();

    try {
      let response = await axios.get(
        "http://localhost:8000/users/newaccesstoken",

        {
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response.status === (401 || 403)) {
        // User has been logged out or refresh token expired. Handle the scenario accordingly.
        // User will be asked to login again, because isLoggedIn is set to false, so protected routes will
        //ensure it gets redirected to the login page automatically.
        setIsLoggedIn(false);
      }
      return toast.error(err.message);
    }
  },

  logout: async (navigate) => {
    console.log("triggered logout function");

    try {
      const response = await axios.delete(
        `http://localhost:8000/users/logout`,
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem("currUserId");
        set({ isLoggedIn: false });
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === (401 || 403)) {
        return toast.error(err.logout);
      }
    }
  },
}));

export default useUserStore;
