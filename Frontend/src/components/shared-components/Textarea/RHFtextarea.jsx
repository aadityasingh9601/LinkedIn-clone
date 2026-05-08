import MyErrorBoundary from "../ErrorBoundary/MyErrorBoundary";
import css from "./Textarea.module.css";

export default function RHFtextarea({
  placeholder,
  register,
  name,
  styles = {},
  rules = {},
  errors = {},
}) {
  return (
    <MyErrorBoundary>
      <div className={css.textarea}>
        <textarea
          style={styles}
          {...register(name, rules)}
          placeholder={placeholder}
        ></textarea>

        {errors[name] && <p>{errors[name].message}</p>}
      </div>
    </MyErrorBoundary>
  );
}
