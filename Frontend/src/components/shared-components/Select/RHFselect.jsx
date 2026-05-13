import styles from "./RHFselect.module.css";

export default function RHFselect({
  register,
  name,
  options,
  errors = {},
  customStyles = {},
  rules = {},
}) {
  return (
    <div className={styles.dropdown}>
      <select className={styles.select}  style={customStyles} {...register(name, { ...rules })}>
        {options?.map((option, index) => {
          return <option className={styles.option} key={index}>{option}</option>;
        })}
      </select>
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  );
}
