import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import useChatStore from "../stores/Chat";
import usePostStore from "../stores/Post";
import useNotificationStore from "../stores/Notification";

const useSocket = (BACKEND_URL, isLoggedIn, currUserId,location) => {
  const socketRef = useRef(null);
  const isAuthRoute = ["/", "/signup", "/login"].includes(location.pathname);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastMsg = useChatStore((s) => s.updateLastMsg);
  const editMessage = useChatStore((s) => s.editMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const updatePost = usePostStore((s) => s.updatePost);
  const addNoti = useNotificationStore((s) => s.addNoti);
  const notifications = useNotificationStore((s) => s.notifications);
  const setNotiCount = useNotificationStore((s) => s.setNotiCount);

  useEffect(() => {
    if (!isLoggedIn || isAuthRoute) return;
    const socketInstance = io(BACKEND_URL, { query: { userId: currUserId } });
    socketRef.current = socketInstance;
    socketInstance.on("connReq", (noti) => {
      addNoti(noti);
      toast(noti.message);
    });
    socketInstance.on("newMsg", (data) => {
      addMessage(data);
      updateLastMsg(data);
    });
    socketInstance.on("editMsg", (data) => {
      editMessage(data);
    });
    socketInstance.on("deleteMsg", (data) => {
      removeMessage(data);
    });
    socketInstance.on("post_created", (data) => {
      console.log(data);
      updatePost(data);
    });
    socketInstance.on("application-rejected", (data) => {
      addNoti(data);
    });
    return () => {
      socketInstance.disconnect();
    };
  }, [isLoggedIn, isAuthRoute, currUserId, BACKEND_URL]);
  
  useEffect(() => {
    if (!isAuthRoute) {
      setNotiCount(notifications?.filter((n) => !n.isRead).length);
    }
  }, [notifications, isAuthRoute]);
  
  return socketRef.current;
};
export default useSocket;
