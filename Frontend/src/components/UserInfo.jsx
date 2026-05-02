import UserAvatar from "./UserAvatar";
import styles from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";

export default function UserInfo({ url, userId, username, headline }) {
  const navigate = useNavigate();
  return (
    <div className={styles.userInfo} key={userId}>
      <UserAvatar url={url} />
      <div className="details">
        <span
          className="username"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <b>{username}</b>
        </span>
        <br />
        <span className="headline">{headline}</span>
        <br />
      </div>
    </div>
  );
}
