import styles from "./UserAvatar.module.css";

export default function UserAvatar({ url, height = {}, width = {} }) {
  return (
    <div className={styles.userAvatar}>
      <img src={url} alt="" height={height} width={width} />
    </div>
  );
}
