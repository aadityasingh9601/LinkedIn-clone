import "./Notification.css";
import Button from "../Button.";
import useNotificationStore from "../../stores/Notification";
import Xmark from "../../icons/Xmark";
import TimePassed from "../TimePassed";

export default function Notification({ noti }) {
  const deleteNoti = useNotificationStore((state) => state.deleteNoti);
  const handleConnRes = useNotificationStore((state) => state.handleConnRes);

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
        <Xmark
          style={{ fontSize: "1.3rem" }}
          onClick={() => deleteNoti(noti._id)}
        />
      )}

      <TimePassed
        timePassed={noti.sentDate}
        styles={{ fontSize: "0.75rem", marginLeft: "1rem" }}
      />
    </div>
  );
}
