import MyErrorBoundary from "../ErrorBoundary/MyErrorBoundary";
import css from "./Textarea.module.css";

export default function ControlledTextarea({
  placeholder,
  value,
  onChange,
  styles,
  customClass=""
}) {
  return (
    <MyErrorBoundary>
      <div className={`${css.textarea} ${customClass}`}>
        <textarea
          style={styles}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></textarea>
      </div>
    </MyErrorBoundary>
  );
}
