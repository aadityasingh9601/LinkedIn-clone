import UserAvatar from "./UserAvatar";
import styles from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";

export default function UserInfo({
  url,
  profileId,
  username,
  headline,
  customClass = "",
  avatarStyles = {},
}) {
  const navigate = useNavigate();
  return (
    <div className={`${styles.userInfo} ${customClass}`} key={profileId}>
      <UserAvatar url={url} customStyles={avatarStyles} />
      <div className={styles.details}>
        <div
          className={styles.username}
          onClick={() => {
            navigate(`/profile/${profileId}`);
          }}
        >
          <b>{username}</b>
        </div>
        <div className={styles.headline}>{headline}</div>
      </div>
    </div>
  );
}
