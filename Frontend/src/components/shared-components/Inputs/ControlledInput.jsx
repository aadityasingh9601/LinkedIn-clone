import styles from "./RHFInput.module.css";

export default function Input({
  placeholder,
  type = "",
  id = {},
  value,
  onChange,
  customClass = "",
  onClick = () => {},
  onKeyDown = () =>{},
}) {
  return (
    <div className={`${styles.input} ${customClass}`}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
      />
    </div>
  );
}
