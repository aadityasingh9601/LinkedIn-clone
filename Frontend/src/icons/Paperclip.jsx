export default function Paperclip({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-paperclip"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
