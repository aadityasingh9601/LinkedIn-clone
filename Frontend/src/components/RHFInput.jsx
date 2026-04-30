import styles from "./RHFInput.module.css";

export default function RHFInput({
  id = {},
  placeholder = "",
  register,
  name,
  type = "text",
  rules = {},
  errors = {},
}) {
  return (
    <div className={`${styles.input}`}>
      <input
        id={id}
        type={type}
        {...register(name, { ...rules })}
        placeholder={placeholder}
      />
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  );
}
