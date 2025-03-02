import "./NotificationBox.css";
import Notification from "./Notification";
import { useEffect } from "react";
import axios from "axios";
import useNotificationStore from "../../stores/Notification";
import useUserStore from "../../stores/User";

export default function NotificationBox() {
  const currUserId = useUserStore((state) => state.currUserId);
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const setNotiCount = useNotificationStore((state) => state.setNotiCount);

  //Find out ,even though we're using the same function it's working in App.jsx at 189,but not in this component
  //even though request is going to the setNotiCount function, but why the value passed isn't printing properly
  //on the console in the setNotiCount function. Why only the old value passed (from app.jsx)is getting printed &
  //not the value passed from the notificationBox.jsx component._?
  useEffect(() => {
    setNotiCount(0);
    markAsRead();
  }, []);

  return (
    <div className="notificationBox">
      {notifications.map((noti) => (
        <Notification key={noti.id} noti={noti} />
      ))}
    </div>
  );
}
