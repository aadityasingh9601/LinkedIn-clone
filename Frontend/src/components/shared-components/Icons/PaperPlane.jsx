export default function PaperPlane(styles = {}, onClick = () => {}) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-paper-plane"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
