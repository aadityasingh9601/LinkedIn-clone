import MyErrorBoundary from "../ErrorBoundary/MyErrorBoundary";
import styles from "./Textarea.module.css";

export default function RHFtextarea({
  placeholder,
  register,
  name,
  customStyles = {},
  rules = {},
  errors = {},
}) {
  return (
    <MyErrorBoundary>
      <div className={styles.textarea}>
        <textarea
          style={styles}
          {...register(name, rules)}
          placeholder={placeholder}
        ></textarea>

        {errors[name] && <div className={styles.errorMsg}>{errors[name].message}</div>}
      </div>
    </MyErrorBoundary>
  );
}
