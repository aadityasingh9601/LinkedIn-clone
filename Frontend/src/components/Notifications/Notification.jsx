import styles from "../../pages/Notifications/NotificationBox.module.css";
import Button from "../shared-components/Buttons/Button";
import useNotificationStore from "../../stores/Notification";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import Xmark from "../shared-components/Icons/Xmark";

export default function Notification({ noti }) {
  const deleteNoti = useNotificationStore((s) => s.deleteNoti);
  const handleConnRes = useNotificationStore((s) => s.handleConnRes);

  return (
    <div className={styles.notification}>
      <div>{noti.message}</div>
      <div className={styles.options}>
        <div className={styles.btns}>
          {noti?.type === "connection" ? (
            <>
              <Button
                btnText="Accept"
                variant="xs"
                onClick={() => handleConnRes(noti, "Accept")}
              />
              <Button
                variant="xs"
                btnText="Reject"
                onClick={() => handleConnRes(noti, "Reject")}
              />
            </>
          ) : (
            <Xmark
              customStyles={{
                fontSize: "1.3rem",
                zIndex: "100",
                right: "1.8rem",
              }}
              onClick={() => deleteNoti(noti._id)}
            />
          )}
        </div>
        <div className="timePassed">
          <TimePassed
            timePassed={noti.sentDate}
            styles={{ fontSize: "0.75rem", right: "0.5rem" }}
          />
        </div>
      </div>
    </div>
  );
}
