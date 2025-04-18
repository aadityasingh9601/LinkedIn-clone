import "./Notification.css";
import axios from "axios";
import Button from "../Button.";
import useNotificationStore from "../../stores/Notification";
import { timeRep } from "../../utils/helper";

export default function Notification({ noti }) {
  const deleteNoti = useNotificationStore((state) => state.deleteNoti);
  async function handleResponse(e) {
    if (noti.notiType === "connection") {
      try {
        const response = await axios.post(
          `http://localhost:8000/connection/respond/${noti.from}`,
          { response: e.target.innerHTML, to: noti.to, notiId: noti.id },
          {
            withCredentials: true,
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
        alert("Failed to accept or reject request");
        return;
      }
    }
    if (noti.notiType === "groupjoinreq") {
      try {
        groupNotiDeletion(noti.id);

        const response = await axios.post(
          `http://localhost:8000/groups/66f7cc339637f8475318c3e3/requests/${noti.from}/respond`,
          { response: e.target.innerHTML },
          {
            withCredentials: true,
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
        alert("Failed to accept or reject request");
        return;
      }
    }
  }

  const currDate = new Date();
  const createdDate = new Date(noti.sentDate);
  const { seconds, minutes, hours, days } = timeRep(currDate - createdDate);

  let styles = { fontSize: "1.3rem" };
  let styles2 = { fontSize: "0.75rem", marginLeft: "1rem" };
  return (
    <div className="notification">
      <div>{noti.message}</div>

      {noti.notiType === "connection" || noti.notiType === "groupjoinreq" ? (
        <div className="btns">
          <Button btnText="Accept" onClick={handleResponse} />
          <Button btnText="Reject" onClick={handleResponse} />
        </div>
      ) : (
        <i
          className="fa-solid fa-xmark"
          style={styles}
          onClick={() => deleteNoti(noti.id)}
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
