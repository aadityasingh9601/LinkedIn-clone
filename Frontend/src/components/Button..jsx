import "./Button.css";

export default function Button({
  type = "submit",
  btnText,
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button className="btn" onClick={onClick} type={type} disabled={disabled}>
      {btnText}
    </button>
  );
}
