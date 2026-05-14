import styles from "./RHFInput.module.css";

export default function Input({
  placeholder,
  type = "",
  id = {},
  value,
  onChange,
  customClass = "",
  onClick = () => {},
}) {
  return (
    <div className={`${styles.input} ${customClass}`}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
      />
    </div>
  );
}
