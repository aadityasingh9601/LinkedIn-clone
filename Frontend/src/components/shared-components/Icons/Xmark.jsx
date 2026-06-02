import styles from "../Modal/Modal.module.css";

export default function Xmark({ customStyles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className={`fa-solid fa-xmark ${styles.customClass}`}
        onClick={onClick}
        style={{ ...customStyles }}
      ></i>
    </div>
  );
}
