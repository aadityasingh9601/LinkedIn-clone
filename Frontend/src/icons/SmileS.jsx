export default function SmileS({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-face-smile"
        style={{ ...styles, display: "inline-block" }}
        onClick={onClick}
      ></i>
    </div>
  );
}
