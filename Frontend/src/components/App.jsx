import "./App.css";

import Homepage from "./Homepage";
import Profile from "./Profile/Profile";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import AppWraper from "./AppWraper";
import PostForm from "./Posts/PostForm";
import NotificationBox from "./Notifications/NotificationBox";
import PreLogin from "./Auth/PreLogin";
import PrivateRoutes from "./PrivateRoutes";
import Followers from "./Network/Followers";
import Following from "./Network/Following";
import Connections from "./Network/Connections";
import JobsUI from "./Jobs/JobsUI";
import Analytics from "./Analytics/Analytics";
import ApplicationForm from "./Jobs/ApplicationForm";
import Applications from "./Jobs/Applications";
import FullApplication from "./Jobs/fullApplication";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import useUserStore from "../stores/User";
import useChatStore from "../stores/Chat";
import useNotificationStore from "../stores/Notification";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const newAccessToken = useUserStore((state) => state.newAccessToken);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMsg = useChatStore((state) => state.updateLastMsg);
  const editMessage = useChatStore((state) => state.editMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);

  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );
  const addNoti = useNotificationStore((state) => state.addNoti);
  const setNotiCount = useNotificationStore((state) => state.setNotiCount);

  const [socket, setSocket] = useState();

  const currUserId = useUserStore((state) => state.currUserId);

  function groupNotiDeletion(id) {
    //Deleting the notifications from database.
    console.log("notiDeletion triggered", id);
    async function handleDeletion() {
      try {
        const response = await axios.delete(
          `http://localhost:8000/notification/group/${id}`,

          {
            withCredentials: true,
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          newAccessToken();
          return toast.error("Something went wrong! Please try again.");
        }
        return toast.error(err.message);
      }
    }
    handleDeletion();
    //Handling deletion on state variable too.
    setNotifications((prevNotifications) => {
      return prevNotifications.filter((noti) => noti.id !== id);
    });
  }

  useEffect(() => {
    fetchNotifications();
  }, [currUserId]);

  useEffect(
    function sideEffect() {
      if (isLoggedIn) {
        const socketInstance = io("http://localhost:8000", {
          query: {
            userId: currUserId,
          },
        });
        setSocket(socketInstance);

        socketInstance.on("groupJoinReq", (noti) => {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              id: noti._id,
              from: noti.sender,
              message: noti.message,
              to: noti.recipient,
              type: noti.notiType,
              read: false,
              sentDate: noti.sentDate,
            },
          ]);

          return toast.success(noti.message);
        });

        socketInstance.on("joinReqRes", (noti) => {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              id: noti._id,
              from: noti.sender,
              message: noti.message,
              to: noti.recipient,
              type: noti.notiType,
              read: false,
              sentDate: noti.sentDate,
            },
          ]);
          return toast(noti.message);
        });

        socketInstance.on("connReq", (noti) => {
          addNoti(noti);
          return toast(noti.message);
        });

        socketInstance.on("newMsg", (data) => {
          console.log(data);
          addMessage(data);
          updateLastMsg(data);
        });

        socketInstance.on("editMsg", (data) => {
          console.log(data);
          editMessage(data);
        });

        socketInstance.on("deleteMsg", (data) => {
          console.log(data);
          removeMessage(data);
        });

        socketInstance.on("application-rejected", (data) => {
          console.log(data);
          addNoti(data);
        });

        // Cleanup: Disconnect when the component unmounts
        return () => {
          //socket.removeAllListeners();
          socketInstance.disconnect();

          console.log("Socket disconnected");
        };
      }
    },
    [isLoggedIn]
  );

  //To get all the notifications that are unread ,so that we can display the number on the bell icon.
  useEffect(() => {
    let unreadOnes = notifications.filter((noti) => noti.isRead === false);
    setNotiCount(unreadOnes.length);
  }, [notifications]);

  //As request comes to the website , we have to check first that if the user sending the request has a
  //valid token cookie or not, if they have , then redirect them to the home page , but If they don't redirect
  //them to the prelogin page, so they have to login first.

  return (
    <>
      <Router>
        <AppWraper socket={socket}>
          <Routes>
            <Route path="/" element={<PreLogin />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/home" element={<Homepage />} />
              <Route
                path="/profile/:id"
                element={<Profile socket={socket} />}
              />
              <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
              <Route path="/jobs/:id/applications" element={<Applications />} />
              <Route
                path="/jobs/:id/applications/:appId"
                element={<FullApplication />}
              />
              <Route path="/followers" element={<Followers />} />
              <Route path="/following" element={<Following />} />
              <Route path="/connections" element={<Connections />} />

              <Route path="/jobs" element={<JobsUI />} />

              <Route path="/analytics" element={<Analytics />} />
            </Route>
            <Route path="/createpost" element={<PostForm />} />

            <Route
              path="/notifications"
              element={
                <NotificationBox groupNotiDeletion={groupNotiDeletion} />
              }
            />
          </Routes>
        </AppWraper>
      </Router>
    </>
  );
}

export default App;
