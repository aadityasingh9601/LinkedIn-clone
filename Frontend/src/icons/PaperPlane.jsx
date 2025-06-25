export default function PaperPlane(styles = {}, onClick = () => {}) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-paper-plane"
        style={{ ...styles, display: "inline-block" }}
        onClick={onClick}
      ></i>
    </div>
  );
}
