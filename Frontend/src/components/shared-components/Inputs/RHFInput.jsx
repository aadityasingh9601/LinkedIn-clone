import styles from "./RHFInput.module.css";

export default function RHFInput({
  id = {},
  placeholder = "",
  register,
  name,
  label = "",
  customClass = "",
  type = "text",
  rules = {},
  errors = {},
}) {
  return (
    <div className={`${styles.input} ${customClass}`}>
      {label && <div className={`${styles.label}`}>{label}</div>}
      <input
        id={id}
        type={type}
        {...register(name, { ...rules })}
        placeholder={placeholder}
      />
      {errors[name] && (
        <div className={`${styles.errorMsg}`}>{errors[name].message}</div>
      )}
    </div>
  );
}
