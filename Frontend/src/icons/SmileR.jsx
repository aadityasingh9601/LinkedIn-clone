export default function SmileR({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-regular fa-face-smile"
        onClick={onClick}
        style={{ ...styles, display: "inline-block" }}
      ></i>
    </div>
  );
}
