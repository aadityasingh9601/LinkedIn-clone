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
      {notifications.length > 0 ? (
        notifications.map((noti) => <Notification key={noti.id} noti={noti} />)
      ) : (
        <h2>Oops! Looks like you don't have notifications yet!</h2>
      )}
    </div>
  );
}
