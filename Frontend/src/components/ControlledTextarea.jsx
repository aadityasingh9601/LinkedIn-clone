import MyErrorBoundary from "./MyErrorBoundary";
import "./Textarea.css";

export default function ControlledTextarea({
  placeholder,
  value,
  onChange,
  styles,
}) {
  return (
    <MyErrorBoundary>
      <div className="textarea">
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
