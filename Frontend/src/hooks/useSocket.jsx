import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import { toast } from "react-toastify";
import useChatStore from "../stores/Chat";
import usePostStore from "../stores/Post";
import useNotificationStore from "../stores/Notification";

const useSocket = (isLoggedIn, currUserId, location) => {
  const { addMessage, updateLastMsg, editMessage, removeMessage } = useChatStore((s) => ({
    addMessage: s.addMessage,
    updateLastMsg: s.updateLastMsg,
    editMessage: s.editMessage,
    removeMessage: s.removeMessage,
  }));
  const updatePost = usePostStore((s) => s.updatePost);
  const { addNoti, notifications, setNotiCount } = useNotificationStore((s) => ({
    addNoti: s.addNoti,
    notifications: s.notifications,
    setNotiCount: s.setNotiCount,
  }));
  const isAuthRoute = ["/", "/signup", "/login"].includes(location.pathname);

  useEffect(() => {
    if (!isLoggedIn || isAuthRoute) return;
    socket.io.opts.query = { userId: currUserId };
    socket.connect(); // no-op if already connected
    console.log(socket.connected);
    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn, isAuthRoute, currUserId]);

  // In useSocket.js — separate useEffect per event group
  useEffect(() => {
    socket.on("connReq", (noti) => {
      addNoti(noti);
      toast(noti.message);
    });
    socket.on("newMsg", (data) => {
      console.log(data);
      addMessage(data);
      updateLastMsg(data);
    });
    socket.on("editMsg", (data) => {
      editMessage(data);
    });
    socket.on("deleteMsg", (data) => {
      removeMessage(data);
    });
    socket.on("post_created", (data) => {
      updatePost(data);
    });
    socket.on("application-rejected", (data) => {
      addNoti(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  //   useEffect(() => {
  //   if (!isAuthRoute) {
  //     setNotiCount(notifications?.filter((n) => !n.isRead).length);
  //   }
  // }, [notifications, isAuthRoute]);

  return socket;
};
export default useSocket;
