import styles from "./Button.module.css";

export default function Button({
  type = "submit",
  btnText,
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button
      className={`${styles.btn}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {btnText}
    </button>
  );
}
