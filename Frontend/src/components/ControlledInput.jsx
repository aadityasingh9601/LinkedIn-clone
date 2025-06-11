export default function Input({
  placeholder,
  type = "",
  id = {},
  value,
  onChange,
  styles = {},
}) {
  return (
    <div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles}
      />
    </div>
  );
}
