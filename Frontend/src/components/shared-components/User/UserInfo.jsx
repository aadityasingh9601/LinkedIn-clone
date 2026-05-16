import UserAvatar from "./UserAvatar";
import styles from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";

export default function UserInfo({ url, userId, username, headline,avatarStyles }) {
  const navigate = useNavigate();
  return (
    <div className={styles.userInfo} key={userId}>
      <UserAvatar url={url} customStyles={avatarStyles}/>
      <div className={styles.details}>
        <div
          className={styles.username}
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <b>{username}</b>
        </div>
        <div className={styles.headline}>{headline}</div>
      </div>
    </div>
  );
}
