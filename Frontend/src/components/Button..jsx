import "./Button.css";

export default function Button({
  type = "submit",
  btnText,
  onClick = () => {},
}) {
  return (
    <button className="btn" onClick={onClick} type={type}>
      {btnText}
    </button>
  );
}
