export default function SmileR({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-regular fa-face-smile"
        onClick={onClick}
        style={{ display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
