import "./Input.css";

export default function RHFInput({
  id = {},
  placeholder = "",
  register,
  name,
  type = "text",
  rules = {},
  errors = {},
  styles = {},
}) {
  return (
    <div className="input">
      <input
        id={id}
        type={type}
        {...register(name, rules)}
        placeholder={placeholder}
        style={{...styles}}
      />
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
}
