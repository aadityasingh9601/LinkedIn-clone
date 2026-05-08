import "./App.css";
import { lazy, Suspense } from "react";
const Homepage = lazy(() => import("./pages/Home/Homepage"));
import PrivateRoutes from "./components/shared-components/Routes/PrivateRoutes";
import AppWraper from "./components/shared-components/Wrappers/AppWraper";

const Profile = lazy(() => import("./pages/Profile/Profile"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotificationBox = lazy(
  () => import("./pages/Notifications/NotificationBox"),
);
import PreLogin from "./pages/Prelogin/PreLogin";
const Network = lazy(() => import("./pages/Network/Network"));
const JobsUI = lazy(() => import("./pages/Jobs/JobsUI"));
const Analytics = lazy(() => import("./pages/Analytics/Analytics"));
const ApplicationForm = lazy(() => import("./components/Jobs/ApplicationForm"));
const Applications = lazy(() => import("./components/Jobs/Applications"));
const FullApplication = lazy(() => import("./components/Jobs/FullApplication"));

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {  useEffect } from "react";
import useUserStore from "./stores/User";
import useNotificationStore from "./stores/Notification";
import "react-toastify/dist/ReactToastify.css";
import PublicRoutes from "./components/shared-components/Routes/PublicRoutes";
import { setNavigate } from "./utils/api/axiosInstance";
import useSocket from "./hooks/useSocket";

const AppRoutes = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const currUserId = useUserStore((state) => state.currUserId);
  const checkAuthStatus = useUserStore((state) => state.checkAuthStatus);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const authRoutes = ["/", "/signup", "/login"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    {
      !isAuthRoute && fetchNotifications();
    }
  }, [currUserId]);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
        <Route path="/" element={<PreLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
        <Route path="/jobs/:id/applications" element={<Applications />} />
        <Route
          path="/jobs/:id/applications/:appId"
          element={<FullApplication />}
        />
        <Route path="/network/:type" element={<Network />} />
        <Route path="/jobs" element={<JobsUI />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<NotificationBox />} />
      </Route>
    </Routes>
  );
};

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

  const currUserId = useUserStore((state) => state.currUserId);
  const socket = useSocket(BACKEND_URL, isLoggedIn, currUserId, location);

  //To get all the notifications that are unread ,so that we can display the number on the bell icon.
  // useEffect(() => {
  //   let unreadOnes = notifications?.filter((noti) => noti.isRead === false);
  //   setNotiCount(unreadOnes.length);
  // }, [notifications]);

  return (
    <>
      <Router>
        <AppWraper socket={socket}>
          <AppRoutes />
        </AppWraper>
      </Router>
    </>
  );
}

export default App;
