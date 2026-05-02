import "./App.css";
import { lazy, Suspense } from "react";

const Homepage = lazy(() => import("./Homepage"));
import PrivateRoutes from "./PrivateRoutes";
import AppWraper from "./AppWraper";
const Profile = lazy(() => import("./Profile/Profile"));
const Signup = lazy(() => import("./Auth/Signup"));
const Login = lazy(() => import("./Auth/Login"));
const PostForm = lazy(() => import("./Posts/PostForm"));
const NotificationBox = lazy(() => import("./Notifications/NotificationBox"));
import PreLogin from "./Auth/PreLogin";
const Network = lazy(() => import("./Network/Network"));
const JobsUI = lazy(() => import("./Jobs/JobsUI"));
const Analytics = lazy(() => import("./Analytics/Analytics"));
const ApplicationForm = lazy(() => import("./Jobs/ApplicationForm"));
const Applications = lazy(() => import("./Jobs/Applications"));
const FullApplication = lazy(() => import("./Jobs/FullApplication"));

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import useUserStore from "../stores/User";
import useChatStore from "../stores/Chat";
import useNotificationStore from "../stores/Notification";
import "react-toastify/dist/ReactToastify.css";
import usePostStore from "../stores/Post";
import PublicRoutes from "./PublicRoutes";
import { setNavigate } from "../utils/api/axiosInstance";

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
      </Route>
      <Route path="/createpost" element={<PostForm />} />

      <Route path="/notifications" element={<NotificationBox />} />
    </Routes>
  );
};

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const newAccessToken = useUserStore((state) => state.newAccessToken);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMsg = useChatStore((state) => state.updateLastMsg);
  const editMessage = useChatStore((state) => state.editMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);
  const updatePost = usePostStore((state) => state.updatePost);
  const notifications = useNotificationStore((state) => state.notifications);

  const addNoti = useNotificationStore((state) => state.addNoti);
  const setNotiCount = useNotificationStore((state) => state.setNotiCount);
  const [socket, setSocket] = useState();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

  const currUserId = useUserStore((state) => state.currUserId);

  //This contains socket logic, maybe separate it into custom hook too. Run only when !isAuthRoute.
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     const socketInstance = io(BACKEND_URL, {
  //       query: {
  //         userId: currUserId,
  //       },
  //     });
  //     setSocket(socketInstance);

  //     socketInstance.on("connReq", (noti) => {
  //       addNoti(noti);
  //       return toast(noti.message);
  //     });

  //     socketInstance.on("newMsg", (data) => {
  //       console.log(data);
  //       addMessage(data);
  //       updateLastMsg(data);
  //     });

  //     socketInstance.on("editMsg", (data) => {
  //       console.log(data);
  //       editMessage(data);
  //     });

  //     socketInstance.on("deleteMsg", (data) => {
  //       console.log(data);
  //       removeMessage(data);
  //     });

  //     socketInstance.on("post_created", (data) => {
  //       console.log(data);
  //       updatePost(data);
  //     });

  //     socketInstance.on("application-rejected", (data) => {
  //       console.log(data);
  //       addNoti(data);
  //     });

  //     // Cleanup: Disconnect when the component unmounts
  //     return () => {
  //       //socket.removeAllListeners();
  //       socketInstance.disconnect();
  //       console.log("Socket disconnected");
  //     };
  //   }
  // }, []);

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
