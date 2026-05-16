import styles from "./UserAvatar.module.css";

export default function UserAvatar({ url, customStyles = {} }) {
  return (
    <div className={styles.userAvatar}>
      <img src={url} alt="" style={customStyles}/>
    </div>
  );
}
