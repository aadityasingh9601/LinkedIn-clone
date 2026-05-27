import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import { toast } from "react-toastify";
import useChatStore from "../stores/Chat";
import usePostStore from "../stores/Post";
import useNotificationStore from "../stores/Notification";

const useSocket = (isLoggedIn, currUserId, location) => {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastMsg = useChatStore((s) => s.updateLastMsg);
  const editMessage = useChatStore((s) => s.editMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const updatePost = usePostStore((s) => s.updatePost);
  const addNoti = useNotificationStore((s) => s.addNoti);
  const notifications = useNotificationStore((s) => s.notifications);
  const setNotiCount = useNotificationStore((s) => s.setNotiCount);
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
