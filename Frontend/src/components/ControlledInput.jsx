import "./Input.css";

export default function Input({
  placeholder,
  type = "",
  id = {},
  value,
  onChange,
  onClick = () => {},
  styles = {},
}) {
  return (
    <div className="input">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        style={styles}
      />
    </div>
  );
}
