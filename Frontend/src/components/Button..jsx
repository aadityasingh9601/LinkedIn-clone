import "./Button.css";

export default function Button({ btnText, onClick }) {
  return (
    <button className="btn1" onClick={onClick}>
      {btnText}
    </button>
  );
}
