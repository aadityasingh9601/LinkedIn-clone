import styles from "./NotificationBox.module.css";
import Notification from "../../components/Notifications/Notification";
import { useEffect } from "react";
import useNotificationStore from "../../stores/Notification";

export default function NotificationBox() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const setNotiCount = useNotificationStore((s) => s.setNotiCount);

  useEffect(() => {
    setNotiCount(0);
    markAsRead();
  }, []);

  return (
    <div className={styles.notificationBox}>
      <div className={styles.boxHeader}>All notifications</div>
      <div className={styles.boxBody}>
        {notifications.length > 0 ? (
          <div>
            {notifications?.map((noti) => (
              <Notification key={noti.id} noti={noti} />
            ))}
          </div>
        ) : (
          <div className={styles.fallBackUI}>
            Oops! Looks like you don't have notifications yet!
          </div>
        )}
      </div>
    </div>
  );
}
