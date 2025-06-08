import MyErrorBoundary from "./MyErrorBoundary";

export default function ControlledTextarea({ placeholder, value, onChange }) {
  return (
    <MyErrorBoundary>
      <div>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></textarea>
      </div>
    </MyErrorBoundary>
  );
}
