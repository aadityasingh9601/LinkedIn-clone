import styles from "./NotificationBox.module.css";
import Notification from "../../components/Notifications/Notification";
import { useEffect } from "react";
import useNotificationStore from "../../stores/Notification";

export default function NotificationBox() {
  const { notifications, markAsRead, setNotiCount } = useNotificationStore((s) => ({
    notifications: s.notifications,
    markAsRead: s.markAsRead,
    setNotiCount: s.setNotiCount,
  }));

  useEffect(() => {
    setNotiCount(0);
    markAsRead();
  }, []);

  return (
    <div className={styles.notificationBox}>
      {notifications.length > 0 ? (
        notifications?.map((noti) => <Notification key={noti.id} noti={noti} />)
      ) : (
        <h2>Oops! Looks like you don't have notifications yet!</h2>
      )}
    </div>
  );
}
