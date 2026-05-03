import styles from "./RHFInput.module.css";

export default function Input({
  placeholder,
  type = "",
  id = {},
  value,
  onChange,
  onClick = () => {},
}) {
  return (
    <div className={`${styles.input}`}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        style={styles}
      />
    </div>
  );
}
