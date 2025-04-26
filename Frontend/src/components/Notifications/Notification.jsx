import "./Notification.css";
import axios from "axios";
import Button from "../Button.";
import useNotificationStore from "../../stores/Notification";
import { timeRep } from "../../utils/helper";

export default function Notification({ noti }) {
  const deleteNoti = useNotificationStore((state) => state.deleteNoti);
  const handleConnRes = useNotificationStore((state) => state.handleConnRes);

  const { seconds, minutes, hours, days } = timeRep(
    new Date() - new Date(noti.sentDate)
  );

  let styles = { fontSize: "1.3rem" };
  let styles2 = { fontSize: "0.75rem", marginLeft: "1rem" };
  return (
    <div className="notification">
      <div>{noti.message}</div>

      {noti.notiType === "connection" || noti.notiType === "groupjoinreq" ? (
        <div className="btns">
          <Button
            btnText="Accept"
            onClick={() => handleConnRes(noti, "Accept")}
          />
          <Button
            btnText="Reject"
            onClick={() => handleConnRes(noti, "Reject")}
          />
        </div>
      ) : (
        <i
          className="fa-solid fa-xmark"
          style={styles}
          onClick={() => deleteNoti(noti._id)}
        ></i>
      )}

      <div style={styles2}>
        {days > 0
          ? `${days}d `
          : hours > 0
          ? `${hours}h `
          : minutes > 0
          ? `${minutes}m`
          : `${seconds}s`}
      </div>
    </div>
  );
}
