import axios from "axios";

let navigateRef = null;
// Call this once from App.jsx to give interceptor access to navigate
export const setNavigate = (navigate) => {
  navigateRef = navigate;
};

const BE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const FE = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

const axiosInstance = axios.create({
  baseURL: BE,
  withCredentials: true,
  crossDomain: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": FE,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._skipInterceptor) {
      return Promise.reject(error);
    }
    console.log(originalRequest);
    //Skip the interceptor for the refresh route, else it'll create a endless loop.
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/users/newaccesstoken")
    ) {
      navigateRef("/login");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //It's generally recommended to not use the same axiosInstance while trying to refresh tokens.
        const res = await axios.get(`${BE}/users/newaccesstoken`, {
          withCredentials: true,
        });
        console.log(res);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (navigateRef) {
          navigateRef("/login");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
