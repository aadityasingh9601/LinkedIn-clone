import MyErrorBoundary from "./MyErrorBoundary";
import "./Textarea.css";

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
      <div className="textarea">
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
