import "./NotificationBox.css";
import Notification from "./Notification";
import { useEffect } from "react";
import useNotificationStore from "../../stores/Notification";

export default function NotificationBox() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const setNotiCount = useNotificationStore((state) => state.setNotiCount);

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
