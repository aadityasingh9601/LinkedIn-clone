export default function Paperclip({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-paperclip"
        style={{ ...styles, display: "inline-block" }}
        onClick={onClick}
      ></i>
    </div>
  );
}
