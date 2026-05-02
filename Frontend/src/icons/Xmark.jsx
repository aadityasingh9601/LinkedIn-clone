import styles from "../components/Modal.module.css";

export default function Xmark({ customStyles = {}, onClick = () => {} }) {
  return (
    <div className={styles.crossBox}>
      <i
        className={`fa-solid fa-xmark ${styles.cross}`}
        onClick={onClick}
        style={{ ...customStyles }}
      ></i>
    </div>
  );
}
